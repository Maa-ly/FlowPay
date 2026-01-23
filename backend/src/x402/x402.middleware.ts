import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { X402Service } from "./x402.service";

@Injectable()
export class X402Middleware implements NestMiddleware {
  constructor(private readonly x402Service: X402Service) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const paymentHeader = req.headers["x-payment"] as string;

    // Case A: No payment provided - Return 402 Payment Required
    if (!paymentHeader) {
      const paymentRequirements =
        this.x402Service.generatePaymentRequirements();

      return res.status(402).json({
        error: "Payment Required",
        x402Version: 1,
        paymentRequirements,
      });
    }

    // Case B: Payment provided - Verify it
    try {
      const verification = await this.x402Service.verifyPayment(paymentHeader);

      if (!verification.isValid) {
        return res.status(403).json({
          error: "Invalid payment",
          reason: verification.invalidReason,
        });
      }

      // Payment is valid - Attempt settlement
      const settlement = await this.x402Service.settlePayment(paymentHeader);

      if (settlement.event !== "payment.settled") {
        return res.status(402).json({
          error: "Payment settlement failed",
          reason: settlement.error,
        });
      }

      // Attach payment info to request for downstream use
      req["paymentInfo"] = settlement;

      next();
    } catch (error) {
      return res.status(500).json({
        error: "Server error processing payment",
        details: error.message,
      });
    }
  }
}
