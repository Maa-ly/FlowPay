import { Module } from "@nestjs/common";
import { ChimoneyService } from "./chimoney.service";
import { ChimoneyController } from "./chimoney.controller";

@Module({
  providers: [ChimoneyService],
  controllers: [ChimoneyController],
  exports: [ChimoneyService],
})
export class ChimoneyModule {}
