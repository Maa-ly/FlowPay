# 📸 Bot Profile Image & Deployment Guide

## 🖼️ How to Upload Bot Profile Image

### Method 1: Using @BotFather (Recommended)

1. **Open Telegram** and search for `@BotFather`
2. **Send:** `/mybots`
3. **Select:** `@flowpayment_bot`
4. **Tap:** "Edit Bot" → "Edit Botpic"
5. **Upload your image:**
   - Format: JPG or PNG
   - Recommended size: 512x512 pixels
   - Max file size: 5MB
   - Square image works best

6. **Done!** Your bot will have the new profile picture

### Image Requirements

- ✅ **Size:** 512x512px (recommended)
- ✅ **Format:** JPG, PNG, or GIF
- ✅ **Aspect Ratio:** 1:1 (square)
- ✅ **Max Size:** 5MB
- ✅ **Quality:** High resolution, clear icon/logo

### Design Tips

- Use your FlowPay logo
- Keep it simple and recognizable
- Use brand colors (green for FlowPay)
- Ensure it looks good at small sizes
- Test in both light and dark themes

---

## 🚀 Deployment Strategy

### Current Setup

You have **3 separate deployments**:

```
1. Frontend (Mini App)    ✅ DEPLOYED
   └─ https://flowpayment.vercel.app

2. Telegram Bot Backend   ⏳ OPTIONAL (can deploy later)
   └─ To be deployed to Vercel

3. Main Backend API       🔜 FUTURE (for smart contracts, DB, Chimoney)
   └─ Will be deployed separately
```

---

## 🤔 Do You Need to Deploy Telegram Bot Backend?

### Short Answer: **NOT YET** ✅

You can continue development with:

