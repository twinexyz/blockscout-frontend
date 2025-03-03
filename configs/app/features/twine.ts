export const TWINE_CHAIN_MAPPING = {
  '17000': {
    name: 'Holesky',
    explorer_url: 'https://holesky.etherscan.io',
  },
  '900': {
    name: 'Solana',
    explorer_url: 'https://solana.io',
  },
} as const;

export type TwineChainId = keyof typeof TWINE_CHAIN_MAPPING;

export const isTwineChainId = (chainId: string): chainId is TwineChainId => {
  return chainId in TWINE_CHAIN_MAPPING;
};
