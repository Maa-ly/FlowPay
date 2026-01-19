import { CommandContext, Context } from 'grammy';
import { mainMenuKeyboard } from '../keyboards.js';

export async function startCommand(ctx: CommandContext<Context>) {
  const firstName = ctx.from?.first_name || 'there';
  const userId = ctx.from?.id;
  
  const welcomeMessage = `
🌊 *Welcome to FlowPay, ${firstName}!*

Your AI-powered payment automation assistant on Cronos blockchain.

✨ *What you can do:*
• 💳 Create smart payment intents
• 🤖 Set AI-powered conditions
• 🔄 Automate recurring payments
• 📊 Track all transactions
• 💰 Manage your crypto assets

🚀 *Get Started:*
Tap "Open FlowPay App" below to access the full web interface, or use the quick actions!

_Your User ID: \`${userId}\`_
`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: mainMenuKeyboard(),
  });
}
