export const TWINE_CHAIN_MAPPING = {
  '17000': {
    name: 'Holesky',
    icon: 'chains/ethereum' as const,
    explorer_url: 'https://holesky.etherscan.io',
    rpc_url: 'https://holesky.drpc.org',
  },
  '103': {
    name: 'Solana',
    icon: 'chains/solana' as const,
    explorer_url: 'https://explorer.solana.com',
    rpc_url: 'https://api.devnet.solana.com',
  },
  '11155111': {
    name: 'Sepolia',
    icon: 'chains/ethereum' as const,
    explorer_url: 'https://sepolia.etherscan.io',
    rpc_url: 'https://sepolia.drpc.org',
  },
  '900': {
    name: 'Solana',
    icon: 'chains/solana' as const,
    explorer_url: 'https://explorer.solana.com',
    rpc_url: 'https://api.devnet.solana.com',
  },
  '1337': {
    name: 'Twine',
    icon: 'chains/twine' as const,
    explorer_url: '',
    rpc_url: '',
  },
  '14523': {
    name: 'Twine',
    icon: 'chains/twine' as const,
    explorer_url: '',
    rpc_url: '',
  },
} as const;

export type TwineChainId = keyof typeof TWINE_CHAIN_MAPPING;

export const isTwineChainId = (chainId: string): chainId is TwineChainId => {
  return chainId in TWINE_CHAIN_MAPPING;
};

// Default L1 chain ID for L2 withdrawals when chain_id is Twine/L2 chain ID
// This is used as a fallback when we can't determine the L1 chain from transaction/token format
// Change this value to switch the default EVM chain (e.g., '17000' for Holesky, '11155111' for Sepolia)
export const DEFAULT_L1_CHAIN_ID_FOR_L2_WITHDRAWALS = '11155111'; // Sepolia

export const getExplorerTxUrl = (chainId: string, txHash: string) => {
  if (!txHash) return '';

  // Solana explorer
  if (chainId === '103' || chainId === '900') {
    return TWINE_CHAIN_MAPPING[chainId].explorer_url + '/tx/' + (txHash) + '?cluster=devnet';
  }

  // Ethereum explorer
  // append 0x to the tx hash if it doesn't already have it
  return TWINE_CHAIN_MAPPING[chainId as TwineChainId].explorer_url + '/tx/' + (txHash.startsWith('0x') ? txHash : '0x' + txHash);
};

export const getExplorerBlockUrl = (chainId: string, blockNumber: string) => {
  // Solana explorer
  if (chainId === '103' || chainId === '900') {
    return TWINE_CHAIN_MAPPING[chainId].explorer_url + '/block/' + blockNumber + '?cluster=devnet';
  }

  // Ethereum explorer
  return TWINE_CHAIN_MAPPING[chainId as TwineChainId].explorer_url + '/block/' + blockNumber;
};

export const getExplorerAddressUrl = (chainId: string, address: string) => {
  // Solana explorer
  if (chainId === '103' || chainId === '900') {
    return TWINE_CHAIN_MAPPING[chainId].explorer_url + '/address/' + address + '?cluster=devnet';
  }

  // Ethereum explorer
  // append 0x to the address if it doesn't already have it
  return TWINE_CHAIN_MAPPING[chainId as TwineChainId].explorer_url + '/address/' + (address.startsWith('0x') ? address : '0x' + address);
};

export const convertSolanaTxHashToBase58 = (txHash: string) => {
  // Convert hex string to Uint8Array
  const bytes = new Uint8Array(txHash.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  // Base58 alphabet
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  // Convert to base58
  let num = BigInt(0);
  for (let i = 0; i < bytes.length; i++) {
    num = num * BigInt(256) + BigInt(bytes[i]);
  }

  let base58 = '';
  while (num > 0) {
    const remainder = Number(num % BigInt(58));
    base58 = ALPHABET[remainder] + base58;
    num = num / BigInt(58);
  }

  // Add leading zeros
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    base58 = '1' + base58;
  }

  return base58;
};
