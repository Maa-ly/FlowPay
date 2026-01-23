import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("nonce")
  async getNonce(@Query("walletAddress") walletAddress: string) {
    const nonce = await this.authService.getNonce(walletAddress);
    return {
      nonce,
      message: `Sign this message to authenticate with FlowPay:\n\nNonce: ${nonce}`,
    };
  }

  @Post("login")
  async login(
    @Body("walletAddress") walletAddress: string,
    @Body("signature") signature: string,
    @Body("message") message: string,
  ) {
    return await this.authService.verifyAndLogin(
      walletAddress,
      signature,
      message,
    );
  }

  @Post("link-telegram")
  async linkTelegram(
    @Body("userId") userId: string,
    @Body("telegramId") telegramId: string,
    @Body("telegramUsername") telegramUsername: string,
  ) {
    await this.authService.linkTelegram(
      userId,
      BigInt(telegramId),
      telegramUsername,
    );
    return { success: true };
  }
}