- ✅ **Bot running locally** (long polling - what you're using now)
- ✅ **Frontend deployed** (https://flowpayment.vercel.app)
- ✅ **Users can access the Mini App** from the deployed URL

### When to Deploy Bot Backend?

Deploy the Telegram bot backend when:

1. **You want 24/7 bot availability** (not dependent on your computer being on)
2. **You're ready for production** (after testing everything locally)
3. **You need webhooks** (slightly faster than long polling)
4. **You want to scale** (handle more users)

---

## 📊 Deployment Modes Comparison

### Mode 1: Current Setup (Development) ✅

```
┌─────────────────────────────────────────────┐
│ Your Computer                               │
│  ├─ Bot Backend (localhost:3000)            │
│  │   └─ Long Polling (checks Telegram)      │
│  └─ Development only                        │
└─────────────────────────────────────────────┘
           │
           ▼
    [Telegram Servers]
           │
           ▼
┌─────────────────────────────────────────────┐
│ Vercel (Deployed)                           │
│  └─ Frontend (flowpayment.vercel.app)       │
└─────────────────────────────────────────────┘
```

**Pros:**

- ✅ Easy to develop and test
- ✅ See logs in real-time
- ✅ Quick iteration
- ✅ No deployment costs

**Cons:**

- ❌ Bot only works when your computer is on
- ❌ Can't handle many users
- ❌ Slightly slower (long polling)

---

### Mode 2: Full Production (Future) 🚀

```
┌─────────────────────────────────────────────┐
│ Vercel - Bot Backend                        │
│  └─ Webhooks (Telegram pushes updates)      │
└─────────────────────────────────────────────┘
           ▲
           │
    [Telegram Servers]
           │
           ▼
┌─────────────────────────────────────────────┐
│ Vercel - Frontend                           │
│  └─ flowpayment.vercel.app                  │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│ Main Backend API (Future)                   │
│  ├─ Smart Contract Interaction              │
│  ├─ Database (PostgreSQL/Prisma Accelerate) │
│  ├─ Chimoney Integration                    │
│  └─ Business Logic                          │
└─────────────────────────────────────────────┘
```

**Pros:**

- ✅ 24/7 availability
- ✅ Scales automatically
- ✅ Faster (webhooks)
- ✅ Professional setup

**Cons:**

- ❌ Requires deployment setup
- ❌ Slightly more complex debugging

---

## 🎯 Recommended Approach

### Phase 1: Now (Development) ✅

**What you have:**

- ✅ Frontend deployed: https://flowpayment.vercel.app
- ✅ Bot backend running locally (what you're doing now)
- ✅ Can test everything

**What to do:**

1. Keep bot running locally: `npm run dev`
2. Test with real Telegram users
3. Iterate on features
4. Fix bugs

### Phase 2: Later (When Ready for Production)

**Deploy bot backend when:**

- ✅ All features tested locally
- ✅ No major bugs
- ✅ Ready for real users
- ✅ Want 24/7 availability

**Steps:**

1. Deploy bot to Vercel
2. Set webhook URL
3. Update environment variables
4. Test production mode

### Phase 3: Future (Complete Backend)

**Deploy main backend when:**

- ✅ Smart contracts deployed
- ✅ Database schema ready
- ✅ Chimoney integration complete
- ✅ Need persistent data storage

---

## 🛠️ How to Deploy Bot Backend (When Ready)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy Bot

```bash
cd telegram-bot
vercel --prod
```

You'll get a URL like: `https://flowpay-bot.vercel.app`

### Step 3: Set Environment Variables in Vercel

In Vercel dashboard, add:

```env
BOT_TOKEN=your_bot_token_here
BOT_USERNAME=your_bot_username_here
ADMIN_USER_ID=your_admin_user_id_here
MINI_APP_URL=https://flowpayment.vercel.app
WEBHOOK_URL=https://flowpay-bot.vercel.app/webhook
NODE_ENV=production
PORT=3000
```

### Step 4: Set Webhook

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://flowpay-bot.vercel.app/webhook"
```

**Response should be:**

```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

### Step 5: Update Local .env for Development

```env
NODE_ENV=development  # Keep this for local development
MINI_APP_URL=http://localhost:8080  # For local testing
```

---

## 🎨 Configure Mini App in @BotFather

### Set Menu Button (Mini App Launcher)

1. Open `@BotFather`
2. Send: `/mybots`
3. Select: `@flowpayment_bot`
4. Tap: "Bot Settings" → "Menu Button"
5. Choose: "Edit Menu Button URL"
6. Send: `https://flowpayment.vercel.app`
7. Send: "Open FlowPay" (button text)

Now users will see "Open FlowPay" button in chat!

### Optional: Create Dedicated Mini App

1. Send to @BotFather: `/newapp`
2. Select: `@flowpayment_bot`
3. **Title:** FlowPay
4. **Description:** Automate payments on Cronos blockchain
5. **Photo:** Upload 640x360 screenshot
6. **GIF:** (Optional) Upload demo GIF
7. **URL:** `https://flowpayment.vercel.app`

Then set as main app:

- `/mybots` → Select bot → Bot Settings → Mini App → Set Main Mini App

---

## 🧪 Testing Deployment

### Test Deployed Frontend

1. Open Telegram
2. Search: `@flowpayment_bot`
3. Send: `/start`
4. Click: "Open FlowPay App" button
5. Verify: App loads from https://flowpayment.vercel.app
6. Check: Telegram user data is detected
7. Test: All features work

### Verify Mini App Integration

In the Mini App (browser DevTools):

```javascript
console.log(window.Telegram?.WebApp?.initDataUnsafe?.user);
// Should show your Telegram user data
```

---

## 📱 Architecture Overview

### Current (Development):

```
User → Telegram → Bot (Your PC) → Commands/Keyboards
                         ↓
                  Opens Mini App
                         ↓
                Vercel Frontend (https://flowpayment.vercel.app)
```

### Future (Full Production):

```
User → Telegram → Bot (Vercel) → Commands/Keyboards
                         ↓
                  Opens Mini App
                         ↓
                Vercel Frontend
                         ↓
                    Backend API
                    ├─ Smart Contracts (Cronos)
                    ├─ Database (Prisma Accelerate)
                    └─ Chimoney API
```

---

## ✅ Current Status

**What's Working:**

- ✅ Frontend deployed and accessible
- ✅ Bot running locally
- ✅ Mini App integration configured
- ✅ Commands working
- ✅ Inline keyboards functional

**What's Next:**

1. Upload bot profile image (see above)
2. Test all features thoroughly
3. Continue backend development
4. Deploy bot when ready for 24/7 operation

---

## 🚨 Important Notes

### For Local Development:

- Keep `NODE_ENV=development` in `.env`
- Use `http://localhost:8080` for MINI_APP_URL when testing locally
- Switch to `https://flowpayment.vercel.app` when testing with real users

### For Production:

- Bot backend deployment is **optional** for now
- You can develop everything locally
- Deploy when you need 24/7 availability
- Main backend API will be separate deployment

---

## 📞 Quick Reference

| Item                      | Value                          |
| ------------------------- | ------------------------------ |
| **Bot Username**          | @flowpayment_bot               |
| **Bot Link**              | https://t.me/flowpayment_bot   |
| **Frontend (Deployed)**   | https://flowpayment.vercel.app |
| **Bot Backend (Local)**   | http://localhost:3000          |
| **Bot Backend (Future)**  | Will deploy to Vercel          |
| **Main Backend (Future)** | Separate deployment            |

---

## 🎉 Summary

**You DON'T need to deploy the bot backend yet!**

Continue developing with:

1. ✅ Bot running locally (`npm run dev`)
2. ✅ Frontend on Vercel (https://flowpayment.vercel.app)
3. ✅ Test everything
4. ✅ Build features

Deploy bot backend later when:

- You're ready for production
- You want 24/7 availability
- You've tested everything locally

**For now, focus on building features and testing!** 🚀
