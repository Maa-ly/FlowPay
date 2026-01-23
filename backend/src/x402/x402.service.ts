import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

interface PaymentRequirements {
  scheme: string;
  network: string;
  payTo: string;
  asset: string;
  description: string;
  mimeType: string;
  maxAmountRequired: string;
  maxTimeoutSeconds: number;
}

interface VerificationResult {
  isValid: boolean;
  invalidReason?: string;
}

interface SettlementResult {
  event: string;
  txHash?: string;
  from?: string;
  to?: string;
  value?: string;
  blockNumber?: number;
  timestamp?: number;
  error?: string;
}

@Injectable()
export class X402Service {
  private readonly facilitatorUrl: string;
  private readonly sellerWallet: string;
  private readonly usdcAddress: string;
  private readonly network: string;

  constructor(private configService: ConfigService) {
    this.facilitatorUrl = this.configService.get("X402_FACILITATOR_URL");
    this.sellerWallet =
      this.configService.get("EXECUTION_WALLET_ADDRESS") || "0x...";
    this.usdcAddress = this.configService.get("USDC_TESTNET_ADDRESS");
    this.network = "cronos-testnet"; // or 'cronos' for mainnet
  }

  /**
   * Generate payment requirements for x402
   */
  generatePaymentRequirements(amount: string = "1000000"): PaymentRequirements {
    return {
      scheme: "exact",
      network: this.network,
      payTo: this.sellerWallet,
      asset: this.usdcAddress,
      description: "FlowPay Intent Execution Fee",
      mimeType: "application/json",
      maxAmountRequired: amount, // 1 USDC (6 decimals)
      maxTimeoutSeconds: 300,
    };
  }

  /**
   * Verify x402 payment header
   */
  async verifyPayment(paymentHeader: string): Promise<VerificationResult> {
    try {
      const paymentRequirements = this.generatePaymentRequirements();

      const requestBody = {
        x402Version: 1,
        paymentHeader,
        paymentRequirements,
      };

      const response = await axios.post(
        `${this.facilitatorUrl}/verify`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X402-Version": "1",
          },
        },
      );

      return {
        isValid: response.data.isValid,
        invalidReason: response.data.invalidReason,
      };
    } catch (error) {
      console.error(
        "x402 verification error:",
        error.response?.data || error.message,
      );
      return {
        isValid: false,
        invalidReason:
          error.response?.data?.invalidReason || "Verification failed",
      };
    }
  }

  /**
   * Settle x402 payment on-chain
   */
  async settlePayment(paymentHeader: string): Promise<SettlementResult> {
    try {
      const paymentRequirements = this.generatePaymentRequirements();

      const requestBody = {
        x402Version: 1,
        paymentHeader,
        paymentRequirements,
      };

      const response = await axios.post(
        `${this.facilitatorUrl}/settle`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X402-Version": "1",
          },
        },
      );

      return {
        event: response.data.event,
        txHash: response.data.txHash,
        from: response.data.from,
        to: response.data.to,
        value: response.data.value,
        blockNumber: response.data.blockNumber,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      console.error(
        "x402 settlement error:",
        error.response?.data || error.message,
      );
      return {
        event: "payment.failed",
        error: error.response?.data?.error || "Settlement failed",
      };
    }
  }

  /**
   * Check supported payment methods
   */
  async getSupportedMethods(): Promise<any> {
    try {
      const response = await axios.get(`${this.facilitatorUrl}/supported`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch supported methods:", error.message);
      return null;
    }
  }
}
