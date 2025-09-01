import { Td, Tr, Badge } from '@chakra-ui/react';
import React from 'react';

import type { TwineL2WithdrawalsItem } from 'types/api/twineL2';

import config from 'configs/app';
import { isTwineChainId, TWINE_CHAIN_MAPPING } from 'configs/app/features/twine';
import shortenString from 'lib/shortenString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TwineExternalLink from 'ui/shared/links/TwineExternalLink';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineL2WithdrawalsItem; isLoading?: boolean };

const TwineWithdrawalsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  const isSolana = isTwineChainId(String(item.chain_id)) && item.chain_id === 900;
  const chainKey = String(item.chain_id) as keyof typeof TWINE_CHAIN_MAPPING;
  const chainName = TWINE_CHAIN_MAPPING[chainKey]?.name || String(item.chain_id);
  const statusText = item.status === 1 ? 'Success' : 'Failed';
  const statusColorScheme = item.status === 1 ? 'green' : 'red';

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Badge colorScheme={ isSolana ? 'purple' : 'blue' }>{ chainName }</Badge>
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.l1_block_height } chainId={ String(item.chain_id) } type="block" isLoading={ isLoading }>
          { item.l1_block_height }
        </TwineExternalLink>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntity
          number={ item.l2_block_height }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.l1_tx_hash } chainId={ String(item.chain_id) } type="tx" isLoading={ isLoading }>
          { shortenString(item.l1_tx_hash, 8) }
        </TwineExternalLink>
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.l2_tx_hash } chainId={ String(item.chain_id) } type="tx" isLoading={ isLoading }>
          { shortenString(item.l2_tx_hash, 8) }
        </TwineExternalLink>
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
        <Badge colorScheme={ statusColorScheme }>{ statusText }</Badge>
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.l1_token } chainId={ String(item.chain_id) } type="tx" isLoading={ isLoading }>
          { shortenString(item.l1_token, 8) }
        </TwineExternalLink>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity
          address={{ hash: item.l2_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle">
        <TwineExternalLink href={ item.from } chainId={ String(item.chain_id) } type="tx" isLoading={ isLoading }>
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
    </Tr>
  );
};

export default TwineWithdrawalsTableItem;
