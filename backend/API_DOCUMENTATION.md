# FlowPay Backend API Documentation

**Base URL**: `http://localhost:3000/api` (Development)  
**Production URL**: `https://your-domain.com/api`

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Intents](#intents)
- [Notifications](#notifications)
- [Telegram](#telegram)
- [Chimoney](#chimoney)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### Overview

FlowPay uses wallet-based authentication with EIP-712 signatures. Users sign a message with their wallet, and the backend verifies the signature to issue a JWT token.

### 1. Get Nonce

**Endpoint**: `GET /api/auth/nonce?walletAddress=0x...`  
**Description**: Get a nonce for wallet authentication  
**Authentication**: None

**Query Parameters**:

- `walletAddress` (string, required): The user's wallet address

**Response** (200 OK):

```json
{
  "nonce": "a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5"
}
```

**Example (JavaScript)**:

```javascript
const response = await fetch(`http://localhost:3000/api/auth/nonce?walletAddress=${account}`);
const { nonce } = await response.json(););
const { nonce } = await response.json();
```

---

### 2. Login with Wallet

**Endpoint**: `POST /api/auth/login`  
**Description**: Verify signature and get JWT token  
**Authentication**: None

**Request Body**:

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
  "signature": "0x...",
  "message": "Sign this message to authenticate with FlowPay.\n\nNonce: ..."
}
```

**Message to Sign**:

```
Sign this message to authenticate with FlowPay.

Nonce: {nonce}
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
    "telegramId": null
  }
}
```

**Example (JavaScript with ethers.js)**:

```javascript
import { ethers } from 'ethers';

// 1. Get nonce
const nonceResponse = await fetch(`http://localhost:3000/api/auth/nonce?walletAddress=${account}`);
const { nonce } = await nonceResponse.json();

// 2. Sign message
const message = `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonce}`;
const signature = await signer.signMessage(message);

// 3. Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: account,
    signature,
    message
  })
});
  body: JSON.stringify({
    walletAddress: account,
    signature: signature
  })
});
const { accessToken, user } = await loginResponse.json();

// Store token for future requests
localStorage.setItem('authToken', accessToken);
```

---

### 3. Get Profile

**Endpoint**: `GET /api/auth/profile`  
**Description**: Get current user profile  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "id": "uuid",
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
  "telegramId": "123456789",
  "telegramUsername": "johndoe",
  "email": null,
  "nonce": "...",
  "createdAt": "2026-01-23T10:00:00.000Z",
  "lastActive": "2026-01-23T14:30:00.000Z"
}
```

**Example**:

```javascript
const response = await fetch("http://localhost:3000/api/auth/profile", {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});
const profile = await response.json();
```

---

### 4. Link Telegram Account

**Endpoint**: `POST /api/auth/link-telegram`  
**Description**: Link Telegram account to wallet  
**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "telegramId": "123456789",
  "telegramUsername": "johndoe"
}
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
  "telegramId": "123456789",
  "telegramUsername": "johndoe"
}
```

---

## Users

### 1. Get User Profile

**Endpoint**: `GET /api/users/profile`  
**Description**: Get detailed user profile  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "id": "uuid",
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
  "telegramId": "123456789",
  "telegramUsername": "johndoe",
  "createdAt": "2026-01-23T10:00:00.000Z",
  "lastActive": "2026-01-23T14:30:00.000Z",
  "_count": {
    "intents": 5,
    "notifications": 12
  }
}
```

---

## Intents

### 1. Create Intent

