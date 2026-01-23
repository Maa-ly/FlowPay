import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { IntentsService } from '../intents/intents.service';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly botUsername: string;
  private readonly miniAppUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private intentsService: IntentsService,
  ) {
    this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
    this.botUsername = this.configService.get('TELEGRAM_BOT_USERNAME');
    this.miniAppUrl = this.configService.get('FRONTEND_URL');
  }

  /**
   * Handle incoming Telegram webhook
   */
  async handleWebhook(update: any) {
    console.log('Telegram webhook received:', JSON.stringify(update, null, 2));

    if (update.message) {
      await this.handleMessage(update.message);
    } else if (update.callback_query) {
      await this.handleCallbackQuery(update.callback_query);
    }
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(message: any) {
    const chatId = message.chat.id;
    const text = message.text;

    if (text.startsWith('/start')) {
      await this.sendWelcomeMessage(chatId);
    } else if (text === '/help') {
      await this.sendHelpMessage(chatId);
    } else if (text === '/intents') {
      await this.sendUserIntents(chatId, message.from.id);
    } else if (text === '/link') {
      await this.sendLinkInstructions(chatId);
    } else {
      await this.sendMessage(chatId, 'Unknown command. Send /help for available commands.');
    }
  }

  /**
   * Handle callback query (button clicks)
   */
  private async handleCallbackQuery(query: any) {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Handle different callback actions
    if (data.startsWith('view_intent_')) {
      const intentId = data.replace('view_intent_', '');
      await this.sendIntentDetails(chatId, intentId);
    }

    // Answer callback query
    await axios.post(
      `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`,
      { callback_query_id: query.id },
    );
  }

  /**
   * Send welcome message
   */
  private async sendWelcomeMessage(chatId: number) {
    const keyboard = {
      inline_keyboard: [
        [{ text: '🚀 Open FlowPay', web_app: { url: this.miniAppUrl } }],
        [{ text: '📋 My Intents', callback_data: 'my_intents' }],
        [{ text: '🔗 Link Wallet', callback_data: 'link_wallet' }],
      ],
    };

    await this.sendMessage(
      chatId,
      '👋 Welcome to <b>FlowPay</b>!\n\n' +
      'FlowPay is an intent-driven agentic payment platform on Cronos.\n\n' +
      'Automate your payments with smart constraints:\n' +
      '• Balance safety buffers\n' +
      '• Gas price limits\n' +
      '• Time windows\n' +
      '• Off-ramp to mobile money\n\n' +
      'Click below to get started!',
      keyboard,
    );
  }

  /**
   * Send help message
   */
  private async sendHelpMessage(chatId: number) {
    await this.sendMessage(
      chatId,
      '<b>FlowPay Bot Commands</b>\n\n' +
      '/start - Welcome message\n' +
      '/help - Show this help\n' +
      '/intents - View your active intents\n' +
      '/link - Link your wallet\n\n' +
      'Or click the button below to open the full app:',
      {
        inline_keyboard: [
          [{ text: '🚀 Open FlowPay', web_app: { url: this.miniAppUrl } }],
        ],
      },
    );
  }

  /**
   * Send user intents
   */
  private async sendUserIntents(chatId: number, telegramId: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      include: { intents: { where: { status: 'ACTIVE' }, take: 5 } },
    });

    if (!user) {
      await this.sendMessage(
        chatId,
        'You haven\'t linked your wallet yet. Use /link to connect your wallet.',
      );
      return;
    }

    if (user.intents.length === 0) {
      await this.sendMessage(
        chatId,
        'You don\'t have any active intents yet. Create one in the app!',
        {
          inline_keyboard: [
            [{ text: '➕ Create Intent', web_app: { url: `${this.miniAppUrl}/create` } }],
          ],
        },
      );
      return;
    }

    let message = '<b>Your Active Intents:</b>\n\n';
    user.intents.forEach((intent, index) => {
      message += `${index + 1}. ${intent.name}\n`;
      message += `   💰 ${intent.amount} ${intent.token} → ${intent.recipient.slice(0, 10)}...\n`;
      message += `   📅 Next: ${intent.nextExecution?.toLocaleDateString()}\n\n`;
    });

    await this.sendMessage(chatId, message, {
      inline_keyboard: [
        [{ text: '📊 View Dashboard', web_app: { url: `${this.miniAppUrl}/dashboard` } }],
      ],
    });
  }

  /**
   * Send link instructions
   */
  private async sendLinkInstructions(chatId: number) {
    await this.sendMessage(
      chatId,
      '🔗 <b>Link Your Wallet</b>\n\n' +
      'To link your Telegram account with your wallet:\n\n' +
      '1. Open the FlowPay app\n' +
      '2. Connect your wallet\n' +
      '3. Go to Settings\n' +
      '4. Click "Link Telegram"\n\n' +
      'Your Telegram ID: <code>' + chatId + '</code>',
      {
        inline_keyboard: [
          [{ text: '🚀 Open FlowPay', web_app: { url: this.miniAppUrl } }],
        ],
      },
    );
  }

  /**
   * Send intent details
   */
  private async sendIntentDetails(chatId: number, intentId: string) {
    const intent = await this.intentsService.getIntentById(intentId);

    if (!intent) {
      await this.sendMessage(chatId, 'Intent not found.');
      return;
    }

    const message =
      `<b>${intent.name}</b>\n\n` +
      `Recipient: ${intent.recipient}\n` +
      `Amount: ${intent.amount} ${intent.token}\n` +
      `Frequency: ${intent.frequency}\n` +
      `Status: ${intent.status}\n` +
      `Executions: ${intent.executionCount}\n` +
      `Next: ${intent.nextExecution?.toLocaleString()}`;

    await this.sendMessage(chatId, message);
  }

  /**
   * Send message to chat
   */
  async sendMessage(chatId: number, text: string, replyMarkup?: any) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        },
      );
    } catch (error) {
      console.error('Failed to send Telegram message:', error.response?.data || error.message);
    }
  }

  /**
   * Set webhook
   */
  async setWebhook(webhookUrl: string) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${this.botToken}/setWebhook`,
        { url: webhookUrl },
      );
      console.log('✅ Telegram webhook set:', webhookUrl);
    } catch (error) {
      console.error('Failed to set webhook:', error.message);
    }
  }
}
