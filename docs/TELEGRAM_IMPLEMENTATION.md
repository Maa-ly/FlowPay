# 🤖 Telegram Implementation Guide - FlowPay

> **Complete guide to implementing FlowPay on Telegram with both Bot and Mini App**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Telegram Bot Setup](#telegram-bot-setup)
3. [Telegram Mini App Integration](#telegram-mini-app-integration)
4. [Architecture](#architecture)
5. [Implementation Steps](#implementation-steps)
6. [Deployment Guide](#deployment-guide)
7. [Free Hosting Options](#free-hosting-options)
8. [Wallet Integration on Telegram](#wallet-integration-on-telegram)
9. [Payment Integration](#payment-integration)
10. [Testing Guide](#testing-guide)
11. [Best Practices](#best-practices)

---

## 🎯 Overview

FlowPay will be available on Telegram in **two powerful ways**:

### 1. **Telegram Bot** 🤖

- Chat-based interface for creating and managing intents
- Command-based interactions (`/start`, `/create`, `/dashboard`)
- Direct notifications for intent execution
- Voice command support (future)

### 2. **Telegram Mini App** 🌐

- Full React web app **inside Telegram**
- Same UI as standalone website
- Seamless wallet connection (Telegram Wallet, MetaMask via TON Connect)
- Launches from bot or direct link
- Can be added to home screen

---

## 🤖 Telegram Bot Setup

### Step 1: Create Your Bot with BotFather

1. **Open Telegram** and search for [@BotFather](https://t.me/BotFather)

2. **Start a conversation** and create your bot:

   ```
   /newbot
   ```

3. **Choose a name:**

   ```
   FlowPay
   ```

4. **Choose a username** (must end in 'bot'):

   ```
   flowpay_bot
   ```

5. **Save your bot token** (looks like this):
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### Step 2: Configure Bot Settings

1. **Set description:**

   ```
   /setdescription
   ```

   Then paste:

   ```
   FlowPay - Your AI-powered payment automation assistant for Cronos blockchain. Create smart payment intents that execute automatically when conditions are met.
   ```

2. **Set about text:**

   ```
   /setabouttext
   ```

   Then paste:

   ```
   Automate your recurring payments, subscriptions, and conditional transfers on Cronos blockchain.
   ```

3. **Set commands:**

   ```
   /setcommands
   ```

   Then paste:

   ```
   start - Start using FlowPay
   create - Create a new payment intent
   dashboard - View all your intents
   app - Open the full app
   help - Get help and support
   settings - Configure preferences
   ```

4. **Set bot picture:**
   ```
   /setuserpic
   ```
   Upload your bot's profile picture (512x512 px recommended)

### Step 3: Enable Mini App

1. **Set up Mini App:**

   ```
   /newapp
   ```

2. **Choose your bot:**

   ```
   @flowpay_bot
   ```

3. **App title:**

   ```
   FlowPay
   ```

4. **App description:**

   ```
   Automate payments on Cronos blockchain with AI-powered conditions
   ```

5. **Upload preview images** (1280x720 px):
   - Screenshot of dashboard
   - Screenshot of create intent form
   - Screenshot of intent execution

6. **Set app URL** (after deploying):

   ```
   https://your-domain.com
   ```

   Or use temporary URL for testing:

   ```
   https://your-vercel-app.vercel.app
   ```

7. **Enable as Main Mini App:**
   ```
   /mybots
   ```

   - Select your bot
   - Bot Settings → Mini App → Set Main Mini App

---

## 🌐 Telegram Mini App Integration

### What is a Telegram Mini App?

Telegram Mini Apps are **full web applications that run inside Telegram**:

- Built with standard web technologies (React, HTML, CSS, JavaScript)
- Access to Telegram user data (name, username, photo)
- Native Telegram UI components
- Can send data back to the bot
- Support payments via Telegram Stars or traditional methods
- Can be added to device home screen

### How Your React App Becomes a Mini App

Your existing React app needs **minimal changes** to work as a Telegram Mini App:

1. **Add Telegram Web App Script**
2. **Initialize Telegram SDK**
3. **Handle Telegram-specific features**
4. **Adapt wallet connection for Telegram**

### Integration Code

#### 1. Add Telegram SDK to HTML

**File:** `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    <title>FlowPay</title>

    <!-- Telegram Web App SDK -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### 2. Create Telegram Context

**File:** `frontend/src/contexts/TelegramContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  isInTelegram: boolean;
  theme: 'light' | 'dark';
  expand: () => void;
  close: () => void;
  ready: () => void;
  showPopup: (params: any) => void;
  showAlert: (message: string) => void;
  hapticFeedback: (type: 'impact' | 'notification' | 'selection') => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      setIsInTelegram(true);

      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();

      // Get user data
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }

      // Set theme
      setTheme(tg.colorScheme || 'light');

      // Apply Telegram theme colors
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color',
        tg.themeParams.bg_color || '#ffffff'
      );
      document.documentElement.style.setProperty(
        '--tg-theme-text-color',
        tg.themeParams.text_color || '#000000'
      );
      document.documentElement.style.setProperty(
        '--tg-theme-button-color',
        tg.themeParams.button_color || '#3390ec'
      );
    }
  }, []);

  const expand = () => window.Telegram?.WebApp?.expand();
  const close = () => window.Telegram?.WebApp?.close();
  const ready = () => window.Telegram?.WebApp?.ready();

  const showPopup = (params: any) => window.Telegram?.WebApp?.showPopup(params);

  const showAlert = (message: string) => window.Telegram?.WebApp?.showAlert(message);

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection') => {
    const tg = window.Telegram?.WebApp;
    if (type === 'impact') {
      tg?.HapticFeedback?.impactOccurred('medium');
    } else if (type === 'notification') {
      tg?.HapticFeedback?.notificationOccurred('success');
    } else {
      tg?.HapticFeedback?.selectionChanged();
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        user,
        isInTelegram,
        theme,
        expand,
        close,
        ready,
        showPopup,
        showAlert,
        hapticFeedback,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};

// Type declaration for window.Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}
```

#### 3. Update App.tsx

**File:** `frontend/src/App.tsx`

```typescript
import { TelegramProvider } from "./contexts/TelegramContext";

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TelegramProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen bg-background">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/create" element={<CreateIntent />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/intent/:id" element={<IntentDetails />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </TelegramProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

#### 4. Use Telegram Features in Components

**Example: Create Intent with Telegram Feedback**

```typescript
import { useTelegram } from "@/contexts/TelegramContext";

function CreateIntentForm() {
  const { hapticFeedback, showAlert, isInTelegram } = useTelegram();

  const handleSubmit = async (data: any) => {
    // Haptic feedback on button press (Telegram only)
    hapticFeedback('impact');

    try {
      await createIntent(data);

      // Success feedback
      hapticFeedback('notification');

      if (isInTelegram) {
        showAlert('Intent created successfully!');
      } else {
        toast.success('Intent created!');
      }
    } catch (error) {
      showAlert('Failed to create intent');
    }
  };

  return (
    // Your form JSX
  );
}
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      TELEGRAM PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Telegram Bot   │◄───────►│  Telegram Mini   │         │
│  │   (@flowpay_bot) │         │       App        │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            ▼                            ▼
┌───────────────────────────────────────────────────────────┐
│                    YOUR BACKEND SERVER                     │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Bot Server (Node.js + grammY)                      │  │
│  │  - Handle commands (/start, /create, /dashboard)    │  │
│  │  - Send notifications                               │  │
│  │  - Process callbacks                                │  │
│  │  - Validate Telegram data                           │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  API Server (Express/Fastify)                       │  │
│  │  - Serve Mini App frontend                          │  │
│  │  - Handle intent CRUD operations                    │  │
│  │  - Process payments                                 │  │
│  │  - Interact with blockchain                         │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────┬───────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────┐
│                  CRONOS BLOCKCHAIN                         │
│  - Intent Smart Contract                                  │
│  - Payment Execution                                       │
│  - x402 Facilitator API                                    │
└───────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Steps

### Phase 1: Bot Backend (Week 1)

Create a Node.js server using **grammY** (best TypeScript framework for Telegram bots):

#### 1. Initialize Bot Project

```bash
mkdir telegram-bot
cd telegram-bot
npm init -y
npm install grammy @grammyjs/types dotenv
npm install -D typescript @types/node tsx
npx tsc --init
```

#### 2. Create Bot Code

**File:** `telegram-bot/src/bot.ts`

```typescript
import { Bot, InlineKeyboard, Context } from "grammy";
import dotenv from "dotenv";

dotenv.config();

// Initialize bot with token from BotFather
const bot = new Bot(process.env.BOT_TOKEN!);

// Middleware to log all updates
bot.use(async (ctx, next) => {
  console.log(`Update from ${ctx.from?.username}: ${ctx.message?.text}`);
  await next();
});

// /start command
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .webApp("🚀 Open App", process.env.MINI_APP_URL!)
    .row()
    .text("➕ Create Intent", "create_intent")
    .text("📊 Dashboard", "view_dashboard")
    .row()
    .text("❓ Help", "help");

  await ctx.reply(
    `👋 Welcome to FlowPay!

I help you automate payments on Cronos blockchain with AI-powered conditions.

🔹 Create recurring payments
🔹 Set conditional transfers
🔹 Manage subscriptions
🔹 Never miss a payment again

Choose an option below or tap "Open App" for the full experience!`,
    { reply_markup: keyboard },
  );
});

// /create command
bot.command("create", async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    "Create in App",
    `${process.env.MINI_APP_URL}/create`,
  );

  await ctx.reply(
    "Let's create a new payment intent!\n\n" +
      "Tap below to open the creation wizard:",
    { reply_markup: keyboard },
  );
});

// /dashboard command
bot.command("dashboard", async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    "View Dashboard",
    `${process.env.MINI_APP_URL}/dashboard`,
  );

  await ctx.reply("📊 View all your payment intents:", {
    reply_markup: keyboard,
  });
});

// /app command - open full mini app
bot.command("app", async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    "🚀 Launch App",
    process.env.MINI_APP_URL!,
  );

  await ctx.reply("Launch the full FlowPay app:", { reply_markup: keyboard });
});

