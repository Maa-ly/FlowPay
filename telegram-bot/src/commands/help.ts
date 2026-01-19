import { CommandContext, Context } from 'grammy';
import { helpKeyboard } from '../keyboards.js';

export async function helpCommand(ctx: CommandContext<Context>) {
  const message = `
📚 *FlowPay Help & Documentation*

*Available Commands:*
/start - Show welcome message and main menu
/create - Create a new payment intent
/dashboard - View your intents and stats
/help - Show this help message
/settings - Configure your preferences

*Quick Guide:*

🎯 *Creating Intents*
1. Use /create or tap "Create Intent"
2. Choose your intent type
3. Set conditions and amount
4. Confirm and activate

💡 *Pro Tips:*
• Use AI conditions for smart automation
• Set up recurring payments for subscriptions
• Check dashboard regularly for activity
• Enable notifications for real-time updates

*Need More Help?*
• Read our full documentation
• Join the community chat
• Report issues on GitHub

_FlowPay - Powered by Cronos blockchain_
`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: helpKeyboard(),
  });
}
