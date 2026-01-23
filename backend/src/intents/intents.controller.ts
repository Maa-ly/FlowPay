import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { IntentsService, CreateIntentDto } from "./intents.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("intents")
@UseGuards(JwtAuthGuard)
export class IntentsController {
  constructor(private readonly intentsService: IntentsService) {}

  @Post()
  async create(@Request() req, @Body() data: CreateIntentDto) {
    return await this.intentsService.createIntent(req.user.userId, data);
  }

  @Get()
  async getUserIntents(@Request() req) {
    return await this.intentsService.getUserIntents(req.user.userId);
  }

  @Get(":id")
  async getIntent(@Param("id") id: string) {
    return await this.intentsService.getIntentById(id);
  }

  @Patch(":id/pause")
  async pause(@Param("id") id: string, @Request() req) {
    return await this.intentsService.pauseIntent(id, req.user.userId);
  }

  @Patch(":id/resume")
  async resume(@Param("id") id: string, @Request() req) {
    return await this.intentsService.resumeIntent(id, req.user.userId);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Request() req,
    @Body() data: Partial<CreateIntentDto>,
  ) {
    return await this.intentsService.updateIntent(id, req.user.userId, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Request() req) {
    return await this.intentsService.deleteIntent(id, req.user.userId);
  }
}