// /help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    `📚 *FlowPay Help*

*Commands:*
/start - Start the bot
/create - Create a new intent
/dashboard - View your intents
/app - Open full application
/help - Show this help message

*Features:*
• Automated recurring payments
• Conditional transfers
• Subscription management
• Real-time notifications
• AI-powered conditions

*Need support?*
Contact: @flowpay_support`,
    { parse_mode: "Markdown" },
  );
});

// Handle callback queries (button clicks)
bot.on("callback_query:data", async (ctx) => {
  const action = ctx.callbackQuery.data;

  if (action === "create_intent") {
    await ctx.answerCallbackQuery();
    const keyboard = new InlineKeyboard().webApp(
      "Create Intent",
      `${process.env.MINI_APP_URL}/create`,
    );
    await ctx.editMessageText("Create a new payment intent in the app:", {
      reply_markup: keyboard,
    });
  } else if (action === "view_dashboard") {
    await ctx.answerCallbackQuery();
    const keyboard = new InlineKeyboard().webApp(
      "View Dashboard",
      `${process.env.MINI_APP_URL}/dashboard`,
    );
    await ctx.editMessageText("View your dashboard:", {
      reply_markup: keyboard,
    });
  } else if (action === "help") {
    await ctx.answerCallbackQuery();
    await bot.api.sendMessage(ctx.chat!.id, "For help, use /help command");
  }
});

// Handle errors
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  console.error("Error:", e);
});

// Start bot
bot.start({
  onStart: (botInfo) => {
    console.log(`Bot @${botInfo.username} started!`);
  },
});

export { bot };
```

