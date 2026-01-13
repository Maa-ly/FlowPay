# FlowPay 🤖💰

Intent-Driven Agentic Payments on Cronos EVM

## 📋 Project Overview

**FlowPay** is an intent-driven, agentic on-chain payments application built on Cronos EVM using x402 programmatic payment flows. The project enables users to express high-level financial intentions—such as paying rent safely, sending allowances when affordable, or automating subscriptions—without manually signing transactions each time.

Instead of relying on rigid schedules, FlowPay introduces a lightweight AI-driven execution agent that evaluates user-defined constraints before triggering payments. These constraints include balance thresholds, safety buffers, timing windows, and priority rules.

### Key Features

- **Intent Creation**: Users define payment intents including recipient, amount, frequency, and safety buffer
- **Agentic Decision Layer**: A lightweight agent evaluates wallet balance and user-defined constraints before execution
- **Conditional Execution**: Payments are delayed or skipped if constraints (e.g., minimum balance buffer) are violated
- **x402 Settlement**: Approved payments are executed using x402-compatible programmatic payment flows on Cronos
- **Transparency & Explainability**: The UI displays the agent's decision state (Ready, Delayed, Executed) and reasoning
- **Multi-Wallet Support**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more via RainbowKit
- **🆕 Telegram Integration**: Full bot and Mini App experience - use FlowPay directly in Telegram with chat commands and embedded web app

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- A compatible Web3 wallet (MetaMask, WalletConnect-compatible wallets, etc.)
- (Optional) Telegram account for bot/Mini App usage

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/croam.git
cd croam
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install smart contract dependencies (Foundry):
```bash
cd ../contract
forge install
```

### Running the Application

#### Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

#### Smart Contract Development

```bash
cd contract
forge build
forge test
```
� Platform Availability

FlowPay is available on **multiple platforms**:

### 🌐 Web Application
Access the full-featured web app at your deployed URL with complete wallet integration and UI.

### 🤖 Telegram Bot
Use FlowPay through the Telegram bot with:
- Command-based interactions (`/start`, `/create`, `/dashboard`)
- Quick intent creation via chat
- Instant notifications when payments execute
- Direct links to Mini App for complex tasks

### 📲 Telegram Mini App
Run the full React application **inside Telegram**:
- Same UI as web version
- Native Telegram integration
- Seamless authentication
- Can be added to home screen
- Works on desktop and mobile

**👉 See [TELEGRAM_IMPLEMENTATION.md](TELEGRAM_IMPLEMENTATION.md) for complete setup guide**

---

## �
## 🔌 Cronos Wallet Integration

The application uses **RainbowKit** and **Wagmi** for wallet connections, providing a modern, user-friendly wallet experience with support for multiple wallet providers.

### Wallet Features

- **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and more
- **Network Support**: Cronos Mainnet (Chain ID: 25) and Cronos Testnet (Chain ID: 338)
- **Real-time Balance**: Automatic CRO balance updates
- **Account Management**: View address, copy to clipboard, switch accounts
- **Network Switching**: Seamless network detection and switching
- **Mobile & Desktop**: Responsive design with QR code support for mobile wallets
- **Customizable UI**: Beautiful, branded wallet connection experience

### Supported Networks

- **Cronos Mainnet** (Chain ID: 25)
  - RPC: https://evm.cronos.org/
  - Explorer: https://cronoscan.com
