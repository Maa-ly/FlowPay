# 🔧 Backend Requirements & Architecture

## Overview
FlowPay currently has a complete **frontend** (React + Vite) and **smart contracts** (Solidity + Foundry). To make the platform fully functional, we need a **backend service** to handle automation, monitoring, and execution of payment intents.

---

## What the Backend Will Be Used For

### 1. **Intent Execution Engine** 🎯
The core backend service that monitors and executes payment intents based on defined constraints.

#### Responsibilities:
- **Monitor active intents** - Continuously check for intents ready to execute
- **Evaluate constraints** - Check if all conditions (time windows, gas prices, balance) are met
- **Execute transactions** - Sign and broadcast transactions to the blockchain when conditions are satisfied
- **Handle retries** - Retry failed transactions with exponential backoff
- **Update intent status** - Mark intents as executed, delayed, or failed

#### Example Flow:
```
1. User creates intent: "Pay $100 USDC to 0x123... monthly"
2. Backend monitors this intent every minute
3. On the 1st of each month:
   - Check balance > $100 + safety buffer
   - Check gas price < limit (if enabled)
   - Check time window (if enabled)
4. If all constraints met → Execute transaction
5. If not → Delay and log reason
6. Notify user of outcome
```

---

### 2. **Blockchain Interaction Layer** ⛓️
Interfaces with Cronos blockchain and smart contracts.

#### Responsibilities:
- **Read contract state** - Fetch intent details, balances, execution history
- **Write to contracts** - Create, update, pause, resume, delete intents
- **Transaction management** - Nonce tracking, gas estimation, transaction signing
- **Event listening** - Monitor blockchain events for intent execution, updates
- **Multi-chain support** - Handle both Cronos Testnet and Mainnet

#### Technology Stack:
- **ethers.js** or **viem** - Ethereum/Cronos blockchain interaction
- **Wallet management** - Secure key storage for automated execution
- **RPC providers** - Reliable Cronos RPC endpoints

---

### 3. **API Server** 🌐
REST/GraphQL API for frontend and Telegram bot communication.

#### Endpoints Needed:

##### Intent Management
```typescript
POST   /api/intents              // Create new intent
GET    /api/intents              // List user's intents
GET    /api/intents/:id          // Get intent details
PATCH  /api/intents/:id          // Update intent
DELETE /api/intents/:id          // Delete intent
POST   /api/intents/:id/pause    // Pause intent
POST   /api/intents/:id/resume   // Resume intent
```

##### User & Wallet
```typescript
POST   /api/auth/wallet          // Authenticate with wallet signature
GET    /api/user/profile         // Get user profile
GET    /api/user/balance         // Get wallet balances
GET    /api/user/history         // Get transaction history
```

##### Analytics & Monitoring
```typescript
GET    /api/stats/overview       // Dashboard statistics
GET    /api/stats/gas-prices     // Current gas prices
GET    /api/intents/upcoming     // Upcoming executions
GET    /api/intents/delayed      // Delayed intents with reasons
```

##### Telegram Integration
```typescript
POST   /api/telegram/webhook     // Receive Telegram updates
GET    /api/telegram/user/:id    // Get Telegram user's intents
POST   /api/telegram/link        // Link Telegram account to wallet
```

---

### 4. **Notification Service** 🔔
Sends notifications to users via multiple channels.

#### Notification Types:
- **Execution Success** - "Your rent payment of 1000 USDC was sent successfully"
- **Execution Delayed** - "Payment delayed: Balance below safety buffer"
- **Execution Failed** - "Transaction failed: Insufficient gas"
- **Warning Alerts** - "Your safety buffer is running low"
- **Weekly Summaries** - "This week: 3 payments executed, 1 delayed"

#### Channels:
- **In-app notifications** - Bell icon in frontend
- **Telegram messages** - Via the Telegram bot
- **Email** (optional) - For critical alerts
- **Push notifications** (future) - Mobile app notifications

---

### 5. **Database & Data Persistence** 💾
Store user data, intent configurations, and execution history.

#### Database Schema:

##### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE,
  telegram_id BIGINT UNIQUE,
  email VARCHAR(255),
  created_at TIMESTAMP,
  last_active TIMESTAMP
)
```

##### Intents Table
```sql
intents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  on_chain_id BIGINT,
  name VARCHAR(255),
  recipient VARCHAR(42),
  amount DECIMAL(20, 8),
  token VARCHAR(20),
  frequency VARCHAR(20),
  safety_buffer DECIMAL(20, 8),
  status VARCHAR(20),
  constraints JSONB,
  next_execution TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

##### Executions Table
```sql
executions (
  id UUID PRIMARY KEY,
  intent_id UUID REFERENCES intents(id),
  tx_hash VARCHAR(66),
  status VARCHAR(20),
  amount DECIMAL(20, 8),
  gas_used INTEGER,
  gas_price BIGINT,
  error_message TEXT,
  executed_at TIMESTAMP
)
```

##### Notifications Table
```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)
```

---