#### 3. Environment Variables

**File:** `telegram-bot/.env`

```bash
BOT_TOKEN=your_bot_token_from_botfather
MINI_APP_URL=https://your-domain.com
PORT=3001
```

#### 4. Run Bot

```bash
npm run dev
```

### Phase 2: Mini App Integration (Week 2)

Already mostly done! Just add Telegram context as shown above.

### Phase 3: Webhook Deployment (Week 2-3)

For production, use **webhooks** instead of polling:

**File:** `telegram-bot/src/webhook.ts`

```typescript
import express from "express";
import { webhookCallback } from "grammy";
import { bot } from "./bot";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Webhook endpoint
app.post(`/${process.env.BOT_TOKEN}`, webhookCallback(bot, "express"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  // Set webhook URL
  const webhookUrl = `${process.env.WEBHOOK_URL}/${process.env.BOT_TOKEN}`;
  await bot.api.setWebhook(webhookUrl);
  console.log(`Webhook set to: ${webhookUrl}`);
});
```

---

## 🌍 Deployment Guide

### Option 1: Vercel (Recommended - Free)

**Perfect for both Mini App and Bot webhook!**

#### Deploy Mini App (Frontend)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy from frontend folder:**

   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts:**
   - Set project name: `flowpay`
   - Select framework: `Vite`
   - Keep default settings

