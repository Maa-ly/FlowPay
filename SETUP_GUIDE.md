# 🚀 FlowPay Complete Setup Guide

## Issues Fixed ✅

1. ✅ Removed `@bullmq/nestjs` package (doesn't exist in npm)
2. ✅ Updated `.env.example` files with placeholders
3. ✅ Created `.env` files with actual values
4. ✅ Fixed package.json dependencies

---

## 📋 Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages including:

- NestJS framework
- Prisma ORM
- ethers.js (blockchain)
- Passport & JWT (authentication)
- Axios (HTTP requests)

### 2. Setup Database

**Option A: Local PostgreSQL (Recommended for Development)**

```bash
# Install PostgreSQL (if not installed)
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb flowpay

# Update .env DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/flowpay?schema=public"
```

**Option B: Cloud Database (Recommended for Production)**

Use one of these free/easy options:

- **Prisma Accelerate**: https://console.prisma.io (Connection pooling, never inactive)
- **Railway**: https://railway.app (Auto-provision database)
- **Neon**: https://neon.tech (Serverless PostgreSQL)

Get the connection URL and update in `.env`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### 3. Generate Prisma Client & Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view database
npx prisma studio
```

### 4. Configure Environment Variables

Edit `backend/.env`:

#### Required Variables:

**Database:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flowpay"
```

**JWT Secret** (generate a secure random string):

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```env
JWT_SECRET=your_generated_secret_here
```

**Execution Wallet** (create a new wallet for backend):

```env
EXECUTION_WALLET_PRIVATE_KEY=0xYourPrivateKeyHere
```

⚠️ This wallet needs ~10-20 CRO for gas fees

**Smart Contracts** (already configured):

```env
INTENT_CONTRACT_ADDRESS=0xa08ddc973F7EdD3c7609AB89CDCB8634D462D904
FACTORY_CONTRACT_ADDRESS=0xc0f194c7332fed0edB39550A66946d09c245B842
```

**Telegram Bot** (already configured):

```env
TELEGRAM_BOT_TOKEN=8213507760:AAHgWNKq9qC23tSk_jJoAONH7EpeRZxS6GU
TELEGRAM_BOT_USERNAME=flowpayment_bot
```

**Frontend CORS:**

```env
FRONTEND_URL=https://flowpayment.vercel.app
FRONTEND_DEV_URL=http://localhost:5173
```

#### Optional Variables (for later):

**Chimoney** (only if using off-ramp):

```env
CHIMONEY_API_KEY=your_chimoney_api_key
```

Get from: https://chimoney.io/developers

**Polygon Treasury** (only for off-ramp):

```env
POLYGON_TREASURY_WALLET=0xYourPolygonWallet
POLYGON_TREASURY_PRIVATE_KEY=0xYourPolygonPrivateKey
```

### 5. Start Backend Server

```bash
npm run start:dev
```

You should see:

```
🚀 FlowPay Backend running on: http://localhost:3000/api
✅ Database connected
```

### 6. Test Backend API

```bash
# Test health check
curl http://localhost:3000/api

# Test wallet authentication
curl "http://localhost:3000/api/auth/nonce?walletAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

Expected response:

```json
{
  "nonce": "123456",
  "message": "Sign this message to authenticate with FlowPay:\n\nNonce: 123456"
}
```

---

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 2. Configure Environment

The `.env` file is already created with actual values. Just verify:

```env
VITE_WALLETCONNECT_PROJECT_ID=6e8ca32076c7e666f62b8315aef4dffe
VITE_INTENT_CONTRACT_ADDRESS_TESTNET=0xa08ddc973F7EdD3c7609AB89CDCB8634D462D904
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## 🔑 Required API Keys & Accounts

### ✅ Already Configured:

1. **WalletConnect Project ID** ✅
   - Already set: `6e8ca32076c7e666f62b8315aef4dffe`

2. **Smart Contracts** ✅
   - Intent: `0xa08ddc973F7EdD3c7609AB89CDCB8634D462D904`
   - Factory: `0xc0f194c7332fed0edB39550A66946d09c245B842`

3. **Telegram Bot** ✅
   - Token: `8213507760:AAHgWNKq9qC23tSk_jJoAONH7EpeRZxS6GU`
   - Username: `@flowpayment_bot`

### ⚠️ Need to Create/Configure:

#### 1. **Backend Execution Wallet** (REQUIRED)

**Purpose:** Wallet that backend uses to execute intents and pay gas fees

**Steps:**

```bash
# Option 1: Create new wallet with ethers
node -e "const ethers = require('ethers'); const w = ethers.Wallet.createRandom(); console.log('Address:', w.address, '\nPrivate Key:', w.privateKey)"

# Option 2: Export from MetaMask
# - Create new account in MetaMask
# - Go to Account Details → Export Private Key
```

**Fund the wallet:**

- Go to Cronos Testnet Faucet: https://cronos.org/faucet
- Request testnet CRO (~10-20 CRO needed)
- Add private key to `.env`:

```env
EXECUTION_WALLET_PRIVATE_KEY=0xYourPrivateKeyHere
```

#### 2. **Database** (REQUIRED)

**Option A: Local PostgreSQL**

```bash
# Already explained above
createdb flowpay
```

**Option B: Prisma Accelerate (Recommended, Never Inactive)**

1. Go to https://console.prisma.io
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Update `.env`:

```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

#### 3. **JWT Secret** (REQUIRED)

Generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:

```env
JWT_SECRET=your_generated_secret_here
```

#### 4. **Chimoney API Key** (OPTIONAL - Only for Off-Ramp)

**Only needed if you want to test fiat off-ramp functionality**

**Steps:**

1. Go to https://chimoney.io
2. Sign up for developer account
3. Go to Dashboard → API Keys
4. Copy sandbox API key
5. Add to `.env`:

```env
CHIMONEY_API_KEY=your_chimoney_api_key
```

**Note:** Without this, on-chain payments will still work!

---

## 🧪 Testing the System

### 1. Test Backend

```bash
# Terminal 1: Start backend
cd backend
npm run start:dev

# Terminal 2: Test API
curl http://localhost:3000/api/auth/nonce?walletAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 2. Test Frontend

```bash
# Terminal 3: Start frontend
cd frontend
npm run dev
```

Open http://localhost:5173 in browser:

1. Click "Connect Wallet"
2. Connect MetaMask (Cronos Testnet)
3. Should see dashboard

### 3. Test Full Flow

1. **Create Intent:**
   - Go to "Create Intent" page
   - Fill in recipient, amount, frequency
   - Set safety buffer
   - Submit

2. **Monitor Execution:**
   - Backend cron job runs every minute
   - Check logs for "🔍 Checking for intents..."
   - Intent will execute when conditions are met

3. **Check Notifications:**
   - Should see in-app notification
   - If Telegram linked, bot sends message

---

## 🚀 Deployment (Optional - for Production)

### Backend Deployment (Railway)

1. Go to https://railway.app
2. Connect GitHub repository
3. Select `backend` folder
4. Add PostgreSQL database
5. Set environment variables
6. Deploy!

### Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Import GitHub repository
3. Framework: Vite
4. Root Directory: `frontend`
5. Add environment variables
6. Deploy!

### Set Telegram Webhook (After Backend Deployment)

```bash
curl -X POST "https://api.telegram.org/bot8213507760:AAHgWNKq9qC23tSk_jJoAONH7EpeRZxS6GU/setWebhook" \
  -d "url=https://your-backend-url.com/api/telegram/webhook"
```

---

## 📊 Summary of What You Need

### Minimum to Run Locally:

1. ✅ PostgreSQL database
2. ✅ Execution wallet with testnet CRO
3. ✅ JWT secret
4. ✅ All other values already configured

### Optional for Full Features:

1. ❌ Chimoney API key (only for off-ramp)
2. ❌ Polygon wallet (only for off-ramp)
3. ❌ Production hosting (Railway/Vercel)

---

## 🐛 Troubleshooting

### Error: "command not found: nest"

**Solution:** Dependencies not installed

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Cannot connect to database"

**Solution:** PostgreSQL not running or wrong connection URL

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -d flowpay

# Update DATABASE_URL in .env
```

### Error: "sh: prisma: command not found"

**Solution:** Use npx

```bash
npx prisma generate
npx prisma migrate dev
```

### Error: "Insufficient funds for gas"

**Solution:** Fund execution wallet

```bash
# Go to faucet
open https://cronos.org/faucet

# Request testnet CRO for your execution wallet address
```

---

## 🎯 Next Steps

1. **Install dependencies**: `npm install` in backend and frontend
2. **Setup database**: PostgreSQL with Prisma Accelerate
3. **Create execution wallet**: Fund with testnet CRO
4. **Generate JWT secret**: Use crypto.randomBytes
5. **Run migrations**: `npx prisma migrate dev`
6. **Start servers**: Backend (port 3000) and Frontend (port 5173)
7. **Test**: Connect wallet and create an intent
8. **Deploy**: Railway (backend) + Vercel (frontend)

---

## 📞 Support

- **Backend not starting?** Check all required env vars are set
- **Frontend not connecting?** Check VITE_API_BASE_URL
- **Intents not executing?** Check execution wallet has CRO
- **Telegram bot silent?** Set webhook after deployment

---

**🎉 You're ready to run FlowPay!**

Built with ❤️ for Cronos Hackathon 2026
