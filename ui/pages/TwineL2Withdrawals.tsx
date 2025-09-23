import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import { TWINE_WITHDRAWAL_ITEM, TWINE_L1_WITHDRAWAL_ITEM } from 'stubs/twineL2';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TwineL1WithdrawalsListItem from 'ui/withdrawals/twineL2/TwineL1WithdrawalsListItem';
import TwineL1WithdrawalsTable from 'ui/withdrawals/twineL2/TwineL1WithdrawalsTable';
import TwineWithdrawalsListItem from 'ui/withdrawals/twineL2/TwineL2WithdrawalsListItem';
import TwineWithdrawalsTable from 'ui/withdrawals/twineL2/TwineL2WithdrawalsTable';

const TwineL2Withdrawals = () => {
  const router = useRouter();
  const tab = router.query.tab as string;

  const l2WithdrawalsQuery = useQueryWithPages({
    resourceName: 'twine_l2_withdrawals',
    options: {
      placeholderData: generateListStub<'twine_l2_withdrawals'>(
        TWINE_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            nonce: '',
          },
        },
      ),
    },
  });

  const l1WithdrawalsQuery = useQueryWithPages({
    resourceName: 'twine_l1_withdrawals',
    options: {
      placeholderData: generateListStub<'twine_l1_withdrawals'>(
        TWINE_L1_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            nonce: '',
          },
        },
      ),
    },
  });

  const tabs: Array<RoutedTab> = [
    {
      id: 'l2_initiated',
      title: 'L2 Initiated Withdrawals',
      component: (
        <>
          <Show below="lg" ssr={ false }>
            { l2WithdrawalsQuery.data?.items?.map(((item, index) => (
              <TwineWithdrawalsListItem
                key={ item.source_tx_hash + (l2WithdrawalsQuery.isPlaceholderData ? index : '') }
                isLoading={ l2WithdrawalsQuery.isPlaceholderData }
                item={ item }
              />
            ))) }
          </Show>
          <Hide below="lg" ssr={ false }>
            <TwineWithdrawalsTable
              items={ l2WithdrawalsQuery.data?.items || [] }
              top={ l2WithdrawalsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
              isLoading={ l2WithdrawalsQuery.isPlaceholderData }
            />
          </Hide>
        </>
      ),
    },
    {
      id: 'l1_initiated',
      title: 'L1 Initiated Withdrawals',
      component: (
        <>
          <Show below="lg" ssr={ false }>
            { l1WithdrawalsQuery.data?.items?.map(((item, index) => (
              <TwineL1WithdrawalsListItem
                key={ item.source_tx_hash + (l1WithdrawalsQuery.isPlaceholderData ? index : '') }
                isLoading={ l1WithdrawalsQuery.isPlaceholderData }
                item={ item }
              />
            ))) }
          </Show>
          <Hide below="lg" ssr={ false }>
            <TwineL1WithdrawalsTable
              items={ l1WithdrawalsQuery.data?.items || [] }
              top={ l1WithdrawalsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
              isLoading={ l1WithdrawalsQuery.isPlaceholderData }
            />
          </Hide>
        </>
      ),
    },
  ];

  const currentQuery = tab === 'l1_initiated' ? l1WithdrawalsQuery : l2WithdrawalsQuery;
  const { data, isError, pagination } = currentQuery;

  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = <RoutedTabs tabs={ tabs }/>;

  return (
    <>
      <PageTitle title="Withdrawals" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no withdrawals."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default TwineL2Withdrawals;
