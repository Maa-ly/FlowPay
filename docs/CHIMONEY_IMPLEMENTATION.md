# Chimoney Off-Ramping Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Supported Networks & Funding Methods](#supported-networks--funding-methods)
4. [FlowPay Integration Strategy](#flowpay-integration-strategy)
5. [API Setup](#api-setup)
6. [Agent Wallet Creation](#agent-wallet-creation)
7. [Payout Methods](#payout-methods)
8. [Cronos Integration via Bridging](#cronos-integration-via-bridging)
9. [Implementation Steps](#implementation-steps)
10. [Code Examples](#code-examples)
11. [Webhook Implementation](#webhook-implementation)
12. [Testing Guide](#testing-guide)
13. [Production Deployment](#production-deployment)
14. [Regional Considerations](#regional-considerations)
15. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Chimoney?

Chimoney is a **digital payment and identity infrastructure platform** that provides AI agents and humans with:
- **Multi-currency wallets** (USD, CAD, NGN, MXN, KES, and 20+ stablecoins)
- **Cryptographic digital passports** (APort DID)
- **Real-time policy enforcement** for compliant autonomous money movement
- **Global payout capabilities** (mobile money, bank transfers, crypto)

### Why Use Chimoney for FlowPay?

FlowPay's core value is **automated recurring payments** using crypto. However, many potential users in emerging markets:
- **Don't have crypto wallets** or knowledge of cryptocurrency
- **Prefer local payment methods** (bank transfers, mobile money)
- **Need off-ramping** to convert crypto → fiat seamlessly

**Chimoney solves this by:**
1. Receiving crypto payments on FlowPay's behalf (Ethereum, BSC, Polygon, Celo)
2. Converting to USD/local currency automatically
3. Paying recipients via their preferred method (bank, mobile money)
4. Handling compliance, KYC, and regulatory requirements

### Key Features for FlowPay
- ✅ **Bank Transfers**: Direct bank payouts in 50+ countries
- ✅ **Mobile Money**: M-Pesa, MTN Mobile Money, Airtel Money, etc.
- ✅ **Interledger Protocol (ILP)**: Cross-ledger payments
- ✅ **Agent Wallets**: AI-powered payment automation
- ✅ **Policy Engine**: Transaction limits, compliance rules
- ✅ **Multi-currency Support**: 20+ stablecoins across 5 blockchains

---

## Architecture

Chimoney's platform consists of three core layers:

### 1. **Wallet Layer**
- Multi-currency wallet system (fiat + crypto)
- Supports USD, CAD, NGN, MXN, KES, GHS, ZAR, etc.
- 20+ stablecoins: USDC, USDT, DAI, cUSD (Celo), etc.
- Blockchain support: Ethereum, BSC, Polygon, Celo, XRP Ledger

### 2. **Passport Layer** (APort)
- Decentralized Identity (DID)
- Cryptographic attestations for identity verification
- Assurance levels: `high`, `medium`, `low`
- Enables compliance with global regulations

### 3. **Policy Layer**
- Transaction limits (per-transaction, daily caps)
- Regional restrictions (ISO country codes)
- Capability controls (`finance.*`, `wallet.*`)
- Approval workflows for high-value transactions

---

## Supported Networks & Funding Methods

### Blockchain Networks (Native Support)
| Network | Chain ID | Stablecoins Supported | Funding | Payout |
|---------|----------|----------------------|---------|--------|
| Ethereum | 1 | USDC, USDT, DAI | ✅ | ✅ |
| BSC | 56 | USDC, USDT, BUSD | ✅ | ✅ |
| Polygon | 137 | USDC, USDT, DAI | ✅ | ✅ |
| Celo | 42220 | cUSD, cEUR, cREAL | ✅ | ✅ |
| XRP Ledger | - | XRP, RLUSD | ✅ | ✅ |
| **Cronos** | **25** | **USDC** | **❌ (via bridge)** | **✅ (asymmetric)** |

### Cronos Network Limitations
⚠️ **Chimoney does NOT natively support funding from Cronos network**

**However, Chimoney CAN pay out TO Cronos wallets** (asymmetric support). This means:
- ❌ Cannot fund Chimoney wallet directly from Cronos USDC
- ✅ Can receive crypto payouts to Cronos wallet addresses
- ✅ Must use **bridging strategy** for Cronos → Chimoney funding

### Fiat Payout Methods
| Method | Regions | Description |
|--------|---------|-------------|
| **Bank Transfers** | 50+ countries | Direct ACH, SEPA, SWIFT, local rails |
| **Mobile Money** | Africa, Asia | M-Pesa, MTN, Airtel, Orange Money |
| **SPEI** | Mexico | Real-time bank transfers (CLABE) |
| **Interledger (ILP)** | Global | Cross-ledger protocol payments |
| **Gift Cards** | Global | Amazon, iTunes, Google Play, etc. |
| **Virtual Cards** | Global | Disposable debit cards |

---

## FlowPay Integration Strategy

### Problem Statement
FlowPay executes automated payments from **Cronos network (Chain ID 25)** using USDC. Recipients may:
1. Not have a crypto wallet
2. Prefer receiving funds in their local bank account
3. Live in regions where mobile money is preferred (Africa, Asia)

### Solution: Hybrid Off-Ramping Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLOWPAY SYSTEM                          │
│  ┌────────────┐          ┌──────────────┐                       │
│  │  Payment   │  Cronos  │   FlowPay    │                       │
│  │   Intent   │─────────▶│   Contract   │                       │
│  │  (execute) │   USDC   │  (on Cronos) │                       │
│  └────────────┘          └──────┬───────┘                       │
│                                 │ Transfer USDC                  │
│                                 ▼                                │
│                        ┌────────────────┐                        │
│                        │  FlowPay Hot   │                        │
│                        │    Wallet      │                        │
│                        │  (Cronos EVM)  │                        │
│                        └────────┬───────┘                        │
└─────────────────────────────────┼──────────────────────────────┘
                                  │
                                  │ Bridge USDC
                                  │ (Cronos → Polygon)
                                  ▼
                         ┌─────────────────┐
                         │  Bridge Service │
                         │ (XY Finance/     │
                         │  Symbiosis)     │
                         └────────┬────────┘
                                  │ USDC on Polygon
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CHIMONEY PLATFORM                          │
│  ┌────────────────┐          ┌──────────────┐                   │
│  │ Chimoney Agent │◀─────────│   Polygon    │                   │
│  │     Wallet     │  Fund    │  USDC Wallet │                   │
│  │   (USD Pool)   │          │  (Chimoney)  │                   │
│  └────────┬───────┘          └──────────────┘                   │
│           │                                                      │
│           │ Convert & Payout                                    │
│           ├──────────────────────┬──────────────────┐           │
│           ▼                      ▼                  ▼           │
│  ┌────────────────┐    ┌─────────────────┐  ┌──────────────┐   │
│  │ Bank Transfer  │    │  Mobile Money   │  │  Interledger │   │
│  │ (ACH/SEPA/     │    │ (M-Pesa/MTN/    │  │  (Payment    │   │
│  │  SWIFT/Local)  │    │  Airtel/Orange) │  │   Pointer)   │   │
│  └────────────────┘    └─────────────────┘  └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   End User      │
                  │ (Bank Account/  │
                  │  Mobile Money)  │
                  └─────────────────┘
```

### Integration Points

#### 1. **Payment Intent Creation** (Frontend)
```typescript
interface PaymentIntent {
  recipient: string;         // Wallet address OR email/phone
  amount: string;           // USDC amount
  interval: number;         // Seconds between payments
  payoutMethod?: {          // NEW: Off-ramping config
    type: 'crypto' | 'bank' | 'mobile-money';
    details: BankDetails | MobileMoneyDetails;
  };
}
```

#### 2. **Intent Execution** (Smart Contract)
```solidity
// Cronos contract executes payment
function executeIntent(uint256 intentId) external {
    // Transfer USDC to FlowPay hot wallet
    USDC.transfer(FLOWPAY_HOT_WALLET, amount);
    emit IntentExecuted(intentId, amount, recipient);
}
```

#### 3. **Off-Ramping Service** (Backend)
```typescript
// Backend service monitors contract events
async function handleIntentExecuted(event) {
  const { intentId, amount, recipient } = event;
  
  // Check if recipient needs off-ramping
  const offRampConfig = await getOffRampConfig(intentId);
  
  if (offRampConfig) {
    // Bridge Cronos USDC → Polygon USDC
    await bridgeToPolygon(amount);
    
    // Fund Chimoney wallet
    await fundChimoneyWallet(amount);
    
    // Execute payout via Chimoney
    await executeChimoneyPayout(offRampConfig);
  }
}
```

---

## API Setup

### 1. Get API Keys

**Sandbox Environment:**
```
API Endpoint: https://api-v2-sandbox.chimoney.io
Dashboard: https://sandbox.chimoney.io
```

**Production Environment:**
```
API Endpoint: https://api.chimoney.io
Dashboard: https://chimoney.io
```

**Steps:**
1. Sign up at [chimoney.io](https://chimoney.io)
2. Navigate to **Developer Portal** → **API Keys**
3. Generate API key (format: `ch_live_xxxxx` or `ch_test_xxxxx`)
4. Enable **API Access** (contact support@chimoney.io if disabled)

### 2. Authentication

All API requests require the `X-API-KEY` header:

```bash
curl https://api.chimoney.io/v0.2.4/info/assets \
  -H "X-API-KEY: ch_live_your_api_key_here"
```

**TypeScript Example:**
```typescript
const CHIMONEY_API_KEY = process.env.CHIMONEY_API_KEY;
const CHIMONEY_BASE_URL = 'https://api.chimoney.io';

async function chimoneyRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${CHIMONEY_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-API-KEY': CHIMONEY_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Chimoney API Error: ${error.error || error.message}`);
  }
  
  return response.json();
}
```

### 3. Environment Variables

```env
# Chimoney Configuration
CHIMONEY_API_KEY=ch_live_xxxxx
CHIMONEY_BASE_URL=https://api.chimoney.io
CHIMONEY_AGENT_ID=agent_abc123

# Wallet Configuration
CHIMONEY_HOT_WALLET_ADDRESS=0x...
CHIMONEY_POLYGON_USDC_CONTRACT=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174

# Bridge Configuration (Cronos → Polygon)
XY_FINANCE_API_KEY=xy_xxxxx
BRIDGE_SLIPPAGE_TOLERANCE=0.5
```

---

## Agent Wallet Creation

Chimoney's **Agent Wallets** are perfect for FlowPay because they:
- Enable **AI-powered autonomous payments**
- Support **policy-based transaction controls**
- Provide **multi-currency wallets** (fiat + crypto)
- Include **APort DID** for identity verification

### Create an Agent Wallet

**API Endpoint:** `POST /v0.2.4/agents/create`

**Request:**
```typescript
interface CreateAgentRequest {
  name: string;                        // Agent name (e.g., "FlowPay Payout Agent")
  description?: string;                // Optional description
  email?: string;                      // Auto-generated if omitted
  subAccount?: string;                 // Sub-account identifier
  limits?: {                           // Transaction limits
    USD?: {
      maxPerTx: number;               // Max per transaction
      dailyCap: number;               // Daily spending cap
    };
    NGN?: { maxPerTx: number; dailyCap: number; };
    MXN?: { maxPerTx: number; dailyCap: number; };
    refundAmountMaxPerTx?: number;
    refundAmountDailyCap?: number;
    approvalRequired?: boolean;
  };
  capabilities?: string[];             // ["finance.*", "wallet.*"]
  regions?: string[];                  // ["NG", "KE", "GH", "MX"] (ISO codes)
  meta?: Record<string, any>;          // Custom metadata
  interledgerWalletAddress?: string;   // Custom payment pointer
  initialFunding?: number;             // Initial USD funding from parent wallet
}

interface CreateAgentResponse {
  status: string;
  data: {
    agentId: string;                   // e.g., "agent_abc123"
    uid: string;
    name: string;
    email: string;
    paymentPointer: string;            // e.g., "$chimoney.io/agent_abc123"
    aportPassportId: string;
    aportDID: string;                  // Decentralized Identifier
    assuranceLevel: string;            // "high" | "medium" | "low"
    status: string;                    // "active"
    createdAt: string;
    walletDetails: Array<{
      currency: string;                // "USD", "NGN", etc.
      balance: number;
      id: string;
    }>;
  };
}
```

**Example Request:**
```typescript
async function createFlowPayAgent() {
  const response = await chimoneyRequest('/v0.2.4/agents/create', {
    method: 'POST',
    body: JSON.stringify({
      name: 'FlowPay Payout Agent',
      description: 'Automated payment agent for FlowPay recurring payments',
      limits: {
        USD: {
          maxPerTx: 10000,      // $10k max per transaction
          dailyCap: 100000,     // $100k daily limit
        },
        NGN: {
          maxPerTx: 5000000,    // ₦5M max per transaction
          dailyCap: 50000000,   // ₦50M daily limit
        },
        MXN: {
          maxPerTx: 200000,     // $200k MXN max per transaction
          dailyCap: 2000000,    // $2M MXN daily limit
        },
        approvalRequired: false,
      },
      capabilities: ['finance.send', 'wallet.receive'],
      regions: ['NG', 'KE', 'GH', 'UG', 'TZ', 'MX', 'BR'],
      meta: {
        service: 'flowpay',
        environment: 'production',
        network: 'cronos',
      },
      initialFunding: 1000, // Fund with $1000 USD initially
    }),
  });
  
  console.log('Agent Created:', response.data);
  
  // Store agent ID in database
  await db.config.set('CHIMONEY_AGENT_ID', response.data.agentId);
  
  return response.data;
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "agentId": "agent_flowpay_abc123",
    "name": "FlowPay Payout Agent",
    "email": "agent-flowpay@agents.chimoney.io",
    "paymentPointer": "$chimoney.io/agent_flowpay_abc123",
    "aportPassportId": "passport_xyz789",
    "aportDID": "did:aport:flowpay123",
    "assuranceLevel": "high",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "walletDetails": [
      { "currency": "USD", "balance": 1000.0, "id": "wallet_usd_abc" },
      { "currency": "NGN", "balance": 0.0, "id": "wallet_ngn_def" },
      { "currency": "MXN", "balance": 0.0, "id": "wallet_mxn_ghi" }
    ]
  }
}
```

---

## Payout Methods

Chimoney supports multiple payout methods. FlowPay should implement the most common ones:

### 1. Bank Transfers

**Supported Regions:**
- 🇳🇬 Nigeria (ACH, NIBSS)
- 🇰🇪 Kenya (RTGS, EFT)
- 🇬🇭 Ghana (GIP, ACH)
- 🇺🇬 Uganda (EFT)
- 🇿🇦 South Africa (EFT)
- 🇲🇽 Mexico (SPEI)
- 🇧🇷 Brazil (PIX, TED)
- 🇺🇸 USA (ACH, Wire)
- 🇪🇺 Europe (SEPA)

**API Endpoint:** `POST /v0.2.4/payouts/initiate-chimoney`

**Request:**
```typescript
interface BankPayoutRequest {
  subAccount?: string;                // Agent ID
  turnOffNotification?: boolean;
  chimoneys: Array<{
    metadata: {
      bankPayout: {
        accountNumber: string;        // Bank account number
        bankCode: string;             // Bank code (varies by country)
        fullname: string;             // Account holder name
        countryCode?: string;         // ISO country code
      };
    };
    valueInUSD: number;               // Amount in USD
    narration?: string;               // Payment description
  }>;
}
```

**Example:**
```typescript
async function payoutToBank(recipientDetails: {
  accountNumber: string;
  bankCode: string;
  fullname: string;
  amount: number;
  country: string;
}) {
  const response = await chimoneyRequest('/v0.2.4/payouts/initiate-chimoney', {
    method: 'POST',
    body: JSON.stringify({
      subAccount: process.env.CHIMONEY_AGENT_ID,
      turnOffNotification: false,
      chimoneys: [{
        metadata: {
          bankPayout: {
            accountNumber: recipientDetails.accountNumber,
            bankCode: recipientDetails.bankCode,
            fullname: recipientDetails.fullname,
          },
        },
        valueInUSD: recipientDetails.amount,
        narration: `FlowPay recurring payment - ${new Date().toLocaleDateString()}`,
      }],
    }),
  });
  
  return response.data;
}

// Usage
await payoutToBank({
  accountNumber: '0123456789',
  bankCode: '058',              // GTBank Nigeria
  fullname: 'John Doe',
  amount: 100,                  // $100 USD
  country: 'NG',
});
```

### 2. Mobile Money

**Supported Providers:**
- 🇰🇪 M-Pesa (Kenya)
- 🇺🇬 MTN Mobile Money (Uganda, Ghana, etc.)
- 🇬🇭 Vodafone Cash (Ghana)
- 🇹🇿 Airtel Money (Tanzania)
- 🇿🇦 Orange Money (South Africa)

**API Endpoint:** `POST /v0.2.4/payouts/mobile-money`

**Request:**
```typescript
interface MobileMoneyPayoutRequest {
  subAccount?: string;
  turnOffNotification?: boolean;
  momos: Array<{
    countryToSend: string;            // "Kenya", "Uganda", etc.
    phoneNumber: string;              // +254710102720
    valueInUSD: number;
    reference: string;                // Unique transaction reference
    momoCode: string;                 // Provider code (MPS, MTN, etc.)
    narration?: string;
  }>;
}
```

**Example:**
```typescript
async function payoutToMobileMoney(details: {
  phoneNumber: string;
  amount: number;
  country: string;
  provider: string;
}) {
  const momoCodeMap = {
    'mpesa': 'MPS',
    'mtn': 'MTN',
    'airtel': 'ATL',
    'vodafone': 'VDF',
  };
  
  const response = await chimoneyRequest('/v0.2.4/payouts/mobile-money', {
    method: 'POST',
    body: JSON.stringify({
      subAccount: process.env.CHIMONEY_AGENT_ID,
      turnOffNotification: false,
      momos: [{
        countryToSend: details.country,
        phoneNumber: details.phoneNumber,
        valueInUSD: details.amount,
        reference: `flowpay_${Date.now()}`,
        momoCode: momoCodeMap[details.provider.toLowerCase()],
        narration: 'FlowPay recurring payment',
      }],
    }),
  });
  
  return response.data;
}

// Usage
await payoutToMobileMoney({
  phoneNumber: '+254710102720',
  amount: 50,
  country: 'Kenya',
  provider: 'mpesa',
});
```

### 3. Crypto Payouts (Polygon/Ethereum/BSC)

For recipients who prefer crypto, you can pay directly to their wallet:

**API Endpoint:** `POST /v0.2.4/payouts/initiate-chimoney`

**Example:**
```typescript
async function payoutToCrypto(details: {
  walletAddress: string;
  amount: number;
  network: 'ethereum' | 'bsc' | 'polygon';
  token: 'USDC' | 'USDT' | 'DAI';
}) {
  const response = await chimoneyRequest('/v0.2.4/payouts/initiate-chimoney', {
    method: 'POST',
    body: JSON.stringify({
      subAccount: process.env.CHIMONEY_AGENT_ID,
      chimoneys: [{
        cryptoPayment: [{
          [details.network]: {
            address: details.walletAddress,
            currency: details.token,
          },
        }],
        valueInUSD: details.amount,
      }],
    }),
  });
  
  return response.data;
}
```

### 4. Interledger (Payment Pointer)

For recipients with Interledger wallets (Rafiki, Uphold, GateHub, etc.):

**API Endpoint:** `POST /v0.2.4/payouts/interledger-wallet-address`

**Example:**
```typescript
async function payoutToInterledger(paymentPointer: string, amount: number) {
  const response = await chimoneyRequest('/v0.2.4/payouts/interledger-wallet-address', {
    method: 'POST',
    body: JSON.stringify({
      subAccount: process.env.CHIMONEY_AGENT_ID,
      interledgerWalletAddresses: [{
        address: paymentPointer,        // e.g., "$ilp.uphold.com/user123"
        valueInUSD: amount,
      }],
    }),
  });
  
  return response.data;
}
```

---

## Cronos Integration via Bridging

Since Chimoney doesn't natively support Cronos, we need a **bridge-based funding strategy**:

### Bridging Architecture

```
Cronos USDC → Bridge → Polygon USDC → Chimoney Wallet
```

### Supported Bridge Providers

| Provider | Cronos Support | Fees | Speed | API Docs |
|----------|----------------|------|-------|----------|
| **XY Finance** | ✅ Yes | 0.1-0.3% | 2-10 min | [docs.xy.finance](https://docs.xy.finance) |
| **Symbiosis** | ✅ Yes | 0.2-0.5% | 3-15 min | [docs.symbiosis.finance](https://docs.symbiosis.finance) |
| **Rubic** | ✅ Yes | 0.3-0.7% | 5-20 min | [tools.rubic.exchange](https://tools.rubic.exchange) |

### Recommended: XY Finance Integration

**Why XY Finance?**
- ✅ Native Cronos support
- ✅ Lowest fees (0.1-0.3%)
- ✅ Fast settlement (2-10 min)
- ✅ REST API for automation
- ✅ No KYC required for small amounts

**Implementation:**

```typescript
import { XYFinanceAPI } from '@xy-finance/sdk';

const xyClient = new XYFinanceAPI({
  apiKey: process.env.XY_FINANCE_API_KEY,
});

async function bridgeCronosToPolygon(amount: number) {
  // Step 1: Get quote for Cronos USDC → Polygon USDC
  const quote = await xyClient.getQuote({
    fromChainId: 25,              // Cronos
    toChainId: 137,               // Polygon
    fromToken: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', // USDC on Cronos
    toToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',   // USDC on Polygon
    amount: amount.toString(),
    slippage: 0.5,                // 0.5% slippage tolerance
  });
  
  console.log('Bridge Quote:', {
    fromAmount: quote.fromAmount,
    toAmount: quote.toAmount,
    estimatedGas: quote.estimatedGas,
    estimatedTime: quote.estimatedTime,
  });
  
  // Step 2: Build transaction
  const tx = await xyClient.buildTx({
    quoteId: quote.quoteId,
    receiver: process.env.CHIMONEY_POLYGON_USDC_WALLET, // Your Polygon wallet
  });
  
  // Step 3: Execute bridge transaction
  const receipt = await executeBridgeTx(tx);
  
  // Step 4: Wait for bridge completion
  const bridgeStatus = await xyClient.getTransactionStatus(receipt.txHash);
  
  return {
    bridgeTxHash: receipt.txHash,
    bridgedAmount: quote.toAmount,
    status: bridgeStatus,
  };
}

async function executeBridgeTx(tx: any) {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://evm.cronos.org'
  );
  const wallet = new ethers.Wallet(
    process.env.FLOWPAY_HOT_WALLET_PRIVATE_KEY,
    provider
  );
  
  const txResponse = await wallet.sendTransaction({
    to: tx.to,
    data: tx.data,
    value: tx.value,
    gasLimit: tx.gasLimit,
  });
  
  return await txResponse.wait();
}
```

### Funding Chimoney from Polygon

Once USDC arrives on Polygon, fund the Chimoney wallet:

```typescript
async function fundChimoneyFromPolygon(amount: number) {
  // Step 1: Transfer Polygon USDC to Chimoney's deposit address
  const chimoneyDepositAddress = await getChimoneyDepositAddress('polygon', 'USDC');
  
  const provider = new ethers.providers.JsonRpcProvider(
    'https://polygon-rpc.com'
  );
  const wallet = new ethers.Wallet(
    process.env.FLOWPAY_POLYGON_WALLET_PRIVATE_KEY,
    provider
  );
  
  const usdcContract = new ethers.Contract(
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon USDC
    ['function transfer(address to, uint256 amount) returns (bool)'],
    wallet
  );
  
  const tx = await usdcContract.transfer(
    chimoneyDepositAddress,
    ethers.utils.parseUnits(amount.toString(), 6) // USDC has 6 decimals
  );
  
  await tx.wait();
  
  // Step 2: Wait for Chimoney to credit the agent wallet
  // (Usually takes 2-5 minutes)
  await waitForChimoneyCredit(amount);
  
  return tx.hash;
}

async function getChimoneyDepositAddress(network: string, token: string) {
  // Get deposit address from Chimoney API
  // (This endpoint may vary - check Chimoney docs)
  const response = await chimoneyRequest('/v0.2.4/wallets/deposit-address', {
    method: 'POST',
    body: JSON.stringify({
      agentId: process.env.CHIMONEY_AGENT_ID,
      network,
      token,
    }),
  });
  
  return response.data.address;
}
```

---

## Implementation Steps

### Phase 1: Chimoney Setup (Week 1)

**1.1 Create Chimoney Account**
- [ ] Sign up at [chimoney.io](https://chimoney.io)
- [ ] Complete KYC verification
- [ ] Enable API access (contact support if needed)

**1.2 Generate API Credentials**
- [ ] Create API key in Developer Portal
- [ ] Save API key to `.env` file
- [ ] Test authentication with `/v0.2.4/info/assets`

**1.3 Create Agent Wallet**
- [ ] Use `POST /v0.2.4/agents/create` endpoint
- [ ] Configure transaction limits (daily caps, per-tx max)
- [ ] Set regional restrictions (target countries)
- [ ] Fund agent wallet with initial $1000 USD

**1.4 Setup Polygon Wallet**
- [ ] Create dedicated Polygon hot wallet
- [ ] Fund with MATIC for gas fees
- [ ] Get Chimoney's Polygon USDC deposit address
- [ ] Test small USDC deposit ($10)

### Phase 2: Bridge Integration (Week 2)

**2.1 XY Finance Setup**
- [ ] Sign up for XY Finance API key
- [ ] Install `@xy-finance/sdk` package
- [ ] Test quote API (Cronos → Polygon)
- [ ] Execute test bridge ($10 USDC)

**2.2 Automated Bridging Service**
- [ ] Create backend service to monitor FlowPay contract events
- [ ] Implement `bridgeCronosToPolygon()` function
- [ ] Add retry logic for failed bridges
- [ ] Setup monitoring/alerts for bridge failures

**2.3 Chimoney Funding Automation**
- [ ] Implement `fundChimoneyFromPolygon()` function
- [ ] Add balance monitoring for Polygon wallet
- [ ] Setup auto-refill from main treasury when low
- [ ] Test end-to-end: Cronos → Polygon → Chimoney

### Phase 3: Payout Implementation (Week 3)

**3.1 Database Schema Updates**
```sql
-- Add off-ramp configuration to payment intents
ALTER TABLE payment_intents ADD COLUMN payout_method VARCHAR(20); -- 'crypto', 'bank', 'mobile-money'
ALTER TABLE payment_intents ADD COLUMN payout_details JSONB;

-- Bank payout details structure
-- {
--   "accountNumber": "0123456789",
--   "bankCode": "058",
--   "fullname": "John Doe",
--   "country": "NG"
-- }

-- Mobile money details structure
-- {
--   "phoneNumber": "+254710102720",
--   "provider": "mpesa",
--   "country": "Kenya"
-- }

-- Create payouts tracking table
CREATE TABLE chimoney_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id UUID REFERENCES payment_intents(id),
  chimoney_tx_id VARCHAR(255),
  method VARCHAR(20),
  amount_usd DECIMAL(18, 2),
  status VARCHAR(20), -- 'pending', 'processing', 'completed', 'failed'
  recipient_details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

**3.2 Frontend Updates**
- [ ] Add "Receive as" option to CreateIntentForm
  - Radio buttons: Crypto / Bank Transfer / Mobile Money
- [ ] Create BankDetailsForm component (account number, bank code, name)
- [ ] Create MobileMoneyForm component (phone, provider)
- [ ] Add country selector for regional payment methods
- [ ] Update IntentCard to show payout method badge

**3.3 Backend Service Implementation**
```typescript
// services/ChimoneyPayoutService.ts
class ChimoneyPayoutService {
  async executePayment(intent: PaymentIntent, amount: number) {
    // 1. Bridge Cronos USDC → Polygon USDC
    const bridgeResult = await this.bridgeCronosToPolygon(amount);
    
    // 2. Fund Chimoney agent wallet
    await this.fundChimoneyWallet(amount);
    
    // 3. Execute payout based on recipient preference
    switch (intent.payoutMethod) {
      case 'bank':
        return await this.payoutToBank(intent.payoutDetails, amount);
      case 'mobile-money':
        return await this.payoutToMobileMoney(intent.payoutDetails, amount);
      default:
        throw new Error('Unsupported payout method');
    }
  }
}
```

**3.4 Testing**
- [ ] Test bank payout (Nigeria - GTBank)
- [ ] Test mobile money (Kenya - M-Pesa)
- [ ] Test error handling (insufficient balance, invalid account)
- [ ] Test webhook integration for status updates

### Phase 4: Webhook Integration (Week 4)

**4.1 Webhook Endpoint Setup**
- [ ] Create `/api/webhooks/chimoney` endpoint
- [ ] Implement signature verification
- [ ] Handle payout status updates
- [ ] Update database records

**4.2 Status Monitoring**
- [ ] Create dashboard for Chimoney payouts
- [ ] Add real-time status updates via WebSocket
- [ ] Implement retry logic for failed payouts
- [ ] Setup alerting for stuck transactions

---

## Code Examples

### Complete FlowPay Integration Example

```typescript
// File: /backend/services/ChimoneyIntegration.ts

import { ethers } from 'ethers';

interface PaymentIntent {
  id: string;
  recipient: string;
  amount: string;
  payoutMethod?: 'crypto' | 'bank' | 'mobile-money';
  payoutDetails?: BankDetails | MobileMoneyDetails | null;
}

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  fullname: string;
  country: string;
}

interface MobileMoneyDetails {
  phoneNumber: string;
  provider: string;
  country: string;
}

class ChimoneyIntegration {
  private apiKey: string;
  private baseUrl: string;
  private agentId: string;
  
  constructor() {
    this.apiKey = process.env.CHIMONEY_API_KEY!;
    this.baseUrl = process.env.CHIMONEY_BASE_URL || 'https://api.chimoney.io';
    this.agentId = process.env.CHIMONEY_AGENT_ID!;
  }
  
  // Make authenticated request to Chimoney API
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Chimoney API Error: ${error.error || error.message}`);
    }
    
    return response.json();
  }
  
  // Check agent wallet balance
  async getBalance(): Promise<{ currency: string; balance: number }[]> {
    const response = await this.request(`/v0.2.4/agents/${this.agentId}/balance`);
    return response.data.wallets;
  }
  
  // Fund agent wallet from Polygon USDC
  async fundWalletFromPolygon(amount: number): Promise<string> {
    // Get Chimoney's Polygon deposit address
    const depositInfo = await this.request('/v0.2.4/wallets/deposit-address', {
      method: 'POST',
      body: JSON.stringify({
        agentId: this.agentId,
        network: 'polygon',
        token: 'USDC',
      }),
    });
    
    const depositAddress = depositInfo.data.address;
    
    // Transfer USDC from FlowPay's Polygon wallet to Chimoney
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const wallet = new ethers.Wallet(process.env.POLYGON_WALLET_PRIVATE_KEY!, provider);
    
    const usdcContract = new ethers.Contract(
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon USDC
      ['function transfer(address to, uint256 amount) returns (bool)'],
      wallet
    );
    
    const tx = await usdcContract.transfer(
      depositAddress,
      ethers.utils.parseUnits(amount.toString(), 6)
    );
    
    await tx.wait();
    
    // Wait for Chimoney to credit the balance (polling)
    await this.waitForBalanceUpdate(amount);
    
    return tx.hash;
  }
  
  private async waitForBalanceUpdate(expectedAmount: number, maxRetries = 10) {
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s
      
      const balances = await this.getBalance();
      const usdBalance = balances.find(b => b.currency === 'USD')?.balance || 0;
      
      if (usdBalance >= expectedAmount) {
        return true;
      }
    }
    
    throw new Error('Timeout waiting for Chimoney balance update');
  }
  
  // Execute bank payout
  async payoutToBank(details: BankDetails, amount: number) {
    const response = await this.request('/v0.2.4/payouts/initiate-chimoney', {
      method: 'POST',
      body: JSON.stringify({
        subAccount: this.agentId,
        turnOffNotification: false,
        chimoneys: [{
          metadata: {
            bankPayout: {
              accountNumber: details.accountNumber,
              bankCode: details.bankCode,
              fullname: details.fullname,
            },
          },
          valueInUSD: amount,
          narration: `FlowPay recurring payment - ${new Date().toISOString()}`,
        }],
      }),
    });
    
    return response.data;
  }
  
  // Execute mobile money payout
  async payoutToMobileMoney(details: MobileMoneyDetails, amount: number) {
    const momoCodeMap: Record<string, string> = {
      'mpesa': 'MPS',
      'mtn': 'MTN',
      'airtel': 'ATL',
      'vodafone': 'VDF',
    };
    
    const response = await this.request('/v0.2.4/payouts/mobile-money', {
      method: 'POST',
      body: JSON.stringify({
        subAccount: this.agentId,
        turnOffNotification: false,
        momos: [{
          countryToSend: details.country,
          phoneNumber: details.phoneNumber,
          valueInUSD: amount,
          reference: `flowpay_${Date.now()}`,
          momoCode: momoCodeMap[details.provider.toLowerCase()],
          narration: 'FlowPay recurring payment',
        }],
      }),
    });
    
    return response.data;
  }
  
  // Main execution flow
  async executePayment(intent: PaymentIntent, amount: number) {
    try {
      // Step 1: Ensure sufficient balance
      const balances = await this.getBalance();
      const usdBalance = balances.find(b => b.currency === 'USD')?.balance || 0;
      
      if (usdBalance < amount) {
        // Need to fund the wallet first
        await this.fundWalletFromPolygon(amount);
      }
      
      // Step 2: Execute payout based on method
      let payoutResult;
      
      if (intent.payoutMethod === 'bank' && intent.payoutDetails) {
        payoutResult = await this.payoutToBank(
          intent.payoutDetails as BankDetails,
          amount
        );
      } else if (intent.payoutMethod === 'mobile-money' && intent.payoutDetails) {
        payoutResult = await this.payoutToMobileMoney(
          intent.payoutDetails as MobileMoneyDetails,
          amount
        );
      } else {
        throw new Error('Invalid payout method or missing details');
      }
      
      // Step 3: Log payout to database
      await db.chimoneyPayouts.create({
        intentId: intent.id,
        chimoneyTxId: payoutResult.paymentLink,
        method: intent.payoutMethod,
        amountUsd: amount,
        status: 'processing',
        recipientDetails: intent.payoutDetails,
      });
      
      return payoutResult;
    } catch (error) {
      console.error('Chimoney payout failed:', error);
      throw error;
    }
  }
}

export const chimoneyService = new ChimoneyIntegration();
```

### Usage in FlowPay Backend

```typescript
// File: /backend/services/PaymentExecutor.ts

import { chimoneyService } from './ChimoneyIntegration';
import { bridgeService } from './BridgeService';

class PaymentExecutor {
  async handleIntentExecuted(event: {
    intentId: string;
    amount: string;
    recipient: string;
  }) {
    // 1. Get intent details from database
    const intent = await db.paymentIntents.findById(event.intentId);
    
    if (!intent) {
      throw new Error(`Intent ${event.intentId} not found`);
    }
    
    const amount = parseFloat(event.amount);
    
    // 2. Check if off-ramping is needed
    if (intent.payoutMethod === 'bank' || intent.payoutMethod === 'mobile-money') {
      console.log(`Off-ramping ${amount} USDC via Chimoney...`);
      
      // 2a. Bridge Cronos USDC → Polygon USDC
      const bridgeResult = await bridgeService.bridgeCronosToPolygon(amount);
      console.log(`Bridged to Polygon: ${bridgeResult.bridgedAmount} USDC`);
      
      // 2b. Execute Chimoney payout
      const payoutResult = await chimoneyService.executePayment(intent, amount);
      console.log(`Chimoney payout initiated:`, payoutResult);
      
      // 2c. Update intent status
      await db.paymentIntents.update(event.intentId, {
        lastExecutedAt: new Date(),
        status: 'processing_payout',
      });
    } else {
      // Standard crypto payment (no off-ramping needed)
      console.log(`Direct crypto payment to ${event.recipient}`);
      
      await db.paymentIntents.update(event.intentId, {
        lastExecutedAt: new Date(),
        status: 'completed',
      });
    }
  }
}

export const paymentExecutor = new PaymentExecutor();
```

---

## Webhook Implementation

Chimoney sends webhooks for payout status updates. Implement a webhook endpoint to track payout progress:

### Webhook Endpoint

```typescript
// File: /backend/api/webhooks/chimoney.ts

import { NextRequest } from 'next/server';
import crypto from 'crypto';

interface ChimoneyWebhook {
  event: 'payout.success' | 'payout.failed' | 'payout.pending';
  data: {
    payoutId: string;
    issueID: string;
    status: string;
    amount: number;
    currency: string;
    recipient: {
      type: string;
      identifier: string;
    };
    metadata?: any;
    error?: string;
  };
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = req.headers.get('x-chimoney-signature');
    const body = await req.text();
    
    if (!verifySignature(body, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }
    
    const webhook: ChimoneyWebhook = JSON.parse(body);
    
    // 2. Handle webhook event
    switch (webhook.event) {
      case 'payout.success':
        await handlePayoutSuccess(webhook.data);
        break;
      
      case 'payout.failed':
        await handlePayoutFailed(webhook.data);
        break;
      
      case 'payout.pending':
        await handlePayoutPending(webhook.data);
        break;
      
      default:
        console.log('Unknown webhook event:', webhook.event);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  
  const secret = process.env.CHIMONEY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}

async function handlePayoutSuccess(data: ChimoneyWebhook['data']) {
  console.log('Payout successful:', data);
  
  // Update database
  await db.chimoneyPayouts.update(
    { chimoneyTxId: data.issueID },
    {
      status: 'completed',
      completedAt: new Date(),
    }
  );
  
  // Update payment intent
  const payout = await db.chimoneyPayouts.findOne({ chimoneyTxId: data.issueID });
  if (payout) {
    await db.paymentIntents.update(payout.intentId, {
      status: 'completed',
    });
  }
  
  // Send notification to user
  await notificationService.send({
    type: 'payout_success',
    userId: payout?.intentId,
    message: `Payment of $${data.amount} USD sent successfully`,
  });
}

async function handlePayoutFailed(data: ChimoneyWebhook['data']) {
  console.error('Payout failed:', data);
  
  // Update database
  await db.chimoneyPayouts.update(
    { chimoneyTxId: data.issueID },
    {
      status: 'failed',
      error: data.error,
      completedAt: new Date(),
    }
  );
  
  // Retry logic (optional)
  const payout = await db.chimoneyPayouts.findOne({ chimoneyTxId: data.issueID });
  if (payout && payout.retryCount < 3) {
    // Retry payout after 1 hour
    await schedulePayoutRetry(payout.id, 3600000);
  }
  
  // Alert admin
  await alertService.sendAdminAlert({
    type: 'payout_failed',
    message: `Chimoney payout failed: ${data.error}`,
    data,
  });
}

async function handlePayoutPending(data: ChimoneyWebhook['data']) {
  console.log('Payout pending:', data);
  
  await db.chimoneyPayouts.update(
    { chimoneyTxId: data.issueID },
    { status: 'pending' }
  );
}
```

---

## Testing Guide

### Sandbox Environment

**Chimoney Sandbox:**
```
API: https://api-v2-sandbox.chimoney.io
Dashboard: https://sandbox.chimoney.io
```

### Test Cases

#### 1. Agent Wallet Creation
```bash
curl -X POST https://api-v2-sandbox.chimoney.io/v0.2.4/agents/create \
  -H "X-API-KEY: ch_test_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "limits": {
      "USD": { "maxPerTx": 1000, "dailyCap": 10000 }
    }
  }'
```

#### 2. Bank Payout (Nigeria - Test Account)
```bash
curl -X POST https://api-v2-sandbox.chimoney.io/v0.2.4/payouts/initiate-chimoney \
  -H "X-API-KEY: ch_test_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "subAccount": "agent_test_123",
    "chimoneys": [{
      "metadata": {
        "bankPayout": {
          "accountNumber": "0123456789",
          "bankCode": "058",
          "fullname": "Test User"
        }
      },
      "valueInUSD": 10
    }]
  }'
```

#### 3. Mobile Money Payout (Kenya M-Pesa - Test)
```bash
curl -X POST https://api-v2-sandbox.chimoney.io/v0.2.4/payouts/mobile-money \
  -H "X-API-KEY: ch_test_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "momos": [{
      "countryToSend": "Kenya",
      "phoneNumber": "+254700000000",
      "valueInUSD": 5,
      "reference": "test_123",
      "momoCode": "MPS"
    }]
  }'
