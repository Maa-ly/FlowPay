# FlowPay Telegram Bot

Telegram bot for FlowPay - AI-powered payment automation on Cronos blockchain.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Telegram bot token (from @BotFather)
- FlowPay frontend URL

### Installation

1. **Install dependencies:**
```bash
cd telegram-bot
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Start development server:**
```bash
npm run dev
```

The bot will start in long polling mode and connect to Telegram.

## 📝 Environment Variables

```env
BOT_TOKEN=your_bot_token_here
BOT_USERNAME=your_bot_username_here
ADMIN_USER_ID=your_admin_user_id_here
MINI_APP_URL=https://your-frontend.vercel.app
PORT=3000
NODE_ENV=development
```

## 🧪 Testing

1. **Start the bot:**
```bash
npm run dev
```

2. **Open Telegram and search for:** `@flowpayment_bot`

3. **Send `/start` to test the bot**

4. **Try these commands:**
   - `/start` - Welcome message with main menu
   - `/create` - Create payment intent
   - `/dashboard` - View your intents
   - `/help` - Get help

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
npm run deploy
```

3. **Set environment variables in Vercel dashboard:**
   - BOT_TOKEN
   - MINI_APP_URL
   - WEBHOOK_URL (your Vercel deployment URL + /webhook)

4. **Set webhook:**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-bot.vercel.app/webhook"
```

## 📚 Project Structure

```
telegram-bot/
├── src/
│   ├── index.ts           # Main server entry
│   ├── bot.ts             # Bot configuration
│   ├── config.ts          # Environment config
│   ├── keyboards.ts       # Inline keyboards
│   └── commands/          # Command handlers
│       ├── start.ts
│       ├── create.ts
│       ├── dashboard.ts
│       └── help.ts
├── package.json
├── tsconfig.json
├── vercel.json           # Vercel deployment config
└── .env                  # Environment variables
```

## 🎯 Features

- ✅ Command handlers (/start, /create, /dashboard, /help)
- ✅ Inline keyboards for navigation
- ✅ Mini App integration (Web App button)
- ✅ Callback query handling
- ✅ Session management
- ✅ Error handling
- ✅ Logging middleware
- ✅ Long polling (dev) & Webhooks (prod)

## 🔧 Development

### Build TypeScript:
```bash
npm run build
```

### Run production build:
```bash
npm start
```

### Watch mode (auto-reload):
```bash
npm run dev
```

## 📱 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Show welcome message and main menu |
| `/create` | Create a new payment intent |
| `/dashboard` | View your intents and statistics |
| `/help` | Show help and documentation |
| `/settings` | Configure bot preferences |

## 🔗 Links

- Bot: [@flowpayment_bot](https://t.me/flowpayment_bot)
- Frontend: Update MINI_APP_URL after deployment
- Documentation: [Main README](../README.md)

## 🛠️ Tech Stack

- **grammY** - Modern Telegram Bot framework
- **TypeScript** - Type-safe development
- **Express** - Web server for webhooks
- **Vercel** - Serverless deployment

## 📄 License

MIT
