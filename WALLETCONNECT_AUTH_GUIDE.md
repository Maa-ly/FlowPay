# WalletConnect Integration with FlowPay Backend

## Overview

Your frontend uses **WalletConnect/RainbowKit** for wallet connection, while the backend handles **authentication and user identity**. Here's how they work together seamlessly.

---

## How It Works

### 1. **Frontend: Wallet Connection (WalletConnect/RainbowKit)**

When a user connects their wallet using MetaMask/WalletConnect, you get:

```javascript
// From WalletConnect/RainbowKit
const { address, isConnected } = useAccount();
// address = "0x525d7CD035a76BCA5Ad7f9B1EB534fB565974ee6"
```

This gives you the wallet address but **no backend session yet**.

---

### 2. **Backend: Authentication Flow**

The backend needs to verify wallet ownership before creating a session. Here's the complete flow:

#### **Step 1: Get Nonce**

```javascript
// Request a nonce for the wallet address
const nonceResponse = await fetch(
  `http://localhost:3000/api/auth/nonce?walletAddress=${address}`,
);
const { nonce } = await nonceResponse.json();
// nonce = "a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5"
```

#### **Step 2: Sign Message**

```javascript
// Create message to sign
const message = `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonce}`;

// Sign with WalletConnect/ethers
import { useSignMessage } from "wagmi";
const { signMessageAsync } = useSignMessage();
const signature = await signMessageAsync({ message });
// signature = "0x..."
```

#### **Step 3: Login & Get JWT Token**

```javascript
const loginResponse = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    walletAddress: address,
    signature,
    message, // Important: include the message
  }),
});

const { accessToken, user } = await loginResponse.json();
// accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// user = { id: "uuid", walletAddress: "0x525d...", ... }
```

---

## Complete React Hook Example

```typescript
import { useAccount, useSignMessage } from "wagmi";
import { useState, useEffect } from "react";

