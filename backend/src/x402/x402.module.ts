import { Module } from "@nestjs/common";
import { X402Service } from "./x402.service";
import { X402Middleware } from "./x402.middleware";

@Module({
  providers: [X402Service, X402Middleware],
  exports: [X402Service, X402Middleware],
})
export class X402Module {}
