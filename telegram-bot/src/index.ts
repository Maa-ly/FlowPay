import express from 'express';
import { webhookCallback } from 'grammy';
import { bot } from './bot.js';
import { config } from './config.js';

// Start server
if (config.nodeEnv === 'development') {
  // Use long polling in development (no Express server needed)
  console.log('🤖 Starting bot in development mode (long polling)...');
  console.log(`📱 Bot: @${config.botUsername}`);
  console.log(`🌐 Mini App URL: ${config.miniAppUrl}`);
  
  bot.start({
    onStart: (botInfo) => {
      console.log(`✅ Bot started successfully!`);
      console.log(`   Name: ${botInfo.first_name}`);
      console.log(`   Username: @${botInfo.username}`);
      console.log(`\n💡 Send /start to @${botInfo.username} to test the bot`);
    },
  });
} else {
  // Use webhooks in production with Express
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      bot: config.botUsername,
      mode: config.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  // Webhook endpoint for production
  app.post('/webhook', webhookCallback(bot, 'express'));

  app.listen(config.port, async () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📱 Bot: @${config.botUsername}`);
    
    if (config.webhookUrl) {
      try {
        await bot.api.setWebhook(config.webhookUrl);
        console.log(`✅ Webhook set to: ${config.webhookUrl}`);
      } catch (error) {
        console.error('❌ Failed to set webhook:', error);
      }
    } else {
      console.warn('⚠️ WEBHOOK_URL not set. Set it in production!');
    }
  });
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  bot.stop();
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('\n👋 Shutting down bot...');
  bot.stop();
  process.exit(0);
});
