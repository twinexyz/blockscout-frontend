import { useQuery } from '@tanstack/react-query';

import type { TokenInfo } from 'types/api/token';

import { fetchTokenInfoViaRPC } from './twineTokenInfo';

interface Params {
  tokenAddress: string;
  chainId: string;
  enabled?: boolean;
}

export default function useTwineTokenInfo({ tokenAddress, chainId, enabled = true }: Params) {
  return useQuery<Pick<TokenInfo, 'name' | 'symbol' | 'address'> | null>({
    queryKey: [ 'twine_token_info', tokenAddress, chainId ],
    queryFn: () => fetchTokenInfoViaRPC(tokenAddress, chainId),
    enabled: enabled && Boolean(tokenAddress) && Boolean(chainId),
    staleTime: Infinity, // Token info doesn't change frequently
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 1, // Only retry once
  });
}
