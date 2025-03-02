import { Tag } from '@chakra-ui/react';
import React from 'react';

import type { TwineBatchStatus } from 'types/api/twineL2';

import Skeleton from 'ui/shared/chakra/Skeleton';

const STATUS_COLORS = {
  'Processed on L2': 'blue',
  'Committed on L1': 'green',
  'Batch Finalized on L1': 'purple',
  'Batch Txs Finalized on L1': 'orange',
  'Executed on L1': 'teal',
} as const;

interface Props {
  status: TwineBatchStatus;
  isLoading?: boolean;
}

const TwineL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  const color = STATUS_COLORS[status] || 'gray';

  return (
    <Skeleton isLoaded={ !isLoading } display="inline-block" mr={ 1 } minW="100px">
      <Tag colorScheme={ color } variant="solid">
        { status }
      </Tag>
    </Skeleton>
  );
};

export default TwineL2TxnBatchStatus;
