# Why Do We Need a Polygon Wallet?

## Understanding the Chimoney Off-Ramp Architecture

### The Problem

When users want to cash out cryptocurrency to fiat (mobile money or bank transfer), we face several challenges:

1. **Chimoney only accepts payments from Polygon network** (not Cronos)
2. **Users' funds are on Cronos network** (where FlowPay operates)
3. **Cross-chain transfers are complex and costly**

### The "Shadow Bridge" Solution

Instead of building a real cross-chain bridge (which would be expensive and complex), we use a **Shadow Bridge** architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    SHADOW BRIDGE FLOW                        │
└─────────────────────────────────────────────────────────────┘

User on Cronos                FlowPay Backend           Chimoney API
      │                              │                        │
      │  1. Request Cash-out         │                        │
      │  (100 USDC to Mobile Money) │                        │
      ├─────────────────────────────>│                        │
      │                              │                        │
      │                              │  2. Lock USDC on       │
      │                              │     Cronos (escrow)    │
      │                              │                        │
      │  3. Lock 100 USDC            │                        │
      │     in Intent Contract       │                        │
      │<─────────────────────────────┤                        │
      │                              │                        │
      │                              │  4. Release equivalent │
      │                              │     100 USDC from      │
      │                              │     Polygon Treasury   │
      │                              │                        │
      │                              │  5. Send Payout Request│
      │                              ├───────────────────────>│
      │                              │     (from Polygon)     │
      │                              │                        │
      │                              │  6. Chimoney receives  │
      │                              │     payment on Polygon │
      │                              │<───────────────────────┤
      │                              │                        │
      │  7. Chimoney pays user       │                        │
      │     via mobile money         │                        │
      │<─────────────────────────────┴────────────────────────┤
```

### Why Polygon?

1. **Chimoney Integration**: Chimoney's crypto acceptance is built on Polygon network
2. **Lower Gas Fees**: Polygon has cheaper transaction costs than Ethereum
3. **Faster Confirmations**: Polygon provides quick transaction finality
4. **Stablecoin Support**: USDC is widely available on Polygon

### The Treasury Wallet

The **Polygon Treasury Wallet** serves as:

- **Liquidity Pool**: Pre-funded with USDC on Polygon to pay Chimoney
- **Escrow Counterpart**: When users lock USDC on Cronos, equivalent is released from Polygon
- **Rebalancing Required**: Needs periodic top-ups to maintain liquidity

### How It Works (Technical)

1. **User initiates off-ramp** on Cronos
   - FlowPay backend executes intent
   - USDC locked in Intent contract on Cronos

2. **Backend triggers Chimoney payout**
   - Uses Polygon treasury wallet private key
   - Sends USDC to Chimoney on Polygon network
   - Includes user's mobile money/bank details

3. **Chimoney processes payout**
   - Receives USDC on Polygon
   - Converts to local currency
   - Sends fiat to user's mobile money or bank

4. **Settlement** (manual for now)
   - Cronos escrow accumulates USDC
   - Periodically rebalance: bridge Cronos → Polygon
   - Refill Polygon treasury wallet

### Current Status: Webhook Pending

⚠️ **Important**: The Chimoney implementation is **OPTIONAL** for now because:

- Your Chimoney profile is not yet verified
- Webhook configuration is required for production
- Off-ramp feature can be disabled until ready

### Alternative: Direct Bridge (Not Recommended)

We could use a real cross-chain bridge for each transaction:

```
User → Bridge Cronos to Polygon → Pay Chimoney → Cash out
```

**Why we don't do this:**

- High bridge fees ($5-20 per transaction)
- 10-30 minute bridge delays
- Complex UX (multiple confirmation steps)
- More points of failure

### Configuration

For off-ramp to work, you need in `.env`:

```bash
# Chimoney Off-Ramp (OPTIONAL)
CHIMONEY_API_KEY=your_chimoney_api_key
CHIMONEY_WEBHOOK_SECRET=your_webhook_secret

# Polygon Treasury Wallet (OPTIONAL)
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_CHAIN_ID=137
POLYGON_TREASURY_WALLET_PRIVATE_KEY=your_polygon_wallet_private_key
POLYGON_USDC_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
```

### Security Notes

1. **Treasury Wallet**: Only needs enough USDC for daily off-ramp volume
2. **Private Key**: Store securely in environment variables
3. **Monitoring**: Track treasury balance and alert when low
4. **Rebalancing**: Set up alerts for when treasury needs refilling

### Future Improvements

1. **Automatic Rebalancing**: Bridge from Cronos escrow to Polygon treasury automatically
2. **Multi-Network Support**: Support Chimoney on multiple chains
3. **Liquidity Providers**: Allow LPs to provide treasury liquidity for fees
4. **Direct Integration**: If Chimoney adds Cronos support, eliminate the bridge entirely

## Summary

**You need a Polygon wallet because:**

- Chimoney only accepts crypto payments on Polygon
- FlowPay operates on Cronos
- The shadow bridge keeps UX simple and costs low
- Treasury wallet acts as the Polygon-side liquidity pool

**For now, you can skip this** since your Chimoney profile isn't verified. When ready to enable off-ramps, fund the Polygon treasury wallet with USDC.