### 6. **Background Job Processor** ⏰
Handles scheduled tasks and async processing.

#### Jobs:
- **Intent Monitor** - Runs every minute to check intents
- **Gas Price Fetcher** - Updates gas prices every 30 seconds
- **Weekly Reports** - Generates and sends weekly summaries
- **Cleanup Jobs** - Archive old executions, prune notifications
- **Retry Handler** - Retries failed transactions

#### Technology:
- **BullMQ** (Redis-based queue) - For job scheduling
- **Cron jobs** - For periodic tasks
- **Worker processes** - Separate processes for heavy tasks

---

### 7. **Security & Authentication** 🔒
Protect user data and ensure authorized access.

#### Features:
- **Wallet-based auth** - Sign message to prove wallet ownership
- **JWT tokens** - Secure session management
- **API rate limiting** - Prevent abuse
- **CORS policies** - Restrict frontend origins
- **Encrypted storage** - Secure sensitive data
- **Audit logs** - Track all critical operations

#### Wallet Authentication Flow:
```
1. Frontend requests nonce from backend
2. User signs message with wallet: "Sign in to FlowPay - Nonce: abc123"
3. Backend verifies signature
4. Backend issues JWT token
5. Frontend includes token in all API requests
```

---

### 8. **Off-Ramping Integration** 💵
Enable users to convert crypto to fiat (already documented in CHIMONEY_IMPLEMENTATION.md).

#### Backend Role:
- **Chimoney API integration** - Process off-ramp requests
- **KYC verification** - Handle user verification flow
- **Transaction tracking** - Monitor off-ramp status
- **Webhook handling** - Receive Chimoney updates
- **Balance reconciliation** - Ensure accurate accounting

---

## Recommended Technology Stack

### Backend Framework
**Option 1: Node.js + TypeScript (Recommended)**
- **Framework**: NestJS (modular, scalable architecture)
- **Pros**: Same language as frontend, large ecosystem, great TypeScript support
- **Best for**: Rapid development, microservices architecture

**Option 2: Python**
- **Framework**: FastAPI (modern, async, auto-docs)
- **Pros**: Great for data processing, ML integrations, asyncio
- **Best for**: Complex automation logic, analytics

**Option 3: Go**
- **Framework**: Gin or Fiber
- **Pros**: High performance, excellent concurrency, small memory footprint
- **Best for**: High-throughput, low-latency requirements

### Database
**Primary: PostgreSQL**
- Relational data (users, intents, executions)
- JSONB support for flexible schemas
- Strong ACID guarantees

**Cache/Queue: Redis**
- Session storage
- Job queue (BullMQ)
- Rate limiting
- Real-time data

### Infrastructure
- **Hosting**: Railway, Render, Fly.io, or AWS
- **Monitoring**: Sentry (error tracking), Datadog (metrics)
- **Logging**: Winston (Node.js) or structured JSON logs
- **CI/CD**: GitHub Actions, Vercel (frontend), Railway (backend)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  (React + Vite + RainbowKit + TailwindCSS)                  │
│  Hosted on: Vercel                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTPS/WebSocket
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│  (Express/NestJS REST API + WebSocket)                      │
│  - Authentication (JWT)                                      │
│  - Rate Limiting                                             │
│  - Request Validation                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┬──────────────┬────────────┐
         ▼                   ▼              ▼            ▼
┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ┌────────────┐
│   Intent     │  │  Blockchain  │  │ Notification│  │ Telegram   │
│   Executor   │  │   Service    │  │   Service   │  │    Bot     │
│              │  │              │  │             │  │            │
│ - Monitor    │  │ - Read state │  │ - In-app    │  │ - Commands │
│ - Evaluate   │  │ - Execute TX │  │ - Telegram  │  │ - Webhooks │
│ - Execute    │  │ - Events     │  │ - Email     │  │ - Updates  │
└──────┬───────┘  └──────┬───────┘  └──────┬──────┘  └─────┬──────┘
       │                 │                 │                │
       └─────────────────┴─────────────────┴────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │        PostgreSQL             │
              │  - Users                      │
              │  - Intents                    │
              │  - Executions                 │
              │  - Notifications              │
              └───────────────┬───────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │          Redis                │
              │  - Job Queue (BullMQ)         │
              │  - Session Cache              │
              │  - Rate Limiting              │
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │    Cronos Blockchain          │
              │  - Intent Contract            │
              │  - Factory Contract           │
              │  - Escrow Contract            │
              └───────────────────────────────┘