4. **Get your URL:**
   ```
   https://flowpay.vercel.app
   ```

#### Deploy Bot (Backend)

1. **Create `vercel.json` in telegram-bot folder:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/webhook.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/webhook.ts"
    }
  ],
  "env": {
    "BOT_TOKEN": "@bot_token",
    "MINI_APP_URL": "@mini_app_url",
    "WEBHOOK_URL": "@webhook_url"
  }
}
```

2. **Deploy:**

   ```bash
   cd telegram-bot
   vercel
   ```

3. **Add environment variables:**
   ```bash
   vercel env add BOT_TOKEN
   vercel env add MINI_APP_URL
   vercel env add WEBHOOK_URL
   ```

### Option 2: Railway (Free Tier)

**Good for Node.js backends with databases**

1. **Visit:** https://railway.app
2. **Sign up** with GitHub
3. **New Project** → Deploy from GitHub repo
4. **Add environment variables** in Railway dashboard
5. **Deploy automatically** on push

**Cost:** Free for 500 hours/month, then $5/month

### Option 3: Render (Free Tier)

1. **Visit:** https://render.com
2. **New** → Web Service
3. **Connect GitHub repo**
4. **Configure:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. **Add environment variables**
6. **Deploy**

**Cost:** Free tier available, but spins down after inactivity

### Option 4: Cloudflare Workers (Free)

**Best for serverless functions**

1. **Install Wrangler:**

   ```bash
   npm install -g wrangler
   ```

2. **Create worker:**

   ```bash
   wrangler init telegram-bot
   ```

3. **Deploy:**
   ```bash
   wrangler publish
   ```

**Cost:** 100,000 requests/day free

---

## 💰 Free Hosting Options Summary

| Platform        | Frontend | Backend      | Database | Cost                  |
| --------------- | -------- | ------------ | -------- | --------------------- |
| **Vercel**      | ✅ Free  | ✅ Free      | ❌       | **FREE**              |
| **Railway**     | ✅ Free  | ✅ Free      | ✅ Free  | **FREE** (500h/mo)    |
| **Render**      | ✅ Free  | ✅ Free      | ✅ Free  | **FREE** (spins down) |
| **Netlify**     | ✅ Free  | ✅ Functions | ❌       | **FREE**              |
| **Cloudflare**  | ✅ Free  | ✅ Workers   | ✅ D1    | **FREE**              |
| **Deno Deploy** | ✅ Free  | ✅ Free      | ✅ KV    | **FREE**              |

**Recommended Setup (100% Free):**

- **Frontend (Mini App):** Vercel
- **Bot Backend:** Vercel Serverless Functions
- **Database:** Prisma Accelerate (PostgreSQL - Connection pooling)
- **File Storage:** Cloudflare R2 (Free tier)

**Total Cost: $0/month for up to 100,000 users!**

---

## 💳 Wallet Integration on Telegram

### Option 1: TON Connect (Recommended for Telegram)

**Best for Telegram users - native integration**

```bash
npm install @tonconnect/ui-react
```

```typescript
import { TonConnectButton } from '@tonconnect/ui-react';

