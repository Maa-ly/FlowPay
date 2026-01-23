# FlowPay Backend

Intent-driven agentic payments backend built with NestJS, Cronos x402, and Chimoney off-ramping.

## 🚀 Features

- **Intent Execution Engine** - Automated payment execution with constraint evaluation
- **x402 Integration** - Agentic payments using Cronos x402 facilitator
- **Chimoney Off-Ramping** - Fiat payouts to mobile money and bank accounts
- **Wallet Authentication** - Sign-in with wallet using EIP-712 signatures
- **Telegram Bot** - Monitor and manage intents via Telegram
- **Real-time Notifications** - In-app and Telegram notifications
- **Blockchain Integration** - Interact with Intent and Factory contracts on Cronos

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values
nano .env
```

## 🔧 Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/flowpay"

# Blockchain
CRONOS_RPC_URL=https://evm-t3.cronos.org
INTENT_CONTRACT_ADDRESS=0xa08ddc973F7EdD3c7609AB89CDCB8634D462D904
FACTORY_CONTRACT_ADDRESS=0xc0f194c7332fed0edB39550A66946d09c245B842
EXECUTION_WALLET_PRIVATE_KEY=your_private_key

# Telegram
TELEGRAM_BOT_TOKEN=8213507760:AAHgWNKq9qC23tSk_jJoAONH7EpeRZxS6GU

# Chimoney (Optional - for off-ramp)
CHIMONEY_API_KEY=your_chimoney_api_key

# JWT
JWT_SECRET=your_secure_random_secret
```

## 🗄️ Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (optional)
npm run prisma:studio
```

## 🏃 Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## 📡 API Endpoints

### Authentication
- `GET /api/auth/nonce?walletAddress=0x...` - Get nonce for wallet auth
- `POST /api/auth/login` - Login with wallet signature
- `POST /api/auth/link-telegram` - Link Telegram account

### Intents
- `POST /api/intents` - Create new intent
- `GET /api/intents` - Get user's intents
- `GET /api/intents/:id` - Get intent details
- `PATCH /api/intents/:id/pause` - Pause intent
- `PATCH /api/intents/:id/resume` - Resume intent
- `DELETE /api/intents/:id` - Cancel intent

### Users
- `GET /api/users/profile` - Get user profile

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

### Telegram
- `POST /api/telegram/webhook` - Telegram webhook endpoint

### Chimoney
- `POST /api/chimoney/webhook` - Chimoney webhook endpoint

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   NestJS Backend (API)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Intent     │  │  Blockchain  │  │  Chimoney    │      │
│  │   Executor   │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐   ┌──────────┐   ┌──────────┐
    │PostgreSQL│   │ Cronos   │   │ Chimoney │
    │   DB     │   │Blockchain│   │   API    │
    └─────────┘   └──────────┘   └──────────┘
```

## 🔐 Security

### Private Key Management
- **NEVER** commit private keys to version control
- Store execution wallet key in environment variables
- Use separate wallets for testnet and mainnet
- Backend wallet only needs gas for transactions

### Wallet Authentication
1. Frontend requests nonce from backend
2. User signs message with wallet
3. Backend verifies signature and issues JWT
4. JWT used for all authenticated requests

### x402 Payment Flow
1. Request requires payment → Return 402 with requirements
2. User signs EIP-3009 authorization
3. Backend verifies payment with x402 facilitator
4. Backend settles payment on-chain
5. Content delivered after settlement

## 📊 Intent Execution Flow

```
1. Cron job runs every minute
2. Fetch intents where nextExecution <= now
3. For each intent:
   ├─ Check balance >= amount + safety buffer
   ├─ Check gas price <= max (if set)
   ├─ Check current time in window (if set)
   └─ If all pass:
      ├─ Execute on-chain OR
      └─ Execute off-ramp via Chimoney
4. Record execution result
5. Update next execution time
6. Send notification to user
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔄 Chimoney Off-Ramp Flow

### Shadow Bridge Logic
1. User deposits USDC on Cronos (locked in contract)
2. Backend verifies deposit event
3. Backend releases equivalent USDC from Polygon treasury to Chimoney
4. Chimoney processes mobile money payout
5. On success → Finalize intent on Cronos
6. On failure → Refund user on Cronos

### Supported Countries
- Nigeria, Kenya, Ghana, Uganda, Tanzania, Rwanda
- South Africa, Zambia, Zimbabwe, and more

## 📝 Contract ABIs

The Intent and Factory contract ABIs are in `src/blockchain/blockchain.service.ts`.
Update them with your actual deployed contract ABIs.

## 🚀 Deployment

### Railway / Render / Fly.io

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Docker (Optional)

```bash
docker build -t flowpay-backend .
docker run -p 3000:3000 --env-file .env flowpay-backend
```

## 📞 Telegram Webhook Setup

After deployment, set the webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-backend-domain.com/api/telegram/webhook"}'
```

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull
```

### Blockchain Connection Issues
```bash
# Check RPC endpoint
curl -X POST https://evm-t3.cronos.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Telegram Bot Not Responding
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check webhook is set correctly
- Review logs for errors

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Cronos x402 Docs](https://docs.cronos.org/cronos-x402-facilitator)
- [Chimoney API Docs](https://chimoney.readme.io/)
- [Prisma Docs](https://www.prisma.io/docs)

## 📄 License

MIT

## 👥 Contributors

FlowPay Team

---

**Built with ❤️ for Cronos Hackathon 2026**
