# 📱 FlowPay User Guide

## Welcome to FlowPay! 🌊

FlowPay is an AI-powered payment automation platform built on Cronos blockchain. Send crypto on schedule, automate recurring payments, and manage your transactions seamlessly through Telegram.

---

## 🚀 Getting Started

### 1. Start the Bot

1. Open Telegram
2. Search for `@flowpayment_bot`
3. Send `/start` to begin

You'll see a welcome message with the main menu.

### 2. Open the Web App

There are **3 ways** to access FlowPay:

#### Method 1: Menu Button (Recommended)
- Tap the **☰ menu button** next to the message input
- Select "Open FlowPay"
- The app opens inside Telegram!

#### Method 2: Inline Button
- After sending `/start`, tap "🚀 Open FlowPay App"
- Full interface loads instantly

#### Method 3: Direct Link
- Visit: https://flowpayment.vercel.app
- Works in any browser

---

## 💳 Creating Payment Intents

### What is a Payment Intent?

A payment intent is a **scheduled or conditional payment** that executes automatically based on your rules.

### Quick Creation (Bot)

1. Send `/create` in the bot
2. Choose payment type:
   - 💸 **Quick Payment** - Send now
   - 🔄 **Recurring** - Weekly/monthly subscriptions
   - ⏰ **Scheduled** - Future one-time payment
   - 🤖 **AI Conditions** - Smart triggers

3. Follow the prompts

### Advanced Creation (Web App)

1. Tap "🚀 Open FlowPay App"
2. Click "Create Intent"
3. Fill in details:
   - **Recipient Address** (Cronos wallet)
   - **Amount** (in CRO)
   - **Schedule** (once, daily, weekly, monthly)
   - **Conditions** (optional AI rules)
   - **Token** (CRO, USDC, etc.)

4. Confirm transaction
5. Sign with your wallet

---

## 📊 Managing Intents

### View Your Dashboard

**Option 1: Bot**
- Send `/dashboard`
- See overview of active intents

**Option 2: Web App**
- Open FlowPay App
- Click "Dashboard"
- Full details with charts

### Intent Actions

Each intent can be:
- ✅ **Activated** - Starts execution
- ⏸️ **Paused** - Temporarily stops
- ✏️ **Edited** - Modify details
- 🗑️ **Deleted** - Permanently removed

### Intent Status

- 🟢 **Active** - Running normally
- 🟡 **Pending** - Waiting for conditions
- 🔴 **Paused** - User stopped
- ⚫ **Completed** - Finished (one-time payments)
- ❌ **Failed** - Error occurred

---

## 🤖 AI-Powered Conditions

### What are AI Conditions?

FlowPay uses AI to execute payments based on smart triggers:

#### Example Use Cases:

**1. Weather-Based Payments**
```
"Pay $20 to my friend if it rains tomorrow"
```

**2. Price Triggers**
```
"Send 100 CRO when CRO price reaches $0.10"
```

**3. Event-Based**
```
"Pay monthly rent on the 1st of every month"
```

**4. Time + Condition**
```
"Send payment on Friday if Bitcoin is above $50k"
```

### How to Set AI Conditions

1. Choose "🤖 AI Conditions" when creating intent
2. Describe your condition in plain English
3. AI validates and confirms
4. Payment executes when condition is met

---

## 💰 Supported Tokens

FlowPay supports all Cronos tokens:

- **CRO** - Native Cronos token
- **USDC** - USD Coin
- **USDT** - Tether
- **ETH** - Wrapped Ethereum
- **Any ERC-20 token** on Cronos

### Adding Custom Tokens

1. Open Web App → Create Intent
2. Click "Add Token"
3. Enter contract address
4. Token appears in dropdown

---

## 📈 Transaction History

### View History

**In Bot:**
- Send `/dashboard`
- Tap "📜 History"
- See last 5 transactions

**In Web App:**
- Dashboard → Transaction History
- Full searchable list
- Filter by status/date

### Transaction Details

Each transaction shows:
- ✅ **Status** (Success/Failed/Pending)
- 💵 **Amount** (with token symbol)
- 📅 **Date** (timestamp)
- 🔗 **Transaction Hash** (clickable)
- 👤 **Recipient** (wallet address)

### Export History

1. Open Web App → Dashboard
2. Click "Export"
3. Download CSV file

---

## 🔔 Notifications

### Telegram Notifications

You'll receive alerts for:
- ✅ Payment executed successfully
- ❌ Payment failed
- ⏰ Upcoming scheduled payment
- 🔄 Recurring payment processed
- ⚠️ Low balance warning

### Customize Notifications

1. Bot → `/help`
2. Tap "⚙️ Settings"
3. Choose notification preferences:
   - All payments
   - Failures only
   - Daily summary
   - Disable

---

## 🔐 Security & Privacy