function Header() {
  return (
    <header>
      <TonConnectButton />
    </header>
  );
}
```

### Option 2: RainbowKit (Current - Works in Telegram too!)

Your existing RainbowKit setup **already works** in Telegram Mini Apps!

```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Works perfectly in Telegram Mini App
<ConnectButton />
```

### Option 3: Hybrid Approach (Best of Both Worlds)

Detect if running in Telegram and show appropriate wallet:

```typescript
import { useTelegram } from '@/contexts/TelegramContext';
import { TonConnectButton } from '@tonconnect/ui-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function WalletButton() {
  const { isInTelegram } = useTelegram();

  return isInTelegram ? (
    <TonConnectButton /> {/* Native Telegram wallet */}
  ) : (
    <ConnectButton /> {/* Regular web3 wallets */}
  );
}
```

---

## 💰 Payment Integration

### Telegram Stars (In-App Currency)

**Perfect for digital products and subscriptions**

```typescript
import { Bot } from "grammy";

bot.command("subscribe", async (ctx) => {
  await ctx.replyWithInvoice(
    "Premium Subscription",
    "Get unlimited intents and priority support",
    "subscription_premium",
    "", // No provider needed for Stars
    "XTR", // Telegram Stars currency
    [{ label: "Monthly Subscription", amount: 100 }], // 100 Stars
  );
});

// Handle successful payment
bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("message:successful_payment", async (ctx) => {
  const payment = ctx.message.successful_payment;
  console.log(`Payment received: ${payment.total_amount} ${payment.currency}`);

  // Activate premium features
  await activatePremium(ctx.from.id);

  await ctx.reply("✅ Payment successful! Premium features activated.");
});
```

### Traditional Crypto Payments (Cronos)

Use your existing RainbowKit + Wagmi setup!

```typescript
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

function PaymentButton() {
  const { sendTransaction } = useSendTransaction();

  const handlePayment = () => {
    sendTransaction({
      to: '0xRecipient',
      value: parseEther('10'), // 10 CRO
    });
  };

  return <button onClick={handlePayment}>Pay with CRO</button>;
}
```

---

## 🧪 Testing Guide

### Testing Your Bot Locally

1. **Start ngrok** (for webhook testing):

   ```bash
   ngrok http 3001
   ```

2. **Update webhook URL:**

   ```bash
   export WEBHOOK_URL=https://your-ngrok-url.ngrok.io
   ```

3. **Start bot:**

   ```bash
   npm run dev
   ```

4. **Open Telegram** and search for your bot

5. **Test commands:**
   - `/start`
   - `/create`
   - `/dashboard`
   - `/app`

### Testing Mini App

1. **Enable debug mode** (iOS):
   - Settings → Tap 10 times on icon
   - Toggle "Allow Web View Inspection"

2. **Enable debug mode** (Android):
   - Settings → Scroll to bottom
   - Press and hold version number 2x
   - Enable "WebView Debug"

3. **Inspect Mini App:**
   - **iOS:** Safari → Develop → [Your Device]
   - **Android:** Chrome → `chrome://inspect`

### Test Environment

Telegram has a **test environment** for development:

1. **Login to test environment:**
   - iOS: Settings → 10 taps → Test
   - Android: Debug menu → Test

