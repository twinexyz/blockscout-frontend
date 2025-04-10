import { Grid, GridItem, Text, Flex, Tag } from '@chakra-ui/react';
import React from 'react';
import { Element } from 'react-scroll';

import type { TwineBatchesItem } from 'types/api/twineL2';

import { isTwineChainId, TWINE_CHAIN_MAPPING } from 'configs/app/features/twine';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import CopyToClipboard from './CopyToClipboard';
import DetailsInfoItemDivider from './DetailsInfoItemDivider';
import DetailsTimestamp from './DetailsTimestamp';
import TwineExternalLink from './links/TwineExternalLink';
import TruncatedValue from './TruncatedValue';

interface Props {
  chainDetails: TwineBatchesItem['details'];
}

export const TwineIndividualChainDetails = ({ chainDetails }: Props) => {
  return (
    <GridItem colSpan={{ base: undefined, lg: 2 }}>
      <Element name="TwineL2TxnBatchDetails__cutLink"/>
      { chainDetails.map((detail, index) => {
        const chainName = isTwineChainId(detail.chain_id) ? TWINE_CHAIN_MAPPING[detail.chain_id].name : `Chain ${ detail.chain_id }`;
        return (
          <React.Fragment key={ index }>
            <Grid
              mt={ index === 0 ? 6 : 8 }
              pb={ 6 }
              borderBottom={ index < chainDetails.length - 1 ? '1px solid' : 'none' }
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
                    <TwineExternalLink href={ detail.commit_transaction_hash } chainId={ detail.chain_id }>
                      <TruncatedValue value={ detail.commit_transaction_hash }/>
                    </TwineExternalLink>
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
                        <TwineExternalLink href={ detail.prove_transaction_hash } chainId={ detail.chain_id }>
                          <TruncatedValue value={ detail.prove_transaction_hash }/>
                        </TwineExternalLink>
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
                    <TwineExternalLink href={ detail.execute_transaction_hash } chainId={ detail.chain_id }>
                      <TruncatedValue value={ detail.execute_transaction_hash }/>
                    </TwineExternalLink>
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
  );
};
