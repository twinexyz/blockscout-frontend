import { Grid, GridItem, Text, Flex, Tag, TagLabel } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { Element } from 'react-scroll';

import type { TwineBatchesItem } from 'types/api/twineL2';

import { route } from 'nextjs-routes';

import { TWINE_CHAIN_MAPPING, isTwineChainId } from 'configs/app/features/twine';
import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import Skeleton from 'ui/shared/chakra/Skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  query: UseQueryResult<TwineBatchesItem, ResourceError>;
}

const TwineL2TxnBatchDetails = ({ query }: Props) => {
  const router = useRouter();

  const { data, isPlaceholderData, isError, error } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.number + increment);

    router.push({ pathname: '/batches/[number]', query: { number: nextId } }, undefined);
  }, [ data, router ]);

  if (isError) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const txNum = data.details.reduce((sum, detail) => sum + detail.l1_transaction_count + detail.l2_transaction_count, 0);

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        hint="Batch number indicates the sequence of batches in Twine L2"
        isLoading={ isPlaceholderData }
      >
        Txn batch number
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.number }
        </Skeleton>
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous txn batch"
          nextLabel="View next txn batch"
          isPrevDisabled={ data.number === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Status for each L1 chain"
        isLoading={ isPlaceholderData }
      >
        L1 Status
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <Flex gap={ 2 } flexWrap="wrap" alignItems="center" justifyContent="center">
            { data.details.map((detail) => (
              <Tag
                key={ detail.chain_id }
                size="lg"
                variant="solid"
                colorScheme={ detail.status === 'Executed on L1' ? 'green' : 'blue' }
                fontSize="sm"
                textAlign="center"
                display="flex"
                justifyContent="center"
                width="100%"
              >
                <TagLabel>
                  { isTwineChainId(detail.chain_id) ? (
                    `${ TWINE_CHAIN_MAPPING[detail.chain_id].name } (${ detail.chain_id })`
                  ) : (
                    `Chain ${ detail.chain_id }`
                  ) }: { detail.status }
                </TagLabel>
              </Tag>
            )) }
          </Flex>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Date and time at which batch is produced"
        isLoading={ isPlaceholderData }
      >
        Timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.timestamp ? <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/> : 'Undefined' }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Block range in the batch"
        isLoading={ isPlaceholderData }
      >
        Block range
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.start_block } - { data.end_block }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Number of transactions inside the batch"
        isLoading={ isPlaceholderData }
      >
        Transactions
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { txNum } transaction{ txNum === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItemDivider/>

      <DetailsInfoItem.Label
        hint="Root hash of the batch"
      >
        Root hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TruncatedValue value={ data.root_hash }/>
        <CopyToClipboard text={ data.root_hash }/>
      </DetailsInfoItem.Value>

      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="TwineL2TxnBatchDetails__cutLink"/>
        { data.details.map((detail, index) => {
          const chainName = isTwineChainId(detail.chain_id) ? TWINE_CHAIN_MAPPING[detail.chain_id].name : `Chain ${ detail.chain_id }`;
          return (
            <React.Fragment key={ index }>
              <Grid
                mt={ index === 0 ? 6 : 8 }
                pb={ 6 }
                borderBottom={ index < data.details.length - 1 ? '1px solid' : 'none' }
                borderColor="divider"
              >
                <GridItem colSpan={ 2 } mb={ 4 }>
                  <Text fontSize="lg" fontWeight="500">{ chainName } Details</Text>
                </GridItem>

                <Grid
                  columnGap={ 8 }
                  rowGap={ 3 }
                  templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
                >
                  <DetailsInfoItem.Label>Chain ID</DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>{ detail.chain_id }</DetailsInfoItem.Value>

                  <DetailsInfoItem.Label>Status</DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <Tag
                      size="sm"
                      variant="solid"
                      colorScheme={ detail.status === 'Executed on L1' ? 'green' : 'blue' }
                    >
                      { detail.status }
                    </Tag>
                  </DetailsInfoItem.Value>

                  <DetailsInfoItem.Label>Transaction counts</DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <Text as="span" mr={ 4 }>L1: { detail.l1_transaction_count }</Text>
                    <Text as="span">L2: { detail.l2_transaction_count }</Text>
                  </DetailsInfoItem.Value>

                  <DetailsInfoItem.Label>Gas prices</DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <Text as="span" mr={ 4 }>L1: { detail.l1_gas_price }</Text>
                    <Text as="span">L2: { detail.l2_fair_gas_price }</Text>
                  </DetailsInfoItem.Value>

                  <DetailsInfoItemDivider/>

                  <DetailsInfoItem.Label>Commit transaction</DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <Flex alignItems="center" gap={ 3 }>
                      <TruncatedValue value={ detail.commit_transaction_hash }/>
                      <CopyToClipboard text={ detail.commit_transaction_hash }/>
                      { detail.commit_transaction_timestamp && (
                        <Text as="span" variant="secondary" whiteSpace="nowrap">
                          <DetailsTimestamp timestamp={ detail.commit_transaction_timestamp }/>
                        </Text>
                      ) }
                    </Flex>
                  </DetailsInfoItem.Value>

                  { detail.prove_transaction_hash && (
                    <>
                      <DetailsInfoItem.Label>Prove transaction</DetailsInfoItem.Label>
                      <DetailsInfoItem.Value>
                        <Flex alignItems="center" gap={ 3 }>
                          <TruncatedValue value={ detail.prove_transaction_hash }/>
                          <CopyToClipboard text={ detail.prove_transaction_hash }/>
                          { detail.prove_transaction_timestamp && (
                            <Text as="span" variant="secondary" whiteSpace="nowrap">
                              <DetailsTimestamp timestamp={ detail.prove_transaction_timestamp }/>
                            </Text>
                          ) }
                        </Flex>
                      </DetailsInfoItem.Value>
                    </>
                  ) }

                  <DetailsInfoItem.Label>Execute transaction</DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <Flex alignItems="center" gap={ 3 }>
                      <TruncatedValue value={ detail.execute_transaction_hash }/>
                      <CopyToClipboard text={ detail.execute_transaction_hash }/>
                      { detail.execute_transaction_timestamp && (
                        <Text as="span" variant="secondary" whiteSpace="nowrap">
                          <DetailsTimestamp timestamp={ detail.execute_transaction_timestamp }/>
                        </Text>
                      ) }
                    </Flex>
                  </DetailsInfoItem.Value>
                </Grid>
              </Grid>
            </React.Fragment>
          );
        }) }
      </GridItem>
    </Grid>
  );
};

export default TwineL2TxnBatchDetails;
