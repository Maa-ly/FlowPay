# Cronos Wallet Integration Guide

This document explains how to use the Cronos wallet integration in your components.

## Table of Contents

1. [Using the Wallet Hook](#using-the-wallet-hook)
2. [Wallet Context API](#wallet-context-api)
3. [Network Configuration](#network-configuration)
4. [Common Use Cases](#common-use-cases)
5. [Error Handling](#error-handling)

## Using the Wallet Hook

The `useWallet` hook provides access to wallet state and functions throughout your application.

### Basic Usage

```tsx
import { useWallet } from '@/contexts/WalletContext';

function MyComponent() {
  const { 
    account,        // User's wallet address
    chainId,        // Current chain ID (25 for mainnet, 338 for testnet)
    isConnected,    // Connection status
    isConnecting,   // Loading state during connection
    balance,        // User's CRO balance
    provider,       // Ethers.js provider instance
    connectWallet,  // Function to connect wallet
    disconnectWallet, // Function to disconnect wallet
    error           // Error message if any
  } = useWallet();

  return (
    <div>
      {isConnected ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
    </div>
  );
}
```

## Wallet Context API

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `account` | `string \| null` | The connected wallet address |
| `chainId` | `number \| null` | The current network chain ID |
| `isConnected` | `boolean` | Whether a wallet is connected |
| `isConnecting` | `boolean` | Whether connection is in progress |
| `balance` | `string \| null` | Formatted CRO balance |
| `connector` | `DeFiWeb3Connector \| null` | The DeFi connector instance |
| `provider` | `ethers.providers.Web3Provider \| null` | Ethers.js provider |
| `error` | `string \| null` | Error message if connection fails |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `connectWallet` | `() => Promise<void>` | Initiates wallet connection |
| `disconnectWallet` | `() => Promise<void>` | Disconnects the wallet |

## Network Configuration

The application supports both Cronos Mainnet and Testnet:

```tsx
import { CRONOS_NETWORKS, getNetworkByChainId } from '@/lib/cronos-config';

// Get network info
const network = getNetworkByChainId(chainId);
console.log(network?.name); // "Cronos Mainnet" or "Cronos Testnet"

// Access network constants
const mainnetChainId = CRONOS_NETWORKS.MAINNET.chainId; // 25
const testnetChainId = CRONOS_NETWORKS.TESTNET.chainId; // 338
```

## Common Use Cases

### 1. Requiring Wallet Connection

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

function ProtectedComponent() {
  const { isConnected, connectWallet } = useWallet();

  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet to continue');
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Connect your wallet to access this feature</p>
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    );
  }

  return <div>Protected content</div>;
}
```

### 2. Sending a Transaction

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { ethers } from 'ethers';

function SendTransaction() {
  const { provider, account, isConnected } = useWallet();

  const sendCRO = async (to: string, amount: string) => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    });

    await tx.wait();
    return tx.hash;
  };

  // Usage
  const handleSend = async () => {
    try {
      const txHash = await sendCRO('0x...', '1.0');
      console.log('Transaction sent:', txHash);
    } catch (error) {
      console.error('Failed to send transaction:', error);
    }
  };

  return <button onClick={handleSend}>Send 1 CRO</button>;
}
```

### 3. Interacting with Smart Contracts

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { ethers } from 'ethers';

function ContractInteraction() {
  const { provider, account } = useWallet();

  const interactWithContract = async () => {
    if (!provider || !account) return;

    const contractAddress = '0x...';
    const abi = [/* Your contract ABI */];
    
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider.getSigner()
    );

    // Read from contract
    const value = await contract.someReadFunction();
    
    // Write to contract
    const tx = await contract.someWriteFunction(params);
    await tx.wait();
  };

  return <button onClick={interactWithContract}>Interact</button>;
}
```

### 4. Displaying Network-Specific Information

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { CRONOS_NETWORKS } from '@/lib/cronos-config';

function NetworkInfo() {
  const { chainId, isConnected } = useWallet();

  if (!isConnected || !chainId) {
    return <p>Not connected</p>;
  }

  const isMainnet = chainId === CRONOS_NETWORKS.MAINNET.chainId;
  const isTestnet = chainId === CRONOS_NETWORKS.TESTNET.chainId;

  return (
    <div>
      {isMainnet && <span className="text-green-500">Mainnet</span>}
      {isTestnet && <span className="text-yellow-500">Testnet</span>}
      {!isMainnet && !isTestnet && (
        <span className="text-red-500">Unsupported Network</span>
      )}
    </div>
  );
}
```

### 5. Formatting and Displaying Balance

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { formatFlowPayount } from '@/lib/cronos-config';

function BalanceDisplay() {
  const { balance, isConnected } = useWallet();

  if (!isConnected || !balance) {
    return <p>No balance</p>;
  }

  return (
    <div>
      <p>Balance: {formatFlowPayount(balance, 4)} CRO</p>
    </div>
  );
}
```

## Error Handling

The wallet context provides an `error` state that you can use to handle connection errors:

```tsx
import { useWallet } from '@/contexts/WalletContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

function ErrorHandlingComponent() {
  const { error, connectWallet } = useWallet();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  return <button onClick={handleConnect}>Connect</button>;
}
```

## Event Listeners

The wallet context automatically handles these events:

- **accountsChanged**: Updates the account when user switches accounts in wallet
- **chainChanged**: Reloads the page when network is changed (recommended by wallet providers)
- **disconnect**: Clears wallet state when disconnected
- **connect**: Updates connection status

These events are handled automatically - you don't need to set up listeners manually.

## Best Practices

1. **Always check wallet connection** before performing blockchain operations
2. **Use loading states** (`isConnecting`) to provide feedback during connection
3. **Handle errors gracefully** and provide clear error messages to users
4. **Test on testnet first** before deploying to mainnet
5. **Keep provider instance** from the context rather than creating new ones
6. **Use toast notifications** to inform users about transaction status

## Integration Checklist

- [ ] Wrapped app with `WalletProvider` in App.tsx
- [ ] Imported and used `useWallet` hook in components
- [ ] Added wallet connection UI (already in Header)
- [ ] Tested wallet connection flow
- [ ] Tested wallet disconnection
- [ ] Tested account switching
- [ ] Tested network switching
- [ ] Added error handling
- [ ] Tested on both Mainnet and Testnet

## Resources

- [Cronos Documentation](https://docs.cronos.org)
- [DeFi Wallet Extension](https://docs.cronos.org/for-dapp-developers/chain-integration/web-extension-integration)
- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [@deficonnect/web3-connector](https://github.com/crypto-com/deficonnect-monorepo/tree/develop/packages/web3-connector)
