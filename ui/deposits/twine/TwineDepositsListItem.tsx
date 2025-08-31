import React from 'react';

import type { TwineL2DepositsItem } from 'types/api/twineL2';

import config from 'configs/app';
import { isTwineChainId, TWINE_CHAIN_MAPPING } from 'configs/app/features/twine';
import shortenString from 'lib/shortenString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TwineExternalLink from 'ui/shared/links/TwineExternalLink';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineL2DepositsItem; isLoading?: boolean };

const TwineDepositsListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  const isSolana = isTwineChainId(String(item.chain_id)) && item.chain_id === 900;
  const chainKey = String(item.chain_id) as keyof typeof TWINE_CHAIN_MAPPING;
  const chainName = TWINE_CHAIN_MAPPING[chainKey]?.name || String(item.chain_id);

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>
        Chain
      </ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { chainName }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Block number</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { !isSolana && item.block_number ? (
          <TwineExternalLink href={ item.block_number } chainId={ String(item.chain_id) } type="block" isLoading={ isLoading }>
            { item.block_number }
          </TwineExternalLink>
        ) : (
          <span>-</span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Slot number</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { isSolana && item.slot_number ? (
          <TwineExternalLink href={ item.slot_number } chainId={ String(item.chain_id) } type="slot" isLoading={ isLoading }>
            { item.slot_number }
          </TwineExternalLink>
        ) : (
          <span>-</span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 Tx Hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TwineExternalLink href={ item.l1_tx_hash } chainId={ String(item.chain_id) } type="tx" isLoading={ isLoading }>
          { shortenString(item.l1_tx_hash, 8) }
        </TwineExternalLink>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 Tx Hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 Token Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TwineExternalLink href={ item.l1_token } chainId={ String(item.chain_id) } type="address" isLoading={ isLoading }>
          { shortenString(item.l1_token, 8) }
        </TwineExternalLink>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 Token Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.l2_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TwineExternalLink href={ item.from } chainId={ String(item.chain_id) } type="address" isLoading={ isLoading }>
          { shortenString(item.from, 8) }
        </TwineExternalLink>
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>To (Twine Address)</ListItemMobileGrid.Label>
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
        { item.amount }
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default TwineDepositsListItem;
