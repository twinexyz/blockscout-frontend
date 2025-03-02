import { Td, Tr, Text } from '@chakra-ui/react';
import React from 'react';

import type { TwineBatchesItem } from 'types/api/twineL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TwineL2TxnBatchStatus from 'ui/shared/statusTag/TwineL2TxnBatchStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineBatchesItem; isLoading?: boolean };

const TwineTxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  const details = item.details[0]; // Using first detail item for display
  const txCount = details ? (details.l1_transaction_count + details.l2_transaction_count) : 0;

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <TwineL2TxnBatchStatus status={ details?.status || 'Processed on L2' } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px" my={ 1 }>
            { txCount }
          </Skeleton>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle">
        { details?.commit_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ details.commit_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
            noIcon
          />
        ) : <Text>Pending</Text> }
      </Td>
      <Td verticalAlign="middle">
        { details?.prove_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ details.prove_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
            noIcon
          />
        ) : <Text>Pending</Text> }
      </Td>
    </Tr>
  );
};

export default TwineTxnBatchesTableItem;
