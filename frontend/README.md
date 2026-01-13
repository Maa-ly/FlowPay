# FlowPay Frontend 🚀

Modern React + TypeScript application for intent-driven, agentic payments on Cronos using x402 programmatic flows.

## 🌟 Features

- **Intent-Driven Payments**: Create smart payment intents with conditional execution
- **Multi-Wallet Support**: RainbowKit integration with MetaMask, WalletConnect, Coinbase, and more
- **Cronos Integration**: Full support for Cronos Mainnet and Testnet
- **Telegram Mini App Ready**: Can run as a Telegram Mini App with native integrations
- **x402 Protocol**: Programmatic payment settlement integration
- **Responsive UI**: Beautiful, mobile-first design with shadcn/ui components
- **Type-Safe**: Full TypeScript support with Viem v2
- **🔔 Notifications System**: Real-time alerts for intent status changes *(Complete)*
- **⚙️ Advanced Constraints**: Time windows, gas price limits, multi-condition logic *(Complete)*
- **📋 Intent Templates**: Pre-built templates for common use cases *(Complete)*

## 🗺️ Feature Roadmap

### 🚧 High Priority (Core to the vision)

1. **Real Agent Execution Logic** 🤖
   - [ ] Implement actual condition evaluation (currently using mock data)
   - [ ] Add background service that checks intent conditions periodically
   - [ ] Show agent decision-making process in real-time

2. **Transaction History & Timeline** 📊
   - [ ] Real execution history from blockchain
   - [ ] Visual timeline of past payments
   - [ ] Gas cost tracking and analytics

3. **x402 Integration** ⚡
   - [ ] Connect to real x402 Facilitator API
   - [ ] Actual payment execution on Cronos
   - [ ] Transaction confirmation and receipts

4. **Smart Contract Integration** 📝
   - [ ] Deploy intent contracts on Cronos
   - [ ] Store intents on-chain
   - [ ] Enable trustless execution

### 🎯 Medium Priority (Enhanced UX)

5. **Notifications System** 🔔 *[✅ Complete]*
   - [x] In-app notification center with dropdown UI
   - [x] Unread notification badge counter
   - [x] Mark as read/delete functionality
   - [x] 4 notification types (Success, Warning, Info, Error)
   - [ ] Real-time WebSocket integration for live updates
   - [ ] Email/Telegram notifications

6. **Advanced Constraints** ⚙️ *[✅ Complete]*
   - [x] Full constraint UI with real-time updates
   - [x] Time windows (execute between specific hours 0-23)
   - [x] Gas price limits (slider 1-200 Gwei)
   - [x] Multi-condition logic (AND/OR rules)
   - [x] Active constraints counter
   - [x] Execution summary panel
   - [ ] Day-of-week constraints
   - [ ] Network congestion detection

7. **Intent Templates** 📋 *[✅ Complete]*
   - [x] Complete template structure with TypeScript types
   - [x] 6 pre-built templates (rent, subscription, allowance, utility, savings, contractor)
   - [x] One-click intent creation with auto-fill
   - [x] Category badges and popularity indicators
   - [x] Tab-based UI (Templates/Custom)
   - [ ] Community template sharing
   - [ ] Custom template creation and saving

8. **Transaction History & Timeline** 📊 *[✅ Complete]*
   - [x] Real execution history from blockchain
   - [x] Visual timeline of past payments
   - [x] Gas cost tracking and analytics
   - [x] Transaction details with blockchain explorer links
   - [x] Summary statistics (total volume, gas spent)
   - [x] Accessible via Dashboard History tab
   - [ ] Advanced filtering and search
   - [ ] Export transaction data

9. **Analytics Dashboard** 📈
   - [x] Total transaction count
   - [x] Total volume tracking
   - [x] Gas spent calculations
   - [ ] Execution success rate
   - [ ] Average gas costs over time
   - [ ] Intent performance metrics
   - [ ] Charts and visualizations

### ✨ Nice to Have (Future enhancements)

10. **Multi-Intent Prioritization** 🎯
   - [ ] Rank intents by priority
   - [ ] Agent decides which to execute first when funds are limited
   - [ ] Dependency chains (execute B only if A succeeded)

11. **Recurring Payment Calendar** 📅
    - [ ] Visual calendar showing upcoming executions
    - [ ] Drag-and-drop to reschedule
    - [ ] Conflict detection

12. **Wallet Balance Forecasting** 🔮
    - [ ] Predict future balance based on active intents
    - [ ] Warning when balance may be insufficient
    - [ ] Suggest adjustments to safety buffers

13. **Social Features** 👥
    - [ ] Share intent templates with friends
    - [ ] Leaderboard for most successful automation
    - [ ] Community best practices

> **Latest Updates**: ✅ Completed Notifications System, Advanced Constraints, Intent Templates, Transaction History & Analytics! Core features are now live with full UI implementation and ready for backend integration.
> 
> **Current Focus**: Testing new features and preparing for x402 protocol integration with real blockchain execution.

## 🛠️ Tech Stack

### Core
- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **React Router** for navigation
- **TailwindCSS** for styling