```

---

## Development Phases

### Phase 1: Core Backend Setup (Week 1-2)
- [ ] Set up NestJS project with TypeScript
- [ ] Configure PostgreSQL database
- [ ] Set up Redis for caching
- [ ] Implement wallet authentication (sign-in with wallet)
- [ ] Create basic API endpoints (CRUD for intents)
- [ ] Set up environment configuration

### Phase 2: Blockchain Integration (Week 2-3)
- [ ] Integrate ethers.js/viem
- [ ] Connect to Cronos Testnet
- [ ] Implement contract interaction (read/write)
- [ ] Set up wallet for automated transactions
- [ ] Implement transaction monitoring
- [ ] Test on-chain intent creation

### Phase 3: Intent Execution Engine (Week 3-4)
- [ ] Build constraint evaluation logic
- [ ] Implement intent monitoring (cron job)
- [ ] Create transaction execution service
- [ ] Add retry mechanism for failed transactions
- [ ] Implement gas price tracking
- [ ] Test automated execution

### Phase 4: Notification System (Week 4)
- [ ] Build notification service
- [ ] Integrate with Telegram bot
- [ ] Implement in-app notifications (WebSocket)
- [ ] Create notification preferences
- [ ] Test notification delivery

### Phase 5: Telegram Bot Backend (Week 5)
- [ ] Set up webhook endpoint
- [ ] Implement bot commands backend logic
- [ ] Link Telegram accounts to wallets
- [ ] Create Telegram-specific API endpoints
- [ ] Test bot integration

### Phase 6: Analytics & Monitoring (Week 6)
- [ ] Build dashboard statistics API
- [ ] Implement execution history tracking
- [ ] Add performance monitoring (Sentry)
- [ ] Create admin panel for monitoring
- [ ] Set up logging and alerts

### Phase 7: Testing & Optimization (Week 7)
- [ ] Write unit tests (>80% coverage)
- [ ] Integration tests for critical flows
- [ ] Load testing for execution engine
- [ ] Security audit
- [ ] Performance optimization

### Phase 8: Production Deployment (Week 8)
- [ ] Deploy to Railway/Render
- [ ] Configure production database
- [ ] Set up monitoring and alerts
- [ ] Deploy to Cronos Mainnet
- [ ] Beta testing with real users

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/flowpay
REDIS_URL=redis://localhost:6379

# Blockchain
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
CRONOS_MAINNET_RPC=https://evm.cronos.org
PRIVATE_KEY=your_private_key_for_automated_execution
INTENT_CONTRACT_ADDRESS=0x...
FACTORY_CONTRACT_ADDRESS=0x...

# API
PORT=3000
JWT_SECRET=your_jwt_secret
API_RATE_LIMIT=100

# Telegram
TELEGRAM_BOT_TOKEN=8213507760:AAHgWNKq9qC23tSk_jJoAONH7EpeRZxS6GU
TELEGRAM_WEBHOOK_URL=https://api.flowpay.com/telegram/webhook

# Notifications
SENDGRID_API_KEY=your_sendgrid_key
NOTIFICATION_EMAIL=noreply@flowpay.com

# Monitoring
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_key

# Chimoney (Off-ramping)
CHIMONEY_API_KEY=your_chimoney_api_key
CHIMONEY_WEBHOOK_SECRET=your_webhook_secret
```

---

## API Documentation

Once backend is built, auto-generate API docs using:
- **Swagger/OpenAPI** - Interactive API documentation
- **Postman Collection** - Pre-configured API requests
- **GraphQL Playground** (if using GraphQL) - Interactive schema explorer

---

## Security Considerations

### Critical Security Measures:
1. **Private Key Management**
   - Store execution wallet key in secure vault (AWS Secrets Manager, HashiCorp Vault)
   - Never log or expose private keys
   - Use separate wallets for testnet/mainnet

2. **User Fund Safety**
   - Backend should NEVER hold user funds
   - All funds remain in user's wallet
   - Backend only executes with user's pre-approved intents

3. **Rate Limiting**
   - 100 requests/minute per IP
   - 1000 requests/hour per authenticated user
   - Prevent DDoS attacks

4. **Input Validation**
   - Validate all user inputs
   - Sanitize addresses (checksum validation)
   - Prevent SQL injection, XSS

5. **Audit Logging**
   - Log all intent executions
   - Track API access patterns
   - Monitor for suspicious activity

---

## Cost Estimates

### Infrastructure Costs (Monthly)
- **Railway/Render Basic**: $5-20
- **PostgreSQL (managed)**: $7-25
- **Redis (managed)**: $5-15
- **Monitoring (Sentry)**: Free - $26
- **Domain & SSL**: $12/year
- **Cronos Gas Fees**: Variable (user-paid or subsidized)

**Total: ~$25-100/month** for MVP

---

## Next Steps

1. **Review this document** - Ensure all requirements are covered
2. **Choose tech stack** - Node.js/NestJS recommended
3. **Set up repository** - Create `backend/` folder or separate repo
4. **Start Phase 1** - Core backend setup
5. **Deploy testnet version** - Test with real blockchain
6. **User testing** - Gather feedback
7. **Launch mainnet** - Production deployment

---

## Resources & Documentation

- [NestJS Documentation](https://docs.nestjs.com/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [BullMQ Queue System](https://docs.bullmq.io/)
- [Cronos Developer Docs](https://docs.cronos.org/)
- [Chimoney API Docs](https://chimoney.readme.io/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

---

**Last Updated:** January 19, 2026  
**Status:** Planning Phase  
**Next Milestone:** Backend MVP (8 weeks)
