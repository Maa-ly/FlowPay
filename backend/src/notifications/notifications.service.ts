import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface NotificationData {
  type: string;
  title: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  private readonly telegramBotToken: string;
  private readonly enableTelegram: boolean;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.telegramBotToken = this.configService.get('TELEGRAM_BOT_TOKEN');
    this.enableTelegram = this.configService.get('ENABLE_TELEGRAM_NOTIFICATIONS', 'true') === 'true';
  }

  /**
   * Send notification to user (both in-app and Telegram)
   */
  async sendNotification(userId: string, data: NotificationData) {
    // Create in-app notification
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
      },
    });

    // Send Telegram notification if user has linked Telegram
    if (this.enableTelegram) {
      await this.sendTelegramNotification(userId, data);
    }

    return notification;
  }

  /**
   * Send Telegram message to user
   */
  private async sendTelegramNotification(userId: string, data: NotificationData) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user?.telegramId) {
        return; // User hasn't linked Telegram
      }

      const message = this.formatTelegramMessage(data);

      await axios.post(
        `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`,
        {
          chat_id: user.telegramId.toString(),
          text: message,
          parse_mode: 'HTML',
        },
      );
    } catch (error) {
      console.error('Failed to send Telegram notification:', error.message);
    }
  }

  /**
   * Format notification for Telegram
   */
  private formatTelegramMessage(data: NotificationData): string {
    let icon = '';
    switch (data.type) {
      case 'EXECUTION_SUCCESS':
        icon = '✅';
        break;
      case 'EXECUTION_DELAYED':
        icon = '⚠️';
        break;
      case 'EXECUTION_FAILED':
        icon = '❌';
        break;
      default:
        icon = 'ℹ️';
    }

    return `${icon} <b>${data.title}</b>\n\n${data.message}`;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 20) {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId: string) {
    return await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await this.prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
