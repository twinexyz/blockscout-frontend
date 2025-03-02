import { Text } from '@chakra-ui/react';
import React from 'react';

import type { TwineBatchesItem } from 'types/api/twineL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TwineL2TxnBatchStatus from 'ui/shared/statusTag/TwineL2TxnBatchStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineBatchesItem; isLoading?: boolean };

const TwineTxnBatchesListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  const details = item.details[0]; // Using first detail item for display
  const txCount = details ? (details.l1_transaction_count + details.l2_transaction_count) : 0;

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TwineL2TxnBatchStatus status={ details?.status || 'Processed on L2' } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
          fontWeight={ 600 }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { txCount }
          </Skeleton>
        </LinkInternal>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Commit tx</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { details?.commit_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ details.commit_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
          />
        ) : <Text>Pending</Text> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Prove tx</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { details?.prove_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ details.prove_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
          />
        ) : <Text>Pending</Text> }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default TwineTxnBatchesListItem;
