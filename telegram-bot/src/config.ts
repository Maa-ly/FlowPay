import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  botUsername: process.env.BOT_USERNAME || 'flowpayment_bot',
  adminUserId: parseInt(process.env.ADMIN_USER_ID || '646892793'),
  miniAppUrl: process.env.MINI_APP_URL || 'http://localhost:8080',
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  webhookUrl: process.env.WEBHOOK_URL || '',
};

// Validate required config
if (!config.botToken) {
  throw new Error('BOT_TOKEN is required in .env file');
}
