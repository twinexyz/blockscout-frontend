import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TwineBatchesItem } from 'types/api/twineL2';

import config from 'configs/app';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineBatchesItem; isLoading?: boolean };

const TwineTxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

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
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>

    </Tr>
  );
};

export default TwineTxnBatchesTableItem;
