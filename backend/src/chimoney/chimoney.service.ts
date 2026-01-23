import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

interface PayoutRequest {
  phoneNumber: string;
  country: string;
  amountUSD: number;
  userId: string;
  intentId: string;
}

interface PayoutResult {
  success: boolean;
  txId?: string;
  error?: string;
  status?: string;
}

@Injectable()
export class ChimoneyService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly polygonTreasuryWallet: string;
  private readonly isEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get("CHIMONEY_API_KEY");
    this.apiUrl = this.configService.get("CHIMONEY_API_URL");
    this.polygonTreasuryWallet = this.configService.get(
      "POLYGON_TREASURY_WALLET",
    );
    this.isEnabled = !!(this.apiKey && this.polygonTreasuryWallet);

    if (!this.isEnabled) {
      console.warn(
        "⚠️  Chimoney service is DISABLED - Missing API key or Polygon treasury wallet. Off-ramp features will not work.",
      );
    }
  }

  /**
   * Check if Chimoney service is enabled
   */
  isServiceEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Execute mobile money payout via Chimoney
   * This implements the "Shadow Bridge" logic:
   * 1. Verify user funds locked on Cronos
   * 2. Release equivalent funds from Polygon treasury to Chimoney
   * 3. Process payout
   */
  async executePayout(request: PayoutRequest): Promise<PayoutResult> {
    if (!this.isEnabled) {
      return {
        success: false,
        error: "Chimoney service is not configured. Please contact support.",
      };
    }

    try {
      // Step 1: User funds should already be locked on Cronos (verified by caller)

      // Step 2: Call Chimoney API for payout
      const response = await axios.post(
        `${this.apiUrl}/payouts/mobile-money`,
        {
          payouts: [
            {
              phoneNumber: request.phoneNumber,
              valueInUSD: request.amountUSD,
              country: request.country,
              reference: `FlowPay-${request.intentId}`,
              meta: {
                userId: request.userId,
                intentId: request.intentId,
              },
            },
          ],
        },
        {
          headers: {
            "X-API-KEY": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      // Step 3: Check response
      if (response.data.status === "success") {
        return {
          success: true,
          txId: response.data.data.id,
          status: response.data.data.status,
        };
      } else {
        return {
          success: false,
          error: response.data.error || "Payout failed",
        };
      }
    } catch (error) {
      console.error(
        "Chimoney payout failed:",
        error.response?.data || error.message,
      );

      // If payout fails, the caller should unlock user funds on Cronos
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Execute bank transfer payout via Chimoney
   */
  async executeBankPayout(request: {
    accountNumber: string;
    bankCode: string;
    country: string;
    amountUSD: number;
    userId: string;
    intentId: string;
  }): Promise<PayoutResult> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/payouts/bank`,
        {
          payouts: [
            {
              accountNumber: request.accountNumber,
              bankCode: request.bankCode,
              valueInUSD: request.amountUSD,
              country: request.country,
              reference: `FlowPay-${request.intentId}`,
              meta: {
                userId: request.userId,
                intentId: request.intentId,
              },
            },
          ],
        },
        {
          headers: {
            "X-API-KEY": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        return {
          success: true,
          txId: response.data.data.id,
          status: response.data.data.status,
        };
      } else {
        return {
          success: false,
          error: response.data.error || "Bank payout failed",
        };
      }
    } catch (error) {
      console.error(
        "Chimoney bank payout failed:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  /**
   * Check payout status
   */
  async checkPayoutStatus(txId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payouts/status?id=${txId}`,
        {
          headers: {
            "X-API-KEY": this.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Failed to check payout status:", error.message);
      return null;
    }
  }

  /**
   * Get supported countries and methods
   */
  async getSupportedCountries(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/info/country-banks`, {
        headers: {
          "X-API-KEY": this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch supported countries:", error.message);
      return null;
    }
  }

  /**
   * Verify account details before payout
   */
  async verifyAccount(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/accounts/verify`,
        {
          accountNumber,
          bankCode,
        },
        {
          headers: {
            "X-API-KEY": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Account verification failed:", error.message);
      return null;
    }
  }

  /**
   * Handle Chimoney webhook
   */
  async handleWebhook(payload: any, signature: string): Promise<boolean> {
    // Verify webhook signature
    const webhookSecret = this.configService.get("CHIMONEY_WEBHOOK_SECRET");

    // TODO: Implement signature verification
    // const isValid = this.verifyWebhookSignature(payload, signature, webhookSecret);

    // if (!isValid) {
    //   return false;
    // }

    // Process webhook event
    console.log("Chimoney webhook received:", payload);

    // Update execution status in database based on webhook event
    // This should be handled by the execution service

    return true;
  }
}
