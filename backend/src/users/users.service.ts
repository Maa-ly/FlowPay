import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByWallet(walletAddress: string) {
    return await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
  }

  async findByTelegram(telegramId: bigint) {
    return await this.prisma.user.findUnique({ where: { telegramId } });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  }
}