```

### Integration Testing Checklist

- [ ] **Wallet Creation**: Create test agent wallet successfully
- [ ] **Balance Check**: Retrieve wallet balances via API
- [ ] **Funding**: Fund agent wallet from sandbox Polygon USDC
- [ ] **Bank Payout**: Test payout to Nigerian bank (sandbox)
- [ ] **Mobile Money**: Test payout to Kenya M-Pesa (sandbox)
- [ ] **Webhooks**: Receive and process payout status webhooks
- [ ] **Error Handling**: Test insufficient balance, invalid account
- [ ] **Retry Logic**: Test automatic retry for failed payouts
- [ ] **Monitoring**: Verify database updates and notifications

---

## Production Deployment

### Pre-Launch Checklist

#### 1. Security
- [ ] Store API keys in encrypted environment variables
- [ ] Implement webhook signature verification
- [ ] Use HTTPS for all API calls
- [ ] Enable IP whitelisting for webhook endpoints
- [ ] Setup rate limiting for Chimoney API calls

#### 2. Compliance
- [ ] Complete Chimoney KYC verification
- [ ] Understand regulatory requirements for target countries
- [ ] Implement transaction monitoring for AML compliance
- [ ] Setup reporting for large transactions (>$10k USD)

#### 3. Infrastructure
- [ ] Deploy bridge monitoring service (Cronos → Polygon)
- [ ] Setup automated balance refill for Polygon wallet
- [ ] Configure alerting for:
  - Low Chimoney wallet balance (<$100)
  - Failed payouts (>3 consecutive failures)
  - Bridge transaction delays (>30 minutes)
  - Webhook processing errors

#### 4. Monitoring & Logging
- [ ] Setup Datadog/Sentry for error tracking
- [ ] Log all Chimoney API requests/responses
- [ ] Track payout success rate metrics
- [ ] Monitor bridge transaction times
- [ ] Alert on abnormal payout patterns

#### 5. Documentation
- [ ] Document payout limits for each country
- [ ] Create user guide for bank/mobile money setup
- [ ] Prepare support team with Chimoney troubleshooting guide
- [ ] Document bridge failure recovery procedures

### Production Environment Variables

```env
# Chimoney Production
CHIMONEY_API_KEY=ch_live_xxxxx
CHIMONEY_BASE_URL=https://api.chimoney.io
CHIMONEY_AGENT_ID=agent_flowpay_prod_123
CHIMONEY_WEBHOOK_SECRET=whsec_xxxxx

