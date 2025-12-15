import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TwineL2WithdrawalsItem } from 'types/api/twineL2';

import config from 'configs/app';
import { DEFAULT_L1_CHAIN_ID_FOR_L2_WITHDRAWALS, TWINE_CHAIN_MAPPING } from 'configs/app/features/twine';
import useApiQuery from 'lib/api/useApiQuery';
import shortenString from 'lib/shortenString';
import useTwineTokenInfo from 'lib/token/useTwineTokenInfo';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';
import TwineExternalLink from 'ui/shared/links/TwineExternalLink';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineL2WithdrawalsItem; isLoading?: boolean };

const TwineWithdrawalsListItem = ({ item, isLoading }: Props) => {
  const iconBgColor = useColorModeValue('gray.50', 'whiteAlpha.100');
  const iconBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  // Workaround: For L2 withdrawals, chain_id is Twine/L2 chain ID, but L1 links need actual L1 chain ID
  // Infer L1 chain ID from transaction hash format or token address format
  const getL1ChainId = (): string => {
    const chainKey = String(item.chain_id) as keyof typeof TWINE_CHAIN_MAPPING;
    const chainConfig = TWINE_CHAIN_MAPPING[chainKey];

    // If chain_id is already an L1 chain ID (not Twine), use it
    if (chainConfig && chainConfig.explorer_url) {
      return String(item.chain_id);
    }

    // Check if l1_execute_hash exists and infer from its format
    if (item.l1_execute_hash) {
      // Solana hashes are base58 (long alphanumeric strings without 0x)
      if (!item.l1_execute_hash.startsWith('0x') && item.l1_execute_hash.length > 40) {
        // Check if it matches Solana format (base58)
        const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,}$/;
        if (solanaPattern.test(item.l1_execute_hash)) {
          return '103'; // Default to Solana devnet
        }
      }
    }

    // Check l1_token address format
    if (item.l1_token) {
      // Solana addresses are base58 (long strings, often starting with specific patterns)
      if (!item.l1_token.startsWith('0x')) {
        // Check if it's Solana format
        const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,}$/;
        if (solanaPattern.test(item.l1_token)) {
          return '103'; // Default to Solana devnet
        }
      } else {
        // EVM format - use configured default L1 chain
        return DEFAULT_L1_CHAIN_ID_FOR_L2_WITHDRAWALS;
      }
    }

    // Default fallback to configured default L1 chain
    return DEFAULT_L1_CHAIN_ID_FOR_L2_WITHDRAWALS;
  };

  const l1ChainId = getL1ChainId();

  // Fetch L1 token info via RPC
  const l1TokenInfo = useTwineTokenInfo({
    tokenAddress: item.l1_token,
    chainId: l1ChainId,
    enabled: !isLoading && Boolean(item.l1_token),
  });

  // Fetch L2 token info via Blockscout API
  const l2TokenQuery = useApiQuery('token', {
    pathParams: { hash: item.l2_token },
    queryOptions: {
      enabled: !isLoading && Boolean(item.l2_token),
    },
  });

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  const chainKey = String(item.chain_id) as keyof typeof TWINE_CHAIN_MAPPING;
  const chainConfig = TWINE_CHAIN_MAPPING[chainKey];
  // Ensure we have a valid icon - if chainConfig doesn't exist or icon is missing, use placeholder
  const chainIcon: IconName = (chainConfig?.icon ?? 'networks/icon-placeholder') as IconName;

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Chain
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="base">
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            bgColor={ iconBgColor }
            border="1px solid"
            borderColor={ iconBorderColor }
            borderRadius="base"
            p={ 1.5 }
            boxSize={ 8 }
          >
            <IconSvg name={ chainIcon } boxSize={ 5 } isLoading={ isLoading }/>
          </Box>
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Source Height</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntity
          number={ item.source_block_height }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Source Txn Hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          hash={ item.source_tx_hash }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Source Token</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{
            hash: item.l2_token,
            name: l2TokenQuery.data?.symbol ? `$${ l2TokenQuery.data.symbol }` : '',
            is_contract: false,
            is_verified: false,
            ens_domain_name: null,
            implementations: null,
          }}
          isLoading={ isLoading || l2TokenQuery.isLoading }
          truncation="constant"
          noCopy
          fontSize="sm"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Destination Height</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.l1_execute_hash && item.l1_execute_block_height ? (
          <TwineExternalLink href={ String(item.l1_execute_block_height) } chainId={ l1ChainId } type="block" isLoading={ isLoading }>
            { item.l1_execute_block_height }
          </TwineExternalLink>
        ) : (
          <span>-</span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Destination Txn Hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.l1_execute_hash ? (
          <TwineExternalLink href={ item.l1_execute_hash } chainId={ l1ChainId } type="tx" isLoading={ isLoading }>
            { shortenString(item.l1_execute_hash, 8) }
          </TwineExternalLink>
        ) : (
          <span>-</span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Destination Token</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TwineExternalLink href={ item.l1_token } chainId={ l1ChainId } type="address" isLoading={ isLoading || l1TokenInfo.isLoading }>
          { l1TokenInfo.data?.symbol ? `$${ l1TokenInfo.data.symbol }` : shortenString(item.l1_token, 8) }
        </TwineExternalLink>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.from, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>To</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.to_twine_address, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Amount</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.amount }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default TwineWithdrawalsListItem;
