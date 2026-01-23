import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { IntentsModule } from "./intents/intents.module";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { X402Module } from "./x402/x402.module";
import { ExecutionModule } from "./execution/execution.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { TelegramModule } from "./telegram/telegram.module";
import { ChimoneyModule } from "./chimoney/chimoney.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Scheduling for cron jobs
    ScheduleModule.forRoot(),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    IntentsModule,
    BlockchainModule,
    X402Module,
    ExecutionModule,
    NotificationsModule,
    TelegramModule,
    ChimoneyModule,
  ],
})
export class AppModule {}
