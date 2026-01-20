import { Bot, Context, session, SessionFlavor } from 'grammy';
import { config } from './config.js';
import { startCommand } from './commands/start.js';
import { createCommand } from './commands/create.js';
import { dashboardCommand } from './commands/dashboard.js';
import { helpCommand } from './commands/help.js';
import {
  mainMenuKeyboard,
  createIntentKeyboard,
  dashboardKeyboard,
  helpKeyboard,
  quickActionsKeyboard,
} from './keyboards.js';

// Define session data structure
interface SessionData {
  step: string;
}

// Define custom context type with session
type MyContext = Context & SessionFlavor<SessionData>;

// Create bot instance with custom context
export const bot = new Bot<MyContext>(config.botToken);

// Session setup (for storing user state)
bot.use(session<SessionData, MyContext>({
  initial() {
    return { step: 'idle' };
  },
}));

// Middleware: Log all updates
bot.use(async (ctx, next) => {
  const updateType = ctx.update.message ? 'message' : 
                     ctx.update.callback_query ? 'callback' : 'other';
  const userId = ctx.from?.id;
  const username = ctx.from?.username;
  
  console.log(`[${new Date().toISOString()}] ${updateType} from ${username || userId}`);
  
  await next();
});

// Command handlers
bot.command('start', startCommand);
bot.command('create', createCommand);
bot.command('dashboard', dashboardCommand);
bot.command('help', helpCommand);

bot.command('settings', async (ctx) => {
  await ctx.reply(
    '⚙️ *Settings*\n\nSettings panel coming soon!\n\nYou\'ll be able to:\n• Manage notifications\n• Set default currencies\n• Configure security\n• Update preferences',
    { parse_mode: 'Markdown' }
  );
});

// Callback query handlers (for inline keyboard buttons)
bot.callbackQuery('main_menu', async (ctx) => {
  await ctx.editMessageText(
    '🏠 *Main Menu*\n\nWhat would you like to do?',
    {
      parse_mode: 'Markdown',
      reply_markup: mainMenuKeyboard(),
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('create_intent', async (ctx) => {
  await ctx.editMessageText(
    '💳 *Create Payment Intent*\n\nChoose your intent type:',
    {
      parse_mode: 'Markdown',
      reply_markup: createIntentKeyboard(),
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('my_dashboard', async (ctx) => {
  await ctx.editMessageText(
    '📊 *Dashboard*\n\nView your payment intents and statistics:',
    {
      parse_mode: 'Markdown',
      reply_markup: dashboardKeyboard(),
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('help', async (ctx) => {
  await ctx.editMessageText(
    '📚 *Help & Support*\n\nGet help with FlowPay:',
    {
      parse_mode: 'Markdown',
      reply_markup: helpKeyboard(),
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('check_balance', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: '💰 Balance: Coming soon! Open the web app to check your balance.',
    show_alert: true,
  });
});

// Quick action handlers
bot.callbackQuery('quick_payment', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: '⚡ Quick payment feature coming soon!',
  });
  await ctx.reply(
    '⚡ *Quick Payment*\n\nFor now, please use the Web App to create payments.\n\nTap the button below:',
    {
      parse_mode: 'Markdown',
      reply_markup: createIntentKeyboard(),
    }
  );
});

bot.callbackQuery('recurring_payment', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: '🔄 Use the Web App to set up recurring payments',
  });
});

bot.callbackQuery('ai_conditions', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: '🤖 AI conditions are available in the Web App',
  });
});

bot.callbackQuery('scheduled_payment', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: '⏰ Use the Web App to schedule payments',
  });
});

bot.callbackQuery('active_intents', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    '✅ *Active Intents*\n\n1. Monthly Subscription - $29.99\n2. Recurring Donation - $10.00\n3. Auto-save - $100.00\n\nOpen the Web App for full details.',
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery('paused_intents', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    '⏸️ *Paused Intents*\n\nYou have no paused intents.\n\nIntents can be paused from the dashboard.',
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery('history', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    '📜 *Transaction History*\n\n*Last 5 transactions:*\n1. Payment to Alice - $50 ✅\n2. Subscription - $29.99 ✅\n3. Transfer - $100 ✅\n4. Donation - $10 ✅\n5. Payment - $25 ✅\n\nView full history in Web App.',
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery('stats', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    '📈 *Your Statistics*\n\n• Total Intents: 8\n• Active: 5\n• Completed: 47\n• Total Volume: $2,458.91\n• Success Rate: 98.5%\n\nDetailed analytics in Web App.',
    { parse_mode: 'Markdown' }
  );
});

// Community and feedback handlers
bot.callbackQuery('community_soon', async (ctx) => {
  await ctx.answerCallbackQuery({
    text: '💬 Community features coming soon! Join our updates channel.',
    show_alert: true,
  });
});

bot.callbackQuery('report_issue', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    '🐛 *Report an Issue*\n\nFound a bug or have feedback?\n\n*How to report:*\n1. Describe the issue clearly\n2. Include steps to reproduce\n3. Add screenshots if possible\n\n*Contact Methods:*\n• GitHub: Coming soon\n• Email: support@flowpay.io\n• Telegram: @flowpay_support\n\nFor urgent issues, please use the email option.\n\nThank you for helping us improve! 💚',
    { 
      parse_mode: 'Markdown',
      reply_markup: helpKeyboard()
    }
  );
});

// Handle all other messages
bot.on('message:text', async (ctx) => {
  await ctx.reply(
    '💬 I received your message!\n\nI\'m still learning to understand text. For now, please use the commands:\n\n/start - Main menu\n/create - Create intent\n/dashboard - View dashboard\n/help - Get help',
    { reply_markup: quickActionsKeyboard() }
  );
});

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  console.error(err.error);
  
  // Notify user of error
  ctx.reply(
    '❌ Oops! Something went wrong.\n\nPlease try again or use /help for assistance.'
  ).catch(console.error);
});

export default bot;