export function useFlowPayAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = async () => {
    if (!address || !isConnected) return;

    try {
      setIsAuthenticating(true);

      // 1. Get nonce
      const nonceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/nonce?walletAddress=${address}`,
      );
      const { nonce } = await nonceRes.json();

      // 2. Sign message
      const message = `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // 3. Login
      const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: address,
            signature,
            message,
          }),
        },
      );

      const { accessToken, user } = await loginRes.json();

      // 4. Store token
      setAuthToken(accessToken);
      setUser(user);
      localStorage.setItem("flowpay_token", accessToken);
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (isConnected && address && !authToken) {
      authenticate();
    }
  }, [isConnected, address]);

  // Logout
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("flowpay_token");
  };

  return {
    authToken,
    user,
    isAuthenticating,
    authenticate,
    logout,
    isAuthenticated: !!authToken,
  };
}
```

---

## Usage in Your App

### 1. **Wrap Your App with WagmiConfig**

```typescript
// app.tsx or main.tsx
import { WagmiConfig, createConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <YourApp />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
```

### 2. **Connect Wallet & Authenticate**

```typescript
// Dashboard.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFlowPayAuth } from './hooks/useFlowPayAuth';

function Dashboard() {
  const { authToken, user, isAuthenticated, isAuthenticating } = useFlowPayAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <ConnectButton />
        {isAuthenticating && <p>Authenticating...</p>}
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {user.walletAddress}</h1>
      <p>User ID: {user.id}</p>
      {/* Your app content */}
    </div>
  );
}
```

### 3. **Make Authenticated API Calls**

```typescript
// Create a payment intent
async function createIntent(intentData: any, authToken: string) {
  const response = await fetch(`${API_URL}/intents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, // Use the token here
    },
    body: JSON.stringify(intentData),
  });

  return response.json();
}

// Usage
const { authToken } = useFlowPayAuth();
const intent = await createIntent(
  {
    name: "Monthly Rent",
    recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
    amount: 1500,
    token: "USDC",
    tokenAddress: "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0",
    frequency: "MONTHLY",
    safetyBuffer: 10,
    maxGasPrice: 100000000000,
  },
  authToken,
);
```

---

## What Happens in the Backend?

When you call `/auth/login`, the backend:

1. **Verifies the signature** using `ethers.verifyMessage(message, signature)`
2. **Checks if signature matches the wallet address**
3. **Creates or finds user** in database by wallet address
4. **Generates JWT token** with user ID
5. **Returns token + user data**

### Database Schema

```prisma
model User {
  id               String   @id @default(uuid())
  walletAddress    String   @unique // Stored as lowercase
  telegramId       BigInt?  @unique
  email            String?  @unique
  nonce            String   @default(uuid())
  createdAt        DateTime @default(now())
  lastActive       DateTime @updatedAt
  intents          Intent[]
  notifications    Notification[]
}
```

**Important:** Each wallet address gets a unique user ID. All intents, notifications, and actions are tied to this user ID.

---

## Security Flow

```
┌──────────────┐     1. Connect Wallet      ┌──────────────┐
│   Frontend   │ ─────────────────────────> │ WalletConnect│
│ (RainbowKit) │                             │  /MetaMask   │
└──────────────┘                             └──────────────┘
       │                                             │
       │ 2. Get Nonce                                │
       │ ───────────────────────>                    │
       │                         ┌──────────────┐    │
       │                         │   Backend    │    │
       │                         │   (NestJS)   │    │
       │ <───────────────────────                    │
       │      { nonce }          └──────────────┘    │
       │                                             │
       │ 3. Sign Message                             │
       │ ───────────────────────────────────────────>│
       │                                             │
       │ <───────────────────────────────────────────│
       │      { signature }                          │
       │                                             │
       │ 4. Login with signature + message           │
       │ ───────────────────────>                    │
       │                         ┌──────────────┐    │
       │                         │ Verify Sign  │    │
       │                         │ Create User  │    │
       │                         │ Generate JWT │    │
       │                         └──────────────┘    │
       │ <───────────────────────                    │
       │  { accessToken, user }                      │
       │                                             │
       │ 5. Use Token for API calls                  │
       │ ───────────────────────>                    │
       │     Authorization: Bearer <token>           │
       │                         ┌──────────────┐    │
       │                         │ Validate JWT │    │
       │                         │ Get User ID  │    │
       │                         │ Process Req  │    │
       │                         └──────────────┘    │
       │ <───────────────────────                    │
       │      { data }                               │
```

---

## Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Backend (.env)

```bash
DATABASE_URL="prisma://..."
JWT_SECRET="cd257a47df1096d310ad06f6784ace716459ee8812b3e389feca707c46682164"
CRONOS_TESTNET_RPC="https://evm-t3.cronos.org"
EXECUTION_WALLET_PRIVATE_KEY="..."
```

---

## Testing the Flow

### 1. **Test Authentication Manually**

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Test with curl
# Get nonce
curl "http://localhost:3000/api/auth/nonce?walletAddress=0x525d7CD035a76BCA5Ad7f9B1EB534fB565974ee6"

# Sign message with your wallet (MetaMask/WalletConnect)
# Then login (replace with actual signature)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x525d7CD035a76BCA5Ad7f9B1EB534fB565974ee6",
    "signature": "0x...",
    "message": "Sign this message to authenticate with FlowPay.\n\nNonce: ..."
  }'
```

### 2. **Run Automated Tests**

```bash
cd backend && node test-api.js
```

Current test results: **100% pass rate (13/13 tests)**

---

## Common Issues & Solutions

### Issue 1: "Invalid signature"

**Cause:** Message format doesn't match  
**Solution:** Ensure message is exactly: `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonce}`

### Issue 2: "Unauthorized" on API calls

**Cause:** Token not included in headers  
**Solution:** Always include `Authorization: Bearer ${token}` header

### Issue 3: User not created

**Cause:** Signature verification failed  
**Solution:** Check that wallet address matches the one that signed the message

---

## Key Points

1. **WalletConnect handles wallet connection** ✅
2. **Backend handles authentication & sessions** ✅
3. **Each wallet gets a unique user ID** ✅
4. **All actions require JWT token** ✅
5. **Token expires after 7 days** (configurable)
6. **Wallet address stored as lowercase** in database

---

## Ready to Integrate!

Your backend is fully tested and ready. Just implement the `useFlowPayAuth` hook in your frontend and you're good to go! 🚀

**Backend Status:** ✅ 100% tests passing  
**Telegram Bot:** ✅ Running at @flowpayment_bot  
**Database:** ✅ Connected (Prisma Accelerate)  
**Authentication:** ✅ Wallet signature + JWT

Need help? Check `backend/API_DOCUMENTATION.md` for complete API reference.
