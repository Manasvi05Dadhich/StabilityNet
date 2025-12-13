import type { Address, PublicClient } from 'viem';
import { parseAbiItem } from 'viem';
import type { Erc20TransferLogQuery, WhaleTransferSignal } from '../types.js';
import { getLogsAutoSplit } from '../rpc/getLogsAutoSplit.js';

const transferEvent = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)'
);

export async function countWhaleTransfers(params: {
  client: PublicClient;
  query: Erc20TransferLogQuery;
}): Promise<WhaleTransferSignal> {
  const { client, query } = params;

  const logs = await getLogsAutoSplit(client, {
    address: query.token,
    event: transferEvent,
    fromBlock: query.fromBlock,
    toBlock: query.toBlock
  }) as any[];

  let count = 0;
  for (const log of logs) {
    const value = log.args.value;
    if (typeof value === 'bigint' && value >= query.minTransferAmount) {
      count += 1;
    }
  }

  return { largeTransferCount: count };
}
