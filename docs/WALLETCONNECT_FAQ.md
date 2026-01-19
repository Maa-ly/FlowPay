# WalletConnect & RainbowKit - Frequently Asked Questions

## Q: How does RainbowKit work without a WalletConnect API key?

### Short Answer
RainbowKit uses a **default WalletConnect API key** provided by the RainbowKit team for development purposes. However, **you should get your own API key for production** to avoid rate limiting and ensure better reliability.

---

## How WalletConnect Works

### 1. **WalletConnect Protocol**
WalletConnect is a protocol that allows your web app to connect to mobile wallets (like MetaMask Mobile, Rainbow, Trust Wallet, etc.) via QR codes or deep links.

### 2. **The Bridge/Relay Server**
WalletConnect uses a relay server to transmit messages between your app and the wallet:
- **Your App** ↔ **WalletConnect Relay** ↔ **User's Wallet**
- The relay server needs an API key to prevent abuse and rate limiting

### 3. **RainbowKit's Default Key**
RainbowKit includes a **fallback/default WalletConnect Project ID** for development:
- This allows you to test wallet connections without setup
- It's shared among all RainbowKit users
- **Not recommended for production** due to rate limits

---

## Do You Need Your Own API Key?

### ✅ **YES, for Production Apps**

**Why?**
- **Rate Limiting**: Default key is shared → if many apps use it, you might hit rate limits
- **Analytics**: Your own key gives you connection analytics on WalletConnect dashboard
- **Reliability**: Dedicated key ensures better uptime
- **Best Practice**: WalletConnect recommends it for all production apps

### ⚠️ **Optional for Development**
- The default key works fine for local testing
- Good enough for demos and prototypes

---

## How to Get Your Own WalletConnect API Key

### Step 1: Visit WalletConnect Cloud
Go to: **https://cloud.walletconnect.com**

### Step 2: Create a Free Account
- Sign up with email or GitHub
- No credit card required
- Free tier is generous (100k+ requests/month)

### Step 3: Create a New Project
1. Click "New Project"
2. Enter project name: **"FlowPay"**
3. Select project type: **"App"**

### Step 4: Copy Your Project ID
You'll get a **Project ID** (looks like: `abc123def456...`)

### Step 5: Add to Your `.env` File
```bash
# .env or .env.local
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### Step 6: Update Wagmi Config
Your code already supports this! Check [src/config/wagmi.ts](src/config/wagmi.ts):

```typescript
export const config = getDefaultConfig({
  appName: 'FlowPay',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'fallback-id',
  chains: [cronosMainnet, cronosTestnet],
  ssr: false,
});
```

The `import.meta.env.VITE_WALLETCONNECT_PROJECT_ID` reads from your `.env` file!

---

## How Wallet Connection Works

### Connection Flow

```
┌──────────────┐         ┌─────────────────┐         ┌──────────────┐
│   FlowPay    │         │  WalletConnect  │         │ User's Wallet│
│   Website    │  ◄─────►│     Relay       │  ◄─────►│  (MetaMask)  │
└──────────────┘         └─────────────────┘         └──────────────┘
```

### Step-by-Step:

1. **User Clicks "Connect Wallet"**
   - RainbowKit modal opens
   - Shows available wallet options (MetaMask, WalletConnect, Coinbase, etc.)

2. **User Selects a Wallet**
   - **Browser Extension** (MetaMask): Direct connection via injected provider
   - **Mobile Wallet**: QR code shown → user scans with wallet app
   - **WalletConnect**: Uses relay server with your API key

3. **Connection Established**
   - Wallet sends account address and chain ID
   - Your app receives the connection via Wagmi hooks

4. **Session Persisted**
   - Connection saved in browser's LocalStorage
   - Auto-reconnects on page refresh
   - Session lasts until user disconnects or session expires

---

## Wallet Connection in Your Code

### 1. **Wagmi Config** ([src/config/wagmi.ts](src/config/wagmi.ts))
```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { cronosMainnet, cronosTestnet } from './chains';

export const config = getDefaultConfig({
  appName: 'FlowPay',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [cronosMainnet, cronosTestnet],
  ssr: false,
});
```

### 2. **Providers in App** ([src/App.tsx](src/App.tsx))
```typescript
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider theme={customTheme}>
      {/* Your app */}
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

