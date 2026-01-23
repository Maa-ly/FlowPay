import { Module } from "@nestjs/common";
import { IntentsService } from "./intents.service";
import { IntentsController } from "./intents.controller";
import { BlockchainModule } from "../blockchain/blockchain.module";

@Module({
  imports: [BlockchainModule],
  providers: [IntentsService],
  controllers: [IntentsController],
  exports: [IntentsService],
})
export class IntentsModule {}
