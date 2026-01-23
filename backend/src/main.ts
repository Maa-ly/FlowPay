import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get("PORT", 3000);
  const apiPrefix = configService.get("API_PREFIX", "api");

  // Enable CORS
  app.enableCors({
    origin: [
      configService.get("FRONTEND_URL"),
      configService.get("FRONTEND_DEV_URL"),
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:3001",
      "https://flowpayment.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);
  console.log(
    `🚀 FlowPay Backend running on: http://localhost:${port}/${apiPrefix}`,
  );
}

bootstrap();
