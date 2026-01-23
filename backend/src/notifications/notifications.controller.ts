import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req) {
    return await this.notificationsService.getUserNotifications(req.user.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    return await this.notificationsService.markAllAsRead(req.user.userId);
  }
}
