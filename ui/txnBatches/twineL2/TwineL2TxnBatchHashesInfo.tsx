import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TwineBatch } from 'types/api/twineL2';

import Skeleton from 'ui/shared/chakra/Skeleton';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

interface Props {
  isLoading: boolean;
  data: Pick<
    TwineBatch,
    'commit_transaction_hash' |
    'commit_transaction_timestamp' |
    'prove_transaction_hash' |
    'prove_transaction_timestamp' |
    'status'
  >;
}

const TwineL2TxnBatchHashesInfo = ({ isLoading, data }: Props) => {
  return (
    <>

      <DetailsInfoItem.Label
        hint="Hash of L1 tx on which the batch was proven"
        isLoading={ isLoading }
      >
        Prove tx hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexDir="column"
        alignItems="flex-start"
      >
        { data.prove_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.prove_transaction_hash }
              maxW="100%"
              noCopy={ false }
            />
            { data.prove_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.prove_transaction_timestamp } isLoading={ isLoading }/>
              </Flex>
            ) }
          </>
        ) : <Skeleton isLoaded={ !isLoading }>Pending</Skeleton> }
      </DetailsInfoItem.Value>
    </>
  );
};

export default TwineL2TxnBatchHashesInfo;
