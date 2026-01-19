import { CommandContext, Context } from 'grammy';
import { dashboardKeyboard } from '../keyboards.js';

export async function dashboardCommand(ctx: CommandContext<Context>) {
  // In production, this would fetch real data from your backend
  const mockStats = {
    activeIntents: 5,
    totalVolume: '$1,234.56',
    successRate: '98.5%',
    lastExecution: '2 hours ago',
  };

  const message = `
📊 *Your Dashboard*

*Quick Stats:*
• ✅ Active Intents: ${mockStats.activeIntents}
• 💰 Total Volume: ${mockStats.totalVolume}
• 📈 Success Rate: ${mockStats.successRate}
• ⏱️ Last Execution: ${mockStats.lastExecution}

*Recent Activity:*
1. Payment to @alice - $50.00 ✅
2. Subscription payment - $29.99 ✅
3. Recurring transfer - $100.00 ✅

Tap "Open Full Dashboard" for detailed analytics and management.
`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: dashboardKeyboard(),
  });
}
