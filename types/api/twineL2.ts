import type { Transaction } from './transaction';

export const TWINE_L2_TX_BATCH_STATUSES = [
  'Processed on L2' as const,
  'Committed on L1' as const,
  'Batch Finalized on L1' as const,
  'Batch Txs Finalized on L1' as const,
  'Executed on L1' as const,
] as const;

export type TwineBatchStatus = typeof TWINE_L2_TX_BATCH_STATUSES[number];

export type TwineL2DepositsItem = {
  l1_tx_hash: string;
  l2_tx_hash: string;
  slot_number: number | null;
  l2_slot_number: number;
  block_number: number;
  nonce: number;
  chain_id: number;
  l1_token: string;
  l2_token: string;
  from: string;
  to_twine_address: string;
  amount: string;
  created_at: string;
};

export type TwineL2DepositsResponse = {
  items: Array<TwineL2DepositsItem>;
  next_page_params: {
    items_count: number;
    l1_block_number: number;
    transaction_hash: string;
  };
};

export type TwineL2WithdrawalsItem = {
  l1_tx_hash: string;
  l2_tx_hash: string;
  slot_number: number | null;
  l2_slot_number: number;
  block_number: number;
  nonce: number;
  chain_id: number;
  l1_token: string;
  l2_token: string;
  from: string;
  to_twine_address: string;
  amount: string;
  created_at: string;
};

export type TwineL2WithdrawalsResponse = {
  items: Array<TwineL2WithdrawalsItem>;
  next_page_params: {
    items_count: number;
    nonce: string;
  };
};

export interface TwineBatchesDetails {
  id: number;
  chain_id: string;
  l1_gas_price: string;
  l1_transaction_count: number;
  l2_transaction_count: number;
  l2_fair_gas_price: string;
  commit_transaction_hash: string;
  commit_transaction_timestamp: string;
  execute_transaction_hash: string;
  execute_transaction_timestamp: string;
  prove_transaction_hash: string | null;
  prove_transaction_timestamp: string | null;
  finalize_transaction_hash: string | null;
  finalize_transaction_timestamp: string | null;
  status: TwineBatchStatus;
}

export interface TwineBatchesItem {
  number: number;
  timestamp: string;
  details: Array<TwineBatchesDetails>;
  start_block: number;
  end_block: number;
  root_hash: string;
}

export type TwineBatchesResponse = {
  batches: Array<TwineBatchesItem>;
  items: null;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
};

export interface TwineBatch extends TwineBatchesItem {
  commit_transaction_hash: string | null;
  commit_transaction_timestamp: string | null;
  prove_transaction_hash: string | null;
  prove_transaction_timestamp: string | null;
  status: TwineBatchStatus;
  transaction_count: number;
  next_page_params: null;
  items: null;
}

export type TwineBatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    index: number;
    items_count: number;
  } | null;
};