**Endpoint**: `POST /api/intents`  
**Description**: Create a new payment intent  
**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "name": "Monthly Subscription",
  "description": "Netflix subscription payment",
  "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
  "amount": "15.99",
  "token": "USDC",
  "tokenAddress": "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0",
  "frequency": "MONTHLY",
  "safetyBuffer": "5.0",
  "maxGasPrice": "100000000000",
  "timeWindowStart": "09:00",
  "timeWindowEnd": "17:00",
  "isOffRamp": false,
  "offRampDetails": null
}
```

**Frequency Options**:

- `ONCE` - Execute once
- `DAILY` - Every day
- `WEEKLY` - Every week
- `MONTHLY` - Every month
- `YEARLY` - Every year

**Off-Ramp Details** (optional, for fiat payouts):

```json
{
  "isOffRamp": true,
  "offRampDetails": {
    "type": "MOBILE_MONEY",
    "phoneNumber": "+254712345678",
    "country": "KE",
    "provider": "MPESA"
  }
}
```

**Response** (201 Created):

```json
{
  "id": "uuid",
  "userId": "uuid",
  "onChainId": null,
  "name": "Monthly Subscription",
  "description": "Netflix subscription payment",
  "recipient": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
  "amount": "15.99",
  "token": "USDC",
  "tokenAddress": "0xc01efaaf7c5c61bebfaeb358e1161b537b8bc0e0",
  "frequency": "MONTHLY",
  "status": "ACTIVE",
  "safetyBuffer": "5.0",
  "maxGasPrice": "100000000000",
  "timeWindowStart": "09:00",
  "timeWindowEnd": "17:00",
  "nextExecution": "2026-02-23T12:00:00.000Z",
  "lastExecution": null,
  "executionCount": 0,
  "failureCount": 0,
  "isOffRamp": false,
  "offRampDetails": null,
  "createdAt": "2026-01-23T14:30:00.000Z",
  "updatedAt": "2026-01-23T14:30:00.000Z"
}
```

**Example**:

```javascript
const createIntent = async (intentData) => {
  const response = await fetch("http://localhost:3000/api/intents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(intentData),
  });
  return await response.json();
};
```

---

### 2. List User Intents

**Endpoint**: `GET /api/intents`  
**Description**: Get all intents for current user  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "name": "Monthly Subscription",
    "recipient": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
    "amount": "15.99",
    "token": "USDC",
    "frequency": "MONTHLY",
    "status": "ACTIVE",
    "nextExecution": "2026-02-23T12:00:00.000Z",
    "executionCount": 3,
    "failureCount": 0,
    "createdAt": "2026-01-23T14:30:00.000Z"
  }
]
```

---

### 3. Get Intent Details

**Endpoint**: `GET /api/intents/:id`  
**Description**: Get detailed information about a specific intent  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "id": "uuid",
  "userId": "uuid",
  "onChainId": "12345",
  "name": "Monthly Subscription",
  "description": "Netflix subscription payment",
  "recipient": "0x742d35cc6634c0532925a3b844bc9e7595f0beb5",
  "amount": "15.99",
  "token": "USDC",
  "tokenAddress": "0xc01efaaf7c5c61bebfaeb358e1161b537b8bc0e0",
  "frequency": "MONTHLY",
  "status": "ACTIVE",
  "safetyBuffer": "5.0",
  "maxGasPrice": "100000000000",
  "timeWindowStart": "09:00",
  "timeWindowEnd": "17:00",
  "nextExecution": "2026-02-23T12:00:00.000Z",
  "lastExecution": "2026-01-23T12:00:00.000Z",
  "executionCount": 3,
  "failureCount": 0,
  "executions": [
    {
      "id": "uuid",
      "status": "SUCCESS",
      "txHash": "0x...",
      "gasUsed": "150000",
      "gasPrice": "50000000000",
      "executedAt": "2026-01-23T12:00:00.000Z"
    }
  ]
}
```

---

### 4. Pause Intent

**Endpoint**: `PATCH /api/intents/:id/pause`  
**Description**: Pause an active intent  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "id": "uuid",
  "status": "PAUSED",
  "updatedAt": "2026-01-23T14:35:00.000Z"
}
```

---

### 5. Resume Intent

**Endpoint**: `PATCH /api/intents/:id/resume`  
**Description**: Resume a paused intent  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "id": "uuid",
  "status": "ACTIVE",
  "nextExecution": "2026-02-23T12:00:00.000Z",
  "updatedAt": "2026-01-23T14:36:00.000Z"
}
```

---

### 6. Delete Intent

**Endpoint**: `DELETE /api/intents/:id`  
**Description**: Delete an intent  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "message": "Intent deleted successfully",
  "id": "uuid"
}
```

---

## Notifications

### 1. List Notifications

