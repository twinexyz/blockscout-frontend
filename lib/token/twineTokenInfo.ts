import { createPublicClient, http, type Address, type Chain } from 'viem';
import { mainnet, holesky, sepolia } from 'viem/chains';

import type { TokenInfo } from 'types/api/token';

import { TWINE_CHAIN_MAPPING, isTwineChainId } from 'configs/app/features/twine';

// Standard ERC-20 ABI for name() and symbol()
const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [ { name: '', type: 'string' } ],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [ { name: '', type: 'string' } ],
    type: 'function',
  },
] as const;

// Map chain IDs to viem chain objects
const getViemChain = (chainId: string): Chain | null => {
  switch (chainId) {
    case '1':
      return mainnet;
    case '17000':
      return holesky;
    case '11155111':
      return sepolia;
    default:
      return null;
  }
};

// Create public client for a specific chain
const createChainClient = (chainId: string, rpcUrl: string) => {
  const chain = getViemChain(chainId);
  if (!chain || !rpcUrl) {
    return null;
  }

  try {
    return createPublicClient({
      chain: {
        ...chain,
        rpcUrls: {
          'default': {
            http: [ rpcUrl ],
          },
        },
      },
      transport: http(rpcUrl),
    });
  } catch {
    return null;
  }
};
export const fetchTokenInfoViaRPC = async(
  tokenAddress: string,
  chainId: string,
): Promise<Pick<TokenInfo, 'name' | 'symbol' | 'address'> | null> => {
  // Check for native ETH token (zero address)
  const normalizedAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${ tokenAddress }`;
  if (normalizedAddress.toLowerCase() === '0x0000000000000000000000000000000000000000' || normalizedAddress === '0x0') {
    return {
      address: normalizedAddress,
      name: 'Ethereum',
      symbol: 'ETH',
    };
  }

  // Check if it's a Solana chain
  if (chainId === '103' || chainId === '900') {
    // Check for native SOL token (11111... address)
    if (tokenAddress.startsWith('11111') || tokenAddress === 'So11111111111111111111111111111111111111112') {
      return {
        address: tokenAddress,
        name: 'Solana',
        symbol: 'SOL',
      };
    }

    // TODO: Fetch SPL token metadata for Solana tokens
    // For now, return null to fall back to showing the address
    return null;
  }

  // Check if it's a valid Twine chain
  if (!isTwineChainId(chainId)) {
    return null;
  }

  const chainConfig = TWINE_CHAIN_MAPPING[chainId];
  if (!chainConfig?.rpc_url) {
    return null;
  }

  // Validate it's a valid EVM address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    return null;
  }

  const client = createChainClient(chainId, chainConfig.rpc_url);
  if (!client) {
    return null;
  }

  try {
    const [ name, symbol ] = await Promise.all([
      client.readContract({
        address: normalizedAddress as Address,
        abi: ERC20_ABI,
        functionName: 'name',
      }).catch(() => null) as Promise<string | null>,
      client.readContract({
        address: normalizedAddress as Address,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }).catch(() => null) as Promise<string | null>,
    ]);

    if (!name && !symbol) {
      return null;
    }

    return {
      address: normalizedAddress,
      name: name || null,
      symbol: symbol || null,
    };
  } catch {
    return null;
  }
};