### How FlowPay Protects You

✅ **Non-Custodial** - You control your funds
✅ **Smart Contracts** - Audited on Cronos
✅ **Telegram Encryption** - End-to-end security
✅ **No Private Keys** - We never access your wallet
✅ **Open Source** - Code is public

### Best Practices

1. **Never share your wallet seed phrase**
2. **Double-check recipient addresses**
3. **Start with small test payments**
4. **Review AI conditions carefully**
5. **Enable 2FA on Telegram**

### What Data We Store

- ✅ Telegram User ID (for authentication)
- ✅ Payment intents (on blockchain)
- ✅ Transaction history (public blockchain)
- ❌ Private keys (NEVER)
- ❌ Personal information

---

## 💸 Payment Flows

### Flow 1: Quick Send (Instant)

```
User → Bot → "Quick Send"
     → Enter amount
     → Enter address
     → Confirm
     → Sign with wallet
     → Payment sent ✅
```

### Flow 2: Recurring Payment (Subscription)

```
User → Web App → "Create Intent"
     → Set recipient
     → Choose "Recurring"
     → Set frequency (weekly/monthly)
     → Set amount
     → Approve contract
     → Auto-executes on schedule 🔄
```

### Flow 3: AI Condition

```
User → Bot → "AI Conditions"
     → Describe condition
     → AI validates
     → Set amount & recipient
     → Payment waits for trigger
     → Executes when condition met 🤖
```

---

## 🌉 Off-Ramping (Cash Out)

### Send to Bank Account

FlowPay integrates with **Chimoney** to send crypto to:
- 🏦 Bank accounts (150+ countries)
- 📱 Mobile money (M-Pesa, Airtel, etc.)
- 💳 Gift cards
- 📧 Email payouts

### How to Off-Ramp

1. Create intent as usual
2. Instead of wallet address, enter:
   - Bank account number
   - Mobile money number
   - Email address

3. FlowPay automatically:
   - Converts CRO → USDC
   - Bridges Cronos → Polygon
   - Sends via Chimoney
   - Delivers to recipient

### Supported Countries