**Endpoint**: `GET /api/notifications`  
**Description**: Get all notifications for current user  
**Authentication**: Required (Bearer token)

**Query Parameters**:

- `unreadOnly` (boolean): Only show unread notifications
- `limit` (number): Limit number of results (default: 50)
- `offset` (number): Offset for pagination (default: 0)

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "INTENT_EXECUTED",
    "title": "Intent Executed Successfully",
    "message": "Your Monthly Subscription payment was executed",
    "data": {
      "intentId": "uuid",
      "txHash": "0x...",
      "amount": "15.99"
    },
    "read": false,
    "sentAt": "2026-01-23T12:00:00.000Z"
  }
]
```

**Notification Types**:

- `INTENT_CREATED` - Intent was created
- `INTENT_EXECUTED` - Intent was executed successfully
- `INTENT_FAILED` - Intent execution failed
- `INTENT_PAUSED` - Intent was paused
- `LOW_BALANCE` - Wallet balance is low
- `HIGH_GAS` - Gas price is too high

---

### 2. Get Unread Count

**Endpoint**: `GET /api/notifications/unread-count`  
**Description**: Get count of unread notifications  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "count": 5
}
```

---

### 3. Mark Notification as Read

**Endpoint**: `PATCH /api/notifications/:id/read`  
**Description**: Mark a notification as read  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "id": "uuid",
  "read": true
}
```

---

### 4. Mark All as Read

**Endpoint**: `PATCH /api/notifications/read-all`  
**Description**: Mark all notifications as read  
**Authentication**: Required (Bearer token)

**Response** (200 OK):

```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

---

## Telegram

### Webhook

**Endpoint**: `POST /api/telegram/webhook`  
**Description**: Receive Telegram webhook updates  
**Authentication**: None (verified via Telegram secret)

**Note**: This endpoint is used by Telegram servers. Frontend doesn't need to call this.

---

## Chimoney

### Webhook

**Endpoint**: `POST /api/chimoney/webhook`  
**Description**: Receive Chimoney webhook updates  
**Authentication**: None (verified via Chimoney secret)

**Note**: This endpoint is used by Chimoney servers. Frontend doesn't need to call this.

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Code | Meaning               | Description                       |
| ---- | --------------------- | --------------------------------- |
| 200  | OK                    | Request successful                |
| 201  | Created               | Resource created successfully     |
| 400  | Bad Request           | Invalid request data              |
| 401  | Unauthorized          | Missing or invalid authentication |
| 403  | Forbidden             | Insufficient permissions          |
| 404  | Not Found             | Resource not found                |
| 429  | Too Many Requests     | Rate limit exceeded               |
| 500  | Internal Server Error | Server error                      |

### Example Error Responses

**401 Unauthorized**:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**400 Bad Request**:

```json
{
  "statusCode": 400,
  "message": ["amount must be a positive number"],
  "error": "Bad Request"
}
```

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "Intent not found",
  "error": "Not Found"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Header**: `X-RateLimit-Remaining` shows remaining requests
- **Response**: `429 Too Many Requests` when exceeded

---

## Frontend Integration Guide

### Setup

```javascript
// config/api.js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiClient = {
  get: async (endpoint, useAuth = false) => {
    const headers = { "Content-Type": "application/json" };
    if (useAuth) {
      const token = localStorage.getItem("authToken");
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  post: async (endpoint, data, useAuth = false) => {
    const headers = { "Content-Type": "application/json" };
    if (useAuth) {
      const token = localStorage.getItem("authToken");
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  patch: async (endpoint, data, useAuth = true) => {
    const headers = { "Content-Type": "application/json" };
    if (useAuth) {
      const token = localStorage.getItem("authToken");
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },

  delete: async (endpoint, useAuth = true) => {
    const headers = { "Content-Type": "application/json" };
    if (useAuth) {
      const token = localStorage.getItem("authToken");
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  },
};
```

### Authentication Hook

