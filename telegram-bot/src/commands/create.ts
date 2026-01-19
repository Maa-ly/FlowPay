import { CommandContext, Context } from 'grammy';
import { createIntentKeyboard } from '../keyboards.js';

export async function createCommand(ctx: CommandContext<Context>) {
  const message = `
💳 *Create Payment Intent*

Choose how you want to create your payment intent:

📱 *Web App* - Full featured interface with all options
⚡ *Quick Actions* - Fast creation with templates

*Intent Types:*
• 💸 One-time payment
• 🔄 Recurring subscription
• 🤖 AI-triggered payment
• ⏰ Scheduled transfer
`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: createIntentKeyboard(),
  });
}