See full list: [Chimoney Coverage](https://chimoney.readme.io/reference/coverage)

Popular regions:
- 🌍 Africa (Nigeria, Kenya, Ghana, South Africa)
- 🌎 Americas (USA, Brazil, Mexico)
- 🌏 Asia (India, Philippines, Bangladesh)
- 🌍 Europe (UK, France, Germany)

---

## ⚙️ Settings & Preferences

### Access Settings

**In Bot:**
- Send `/help`
- Tap "⚙️ Settings"

**In Web App:**
- Click profile icon → Settings

### Available Settings

#### Notifications
- Enable/disable alerts
- Choose notification types
- Set quiet hours

#### Default Token
- Set preferred token for payments
- Auto-fill in forms

#### Language
- English (default)
- More languages coming soon

#### Display
- Light/Dark theme (syncs with Telegram)
- Currency display (USD, EUR, etc.)

---

## 🆘 Help & Support

### Get Help

**Option 1: In-Bot Help**
- Send `/help`
- Browse FAQ
- Contact support

**Option 2: Community**
- Join our Telegram group
- Ask questions
- Share feedback

**Option 3: Documentation**
- Full docs: [GitHub Docs](https://github.com/your-repo/docs)
- API reference
- Video tutorials

### Common Issues

#### "Transaction Failed"
**Cause:** Insufficient balance or gas
**Solution:** Check wallet balance, add CRO for gas

#### "Intent Not Executing"
**Cause:** Paused or condition not met
**Solution:** Check intent status in dashboard

#### "Can't Connect Wallet"
**Cause:** Network issue or wrong network
**Solution:** Switch to Cronos network in wallet

#### "Web App Not Loading"
**Cause:** Telegram client outdated
**Solution:** Update Telegram app

---

## 💡 Tips & Tricks

### 1. Use Quick Actions
Access frequent tasks faster:
- `/start` → Tap button
- Bookmark Web App

### 2. Set Up Recurring Payments
Perfect for:
- Monthly rent
- Subscription services
- DCA (Dollar Cost Averaging)
- Allowances

### 3. Test with Small Amounts
Before setting up large payments:
- Send 1 CRO first
- Verify recipient address
- Check execution time

### 4. Monitor Gas Fees
- Check network congestion
- Schedule during low-traffic times
- Use batch payments to save gas

### 5. Leverage AI Conditions
Automate complex scenarios:
- Profit-taking strategies
- Emergency fund triggers
- Event-based payments

---

## 🎯 Use Cases

### Personal Finance
- 💰 Savings automation
- 📊 Budget tracking
- 🎁 Gift scheduling
- 👨‍👩‍👧 Family allowances

### Business
- 💼 Payroll automation
- 🧾 Invoice payments
- 🔄 Subscription billing
- 🤝 Partner settlements

### DeFi
- 📈 DCA strategies
- 🔄 Yield optimization
- 🌉 Cross-chain transfers
- 💱 Token swaps

### Content Creators
- 🎨 Subscription tiers
- 💎 Exclusive content access
- 🏆 Reward loyal supporters
- 📺 Pay-per-view

---

## 📊 Dashboard Overview

### Key Metrics

**Total Intents**
- Number of active payment intents

**Total Sent**
- Cumulative amount sent (all time)

**Active Subscriptions**
- Recurring payments currently running

**Success Rate**
- % of successful transactions

### Charts & Analytics

**Spending Over Time**
- Line chart of daily/weekly/monthly spending

**Top Recipients**
- Who you pay most frequently

**Token Distribution**
- Pie chart of payment tokens

**Payment Types**
- Split between one-time, recurring, conditional

---

## 🔗 Integration Guide

### Using FlowPay in Your App

FlowPay can be embedded in:
- Telegram bots
- Web apps
- Mobile apps
- DApps

### Deep Links

**Open Create Intent:**
```
https://t.me/flowpayment_bot?start=create
```

**Open Dashboard:**
```
https://t.me/flowpayment_bot?start=dashboard
```

**Pre-fill Payment:**
```
https://flowpayment.vercel.app/create?
  to=0x123...
  &amount=100
  &token=CRO
```

---

## 🌟 Premium Features (Coming Soon)

### Advanced Analytics
- Detailed spending reports
- Tax export (CSV for accountants)
- Custom categories
- Budget alerts

### Multi-User Wallets
- Shared payment accounts
- Approval workflows
- Role-based access

### Smart Routing
- Automatic best-rate finding
- Multi-path execution
- Gas optimization

### API Access
- RESTful API
- Webhooks
- SDK for developers

---

## 📞 Quick Reference

### Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome & main menu |
| `/create` | Create new intent |
| `/dashboard` | View your intents |
| `/help` | Get support |

### Keyboard Shortcuts (Web App)

| Key | Action |
|-----|--------|
| `N` | New intent |
| `D` | Dashboard |
| `H` | History |
| `/` | Search |
| `?` | Help |

### Important Links

| Link | URL |
|------|-----|
| **Web App** | https://flowpayment.vercel.app |
| **Bot** | https://t.me/flowpayment_bot |
| **Docs** | https://github.com/your-repo |
| **Support** | https://t.me/flowpay_support |

---

## 🎓 Video Tutorials

### Getting Started (2 min)
- First payment walkthrough
- Dashboard tour
- Notification setup

### Creating Intents (5 min)
- One-time payments
- Recurring subscriptions
- AI conditions

### Advanced Features (10 min)
- Multi-recipient splits
- Cross-chain bridges
- Off-ramping to bank

---

## 🐛 Troubleshooting

### Error Messages

#### "Insufficient Gas"
**Meaning:** Not enough CRO for transaction fees
**Fix:** Add CRO to your wallet

#### "Invalid Address"
**Meaning:** Recipient address is wrong format
**Fix:** Double-check address (starts with 0x)

#### "Network Error"
**Meaning:** Connection to Cronos failed
**Fix:** Check internet, retry in 1 minute

#### "Unauthorized"
**Meaning:** Wallet not connected
**Fix:** Reconnect wallet in Web App

#### "Condition Not Met"
**Meaning:** AI trigger hasn't occurred yet
**Fix:** Wait or edit condition

---

## 💬 Feedback

We love hearing from you! 💙

### Share Feedback

**In-Bot:**
- `/help` → "💬 Feedback"
- Rate your experience
- Suggest features

**GitHub:**
- Open an issue
- Submit pull request
- Star the repo

**Community:**
- Share in Telegram group
- Tweet @FlowPay
- Post on Discord

---

## 📜 Legal & Terms

### Terms of Service
- User agreement
- Privacy policy
- Acceptable use

### Disclaimer
⚠️ FlowPay is experimental software. Use at your own risk.
- Not financial advice
- No warranty
- Test with small amounts first

### Licenses
- Smart contracts: MIT License
- Frontend: MIT License
- Bot: MIT License

---

## 🚀 What's Next?

Upcoming features:
- ✨ Multi-signature wallets
- 🌐 More blockchain support (Ethereum, Polygon)
- 🎨 Custom payment pages
- 📱 Native mobile app
- 🔗 Zapier integration

---

**Made with 💙 by the FlowPay Team**

_Last updated: January 2026_

---

## Need Help?

- 📧 Email: support@flowpay.io
- 💬 Telegram: @flowpay_support
- 🐦 Twitter: @FlowPayOfficial
- 🌐 Website: https://flowpay.io

**Happy Automating! 🌊💰**
