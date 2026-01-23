import { Controller, Post, Body, Headers } from "@nestjs/common";
import { ChimoneyService } from "./chimoney.service";

@Controller("chimoney")
export class ChimoneyController {
  constructor(private readonly chimoneyService: ChimoneyService) {}

  @Post("webhook")
  async handleWebhook(
    @Body() payload: any,
    @Headers("x-chimoney-signature") signature: string,
  ) {
    const result = await this.chimoneyService.handleWebhook(payload, signature);
    return { received: result };
  }
}
