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

const truncateHash = (hash: string) => {
  if (hash.length <= 12) return hash;
  return `${ hash.slice(0, 10) }...${ hash.slice(-10) }`;
};

const formatTxHash = (chainId: string, txHash: string) => {

  if (!txHash) return '';

  if (chainId === '103' || chainId === '900') {
    const base58Hash = (txHash);
    return truncateHash(base58Hash);
  }
  const formattedHash = txHash.startsWith('0x') ? txHash : `0x${ txHash }`;
  return truncateHash(formattedHash);
};

const getClipBoardText = (chainId: string, txHash: string) => {
  if (!txHash) return '';

  if (chainId === '103' || chainId === '900') {
    return (txHash);
  }

  return txHash.startsWith('0x') ? txHash : `0x${ txHash }`;
};

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

                { detail.prove_transaction_hash && (
                  <>
                    <DetailsInfoItem.Label>Prove transaction</DetailsInfoItem.Label>
                    <DetailsInfoItem.Value>
                      <Flex gap={ 3 } direction="column" >
                        <div className="flex gap-3 items-center justify-center">
                          <TwineExternalLink href={ detail.prove_transaction_hash } chainId={ detail.chain_id }>
                            <TruncatedValue value={ formatTxHash(detail.chain_id, detail.prove_transaction_hash) }/>
                          </TwineExternalLink>
                          <CopyToClipboard text={ getClipBoardText(detail.chain_id, detail.prove_transaction_hash) }/>
                        </div>
                        { detail.prove_transaction_timestamp && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <DetailsTimestamp timestamp={ detail.prove_transaction_timestamp }/>
                          </div>
                        ) }
                      </Flex>
                    </DetailsInfoItem.Value>
                  </>
                ) }

                { detail.execute_transaction_hash && (
                  <>
                    <DetailsInfoItem.Label>Execute transaction</DetailsInfoItem.Label>
                    <DetailsInfoItem.Value>
                      <Flex gap={ 3 } direction="column" >
                        <div className="flex gap-3 items-center justify-center">
                          <TwineExternalLink href={ detail.execute_transaction_hash } chainId={ detail.chain_id }>
                            <TruncatedValue value={ formatTxHash(detail.chain_id, detail.execute_transaction_hash) }/>
                          </TwineExternalLink>
                          <CopyToClipboard text={ getClipBoardText(detail.chain_id, detail.execute_transaction_hash) }/>
                        </div>
                        { detail.execute_transaction_timestamp && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <DetailsTimestamp timestamp={ detail.execute_transaction_timestamp }/>
                          </div>
                        ) }
                      </Flex>
                    </DetailsInfoItem.Value>
                  </>
                ) }
                { detail.finalize_transaction_hash && (
                  <>
                    <DetailsInfoItem.Label>Finalize transaction</DetailsInfoItem.Label>
                    <DetailsInfoItem.Value>
                      <Flex gap={ 3 } direction="column" >
                        <div className="flex gap-3 items-center justify-center">
                          <TwineExternalLink href={ detail.finalize_transaction_hash } chainId={ detail.chain_id }>
                            <TruncatedValue value={ formatTxHash(detail.chain_id, detail.finalize_transaction_hash) }/>
                          </TwineExternalLink>
                          <CopyToClipboard text={ getClipBoardText(detail.chain_id, detail.finalize_transaction_hash) }/>
                        </div>
                        { detail.finalize_transaction_timestamp && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <DetailsTimestamp timestamp={ detail.finalize_transaction_timestamp }/>
                          </div>
                        ) }
                      </Flex>
                    </DetailsInfoItem.Value>
                  </>
                ) }

              </Grid>
            </Grid>
          </React.Fragment>
        );
      }) }
    </GridItem>
  );
};
