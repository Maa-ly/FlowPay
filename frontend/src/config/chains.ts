import { Chain } from '@rainbow-me/rainbowkit';

/**
 * Cronos Mainnet Chain Configuration
 */
export const cronosMainnet = {
  id: 25,
  name: 'Cronos',
  iconUrl: 'https://cronos.org/favicon.png',
  iconBackground: '#002D74',
  nativeCurrency: {
    name: 'Cronos',
    symbol: 'CRO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://evm.cronos.org'],
    },
    public: {
      http: ['https://evm.cronos.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cronoscan',
      url: 'https://cronoscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1963112,
    },
  },
  testnet: false,
} as const satisfies Chain;

/**
 * Cronos Testnet Chain Configuration
 */
export const cronosTestnet = {
  id: 338,
  name: 'Cronos Testnet',
  iconUrl: 'https://cronos.org/favicon.png',
  iconBackground: '#00B8D9',
  nativeCurrency: {
    name: 'Cronos',
    symbol: 'TCRO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://evm-t3.cronos.org'],
    },
    public: {
      http: ['https://evm-t3.cronos.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cronos Testnet Explorer',
      url: 'https://testnet.cronoscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 3002794,
    },
  },
  testnet: true,
} as const satisfies Chain;

/**
 * Get all supported chains for the application
 */
export const getSupportedChains = () => {
  return [cronosMainnet, cronosTestnet] as const;
};

/**
 * Get chain by ID
 */
export const getChainById = (chainId: number): Chain | undefined => {
  const chains = getSupportedChains();
  return chains.find((chain) => chain.id === chainId);
};

/**
 * Check if chain is supported
 */
export const isSupportedChain = (chainId: number): boolean => {
  return !!getChainById(chainId);
};

/**
 * Get block explorer URL for a transaction
 */
export const getTxExplorerUrl = (txHash: string, chainId: number): string => {
  const chain = getChainById(chainId);
  if (!chain || !chain.blockExplorers) return '';
  return `${chain.blockExplorers.default.url}/tx/${txHash}`;
};

/**
 * Get block explorer URL for an address
 */
export const getAddressExplorerUrl = (address: string, chainId: number): string => {
  const chain = getChainById(chainId);
  if (!chain || !chain.blockExplorers) return '';
  return `${chain.blockExplorers.default.url}/address/${address}`;
};