### Web3
- **RainbowKit** v2 - Beautiful wallet connection UI
- **Wagmi** v2 - React hooks for Ethereum
- **Viem** v2 - TypeScript-first Ethereum library

### UI Components
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **React Hook Form** - Form management

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
# Required: Get from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Custom RPC endpoints
VITE_CRONOS_MAINNET_RPC=https://evm.cronos.org
VITE_CRONOS_TESTNET_RPC=https://evm-t3.cronos.org

# Optional: x402 Facilitator API
VITE_X402_FACILITATOR_URL=https://x402.cronos.org
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── ui/            # shadcn/ui components
│   │   ├── create/        # Intent creation components
│   │   ├── dashboard/     # Dashboard components
│   │   └── home/          # Home page components
│   ├── config/            # Configuration
│   │   ├── chains.ts      # Cronos chain definitions
│   │   └── wagmi.ts       # Wagmi + RainbowKit config
│   ├── contexts/          # React contexts
│   │   └── TelegramContext.tsx  # Telegram Mini App context
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Application pages
│   │   ├── Index.tsx      # Home page
│   │   ├── CreateIntent.tsx    # Create intent page
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── IntentDetails.tsx   # Intent details page
│   │   └── NotFound.tsx        # 404 page
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## 🎨 Pages

### `/` - Home
- Hero section with CTA
- How It Works section
- Feature showcase
- Call to action

### `/create` - Create Intent
- Intent creation form
- Real-time validation
- Constraint configuration
- Preview before creation

### `/dashboard` - Dashboard
- View all intents
- Filter and search
- Intent status overview
- Quick actions

### `/intent/:id` - Intent Details
- Detailed intent information
- Execution history
- Edit/delete actions
- Agent decision reasoning

## 🔌 Wallet Integration

### Supported Wallets
- **MetaMask**
- **WalletConnect** (supports 100+ wallets)
- **Coinbase Wallet**
- **Rainbow Wallet**
- **Trust Wallet**
- **And more...**

### Supported Networks
- **Cronos Mainnet** (Chain ID: 25)
- **Cronos Testnet** (Chain ID: 338)

### Configuration Files
- **[src/config/chains.ts](src/config/chains.ts)** - Chain definitions and helpers
- **[src/config/wagmi.ts](src/config/wagmi.ts)** - Wagmi and RainbowKit setup

### Usage Example

```typescript
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function MyComponent() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected) {
    return <ConnectButton />;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
    </div>
  );
}
```

See [WALLET_GUIDE.md](WALLET_GUIDE.md) for comprehensive usage guide.

## 📲 Telegram Mini App

This app can run as a **Telegram Mini App** with full native integration:

### Features
- Access Telegram user data (name, username, photo)
- Native Telegram theme colors
- Haptic feedback
- Native popups and alerts
- Can be added to home screen

### Setup

1. **Add Telegram SDK** (already included in `index.html`):
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

2. **Use Telegram Context**:
```typescript
import { useTelegram } from '@/contexts/TelegramContext';

function MyComponent() {
  const { user, isInTelegram, hapticFeedback } = useTelegram();
  
  const handleClick = () => {
    hapticFeedback('impact');
    // Your logic
  };
  
  return (
    <div>
      {isInTelegram && <p>Hello, {user?.first_name}!</p>}
    </div>
  );
}
```

See **[../TELEGRAM_IMPLEMENTATION.md](../TELEGRAM_IMPLEMENTATION.md)** for complete Telegram integration guide.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🌍 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy. Your app will be live at `https://your-app.vercel.app`

### Netlify

```bash
npm run build
# Drag and drop the `dist` folder to Netlify
```

### Other Platforms
- **Railway**
- **Render**
- **Cloudflare Pages**
- **GitHub Pages**

See deployment guides in [../TELEGRAM_IMPLEMENTATION.md](../TELEGRAM_IMPLEMENTATION.md)

## 📚 Documentation

### Internal Docs
- **[WALLET_GUIDE.md](WALLET_GUIDE.md)** - Complete Wagmi hooks guide
- **[X402_INTEGRATION.md](X402_INTEGRATION.md)** - x402 protocol integration
- **[TELEGRAM_IMPLEMENTATION.md](../TELEGRAM_IMPLEMENTATION.md)** - Telegram bot & Mini App setup

### External Resources
- [RainbowKit Docs](https://www.rainbowkit.com)
- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [Cronos Docs](https://docs.cronos.org)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## 🔧 Configuration

### Tailwind

Configured via [tailwind.config.ts](tailwind.config.ts) with:
- Custom color palette
- Custom fonts
- shadcn/ui theme variables
- Responsive breakpoints

### TypeScript

Configured via [tsconfig.json](tsconfig.json) with:
- Strict mode enabled
- Path aliases (`@/` → `src/`)
- ES2020 target
- React JSX support

### Vite

Configured via [vite.config.ts](vite.config.ts) with:
- React plugin
- Path resolution
- Build optimizations
- Preview server settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [RainbowKit](https://rainbowkit.com) for wallet UX
- [Wagmi](https://wagmi.sh) for Ethereum hooks
- [Cronos](https://cronos.org) for blockchain infrastructure

---

**Built with ❤️ for the Cronos ecosystem**

