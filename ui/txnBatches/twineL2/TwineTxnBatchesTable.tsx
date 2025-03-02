import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TwineBatchesItem } from 'types/api/twineL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import TwineTxnBatchesTableItem from './TwineTxnBatchesTableItem';

type Props = {
  items: Array<TwineBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const TwineTxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table minW="1000px">
      <Thead top={ top }>
        <Tr>
          <Th width="40%">Batch #</Th>
          <Th width="60%">Status</Th>
          <Th width="150px">Age</Th>
          <Th width="150px">Txn count</Th>
          <Th width="210px">Commit tx</Th>
          <Th width="210px">Prove tx</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <TwineTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default TwineTxnBatchesTable;
