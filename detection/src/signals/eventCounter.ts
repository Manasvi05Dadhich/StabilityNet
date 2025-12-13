import type { AbiEvent, PublicClient } from 'viem';
import { parseAbiItem } from 'viem';
import type { EventCountQuery } from '../types.js';
import { getLogsAutoSplit } from '../rpc/getLogsAutoSplit.js';

export async function countEvents(params: {
  client: PublicClient;
  query: EventCountQuery;
}): Promise<number> {
  const { client, query } = params;

  const abiItem = parseAbiItem(query.eventAbiItem);
  if (abiItem.type !== 'event') {
    throw new Error('eventAbiItem must be an event ABI item string');
  }

  const event = abiItem as AbiEvent;
  const logs = await getLogsAutoSplit(client, {
    address: query.address,
    event,
    args: query.args as any,
    fromBlock: query.fromBlock,
    toBlock: query.toBlock,
    strict: query.strict ?? false
  }) as any[];

  return logs.length;
}
