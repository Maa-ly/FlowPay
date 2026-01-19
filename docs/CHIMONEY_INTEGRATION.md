# 💰 Chimoney Off-Ramping Integration Guide

> **Complete guide for implementing Chimoney payments for users without wallets**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why Chimoney?](#why-chimoney)
3. [Architecture](#architecture)
4. [Cronos Network Support](#cronos-network-support)
5. [Implementation Guide](#implementation-guide)
6. [API Reference](#api-reference)
7. [Payment Flows](#payment-flows)
8. [Bridge Integration](#bridge-integration)
9. [Testing](#testing)
10. [Production Deployment](#production-deployment)

---

## 🎯 Overview

Chimoney provides a **"Network of Payment Networks"** that enables FlowPay to pay users who don't have crypto wallets directly to their:

- 🏦 **Bank Accounts** (150+ countries)
- 📱 **Mobile Money** (M-Pesa, Airtel Money, MTN, etc.)
- 💳 **Debit Cards** (Virtual & Physical)
- 📧 **Email** (Gift cards, vouchers)
- 💵 **Cash Pickup** locations worldwide

### Key Features

✅ **Multi-Currency Support**: USD, EUR, GBP, NGN, KES, GHS, CAD, and 20+ more
✅ **AI Agent Wallets**: Create programmable wallets with spending policies
✅ **No Crypto Knowledge Required**: Recipients don't need to understand blockchain
✅ **Instant Settlements**: Real-time payouts to local payment methods
✅ **Compliance Built-in**: KYC/AML handled by Chimoney
✅ **Interledger Protocol**: Connect any payment network

---

## 🤔 Why Chimoney?

### The Problem
When a FlowPay intent executes and sends payment to someone, what if the recipient:
- Doesn't have a crypto wallet?
- Lives in a region where crypto is difficult to cash out?
- Prefers to receive money in their local bank account?
- Wants immediate access without blockchain complexity?

### The Solution
Chimoney acts as a **bridge between crypto (Cronos) and traditional finance**:

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│  FlowPay    │─────>│   Chimoney   │─────>│  Recipient's   │
│  (Cronos)   │ USDC │ Agent Wallet │ Fiat │  Bank Account  │
└─────────────┘      └──────────────┘      └────────────────┘
```

---

## 🏗️ Architecture

### Three-Layer Stack

Chimoney's infrastructure consists of three integrated pillars:

#### 1. **Wallet Layer** (Interledger-enabled)
- Multi-currency storage (20+ fiat + stablecoins)
- Payment pointers (e.g., `$ilp.chimoney.io/flowpay`)
- Interledger Protocol (ILP) for cross-network routing

#### 2. **Passport Layer** (Identity & Compliance)
- W3C Decentralized Identifiers (DIDs)
- KYC/Know Your Business (KYB) data
- AML screening integration (Chainalysis, Elliptic)

#### 3. **Policy Layer** (Programmable Control)
- Spending limits (per transaction, daily, monthly)
- Merchant restrictions
- Velocity checks
- AI agent budget enforcement

### Supported Networks (Funding)

| Network | Standard | Native Stablecoins | Status |
|---------|----------|-------------------|--------|
| Ethereum | ERC-20 | USDC, USDT, DAI | ✅ Supported |
| BSC | BEP-20 | BUSD, USDC, USDT | ✅ Supported |
| Polygon | ERC-20 | USDC, USDT | ✅ Supported |
| Celo | Celo | cUSD, USDC | ✅ Supported |
| XRP Ledger | XRPL | Issued Currencies | ✅ Supported |
| **Cronos** | CRC-20 | USDC | ❌ Not Directly Supported |

---

## ⚠️ Cronos Network Support

### Current Status

**Direct funding from Cronos to Chimoney wallets is NOT supported.**

However, there are two viable approaches:

### ✅ Option 1: Bridge to Polygon (Recommended)

Use cross-chain bridges to convert Cronos USDC → Polygon USDC → Chimoney

**Supported Bridge Protocols:**
1. **XY Finance** - Multi-chain aggregator
2. **Symbiosis** - Liquidity protocol
3. **Rubic** - Cross-chain DEX aggregator

### ✅ Option 2: Centralized Exchange Route

1. User receives Cronos USDC in FlowPay
2. User transfers to Crypto.com or other CEX
3. User withdraws to Chimoney-supported chain (Polygon/BSC)
4. User funds Chimoney wallet

---

## 🚀 Implementation Guide

### Phase 1: Setup Chimoney Account

#### Step 1: Register

1. Go to [chimoney.io](https://chimoney.io)
2. Sign up for a business account
3. Complete KYB verification
4. Enable API access

#### Step 2: Get API Credentials

```bash
# Production API
https://api.chimoney.io/

# Sandbox API (for testing)
https://api-v2-sandbox.chimoney.io
```

**API Key Format:**
```
X-API-KEY: chim_live_1234567890abcdef...
```

### Phase 2: Create AI Agent Wallet

Agent wallets are sub-accounts with programmable policies.

#### Create Agent via API

```typescript
// src/services/chimoney/agentService.ts

interface CreateAgentParams {
  name: string;
  description?: string;
  email?: string;
  limits?: {
    USD?: {
      maxPerTx: number;
      dailyCap: number;
    };
    NGN?: {
      maxPerTx: number;
      dailyCap: number;
    };
  };
  capabilities?: string[];
  regions?: string[];
  initialFunding?: number;
}

export async function createChimoneyAgent(params: CreateAgentParams) {
  const response = await fetch('https://api.chimoney.io/v0.2.4/agents/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.CHIMONEY_API_KEY!,
    },
    body: JSON.stringify({
      name: params.name,
      description: params.description || `FlowPay agent for ${params.name}`,
      email: params.email,
      limits: params.limits || {
        USD: {
          maxPerTx: 10000,
          dailyCap: 100000,
        },
      },
      capabilities: params.capabilities || ['finance.*', 'wallet.*'],
      regions: params.regions || ['US', 'NG', 'KE', 'GH'],
      initialFunding: params.initialFunding,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create agent: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Example response:
/*
{
  "agentId": "agent_abc123",
  "name": "FlowPayAgent",
  "email": "agent-123@agents.chimoney.io",
  "status": "active",
  "paymentPointer": "$chimoney.io/agent_abc123",
  "walletDetails": [
    { "currency": "USD", "balance": 0.0, "id": "wallet_usd_abc123" },
    { "currency": "NGN", "balance": 0.0, "id": "wallet_ngn_abc123" }
  ]
}
*/
```

### Phase 3: Fund Agent Wallet (via Polygon Bridge)

Since Cronos is not directly supported, we use a bridge:

```typescript
// src/services/chimoney/bridgeService.ts

import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { polygon } from 'viem/chains';

// Step 1: Bridge Cronos USDC to Polygon USDC
// (Using XY Finance as example)

interface BridgeToChimoneyParams {
  fromAmount: string; // Amount in USDC (e.g., "100")
  chimoneyWalletAddress: string; // Polygon address of Chimoney wallet
  userAddress: string;
}

export async function bridgeCronosToChimoney(params: BridgeToChimoneyParams) {
  // XY Finance API endpoint
  const xyFinanceQuoteUrl = 'https://api.xy.finance/v1/quote';
  
  const quoteParams = {
    srcChainId: 25, // Cronos
    destChainId: 137, // Polygon
    srcToken: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', // USDC on Cronos
    destToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC on Polygon
    amount: parseUnits(params.fromAmount, 6).toString(),
    slippage: '0.5', // 0.5% slippage
    recipient: params.chimoneyWalletAddress,
  };

  // Get quote
  const quote = await fetch(`${xyFinanceQuoteUrl}?${new URLSearchParams(quoteParams)}`);
  const quoteData = await quote.json();

  // Return transaction data for user to sign
  return {
    to: quoteData.to,
    data: quoteData.data,
    value: quoteData.value,
    estimatedOutput: quoteData.estimatedOutput,
    bridgeFee: quoteData.fee,
  };
}
```

### Phase 4: Execute Payout to Recipient

Once the Chimoney agent wallet is funded, execute payouts:

```typescript
// src/services/chimoney/payoutService.ts

interface BankPayoutParams {
  recipientEmail: string;
  amount: number;
  currency: string; // 'NGN', 'KES', 'GHS', etc.
  bankDetails: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
  };
  narration?: string;
}

export async function payoutToBank(params: BankPayoutParams) {
  const response = await fetch('https://api.chimoney.io/v0.2.4/payouts/bank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.CHIMONEY_API_KEY!,
    },
    body: JSON.stringify({
      subAccount: process.env.CHIMONEY_AGENT_ID, // Your agent wallet ID
      turnOffNotification: false,
      banks: [
        {
          email: params.recipientEmail,
          valueInUSD: params.amount,
          currency: params.currency,
          ...params.bankDetails,
          reference: `FLOWPAY-${Date.now()}`,
          narration: params.narration || 'FlowPay payment',
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Payout failed: ${response.statusText}`);
  }

  return await response.json();
}

// Mobile Money Payout
interface MobileMoneyPayoutParams {
  recipientPhone: string; // With country code: +254712345678
  amount: number;
  currency: string;
  narration?: string;
}

export async function payoutToMobileMoney(params: MobileMoneyPayoutParams) {
  const response = await fetch('https://api.chimoney.io/v0.2.4/payouts/mobile-money', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.CHIMONEY_API_KEY!,
    },
    body: JSON.stringify({
      subAccount: process.env.CHIMONEY_AGENT_ID,
      mobileMoneys: [
        {
          phoneNumber: params.recipientPhone,
          valueInUSD: params.amount,
          currency: params.currency,
          narration: params.narration || 'FlowPay payment',
        },
      ],
    }),
  });

  return await response.json();
}
```

---

## 📡 API Reference

### Agents API

#### POST /v0.2.4/agents/create

Create a new AI agent wallet.

**Request:**
```json
{
  "name": "FlowPayAgent",
  "description": "Agent for FlowPay payments",
  "limits": {
    "USD": {
      "maxPerTx": 10000,
      "dailyCap": 100000
    }
  },
  "capabilities": ["finance.*"],
  "initialFunding": 1000
}
```

**Response:**
```json
{
  "agentId": "agent_abc123",
  "paymentPointer": "$chimoney.io/agent_abc123",
  "walletDetails": [...]
}
```

#### POST /v0.2.4/agents/fund

Fund an agent wallet (internal transfer from parent wallet).

**Request:**
```json
{
  "agentId": "agent_abc123",
  "amount": 1000,
  "currency": "USD"
}
```

### Payouts API

#### POST /v0.2.4/payouts/bank

Payout to bank account.

**Supported Countries:**
- Nigeria (NGN)
- Kenya (KES)
- Ghana (GHS)
- South Africa (ZAR)
- Tanzania (TZS)
- Uganda (UGX)
- And 150+ more

**Request:**
```json
{
  "banks": [{
    "email": "recipient@example.com",
    "valueInUSD": 100,
    "currency": "NGN",
    "accountNumber": "0123456789",
    "bankCode": "058",
    "accountName": "John Doe",
    "reference": "FLOWPAY-12345",
    "narration": "Payment for services"
  }]
}
```

#### POST /v0.2.4/payouts/mobile-money

Payout to mobile money account.

**Supported:**
- M-Pesa (Kenya, Tanzania)
- Airtel Money
- MTN Mobile Money
- Vodafone Cash
- Tigo Pesa

**Request:**
```json
{
  "mobileMoneys": [{
    "phoneNumber": "+254712345678",
    "valueInUSD": 50,
    "currency": "KES",
    "narration": "FlowPay payment"
  }]
}
```

#### POST /v0.2.4/payouts/chimoney

Payout to Chimoney wallet (email or phone).

**Request:**
```json
{
  "chimoneys": [{
    "email": "user@example.com",
    "valueInUSD": 100,
    "narration": "Payment from FlowPay"
  }]
}
```

---

## 🔄 Payment Flows

### Flow 1: Intent Executes → Bank Account

```
┌─────────────────────────────────────────────────────────┐
│ 1. FlowPay Intent Triggers                              │
│    User wants to pay freelancer in Nigeria             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Smart Contract Executes                              │
│    Transfers USDC on Cronos                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Bridge to Polygon                                    │
│    XY Finance: Cronos USDC → Polygon USDC              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Deposit to Chimoney Agent Wallet                     │
│    Wallet receives Polygon USDC                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Chimoney Processes Payout                            │
│    Converts USD → NGN at market rate                    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Bank Transfer                                        │
│    Recipient receives NGN in their bank account         │
└─────────────────────────────────────────────────────────┘
```

### Flow 2: Recipient Without Wallet Claims Payment

```typescript
// When an intent executes for a user without a wallet

async function handleIntentExecutionForNonWalletUser(
  recipientEmail: string,
  amountUSD: number,
  paymentMethod: 'bank' | 'mobile_money' | 'email'
) {
  // 1. Check if recipient has Chimoney account
  const hasChimoneyAccount = await checkChimoneyAccount(recipientEmail);
  
  if (!hasChimoneyAccount) {
    // 2. Send Chimoney invite payment
    // Recipient can claim and choose payout method
    return await payoutToChimoney({
      chimoneys: [{
        email: recipientEmail,
        valueInUSD: amountUSD,
        narration: 'Payment from FlowPay - Create account to claim',
      }],
    });
  } else {
    // 3. Get recipient's preferred payout method
    const preferences = await getRecipientPreferences(recipientEmail);
    
    switch (preferences.method) {
      case 'bank':
        return await payoutToBank({
          recipientEmail,
          amount: amountUSD,
          currency: preferences.currency,
          bankDetails: preferences.bankDetails,
        });
        
      case 'mobile_money':
        return await payoutToMobileMoney({
          recipientPhone: preferences.phone,
          amount: amountUSD,
          currency: preferences.currency,
        });
        
      default:
        // Default to Chimoney wallet
        return await payoutToChimoney({
          chimoneys: [{
            email: recipientEmail,
            valueInUSD: amountUSD,
          }],
        });
    }
  }
}
```

---

## 🌉 Bridge Integration (Cronos → Polygon)

### Option 1: XY Finance

```typescript
// Complete XY Finance integration example

import { useAccount, useWalletClient } from 'wagmi';

export function BridgeToCHimoney() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  async function bridgeUSDC(amount: string, chimoneyAddress: string) {
    // 1. Get quote from XY Finance
    const quote = await fetch('https://api.xy.finance/v1/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        srcChainId: 25, // Cronos
        destChainId: 137, // Polygon
        srcToken: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', // USDC on Cronos
        destToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC on Polygon
        amount: parseUnits(amount, 6).toString(),
        slippage: 0.5,
        recipient: chimoneyAddress, // Chimoney wallet on Polygon
      }),
    });

    const quoteData = await quote.json();

    // 2. Approve USDC spending (if needed)
    // ... approval transaction

    // 3. Execute bridge transaction
    const tx = await walletClient.sendTransaction({
      to: quoteData.to,
      data: quoteData.data,
      value: quoteData.value,
    });

    return tx;
  }

  return (
    <button onClick={() => bridgeUSDC('100', 'CHIMONEY_POLYGON_ADDRESS')}>
      Bridge & Pay
    </button>
  );
}
```

### Option 2: Automated Backend Bridge

For better UX, handle bridging on your backend:

```typescript
// Backend service that watches for FlowPay payments
// and automatically bridges to Chimoney

import { createPublicClient, http } from 'viem';
import { cronos } from 'viem/chains';

const cronosClient = createPublicClient({
  chain: cronos,
  transport: http(),
});

// Watch for FlowPay intent executions
cronosClient.watchEvent({
  address: FLOWPAY_CONTRACT_ADDRESS,
  event: parseAbiItem('event IntentExecuted(bytes32 indexed intentId, address indexed recipient, uint256 amount)'),
  onLogs: async (logs) => {
    for (const log of logs) {
      const { recipient, amount } = log.args;
      
      // Check if recipient wants Chimoney payout
      const recipientPrefs = await db.getRecipientPreferences(recipient);
      
      if (recipientPrefs.payoutMethod === 'chimoney') {
        // 1. Bridge to Polygon
        await bridgeToPoly gon(amount);
        
        // 2. Payout via Chimoney
        await payoutToRecipient(recipientPrefs);
      }
    }
  },
});
```

---

## 🧪 Testing

### Sandbox Environment

```bash
# Use sandbox API for testing
CHIMONEY_API_URL=https://api-v2-sandbox.chimoney.io
CHIMONEY_API_KEY=chim_sandbox_test_key
```

### Test Scenarios

1. **Create Test Agent**
```bash
curl -X POST https://api-v2-sandbox.chimoney.io/v0.2.4/agents/create \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your_sandbox_key" \
  -d '{
    "name": "TestAgent",
    "initialFunding": 100
  }'
```

2. **Test Bank Payout**
```bash
# Use test bank accounts (won't actually transfer)
curl -X POST https://api-v2-sandbox.chimoney.io/v0.2.4/payouts/bank \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your_sandbox_key" \
  -d '{
    "banks": [{
      "email": "test@example.com",
      "valueInUSD": 10,
      "currency": "NGN",
      "accountNumber": "0123456789",
      "bankCode": "058"
    }]
  }'
```

---

## 🚀 Production Deployment

### Environment Variables

```env
# .env.production

# Chimoney Configuration
CHIMONEY_API_URL=https://api.chimoney.io
CHIMONEY_API_KEY=chim_live_your_production_key
CHIMONEY_AGENT_ID=agent_your_production_agent
CHIMONEY_POLYGON_WALLET=0x... # Your Chimoney wallet address on Polygon

# Bridge Configuration
XY_FINANCE_API_KEY=your_xy_finance_key
BRIDGE_SLIPPAGE_TOLERANCE=0.5

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### Integration Checklist

- [ ] Create production Chimoney account
- [ ] Complete KYB verification
- [ ] Enable API access
- [ ] Create agent wallet
- [ ] Fund agent wallet (via bridge)
- [ ] Set up webhook endpoints for notifications
- [ ] Implement error handling and retries
- [ ] Add transaction monitoring
- [ ] Set up alerts for failed payouts
- [ ] Document recipient onboarding flow
- [ ] Create support documentation

---

## 💡 Best Practices

1. **Always use HTTPS** for API calls
2. **Store API keys securely** (never in frontend)
3. **Implement retry logic** for failed payouts
4. **Monitor exchange rates** for accurate conversions
5. **Validate recipient details** before payout
6. **Use webhook notifications** for real-time updates
7. **Keep audit logs** of all transactions
8. **Handle edge cases** (insufficient balance, invalid accounts)
9. **Test thoroughly** in sandbox before production
10. **Provide clear UI** for recipients to claim payments

---

## 📚 Additional Resources

- **Chimoney API Docs**: https://chimoney.readme.io
- **XY Finance Docs**: https://docs.xy.finance
- **Symbiosis Docs**: https://docs.symbiosis.finance
- **Interledger Protocol**: https://interledger.org

---

## 🆘 Support

For Chimoney integration issues:
- Email: support@chimoney.io
- Telegram: https://t.me/chimoney_support
- Documentation: https://chimoney.readme.io

For FlowPay questions:
- See main [README.md](../README.md)

---

**Ready to implement?** Start with the sandbox environment and test the complete flow!
