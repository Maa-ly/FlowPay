import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { ChimoneyModule } from '../chimoney/chimoney.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [BlockchainModule, ChimoneyModule, NotificationsModule],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
