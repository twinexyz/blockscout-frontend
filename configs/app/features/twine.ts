export const TWINE_CHAIN_MAPPING = {
  '17000': {
    name: 'Holesky',
    explorer_url: 'https://holesky.etherscan.io',
  },
  '103': {
    name: 'Solana',
    explorer_url: 'https://explorer.solana.com',
  },
  '11155111': {
    name: 'Sepolia',
    explorer_url: 'https://sepolia.etherscan.io',
  },
  '900': {
    name: 'Solana',
    explorer_url: 'https://explorer.solana.com',
  },
  '1337': {
    name: 'Twine',
    explorer_url: '',
  },
} as const;

export type TwineChainId = keyof typeof TWINE_CHAIN_MAPPING;

export const isTwineChainId = (chainId: string): chainId is TwineChainId => {
  return chainId in TWINE_CHAIN_MAPPING;
};

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
