# Quick Start Guide - Cronos Wallet Integration

## ✅ What's Been Implemented

Your FlowPay application now has full Cronos wallet integration! Here's what's been added:

### 1. **Wallet Connection Infrastructure**
- ✅ DeFiWeb3Connector for Crypto.com DeFi Wallet Extension
- ✅ React Context API for global wallet state management
- ✅ Ethers.js v5 for blockchain interactions
- ✅ Support for both Cronos Mainnet (Chain ID: 25) and Testnet (Chain ID: 338)

### 2. **Files Created/Modified**

#### New Files:
- `src/contexts/WalletContext.tsx` - Wallet state management
- `src/lib/cronos-config.ts` - Network configurations and utilities
- `src/lib/transaction-utils.ts` - Transaction helper functions
- `WALLET_INTEGRATION.md` - Developer documentation

#### Modified Files:
- `src/App.tsx` - Wrapped with WalletProvider
- `src/components/layout/Header.tsx` - Enhanced with wallet UI
- `vite.config.ts` - Added Node.js polyfills support
- `package.json` - Added required dependencies
- `README.md` - Comprehensive project documentation

### 3. **Features Available**

✅ **Connect/Disconnect Wallet**
- One-click wallet connection
- Automatic network detection
- Secure wallet disconnection

✅ **Account Management**
- Display wallet address
- Show CRO balance in real-time
- Copy address to clipboard
- Dropdown menu with account options

✅ **Network Support**
- Cronos Mainnet (Chain ID: 25)
- Cronos Testnet (Chain ID: 338)
- Network change detection
- Automatic page reload on network switch

✅ **Responsive Design**
- Desktop wallet interface
- Mobile-friendly wallet menu
- Touch-optimized interactions

## 🚀 How to Test

### 1. Install Required Software

1. **Install Crypto.com DeFi Wallet Extension**
   - Visit: https://chrome.google.com/webstore
   - Search for "Crypto.com DeFi Wallet"
   - Install the extension
   - Set up your wallet

2. **Switch to Cronos Network**
   - Open the wallet extension
   - Select "Cronos" from the network dropdown
   - For testing, you can use Cronos Testnet

### 2. Get Test CRO (For Testnet)

If you're testing on Cronos Testnet:
- Visit: https://cronos.org/faucet
- Enter your wallet address
- Request test CRO tokens

### 3. Run the Application

```bash
cd frontend
npm run dev
```

Open http://localhost:8080 in your browser

### 4. Test Wallet Connection

1. **Click "Connect Wallet"** in the header
2. **Approve Connection** in the wallet popup
3. **Verify Connection**:
   - Your address should appear in the header
   - Your CRO balance should be displayed
   - The network name should show (Mainnet or Testnet)

4. **Test Features**:
   - Click on your wallet to see the dropdown menu
   - Try copying your address
   - Try disconnecting your wallet
   - Try reconnecting

### 5. Test Network Switching

1. Open the DeFi Wallet extension
2. Switch networks (e.g., from Mainnet to Testnet)
3. The page should automatically reload
4. Verify the new network is displayed correctly

## 🛠️ Using Wallet in Your Components

### Example: Require Wallet Connection

```tsx
import { useWallet } from '@/contexts/WalletContext';

function MyComponent() {
  const { isConnected, account, connectWallet } = useWallet();

  if (!isConnected) {
    return (
      <div>
        <p>Please connect your wallet</p>
        <button onClick={connectWallet}>Connect</button>
      </div>
    );
  }

  return <div>Welcome, {account}!</div>;
}
```

### Example: Send a Transaction

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { sendCRO } from '@/lib/transaction-utils';
import { toast } from 'sonner';

function SendCRO() {
  const { provider } = useWallet();

  const handleSend = async () => {
    if (!provider) return;
    
    try {
      const txHash = await sendCRO(
        provider,
        '0xRecipientAddress',
        '1.0' // Amount in CRO
      );
      toast.success(`Transaction sent: ${txHash}`);
    } catch (error) {
      toast.error('Transaction failed');
    }
  };

  return <button onClick={handleSend}>Send 1 CRO</button>;
}
```

## 📚 Documentation

For detailed integration instructions, see:
- `WALLET_INTEGRATION.md` - Complete developer guide
- `README.md` - Project overview and setup
- `src/lib/cronos-config.ts` - Network configurations
- `src/lib/transaction-utils.ts` - Transaction utilities

## 🔗 Useful Resources

- **Cronos Documentation**: https://docs.cronos.org
- **DeFi Wallet Guide**: https://docs.cronos.org/for-dapp-developers/chain-integration/web-extension-integration
- **Cronos Faucet**: https://cronos.org/faucet
- **Cronos Explorer (Mainnet)**: https://cronoscan.com/
- **Cronos Explorer (Testnet)**: https://testnet.cronoscan.com/

## ⚠️ Important Notes

1. **Always Test on Testnet First**
   - Use Cronos Testnet for development and testing
   - Switch to Mainnet only for production

2. **Never Commit Private Keys**
   - Keep your private keys secure
   - Never share your seed phrase

3. **Check Network Before Transactions**
   - Always verify you're on the correct network
   - Testnet transactions use test CRO (TCRO)
   - Mainnet transactions use real CRO

4. **Error Handling**
   - Always wrap blockchain calls in try-catch
   - Provide user-friendly error messages
   - Log errors for debugging

## 🐛 Troubleshooting

### Wallet Won't Connect
- Ensure DeFi Wallet extension is installed
- Check that the extension is unlocked
- Refresh the page and try again
- Check browser console for errors

### Wrong Network
- Open wallet extension
- Switch to Cronos Mainnet or Testnet
- Page will reload automatically

### Transaction Fails
- Check your CRO balance
- Ensure you're on the correct network
- Verify the recipient address
- Check gas prices

### Balance Not Showing
- Wait a few seconds for balance to load
- Refresh the page
- Check network connection
- Verify wallet is properly connected

## ✨ Next Steps

Now that wallet integration is complete, you can:

1. **Implement Intent Creation**
   - Use wallet context in CreateIntentForm
   - Sign intents with connected wallet
   - Store intent data on-chain

2. **Add Transaction Features**
   - Send payments from intents
   - Display transaction history
   - Show transaction status

3. **Integrate x402 Facilitator**
   - Install @crypto.com/facilitator-client
   - Implement programmatic payment flows
   - Add agentic decision logic

4. **Deploy Smart Contracts**
   - Deploy intent contract to Cronos
   - Connect frontend to contract
   - Test end-to-end flow

## 🎉 Success!

Your Cronos wallet integration is complete and ready to use. Happy building! 🚀
