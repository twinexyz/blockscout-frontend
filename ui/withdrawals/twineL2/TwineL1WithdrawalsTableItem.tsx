import { Box, Td, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TwineL1WithdrawalsItem } from 'types/api/twineL2';

import config from 'configs/app';
import { TWINE_CHAIN_MAPPING } from 'configs/app/features/twine';
import useApiQuery from 'lib/api/useApiQuery';
import shortenString from 'lib/shortenString';
import useTwineTokenInfo from 'lib/token/useTwineTokenInfo';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';
import TwineExternalLink from 'ui/shared/links/TwineExternalLink';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineL1WithdrawalsItem; isLoading?: boolean };

const TwineL1WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const iconBgColor = useColorModeValue('gray.50', 'whiteAlpha.100');
  const iconBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const isSuccess = item.status === 1;
  const statusIcon: IconName = isSuccess ? 'status/success' : 'status/error';
  const statusBgColor = useColorModeValue(
    isSuccess ? 'green.50' : 'red.50',
    isSuccess ? 'green.900' : 'red.900',
  );
  const statusIconColor = useColorModeValue(
    isSuccess ? 'green.600' : 'red.600',
    isSuccess ? 'green.300' : 'red.300',
  );

  // Fetch L1 token info via RPC
  const l1TokenInfo = useTwineTokenInfo({
    tokenAddress: item.l1_token,
    chainId: String(item.chain_id),
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
  const chainIcon = chainConfig?.icon || 'networks/icon-placeholder';

  return (
    <Tr>
      <Td verticalAlign="middle">
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
            <IconSvg name={ chainIcon as IconName } boxSize={ 5 } isLoading={ isLoading }/>
          </Box>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.source_block_height } chainId={ String(item.chain_id) } type="block" isLoading={ isLoading }>
          { item.source_block_height }
        </TwineExternalLink>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntity
          number={ item.l2_handle_block_height }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.source_tx_hash } chainId={ String(item.chain_id) } type="tx" isLoading={ isLoading }>
          { shortenString(item.source_tx_hash, 8) }
        </TwineExternalLink>
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          hash={ item.l2_handle_tx_hash }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant"
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        { l1TokenInfo.data ? (
          <TokenEntity
            token={{
              address: l1TokenInfo.data.address,
              name: l1TokenInfo.data.name,
              symbol: l1TokenInfo.data.symbol ? `$${ l1TokenInfo.data.symbol }` : null,
              type: 'ERC-20',
              icon_url: null,
            }}
            isLoading={ isLoading || l1TokenInfo.isLoading }
            noIcon
            noCopy
            onlySymbol
            fontSize="sm"
          />
        ) : (
          <TwineExternalLink href={ item.l1_token } chainId={ String(item.chain_id) } type="address" isLoading={ isLoading }>
            { shortenString(item.l1_token, 8) }
          </TwineExternalLink>
        ) }
      </Td>
      <Td verticalAlign="middle">
        { l2TokenQuery.data ? (
          <TokenEntity
            token={{
              ...l2TokenQuery.data,
              symbol: l2TokenQuery.data.symbol ? `$${ l2TokenQuery.data.symbol }` : null,
            }}
            isLoading={ isLoading || l2TokenQuery.isPlaceholderData }
            noIcon
            noCopy
            onlySymbol
            fontSize="sm"
          />
        ) : (
          <AddressEntity
            address={{ hash: item.l2_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
            isLoading={ isLoading || l2TokenQuery.isLoading }
            truncation="constant"
            noCopy
          />
        ) }
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.from } chainId={ String(item.chain_id) } type="address" isLoading={ isLoading }>
          { shortenString(item.from, 8) }
        </TwineExternalLink>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity
          address={{ hash: item.to_twine_address, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <TimeAgoWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          color="text_secondary"
          display="inline-block"
        />
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="base">
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            bgColor={ statusBgColor }
            borderRadius="base"
            p={ 1.5 }
            boxSize={ 8 }
            title={ isSuccess ? 'Success' : 'Failed' }
          >
            <IconSvg name={ statusIcon } boxSize={ 4 } color={ statusIconColor } isLoading={ isLoading }/>
          </Box>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default TwineL1WithdrawalsTableItem;
