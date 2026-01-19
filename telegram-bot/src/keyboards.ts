import { InlineKeyboard } from 'grammy';

export const mainMenuKeyboard = () => {
  return new InlineKeyboard()
    .webApp('🚀 Open FlowPay App', process.env.MINI_APP_URL || 'http://localhost:8080')
    .row()
    .text('💳 Create Intent', 'create_intent')
    .row()
    .text('📊 My Dashboard', 'my_dashboard')
    .row()
    .text('💰 Check Balance', 'check_balance')
    .text('📚 Help', 'help');
};

export const createIntentKeyboard = () => {
  return new InlineKeyboard()
    .webApp('📝 Create via Web App', `${process.env.MINI_APP_URL}/create`)
    .row()
    .text('💸 Quick Payment', 'quick_payment')
    .text('🔄 Recurring', 'recurring_payment')
    .row()
    .text('🤖 AI Conditions', 'ai_conditions')
    .text('⏰ Scheduled', 'scheduled_payment')
    .row()
    .text('« Back to Menu', 'main_menu');
};

export const dashboardKeyboard = () => {
  return new InlineKeyboard()
    .webApp('📊 Open Full Dashboard', `${process.env.MINI_APP_URL}/dashboard`)
    .row()
    .text('✅ Active Intents', 'active_intents')
    .text('⏸️ Paused Intents', 'paused_intents')
    .row()
    .text('📜 History', 'history')
    .text('📈 Stats', 'stats')
    .row()
    .text('« Back to Menu', 'main_menu');
};

export const helpKeyboard = () => {
  return new InlineKeyboard()
    .url('📖 Documentation', 'https://github.com/Maa-ly/docs')
    .row()
    .text('💬 Community (Coming Soon)', 'community_soon')
    .text('🐛 Report Issue', 'https://github.com/Maa-ly/issues')
    .row()
    .text('« Back to Menu', 'main_menu');
};

export const quickActionsKeyboard = () => {
  return new InlineKeyboard()
    .text('⚡ Quick Send', 'quick_send')
    .text('📥 Request', 'request_payment')
    .row()
    .text('🔗 Share Intent', 'share_intent')
    .text('⚙️ Settings', 'settings')
    .row()
    .text('« Back to Menu', 'main_menu');
};