2. **Create test bot** with [@BotFather](https://t.me/BotFather) on test server

3. **Use test API:**
   ```
   https://api.telegram.org/bot<token>/test/METHOD
   ```

---

## ✅ Best Practices

### Security

1. **Validate Telegram Data:**

   ```typescript
   import crypto from "crypto";

   function validateTelegramWebAppData(
     initData: string,
     botToken: string,
   ): boolean {
     const urlParams = new URLSearchParams(initData);
     const hash = urlParams.get("hash");
     urlParams.delete("hash");

     const dataCheckString = Array.from(urlParams.entries())
       .sort(([a], [b]) => a.localeCompare(b))
       .map(([key, value]) => `${key}=${value}`)
       .join("\n");

     const secretKey = crypto
       .createHmac("sha256", "WebAppData")
       .update(botToken)
       .digest();

     const calculatedHash = crypto
       .createHmac("sha256", secretKey)
       .update(dataCheckString)
       .digest("hex");

     return hash === calculatedHash;
   }
   ```

2. **Never expose bot token** in frontend code

3. **Use environment variables** for all secrets

4. **Validate user permissions** on backend

### UX/UI

1. **Use Telegram theme colors:**

   ```typescript
   const tg = window.Telegram?.WebApp;
   const bgColor = tg?.themeParams?.bg_color || "#ffffff";
   ```

2. **Enable haptic feedback:**

   ```typescript
   tg?.HapticFeedback?.impactOccurred("medium");
   ```

3. **Show loading states:**

   ```typescript
   tg?.MainButton?.showProgress();
   ```

4. **Handle viewport changes:**
   ```typescript
   tg?.onEvent("viewportChanged", () => {
     console.log("Viewport changed:", tg.viewportHeight);
   });
   ```

### Performance

1. **Lazy load components:**

   ```typescript
   const Dashboard = lazy(() => import("./pages/Dashboard"));
   ```

2. **Optimize images** for mobile

3. **Minimize bundle size**

4. **Use CDN** for static assets

### Notifications

Send notifications when intents execute:

```typescript
async function notifyUser(userId: number, message: string) {
  await bot.api.sendMessage(userId, message, {
    parse_mode: "Markdown",
  });
}

// Example usage
await notifyUser(
  123456789,
  `✅ *Payment Executed*\n\n` +
    `Intent: Monthly Rent\n` +
    `Amount: 500 CRO\n` +
    `To: 0x742d...3a67\n` +
    `Status: Confirmed`,
);
```

---

## 📱 Complete User Flow

### 1. Discovery

User finds bot through:

- Search: `@flowpay_bot`
- Direct link: `https://t.me/flowpay_bot`
- Friend referral
- QR code

### 2. Onboarding

1. User sends `/start`
2. Bot shows welcome message with options
3. User taps "Open App"
4. Mini App launches inside Telegram

### 3. Using the App

1. Connect wallet (TON Connect or MetaMask)
2. Create payment intent
3. Bot sends confirmation notification
4. Intent executes automatically
5. User receives notification

### 4. Managing Intents

- View dashboard in Mini App
- Edit intents via bot commands
- Receive execution notifications
- Check history

---

## 🎯 Quick Start Checklist

- [ ] Create bot with @BotFather
- [ ] Get bot token
- [ ] Set bot description and commands
- [ ] Add Telegram SDK to frontend
- [ ] Create TelegramContext
- [ ] Build bot backend with grammY
- [ ] Deploy frontend to Vercel
- [ ] Deploy bot to Vercel/Railway
- [ ] Set webhook URL
- [ ] Enable Mini App in @BotFather
- [ ] Test all commands
- [ ] Test Mini App launch
- [ ] Test wallet connection
- [ ] Test payment flow
- [ ] Add notifications
- [ ] Go live! 🚀

---

## 📚 Resources

### Official Documentation

- **Telegram Bots:** https://core.telegram.org/bots
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **grammY Framework:** https://grammy.dev
- **Bot API Reference:** https://core.telegram.org/bots/api

### Useful Tools

- **@BotFather:** Create and manage bots
- **@WebAppBot:** Test web apps
- **Telegram Test Environment:** For development
- **ngrok:** Local webhook testing

### Community

- **grammY Chat:** https://t.me/grammyjs
- **Telegram Bot Developers:** https://t.me/BotDevelopment
- **TON Dev:** https://t.me/tondev_eng

---

## 💡 Pro Tips

1. **Start simple** - Get basic bot working first
2. **Use Mini App** for complex features
3. **Leverage Telegram's native UI** - buttons, inline keyboards
4. **Test on real devices** early and often
5. **Monitor analytics** - use bot.api.getUpdates()
6. **Enable backups** for user data
7. **Plan for scale** from day one
8. **Document your bot** with /help command
9. **Collect feedback** from users
10. **Iterate quickly** based on usage

---

## 🎉 Next Steps

Once you have the basic implementation:

1. **Add AI Agent Integration**
   - Natural language intent creation
   - Smart condition parsing
   - Automated decision making

2. **Enable Voice Commands**
   - Voice message processing
   - Text-to-speech responses

3. **Social Features**
   - Share intents with friends
   - Group payment splitting
   - Leaderboards

4. **Advanced Automation**
   - Cross-chain transfers
   - DeFi integrations
   - NFT automations

---

**Need help?** Open an issue on GitHub or message [@flowpay_support](https://t.me/flowpay_support)

**Ready to build?** Let's go! 🚀
