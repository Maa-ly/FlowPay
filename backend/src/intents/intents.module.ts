import { Module } from "@nestjs/common";
import { IntentsService } from "./intents.service";
import { IntentsController } from "./intents.controller";
import { BlockchainModule } from "../blockchain/blockchain.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [BlockchainModule, NotificationsModule],
  providers: [IntentsService],
  controllers: [IntentsController],
  exports: [IntentsService],
})
export class IntentsModule {}
