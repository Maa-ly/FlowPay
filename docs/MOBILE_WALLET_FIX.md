# 🚨 Mobile Wallet Connection Fix Required

## The Issue

You're seeing `ERR_UNKNOWN_URL_SCHEME` on Telegram mobile when connecting wallets because:
1. **Missing WalletConnect Project ID** - Required for mobile deep linking
2. **Universal Links not configured** - Telegram needs proper URL handling

---

## ✅ IMMEDIATE FIX (5 Minutes)

### Step 1: Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Click "Create New Project"
3. **Project Name:** FlowPay
4. **Homepage URL:** https://flowpayment.vercel.app
5. Copy your **Project ID** (looks like: `a1b2c3d4e5f6g7h8...`)

### Step 2: Add to Environment Variables

**Local Development:**
```bash
cd frontend
```

Edit `/frontend/.env`:
```env
VITE_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here
```

**Production (Vercel):**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add new variable:
   - **Key:** `VITE_WALLETCONNECT_PROJECT_ID`
   - **Value:** (paste your project ID)
   - **Environments:** Production, Preview, Development
3. Redeploy

### Step 3: Restart Development Server

```bash
npm run dev
```

---

## 🔧 Code Fix Already Applied

I've updated `wagmi.ts` with proper mobile support:
- ✅ WalletConnect metadata
- ✅ Mobile linking configuration
- ✅ Telegram Web App compatibility

---

## 🧪 Test the Fix

### On Mobile (Telegram):

1. Open @flowpayment_bot
2. Tap "🚀 Open FlowPay App"
3. Click "Connect Wallet"
4. Select wallet (MetaMask, Trust, etc.)
5. Should open wallet app correctly ✅

### Expected Behavior:
- ✅ Wallet app opens
- ✅ Connection request appears
- ✅ You can approve/reject
- ✅ Returns to FlowPay in Telegram

---

## 🐛 If Still Getting Error

### Error: `ERR_UNKNOWN_URL_SCHEME`

**Causes:**
1. WalletConnect Project ID still missing
2. Wrong URL scheme in wallet app
3. Wallet app not installed

**Fixes:**
1. Verify `.env` has correct Project ID
2. Make sure wallet app is installed on phone
3. Try different wallet (MetaMask, Trust Wallet, etc.)

### Error: Connection times out

**Cause:** Telegram blocking deep links

**Fix:** Enable universal links in Vercel:
1. Add `vercel.json` to frontend:

```json
{
  "rewrites": [
    { "source": "/.well-known/apple-app-site-association", "destination": "/apple-app-site-association" }
  ]
}
```

2. Create `/frontend/public/apple-app-site-association` (no extension):

```json
{
  "applinks": {
    "apps": [],
    "details": []
  }
}
```

---

## 📱 Supported Wallets on Mobile

After fix, these wallets work in Telegram:
- ✅ MetaMask Mobile
- ✅ Trust Wallet
- ✅ Rainbow Wallet
- ✅ Coinbase Wallet
- ✅ Any WalletConnect v2 wallet

---

## 🎯 Quick Summary

**Problem:** `ERR_UNKNOWN_URL_SCHEME` on mobile
**Root Cause:** Missing WalletConnect Project ID
**Solution:** 
1. Get Project ID from https://cloud.walletconnect.com
2. Add to `.env` and Vercel environment variables
3. Restart/redeploy

**Time to fix:** 5 minutes
**Already coded:** ✅ All configuration done, just needs Project ID

---

## 📞 Need More Help?

See full guide: [docs/WALLETCONNECT_FAQ.md](WALLETCONNECT_FAQ.md)

**Common Questions:**
- How to test locally? → Run `npm run dev`, open in Telegram
- How to deploy? → `vercel --prod` (auto-deploys on git push)
- Which wallets work? → All WalletConnect v2 compatible wallets

---

**GET YOUR PROJECT ID NOW:** https://cloud.walletconnect.com

Then test on mobile Telegram! 🚀