```javascript
// hooks/useAuth.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { apiClient } from "../config/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const profile = await apiClient.get("/auth/profile", true);
      setUser(profile);
    } catch (error) {
      logout();
    }
  };

  const login = async (signer, account) => {
    setLoading(true);
    try {
      // Get nonce
      const { nonce } = await apiClient.post("/auth/nonce", {
        walletAddress: account,
      });

      // Sign message
      const message = `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // Login
      const { accessToken, user } = await apiClient.post("/auth/login", {
        walletAddress: account,
        signature,
      });

      localStorage.setItem("authToken", accessToken);
      setToken(accessToken);
      setUser(user);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  return { user, token, loading, login, logout };
};
```

### Intents Hook

```javascript
// hooks/useIntents.js
import { useState, useEffect } from "react";
import { apiClient } from "../config/api";

export const useIntents = () => {
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIntents = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/intents", true);
      setIntents(data);
    } catch (error) {
      console.error("Fetch intents error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createIntent = async (intentData) => {
    try {
      const intent = await apiClient.post("/intents", intentData, true);
      setIntents([...intents, intent]);
      return intent;
    } catch (error) {
      console.error("Create intent error:", error);
      throw error;
    }
  };

  const pauseIntent = async (intentId) => {
    try {
      const updated = await apiClient.patch(
        `/intents/${intentId}/pause`,
        null,
        true,
      );
      setIntents(intents.map((i) => (i.id === intentId ? updated : i)));
      return updated;
    } catch (error) {
      console.error("Pause intent error:", error);
      throw error;
    }
  };

  const resumeIntent = async (intentId) => {
    try {
      const updated = await apiClient.patch(
        `/intents/${intentId}/resume`,
        null,
        true,
      );
      setIntents(intents.map((i) => (i.id === intentId ? updated : i)));
      return updated;
    } catch (error) {
      console.error("Resume intent error:", error);
      throw error;
    }
  };

  const deleteIntent = async (intentId) => {
    try {
      await apiClient.delete(`/intents/${intentId}`, true);
      setIntents(intents.filter((i) => i.id !== intentId));
    } catch (error) {
      console.error("Delete intent error:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  return {
    intents,
    loading,
    createIntent,
    pauseIntent,
    resumeIntent,
    deleteIntent,
    refetch: fetchIntents,
  };
};
```

---

## Telegram Bot Integration

The backend provides endpoints that the Telegram bot can use:

### Bot Can Use These Endpoints:

1. **Link User**: `POST /auth/link-telegram`
   - Links Telegram ID to wallet address
   - Requires user to authenticate with wallet first

2. **Get User Intents**: `GET /intents`
   - Show user their intents in Telegram
   - Requires auth token from wallet login

3. **Create Intent**: `POST /intents`
   - Create intent via Telegram bot
   - User must authenticate first

### Bot Flow:

1. User sends `/start` to bot
2. Bot generates unique link with code
3. User connects wallet on web app
4. Web app calls `/auth/link-telegram` with code
5. Bot can now send notifications via Telegram

**Note**: Full bot integration requires webhook setup in production.

---

## Testing

Run the API test suite:

```bash
cd backend
node test-api.js
```

This will test all endpoints and provide a comprehensive report.

---

## Production Deployment

### Environment Variables

Required for production:

```bash
# Database
DATABASE_URL="prisma+postgres://..."

# Security
JWT_SECRET="generate_with_crypto.randomBytes(32)"
JWT_EXPIRES_IN="7d"

# Blockchain
EXECUTION_WALLET_PRIVATE_KEY="0x..."
CRONOS_RPC_URL="https://evm.cronos.org"

# Telegram
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_WEBHOOK_URL="https://api.yourdom.com/api/telegram/webhook"

# Optional
CHIMONEY_API_KEY="..."
CHIMONEY_WEBHOOK_SECRET="..."
```

### CORS Configuration

Update in `main.ts`:

```typescript
app.enableCors({
  origin: [
    "https://yourfrontend.com",
    "http://localhost:5173", // dev only
  ],
  credentials: true,
});
```

---

## Support

For issues or questions:

- Check `IMPLEMENTATION_COMPLETE.md`
- Run `node test-api.js` to verify backend
- Check backend logs for errors
- Verify JWT token is being sent correctly

---

**Last Updated**: January 23, 2026  
**API Version**: 1.0.0
