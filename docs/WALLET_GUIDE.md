# Wallet Integration with RainbowKit & Wagmi

This guide explains how to use the wallet connection features in FlowPay.

## Table of Contents

1. [Overview](#overview)
2. [Using Wagmi Hooks](#using-wagmi-hooks)
3. [Common Use Cases](#common-use-cases)
4. [Chain Configuration](#chain-configuration)
5. [Best Practices](#best-practices)

## Overview

FlowPay uses **RainbowKit** and **Wagmi** for wallet connections, providing a modern, type-safe way to interact with Cronos blockchain.

### Key Benefits

- **Multi-wallet support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and more
- **Type-safe**: Full TypeScript support
- **React hooks**: Clean, declarative API
- **Auto-connect**: Remembers user's wallet choice
- **Network switching**: Seamless chain switching
- **Mobile support**: QR codes for mobile wallets

## Using Wagmi Hooks

Wagmi provides React hooks for all your blockchain needs. Here are the most common ones:

### useAccount - Get Connected Wallet Info

```tsx
import { useAccount } from 'wagmi';

function MyComponent() {
  const { address, isConnected, isConnecting, chain } = useAccount();

  if (isConnecting) return <div>Connecting...</div>;
  if (!isConnected) return <div>Not connected</div>;

  return (
    <div>
      <p>Address: {address}</p>
      <p>Chain: {chain?.name}</p>
    </div>
  );
}
```

### useBalance - Get Wallet Balance

```tsx
import { useAccount, useBalance } from 'wagmi';

function BalanceDisplay() {
  const { address } = useAccount();
  const { data, isLoading } = useBalance({
    address,
  });

  if (isLoading) return <div>Loading balance...</div>;

  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}
```

### useSendTransaction - Send CRO

```tsx
import { useSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';

function SendCRO() {
  const { address } = useAccount();
  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction();

  const handleSend = () => {
    sendTransaction({
      to: '0xRecipientAddress',
      value: parseEther('1'), // 1 CRO
    });
  };

  return (
    <div>
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send 1 CRO'}
      </button>
      {isSuccess && <p>Transaction sent!</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### useWaitForTransactionReceipt - Wait for Confirmation

```tsx
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

function SendWithConfirmation() {
  const { sendTransaction, data: hash } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSend = () => {
    sendTransaction({
      to: '0xRecipientAddress',
      value: parseEther('1'),
    });
  };

  return (
    <div>
      <button onClick={handleSend}>Send 1 CRO</button>
      {isConfirming && <p>Waiting for confirmation...</p>}
      {isSuccess && <p>Transaction confirmed!</p>}
    </div>
  );
}
```

### useReadContract - Read from Smart Contract

```tsx
import { useReadContract } from 'wagmi';

const contractAddress = '0xYourContractAddress';
const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

function TokenBalance() {
  const { address } = useAccount();
  
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'balanceOf',
    args: [address],
  });

  return <div>Token Balance: {balance?.toString()}</div>;
}
```

### useWriteContract - Write to Smart Contract

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const abi = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

function TransferToken() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleTransfer = () => {
    writeContract({
      address: '0xContractAddress',
      abi,
      functionName: 'transfer',
      args: ['0xRecipient', BigInt(1000000)],
    });
  };

  return (
    <button onClick={handleTransfer} disabled={isConfirming}>
      {isConfirming ? 'Transferring...' : 'Transfer'}
    </button>
  );
}
```

### useSignMessage - Sign a Message

```tsx
import { useSignMessage } from 'wagmi';

function SignMessage() {
  const { signMessage, data: signature, error } = useSignMessage();

  const handleSign = () => {
    signMessage({ message: 'Hello from FlowPay!' });
  };

  return (
    <div>
      <button onClick={handleSign}>Sign Message</button>
      {signature && <p>Signature: {signature}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## Common Use Cases

### 1. Protected Content (Require Wallet Connection)

```tsx
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function ProtectedPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1>Connect Your Wallet</h1>
        <p>Please connect your wallet to access this page</p>
        <ConnectButton />
      </div>
    );
  }

  return <div>Protected content here</div>;
}
```

### 2. Check Network and Prompt Switch

```tsx
import { useAccount, useSwitchChain } from 'wagmi';
import { cronosTestnet } from '@/config/chains';