- **Cronos Testnet** (Chain ID: 338)
  - RPC: https://evm-t3.cronos.org/
  - Explorer: https://testnet.cronoscan.com
  - [Get testnet CRO](https://cronos.org/faucet)

### Wallet Implementation Details

The wallet integration uses modern Web3 libraries:

- **RainbowKit** (`@rainbow-me/rainbowkit`): Beautiful wallet connection UI
- **Wagmi** (`wagmi`): React hooks for Ethereum
- **Viem** (`viem`): TypeScript-first Ethereum library
- **Chain Configuration** ([src/config/chains.ts](frontend/src/config/chains.ts)): Cronos chain definitions
- **Wagmi Config** ([src/config/wagmi.ts](frontend/src/config/wagmi.ts)): Wallet connection setup

### How to Connect Your Wallet

1. Click "Connect Wallet" in the application header
2. Choose your preferred wallet from the modal
3. Approve the connection in your wallet
4. Select Cronos Mainnet or Testnet from the network switcher
5. You're connected! Your address and balance will appear in the header

### Setup Instructions

1. Get a WalletConnect Project ID at [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Copy `frontend/.env.example` to `frontend/.env.local`
3. Add your project ID:
   ```bash
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```
4. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```

## 🏗️ Project Structure

```
croam/
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/    # Layout components (Header, etc.)
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── create/    # Intent creation components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   └── home/      # Home page components
│   │   ├── contexts/      # React contexts (Wallet, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Application pages
│   └── package.json
├── contract/              # Solidity smart contracts
│   ├── src/
│   │   └── intent.sol    # Payment intent contract
│   ├── test/
│   │   └── intent.t.sol  # Contract tests
│   └── foundry.toml      # Foundry configuration
└── README.md
```Project Guides
- **[TELEGRAM_IMPLEMENTATION.md](TELEGRAM_IMPLEMENTATION.md)** - Complete guide to deploying FlowPay on Telegram (Bot + Mini App)
- **[WALLET_GUIDE.md](frontend/WALLET_GUIDE.md)** - Comprehensive Wagmi hooks usage guide
- **[X402_INTEGRATION.md](frontend/X402_INTEGRATION.md)** - x402 protocol integration guide
- **[RAINBOWKIT_INTEGRATION.md](RAINBOWKIT_INTEGRATION.md)** - RainbowKit/Wagmi implementation summary

### 

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **RainbowKit** for wallet connections
- **Wagmi** for Ethereum interactions
- **Viem** for blockchain utilities
- **Lucide React** for icons
- **React Hook Form** for form management
- **Sonner** for toast notifications

### Blockchain
- **Cronos EVM** - Layer 1 blockchain
- **Solidity** - Smart contract language
- **Foundry** - Smart contract development framework
- **x402 Protocol** - Programmatic payment settlement
- **@crypto.com/facilitator-client** - x402 Facilitator SDK

## 📖 Documentation

### Cronos Resources
- [Cronos Documentation](https://docs.cronos.org)
- [x402 Facilitator Introduction](https://docs.cronos.org/cronos-x402-facilitator/introduction)
- [x402 How It Works](https://docs.cronos.org/cronos-x402-facilitator/how-it-works)
- [Cronos Developer Resources](https://docs.cronos.org/for-dapp-developers/hacker-resources)
- [Wallet Integration Guide](https://docs.cronos.org/for-dapp-developers/chain-integration/web-extension-integration)
- [Facilitator Client NPM](https://www.npmjs.com/package/@crypto.com/facilitator-client)

### Web3 Libraries
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

### x402 Protocol
- [x402 API Reference](https://docs.cronos.org/cronos-x402-facilitator/api-reference)
- [x402 Quick Start for Sellers](https://docs.cronos.org/cronos-x402-facilitator/quick-start-for-sellers)
- [x402 Quick Start for Buyers](https://docs.cronos.org/cronos-x402-facilitator/quick-start-for-buyers)
- [x402 Examples](https://github.com/cronos-labs/x402-examples)

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Smart Contract Tests
```bash
cd contract
forge test
forge test -vvv  # Verbose output
```

## 🌐 Deployment

### Frontend Deployment

The frontend can be deployed to platforms like Vercel, Netlify, or any static hosting service:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory.

### Smart Contract Deployment

Deploy to Cronos Testnet:
```bash
cd contract
forge create --rpc-url https://evm-t3.cronos.org/ \
  --private-key YOUR_PRIVATE_KEY \
  src/intent.sol:IntentContract
```

Deploy to Cronos Mainnet:
```bash
forge create --rpc-url https://evm.cronos.org/ \
  --private-key YOUR_PRIVATE_KEY \
  src/intent.sol:IntentContract
```

## 🔐 Security Considerations

- Never commit private keys or sensitive data to the repository
- Always test on testnet before deploying to mainnet
- Use environment variables for sensitive configuration
- Review smart contract code thoroughly before deployment
- Keep dependencies up to date

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built for the Cronos Hackathon
- Powered by Cronos EVM and x402
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Wallet integration with Crypto.com DeFi Wallet

## 📞 Support

For questions or support:
- Check the [Cronos Documentation](https://docs.cronos.org)
- Visit the [Cronos Discord](https://discord.gg/cronos)
- Open an issue in this repository

---

**FlowPay** - Making Web3 payments smarter, safer, and more autonomous. 🚀
