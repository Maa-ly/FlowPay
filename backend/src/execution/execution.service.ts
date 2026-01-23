import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { BlockchainService } from "../blockchain/blockchain.service";
import { ChimoneyService } from "../chimoney/chimoney.service";
import { NotificationsService } from "../notifications/notifications.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ExecutionService {
  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
    private chimoneyService: ChimoneyService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  /**
   * Main cron job - runs every minute to check and execute intents
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async monitorAndExecuteIntents() {
    console.log("🔍 Checking for intents ready to execute...");

    // Get all active intents ready for execution
    const intents = await this.prisma.intent.findMany({
      where: {
        status: "ACTIVE",
        nextExecution: { lte: new Date() },
      },
      include: { user: true },
    });

    console.log(`Found ${intents.length} intents ready for execution`);

    for (const intent of intents) {
      await this.evaluateAndExecuteIntent(intent);
    }
  }

  /**
   * Evaluate constraints and execute intent
   */
  async evaluateAndExecuteIntent(intent: any) {
    try {
      console.log(`🎯 Evaluating intent ${intent.id}: ${intent.name}`);

      // Step 1: Check balance constraint
      const balance = await this.blockchainService.getTokenBalance(
        intent.tokenAddress,
        intent.user.walletAddress,
      );

      const requiredAmount =
        BigInt(intent.amount.toString()) +
        BigInt(intent.safetyBuffer.toString());

      if (balance < requiredAmount) {
        console.log(`⚠️ Insufficient balance for intent ${intent.id}`);
        await this.delayIntent(intent.id, "Insufficient balance");
        await this.notificationsService.sendNotification(intent.userId, {
          type: "EXECUTION_DELAYED",
          title: "Payment Delayed",
          message: `${intent.name}: Balance below safety buffer`,
        });
        return;
      }

      // Step 2: Check gas price constraint (if set)
      if (intent.maxGasPrice) {
        const currentGasPrice = await this.blockchainService.getGasPrice();
        if (currentGasPrice > intent.maxGasPrice) {
          console.log(`⚠️ Gas price too high for intent ${intent.id}`);
          await this.delayIntent(intent.id, "Gas price above limit");
          return;
        }
      }

      // Step 3: Check time window constraint (if set)
      if (intent.timeWindowStart && intent.timeWindowEnd) {
        const now = new Date();
        const currentTime = `${now.getHours()}:${now.getMinutes()}`;

        if (
          currentTime < intent.timeWindowStart ||
          currentTime > intent.timeWindowEnd
        ) {
          console.log(`⚠️ Outside time window for intent ${intent.id}`);
          await this.delayIntent(intent.id, "Outside execution time window");
          return;
        }
      }

      // Step 4: Execute the intent
      console.log(`✅ All constraints met. Executing intent ${intent.id}`);

      if (intent.isOffRamp) {
        await this.executeOffRampIntent(intent);
      } else {
        await this.executeOnChainIntent(intent);
      }
    } catch (error) {
      console.error(`❌ Error executing intent ${intent.id}:`, error.message);
      await this.recordFailedExecution(intent.id, error.message);
      await this.notificationsService.sendNotification(intent.userId, {
        type: "EXECUTION_FAILED",
        title: "Payment Failed",
        message: `${intent.name}: ${error.message}`,
      });
    }
  }

  /**
   * Execute on-chain intent
   */
  private async executeOnChainIntent(intent: any) {
    try {
      // Execute transaction on blockchain
      const receipt = await this.blockchainService.executeIntent(
        BigInt(intent.onChainId || 0),
      );

      // Record successful execution
      await this.recordSuccessfulExecution(intent, receipt);

      // Send success notification
      await this.notificationsService.sendNotification(intent.userId, {
        type: "EXECUTION_SUCCESS",
        title: "Payment Sent Successfully",
        message: `${intent.name}: ${intent.amount} ${intent.token} sent to ${intent.recipient}`,
        data: { txHash: receipt.hash },
      });

      console.log(
        `✅ Intent ${intent.id} executed successfully. TxHash: ${receipt.hash}`,
      );
    } catch (error) {
      throw new Error(`On-chain execution failed: ${error.message}`);
    }
  }

  /**
   * Execute off-ramp intent (Chimoney)
   */
  private async executeOffRampIntent(intent: any) {
    try {
      const offRampDetails = intent.offRampDetails;

      // Call Chimoney API
      const result = await this.chimoneyService.executePayout({
        phoneNumber: offRampDetails.phoneNumber,
        country: offRampDetails.country,
        amountUSD: Number(intent.amount),
        userId: intent.userId,
        intentId: intent.id,
      });

      if (result.success) {
        // Record successful execution
        await this.prisma.execution.create({
          data: {
            intentId: intent.id,
            status: "SUCCESS",
            amount: intent.amount,
            chimoneyTxId: result.txId,
            offRampStatus: result.status,
          },
        });

        // Update intent
        await this.updateIntentAfterExecution(intent);

        // Send notification
        await this.notificationsService.sendNotification(intent.userId, {
          type: "EXECUTION_SUCCESS",
          title: "Off-Ramp Successful",
          message: `${intent.name}: ${intent.amount} USD sent to ${offRampDetails.phoneNumber}`,
          data: { chimoneyTxId: result.txId },
        });

        console.log(
          `✅ Off-ramp intent ${intent.id} executed. Chimoney TxId: ${result.txId}`,
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw new Error(`Off-ramp execution failed: ${error.message}`);
    }
  }

  /**
   * Record successful execution
   */
  private async recordSuccessfulExecution(intent: any, receipt: any) {
    await this.prisma.execution.create({
      data: {
        intentId: intent.id,
        txHash: receipt.hash,
        status: "SUCCESS",
        amount: intent.amount,
        gasUsed: BigInt(receipt.gasUsed.toString()),
        gasPrice: BigInt(receipt.gasPrice?.toString() || 0),
        blockNumber: BigInt(receipt.blockNumber),
      },
    });

    await this.updateIntentAfterExecution(intent);
  }

  /**
   * Record failed execution
   */
  private async recordFailedExecution(intentId: string, errorMessage: string) {
    await this.prisma.execution.create({
      data: {
        intentId,
        status: "FAILED",
        amount: 0,
        errorMessage,
      },
    });

    await this.prisma.intent.update({
      where: { id: intentId },
      data: {
        failureCount: { increment: 1 },
        status: "FAILED",
      },
    });
  }

  /**
   * Delay intent execution
   */
  private async delayIntent(intentId: string, reason: string) {
    await this.prisma.execution.create({
      data: {
        intentId,
        status: "DELAYED",
        amount: 0,
        delayReason: reason,
      },
    });

    // Reschedule for next check
    await this.prisma.intent.update({
      where: { id: intentId },
      data: {
        nextExecution: new Date(Date.now() + 5 * 60 * 1000), // Try again in 5 minutes
      },
    });
  }

  /**
   * Update intent after successful execution
   */
  private async updateIntentAfterExecution(intent: any) {
    const nextExecution = this.calculateNextExecution(intent.frequency);

    await this.prisma.intent.update({
      where: { id: intent.id },
      data: {
        lastExecution: new Date(),
        nextExecution,
        executionCount: { increment: 1 },
        failureCount: 0,
      },
    });
  }

  /**
   * Calculate next execution time based on frequency
   */
  private calculateNextExecution(frequency: string): Date {
    const now = new Date();

    switch (frequency) {
      case "ONCE":
        return null; // No next execution for one-time intents
      case "DAILY":
        now.setDate(now.getDate() + 1);
        break;
      case "WEEKLY":
        now.setDate(now.getDate() + 7);
        break;
      case "MONTHLY":
        now.setMonth(now.getMonth() + 1);
        break;
      case "YEARLY":
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        now.setMinutes(now.getMinutes() + 5);
    }

    return now;
  }
}
