import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { cronosMainnet, cronosTestnet } from './chains';

// Get WalletConnect Project ID from environment
// Create one at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  console.warn(
    'VITE_WALLETCONNECT_PROJECT_ID is not set. Get your project ID at https://cloud.walletconnect.com'
  );
}

/**
 * Wagmi configuration with RainbowKit
 * Configured for Cronos Mainnet and Testnet
 */
export const wagmiConfig = getDefaultConfig({
  appName: 'FlowPay',
  projectId,
  chains: [cronosTestnet, cronosMainnet],
  ssr: false, // We're using Vite, not Next.js SSR
  // Enable Telegram Web App support
  walletConnectOptions: {
    metadata: {
      name: 'FlowPay',
      description: 'Automate payments on Cronos blockchain',
      url: 'https://flowpayment.vercel.app',
      icons: ['https://flowpayment.vercel.app/flowpay-icon.svg'],
    },
    // Enable mobile linking for Telegram
    qrModalOptions: {
      themeMode: 'light',
      themeVariables: {
        '--wcm-z-index': '999999',
      },
    },
  },
});
