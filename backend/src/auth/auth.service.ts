import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { BlockchainService } from "../blockchain/blockchain.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private blockchainService: BlockchainService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate nonce for wallet authentication
   */
  async getNonce(walletAddress: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (user) {
      return user.nonce;
    }

    // Create new user with nonce
    const newUser = await this.prisma.user.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
      },
    });

    return newUser.nonce;
  }

  /**
   * Verify wallet signature and issue JWT
   */
  async verifyAndLogin(
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<{ accessToken: string; user: any }> {
    // Verify signature
    const recoveredAddress = this.blockchainService.verifySignature(
      message,
      signature,
    );

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error("Invalid signature");
    }

    // Get or create user
    let user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
        },
      });
    }

    // Generate new nonce for next login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { nonce: this.generateNonce() },
    });

    // Generate JWT
    const payload = { sub: user.id, walletAddress: user.walletAddress };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        telegramId: user.telegramId,
      },
    };
  }

  /**
   * Link Telegram account to wallet
   */
  async linkTelegram(
    userId: string,
    telegramId: bigint,
    telegramUsername: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        telegramId,
        telegramUsername,
      },
    });
  }

  /**
   * Generate random nonce
   */
  private generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }
}
