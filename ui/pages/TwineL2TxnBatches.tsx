import { Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { TWINE_L2_TXN_BATCHES_ITEM } from 'stubs/twineL2';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import TwineTxnBatchesListItem from 'ui/txnBatches/twineL2/TwineTxnBatchesListItem';
import TwineTxnBatchesTable from 'ui/txnBatches/twineL2/TwineTxnBatchesTable';

const TwineL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'twine_l2_txn_batches',
    options: {
      placeholderData: {
        batches: Array(50).fill(TWINE_L2_TXN_BATCHES_ITEM),
        items: null,
        next_page_params: {
          items_count: 50,
          number: 9045200,
        },
      },
    },
  });

  const countersQuery = useApiQuery('twine_l2_txn_batches', {
    queryOptions: {
      placeholderData: {
        batches: [ TWINE_L2_TXN_BATCHES_ITEM ],
        next_page_params: null,
        items: null,
      },
    },
  });

  const content = data?.batches ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.batches.map((item, index) => (
          <TwineTxnBatchesListItem
            key={ item.number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <TwineTxnBatchesTable items={ data.batches } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.batches.length) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isPlaceholderData } display="flex" flexWrap="wrap">
        Txn batch
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.batches[0].number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.batches[data.batches.length - 1].number } </Text>
        (total of { data.batches.length.toLocaleString() } batches)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Txn batches" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.batches }
        emptyText="There are no txn batches."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default TwineL2TxnBatches;