### 3. **Using Connection State**
```typescript
import { useAccount, useDisconnect } from 'wagmi';

function MyComponent() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) return <p>Please connect wallet</p>;

  return (
    <div>
      <p>Connected: {address}</p>
      <p>Chain: {chain?.name}</p>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
```

---

## Current FlowPay Setup

### What's Already Configured

✅ **RainbowKit** - Wallet connection UI
✅ **Wagmi v2** - React hooks for Ethereum
✅ **Viem** - TypeScript Ethereum library
✅ **Custom Cronos Chains** - Mainnet (25) and Testnet (338)
✅ **Green Theme** - Custom RainbowKit branding
✅ **Environment Variable Support** - Ready for your WalletConnect Project ID

### What You Need to Do

1. **Get WalletConnect Project ID** (5 minutes)
   - Visit https://cloud.walletconnect.com
   - Create project
   - Copy Project ID

2. **Add to `.env` File**
   ```bash
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. **Restart Dev Server**
   ```bash
   npm run dev
   ```

That's it! Your app will now use your dedicated API key.

---

## Wallet Storage & Security

### Where Connection Data is Stored

1. **Browser LocalStorage**
   - Wallet address
   - Chain ID
   - Session data
   - **NOT stored**: Private keys (those stay in the wallet!)

2. **Session Storage**
   - Temporary connection data
   - Cleared when tab/browser closes

### Security Best Practices

✅ **Never store private keys** - They stay in user's wallet
✅ **Use HTTPS** - Always in production
✅ **Session expiration** - WalletConnect sessions expire after 7 days
✅ **User approval** - Every transaction requires user approval in their wallet

---

## Supported Wallets

### Browser Extensions (Direct Connection)
- MetaMask
- Coinbase Wallet
- Brave Wallet
- Rainbow

### Mobile Wallets (via WalletConnect)
- MetaMask Mobile
- Trust Wallet
- Rainbow
- Argent
- Gnosis Safe
- 300+ more wallets

### How It Detects Wallets
RainbowKit automatically detects:
- Installed browser extensions
- Available WalletConnect-compatible wallets

---

## Common Issues & Solutions

### Issue: "Unsupported Chain"
**Solution**: Switch to Cronos Mainnet (25) or Testnet (338) in your wallet

### Issue: "Connection Failed"
**Solutions**:
- Check internet connection
- Disable VPN (some wallets don't work with VPNs)
- Clear browser cache and try again
- Update wallet to latest version

### Issue: "Rate Limit Exceeded"
**Solution**: Get your own WalletConnect Project ID (see above)

### Issue: "Wallet Not Detected"
**Solutions**:
- Install the wallet extension
- Refresh the page
- Try WalletConnect option instead

---

## Testing Your Connection

### Local Development
1. Start dev server: `npm run dev`
2. Open http://localhost:8080
3. Click "Connect Wallet"
4. Select wallet and approve connection
5. Check browser console for connection logs

### Production
1. Deploy to Vercel/Netlify
2. Add `VITE_WALLETCONNECT_PROJECT_ID` to environment variables
3. Test with multiple wallets
4. Monitor analytics on WalletConnect dashboard

---

## Resources

### Official Documentation
- **WalletConnect Cloud**: https://cloud.walletconnect.com
- **RainbowKit Docs**: https://www.rainbowkit.com
- **Wagmi Docs**: https://wagmi.sh
- **Viem Docs**: https://viem.sh

### FlowPay Docs
- [WALLET_GUIDE.md](WALLET_GUIDE.md) - Complete Wagmi hooks guide
- [Project-overview.md](Project-overview.md) - Technical architecture
- [README.md](README.md) - Project overview

---

## Summary

| Question | Answer |
|----------|--------|
| **Do I need WalletConnect API key?** | Optional for dev, **required for production** |
| **How does it work without API?** | RainbowKit provides default fallback key |
| **Where to get API key?** | https://cloud.walletconnect.com (free) |
| **How is wallet handled?** | Via Wagmi hooks + RainbowKit UI |
| **Where is data stored?** | Browser LocalStorage (no private keys) |
| **Is it secure?** | Yes - private keys never leave wallet |
| **Cost?** | Free tier: 100k+ requests/month |

---

**Ready to deploy?** Get your WalletConnect Project ID today! 🚀