function NetworkGuard({ children }) {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isCorrectNetwork = chain?.id === cronosTestnet.id;

  if (!isCorrectNetwork) {
    return (
      <div>
        <p>Please switch to Cronos Testnet</p>
        <button onClick={() => switchChain({ chainId: cronosTestnet.id })}>
          Switch Network
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

### 3. Display Formatted Address

```tsx
import { useAccount } from 'wagmi';

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function AddressDisplay() {
  const { address } = useAccount();

  if (!address) return null;

  return (
    <div>
      <span>{formatAddress(address)}</span>
      <button onClick={() => navigator.clipboard.writeText(address)}>
        Copy
      </button>
    </div>
  );
}
```

### 4. Transaction with Loading States

```tsx
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';

function SendTransaction() {
  const { sendTransaction, data: hash, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSend = async () => {
    try {
      sendTransaction({
        to: '0xRecipient',
        value: parseEther('0.1'),
      });
    } catch (err) {
      toast.error('Transaction failed');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction confirmed!');
    }
  }, [isSuccess]);

  return (
    <button onClick={handleSend} disabled={isConfirming}>
      {isConfirming ? 'Confirming...' : 'Send 0.1 CRO'}
    </button>
  );
}
```

### 5. Get Block Explorer Link

```tsx
import { useAccount } from 'wagmi';
import { getTxExplorerUrl, getAddressExplorerUrl } from '@/config/chains';

function ExplorerLinks({ txHash }: { txHash: string }) {
  const { address, chain } = useAccount();

  const txUrl = chain ? getTxExplorerUrl(txHash, chain.id) : '';
  const addressUrl = chain && address ? getAddressExplorerUrl(address, chain.id) : '';

  return (
    <div>
      {txUrl && (
        <a href={txUrl} target="_blank" rel="noopener noreferrer">
          View Transaction
        </a>
      )}
      {addressUrl && (
        <a href={addressUrl} target="_blank" rel="noopener noreferrer">
          View Address
        </a>
      )}
    </div>
  );
}
```

## Chain Configuration

Cronos chains are defined in [src/config/chains.ts](../src/config/chains.ts):

```tsx
import { cronosMainnet, cronosTestnet } from '@/config/chains';

// Get all supported chains
import { getSupportedChains } from '@/config/chains';
const chains = getSupportedChains(); // [cronosMainnet, cronosTestnet]

// Get chain by ID
import { getChainById } from '@/config/chains';
const chain = getChainById(338); // Cronos Testnet

// Check if chain is supported
import { isSupportedChain } from '@/config/chains';
const isSupported = isSupportedChain(25); // true for Cronos Mainnet
```

## Best Practices

### 1. Always Check Connection Status

```tsx
const { isConnected, isConnecting } = useAccount();

if (isConnecting) return <Spinner />;
if (!isConnected) return <ConnectPrompt />;
// Proceed with blockchain operations
```

### 2. Handle Errors Gracefully

```tsx
const { error } = useSendTransaction();

if (error) {
  console.error('Transaction error:', error);
  toast.error(error.message || 'Transaction failed');
}
```

### 3. Use Loading States

```tsx
const { isPending } = useSendTransaction();
const { isLoading } = useWaitForTransactionReceipt({ hash });

<button disabled={isPending || isLoading}>
  {isPending ? 'Signing...' : isLoading ? 'Confirming...' : 'Send'}
</button>
```

### 4. Provide User Feedback

```tsx
useEffect(() => {
  if (isSuccess) {
    toast.success('Transaction confirmed!', {
      action: {
        label: 'View',
        onClick: () => window.open(explorerUrl, '_blank'),
      },
    });
  }
}, [isSuccess]);
```

### 5. Type Your Contract ABIs

```tsx
const abi = [
  {
    name: 'transfer',
    type: 'function',
    // ... rest of ABI
  },
] as const; // ← Important for type inference
```

## Resources

- **Wagmi Docs**: https://wagmi.sh
- **RainbowKit Docs**: https://www.rainbowkit.com
- **Viem Docs**: https://viem.sh
- **Cronos Docs**: https://docs.cronos.org

---

For questions or issues, refer to the main [README.md](../README.md) or open an issue on GitHub.
