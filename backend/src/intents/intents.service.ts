import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BlockchainService } from "../blockchain/blockchain.service";
import { NotificationsService } from "../notifications/notifications.service";

export interface CreateIntentDto {
  name: string;
  description?: string;
  recipient: string;
  amount: number;
  token: string;
  tokenAddress: string;
  frequency: string;
  safetyBuffer: number;
  maxGasPrice?: number;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isOffRamp?: boolean;
  offRampDetails?: any;
}

@Injectable()
export class IntentsService {
  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
    private notificationsService: NotificationsService,
  ) {}

  // Helper to serialize BigInt and Decimal for JSON
  private serializeIntent(intent: any) {
    if (!intent) return null;
    return {
      ...intent,
      maxGasPrice: intent.maxGasPrice?.toString(),
      amount: intent.amount?.toString(),
      safetyBuffer: intent.safetyBuffer?.toString(),
      onChainId: intent.onChainId?.toString(),
      executions: intent.executions?.map((exec: any) => ({
        ...exec,
        amount: exec.amount?.toString(),
        gasUsed: exec.gasUsed?.toString(),
        gasPrice: exec.gasPrice?.toString(),
        blockNumber: exec.blockNumber?.toString(),
      })),
    };
  }

  async createIntent(userId: string, data: CreateIntentDto) {
    // Calculate next execution time
    const nextExecution = this.calculateNextExecution(data.frequency);

    const intent = await this.prisma.intent.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        recipient: data.recipient,
        amount: data.amount.toString(),
        token: data.token,
        tokenAddress: data.tokenAddress,
        frequency: data.frequency,
        safetyBuffer: data.safetyBuffer.toString(),
        maxGasPrice: data.maxGasPrice
          ? BigInt(Math.floor(data.maxGasPrice))
          : null,
        timeWindowStart: data.timeWindowStart,
        timeWindowEnd: data.timeWindowEnd,
        nextExecution,
        isOffRamp: data.isOffRamp || false,
        offRampDetails: data.offRampDetails,
        status: "ACTIVE",
      },
    });

    // Send notification for intent creation
    await this.notificationsService.sendNotification(userId, {
      type: "INTENT_CREATED",
      title: "Intent Created",
      message: `New payment intent "${data.name || `${data.token} Payment`}" created successfully. Amount: ${data.amount} ${data.token}, Frequency: ${data.frequency}`,
      data: {
        intentId: intent.id,
        amount: data.amount,
        token: data.token,
        frequency: data.frequency,
      },
    });

    // Convert BigInt fields to strings for JSON serialization
    return {
      ...intent,
      maxGasPrice: intent.maxGasPrice?.toString(),
      amount: intent.amount.toString(),
      safetyBuffer: intent.safetyBuffer.toString(),
    };
  }

  async getUserIntents(userId: string) {
    const intents = await this.prisma.intent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return intents.map((intent) => this.serializeIntent(intent));
  }

  async getIntentById(id: string) {
    const intent = await this.prisma.intent.findUnique({
      where: { id },
      include: { executions: { orderBy: { executedAt: "desc" }, take: 10 } },
    });
    return this.serializeIntent(intent);
  }

  async pauseIntent(id: string, userId: string) {
    const intent = await this.prisma.intent.update({
      where: { id, userId },
      data: { status: "PAUSED" },
    });
    return this.serializeIntent(intent);
  }

  async resumeIntent(id: string, userId: string) {
    const intent = await this.prisma.intent.update({
      where: { id, userId },
      data: { status: "ACTIVE" },
    });
    return this.serializeIntent(intent);
  }

  async updateIntent(
    id: string,
    userId: string,
    data: Partial<CreateIntentDto>,
  ) {
    // Only update fields that are provided
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.recipient !== undefined) updateData.recipient = data.recipient;
    if (data.amount !== undefined) updateData.amount = data.amount.toString();
    if (data.token !== undefined) updateData.token = data.token;
    if (data.tokenAddress !== undefined)
      updateData.tokenAddress = data.tokenAddress;
    if (data.frequency !== undefined) {
      updateData.frequency = data.frequency;
      // Recalculate next execution if frequency changed
      updateData.nextExecution = this.calculateNextExecution(data.frequency);
    }
    if (data.safetyBuffer !== undefined)
      updateData.safetyBuffer = data.safetyBuffer.toString();
    if (data.maxGasPrice !== undefined)
      updateData.maxGasPrice = BigInt(Math.floor(data.maxGasPrice));
    if (data.timeWindowStart !== undefined)
      updateData.timeWindowStart = data.timeWindowStart;
    if (data.timeWindowEnd !== undefined)
      updateData.timeWindowEnd = data.timeWindowEnd;
    if (data.isOffRamp !== undefined) updateData.isOffRamp = data.isOffRamp;
    if (data.offRampDetails !== undefined)
      updateData.offRampDetails = data.offRampDetails;

    const intent = await this.prisma.intent.update({
      where: { id, userId },
      data: updateData,
    });
    return this.serializeIntent(intent);
  }

  async deleteIntent(id: string, userId: string) {
    const intent = await this.prisma.intent.update({
      where: { id, userId },
      data: { status: "CANCELLED" },
    });
    return this.serializeIntent(intent);
  }

  async getActiveIntents() {
    return await this.prisma.intent.findMany({
      where: {
        status: "ACTIVE",
        nextExecution: { lte: new Date() },
      },
      include: { user: true },
    });
  }

  private calculateNextExecution(frequency: string): Date {
    const now = new Date();

    switch (frequency) {
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
        now.setMinutes(now.getMinutes() + 5); // Default to 5 minutes
    }

    return now;
  }
}
