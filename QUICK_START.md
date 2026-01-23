# ✅ FlowPay Setup - COMPLETE!

## What Was Fixed

1. ✅ **Removed invalid package** - `@bullmq/nestjs` doesn't exist in npm
2. ✅ **Updated .env.example** - Now has proper placeholders
3. ✅ **Created .env files** - Both frontend and backend configured
4. ✅ **Fixed dependencies** - All packages now install correctly
5. ✅ **Prisma client generated** - Database ORM ready

---

## ⚡ Quick Start (3 Steps)

### Step 1: Setup Database

You need PostgreSQL. Choose one option:

**Option A: Local PostgreSQL (5 minutes)**

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
createdb flowpay

# Ubuntu/Linux
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb flowpay
```

**Option B: Cloud Database (2 minutes - EASIEST)**

1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Copy connection string from Settings → Database
5. Update in `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
```

### Step 2: Create Execution Wallet & Generate JWT Secret

```bash
# Generate JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Create wallet
node -e "const ethers = require('ethers'); const w = ethers.Wallet.createRandom(); console.log('Address:', w.address, '\nPrivate Key:', w.privateKey)"
```

Copy the outputs and add to `backend/.env`:

```env
JWT_SECRET=<generated_secret>
EXECUTION_WALLET_PRIVATE_KEY=<wallet_private_key>
```

**Fund the wallet with testnet CRO:**

- Go to: https://cronos.org/faucet
- Paste wallet address
- Request testnet CRO

### Step 3: Run Migrations & Start

```bash
# Run database migrations
cd backend
npx prisma migrate dev --name init

# Start backend
npm run start:dev
```

In another terminal:

```bash
# Start frontend
cd frontend
npm install
npm run dev
```

**Done! 🎉**

- Backend: http://localhost:3000/api
- Frontend: http://localhost:5173

---

## 🔑 What You Need (Summary)

### ✅ Already Configured:

- WalletConnect Project ID
- Smart Contract Addresses
- Telegram Bot Token
- All RPC endpoints

### ⚠️ You Must Provide:

1. **Database** - PostgreSQL with Prisma Accelerate
2. **JWT Secret** - Generate with crypto.randomBytes
3. **Execution Wallet** - Create new wallet + fund with testnet CRO

### ❌ Optional (Not Needed Now):

- Chimoney API Key (only for off-ramp feature)
- Polygon Wallet (only for off-ramp feature)

---

## 📝 Your Current .env Files

### Backend `.env` - Already Created ✅

Located at: `backend/.env`

**What you need to update:**

```env
# 1. Database (choose local or cloud)
DATABASE_URL="postgresql://user:password@localhost:5432/flowpay"

# 2. Generate this
JWT_SECRET=generate_with_crypto_randomBytes

# 3. Create new wallet and fund with CRO
EXECUTION_WALLET_PRIVATE_KEY=your_private_key_here
```

**Already configured (don't change):**

```env
INTENT_CONTRACT_ADDRESS=0xa08ddc973F7EdD3c7609AB89CDCB8634D462D904
FACTORY_CONTRACT_ADDRESS=0xc0f194c7332fed0edB39550A66946d09c245B842
TELEGRAM_BOT_TOKEN=8213507760:AAHgWNKq9qC23tSk_jJoAONH7EpeRZxS6GU
```

### Frontend `.env` - Already Created ✅

Located at: `frontend/.env`

**Everything is already configured! No changes needed.**

```env
VITE_WALLETCONNECT_PROJECT_ID=6e8ca32076c7e666f62b8315aef4dffe
VITE_INTENT_CONTRACT_ADDRESS_TESTNET=0xa08ddc973F7EdD3c7609AB89CDCB8634D462D904
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🧪 Test Everything Works

### 1. Test Backend

```bash
# Should return nonce
curl "http://localhost:3000/api/auth/nonce?walletAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

Expected response:

```json
{
  "nonce": "123456",
  "message": "Sign this message to authenticate with FlowPay:\n\nNonce: 123456"
}
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Click "Connect Wallet"
3. Connect MetaMask (switch to Cronos Testnet)
4. Should see dashboard

### 3. Test Full Flow

1. Create an intent in the UI
2. Check backend logs - should see "🔍 Checking for intents..."
3. Wait for execution time
4. Intent executes automatically
5. Notification appears

---

## 🚀 Commands Cheat Sheet

### Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev

# View database (optional)
npx prisma studio
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📊 Project Status

### ✅ Completed:

- [x] Backend structure created
- [x] Database schema designed
- [x] All services implemented (Auth, Intents, Blockchain, x402, Chimoney, etc.)
- [x] Intent execution engine with cron job
- [x] Telegram bot integration
- [x] API endpoints
- [x] Dependencies fixed
- [x] .env files configured

### ⏳ You Need To Do:

- [ ] Setup PostgreSQL database
- [ ] Generate JWT secret
- [ ] Create & fund execution wallet
- [ ] Run database migrations
- [ ] Start backend & frontend servers
- [ ] Test with MetaMask

---

## 🎯 Next Actions (In Order)

1. **Setup Database** (5 minutes)
   - Use Prisma Accelerate (recommended) or local PostgreSQL
   - Update `DATABASE_URL` in `backend/.env`

2. **Generate Secrets** (1 minute)

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   - Update `JWT_SECRET` in `backend/.env`

3. **Create Wallet** (2 minutes)

   ```bash
   node -e "const ethers = require('ethers'); const w = ethers.Wallet.createRandom(); console.log('Address:', w.address, '\nPrivate Key:', w.privateKey)"
   ```

   - Fund wallet at https://cronos.org/faucet
   - Update `EXECUTION_WALLET_PRIVATE_KEY` in `backend/.env`

4. **Run Migrations** (30 seconds)

   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

5. **Start Everything** (1 minute)

   ```bash
   # Terminal 1
   cd backend && npm run start:dev

   # Terminal 2
   cd frontend && npm run dev
   ```

6. **Test** (2 minutes)
   - Open http://localhost:5173
   - Connect wallet
   - Create test intent
   - Check logs for execution

---

## 🆘 Troubleshooting

### "command not found: nest"

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### "Cannot connect to database"

Check PostgreSQL is running:

```bash
pg_isready  # or check Prisma Console dashboard
```

### "Insufficient funds for gas"

Fund your execution wallet:

- Go to https://cronos.org/faucet
- Request CRO for your wallet address

### Frontend can't connect to backend

Make sure:

1. Backend is running on port 3000
2. `VITE_API_BASE_URL=http://localhost:3000/api` in frontend/.env

---

## 📚 Documentation

All documentation is in these files:

- `SETUP_GUIDE.md` - Detailed setup instructions
- `backend/README.md` - Backend API documentation
- `backend/IMPLEMENTATION_GUIDE.md` - Technical implementation details
- `backend/DEPLOYMENT_CHECKLIST.md` - Production deployment guide

---

## 🎉 Ready to Build!

Your FlowPay project is now fully configured and ready to run!

**What you built:**

- ✅ Complete NestJS backend with intent execution engine
- ✅ x402 agentic payments integration
- ✅ Chimoney off-ramp support
- ✅ Telegram bot
- ✅ Wallet authentication
- ✅ Real-time notifications

**What's left:**

- Setup database (5 min)
- Generate secrets (1 min)
- Create wallet (2 min)
- Start servers (1 min)

**Total time to launch:** ~10 minutes 🚀

---

Built with ❤️ for Cronos Hackathon 2026