# Wallets
FLOWPAY_HOT_WALLET_ADDRESS=0x...
FLOWPAY_HOT_WALLET_PRIVATE_KEY=0x...
FLOWPAY_POLYGON_WALLET_PRIVATE_KEY=0x...
CHIMONEY_POLYGON_USDC_WALLET=0x...

# Bridge
XY_FINANCE_API_KEY=xy_prod_xxxxx
BRIDGE_SLIPPAGE_TOLERANCE=0.5
BRIDGE_MIN_AMOUNT_USD=10
BRIDGE_MAX_AMOUNT_USD=50000

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
DATADOG_API_KEY=xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxx
```

---

## Regional Considerations

### Africa (Primary Market)

#### Nigeria 🇳🇬
- **Population**: 220M+ (largest in Africa)
- **Payment Methods**: Bank transfers (ACH, NIBSS), Mobile Money
- **Supported Banks**: 20+ (GTBank, Access Bank, Zenith, UBA, etc.)
- **Bank Codes**: [See Chimoney Docs](https://chimoney.readme.io/reference/get_v0-2-4-info-bank-branches)
- **KYC Requirements**: Name, Account Number, BVN (for >₦50k)
- **Payout Time**: 2-10 minutes
- **Fees**: 1% (capped at ₦100)

#### Kenya 🇰🇪
- **Population**: 55M+
- **Payment Methods**: M-Pesa (dominant), Bank transfers
- **M-Pesa Coverage**: 96% of adults
- **Mobile Money Code**: `MPS`
- **Payout Time**: Instant (M-Pesa), 1-4 hours (banks)
- **Fees**: 0.5% (M-Pesa), 1% (banks)

#### Ghana 🇬🇭
- **Payment Methods**: Mobile Money (MTN, Vodafone), Banks
- **Mobile Money Codes**: `MTN`, `VDF`, `ATL`
- **Payout Time**: Instant (mobile money)
- **Fees**: 1%

#### Uganda 🇺🇬, Tanzania 🇹🇿, South Africa 🇿🇦
- Similar mobile money ecosystems
- MTN Mobile Money, Airtel Money dominant
- Bank transfer support available

### Latin America

#### Mexico 🇲🇽
- **Payment Method**: SPEI (real-time bank transfers)
- **Requirements**: 18-digit CLABE number
- **Payout Time**: Near-instant
- **Supported Currencies**: MXN (auto-converted from USD)
- **Fees**: 0.5%

#### Brazil 🇧🇷
- **Payment Methods**: PIX (instant), TED (bank transfer)
- **Requirements**: CPF (tax ID), Bank account
- **Payout Time**: Instant (PIX), 1-3 hours (TED)
- **Fees**: 1%

---

## Troubleshooting

### Common Issues

#### 1. Insufficient Balance Error
```json
{
  "status": "error",
  "error": "Insufficient balance. Current balance: $50.00"
}
```

**Solution:**
- Check agent wallet balance: `GET /v0.2.4/agents/{agentId}/balance`
- Fund wallet from Polygon USDC
- Verify bridge transaction completed

#### 2. Invalid Bank Account
```json
{
  "status": "error",
  "code": "INVALID_ACCOUNT",
  "message": "Could not verify bank account"
}
```

**Solution:**
- Verify account number format (varies by country)
- Check bank code is correct
- Ensure account holder name matches exactly

#### 3. Payout Stuck in Pending
**Symptoms:** Payout status remains `pending` for >1 hour

**Solution:**
- Check webhook logs for status updates
- Contact Chimoney support with `issueID`
- Verify webhook endpoint is accessible (HTTPS, no firewall)

#### 4. Bridge Transaction Failed
**Symptoms:** Cronos → Polygon bridge fails

**Solution:**
- Check bridge provider status (XY Finance, Symbiosis)
- Verify sufficient USDC balance on Cronos
- Ensure enough CRO for gas fees
- Check slippage tolerance (increase to 1% if needed)

#### 5. Webhook Signature Verification Failed
**Solution:**
- Verify webhook secret matches Chimoney dashboard
- Check signature header name (`x-chimoney-signature`)
- Ensure raw request body is used (not parsed JSON)

### Support Resources

- **Chimoney Docs**: [chimoney.readme.io](https://chimoney.readme.io)
- **Support Email**: support@chimoney.io
- **Discord**: [discord.gg/chimoney](https://discord.gg/chimoney)
- **Status Page**: status.chimoney.io

---

## Summary

### Key Takeaways

✅ **Chimoney enables FlowPay to:**
- Pay recipients without crypto wallets
- Support 50+ countries with bank transfers
- Enable mobile money payments (M-Pesa, MTN, etc.)
- Handle compliance and KYC automatically

✅ **Integration Flow:**
1. FlowPay executes payment on Cronos
2. Bridge USDC from Cronos → Polygon
3. Fund Chimoney agent wallet from Polygon
4. Chimoney pays recipient via bank/mobile money

✅ **Supported Payout Methods:**
- Bank transfers (50+ countries)
- Mobile money (Africa, Asia)
- SPEI (Mexico)
- Interledger (global)

✅ **Timeline:**
- Week 1: Setup Chimoney account, create agent wallet
- Week 2: Integrate bridge (Cronos → Polygon)
- Week 3: Implement payout methods (bank, mobile money)
- Week 4: Webhooks, testing, production deployment

---

## Next Steps

1. **Read**: Review Chimoney API documentation thoroughly
2. **Test**: Create sandbox account and test payouts
3. **Integrate**: Implement bridge service (Cronos → Polygon)
4. **Deploy**: Launch with Nigeria + Kenya support first
5. **Expand**: Add more countries based on user demand

**Questions?** Contact Chimoney support or FlowPay dev team.
