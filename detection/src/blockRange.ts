import type { PublicClient } from 'viem';
import { getBlockNumber } from 'viem/actions';

export type BlockRangeInput = {
  fromBlock?: bigint;
  toBlock?: bigint;
  // used if fromBlock is not provided
  blocksBack?: number;
};

export async function resolveBlockRange(
  client: PublicClient,
  input: BlockRangeInput
): Promise<{ fromBlock: bigint; toBlock: bigint }> {
  const toBlock =
    input.toBlock ?? (await getBlockNumber(client));

  if (input.fromBlock !== undefined) {
    return { fromBlock: input.fromBlock, toBlock };
  }

  const blocksBack = BigInt(Math.max(0, input.blocksBack ?? 5000));
  const fromBlock = toBlock > blocksBack ? toBlock - blocksBack : 0n;
  return { fromBlock, toBlock };
}
