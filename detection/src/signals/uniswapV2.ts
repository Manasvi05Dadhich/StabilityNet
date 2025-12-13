import type { Address, PublicClient } from 'viem';
import { readContract } from 'viem/actions';
import { uniswapV2PairAbi } from '../abiFragments.js';
import type { LiquiditySignal, LiquiditySnapshot } from '../types.js';

export async function fetchUniswapV2Reserves(params: {
  client: PublicClient;
  pair: Address;
}): Promise<LiquiditySnapshot> {
  const { client, pair } = params;

  const [reserve0, reserve1, blockTimestampLast] = await readContract(client, {
    address: pair,
    abi: uniswapV2PairAbi,
    functionName: 'getReserves'
  });

  return {
    reserve0,
    reserve1,
    blockTimestampLast: Number(blockTimestampLast)
  };
}

function percentDrop(prev: bigint, curr: bigint): number {
  if (prev <= 0n) return 0;
  if (curr >= prev) return 0;
  const drop = prev - curr;
  // ((drop / prev) * 100)
  return Number((drop * 10_000n) / prev) / 100;
}

export function computeLiquidityDropPercent(params: {
  previous?: LiquiditySnapshot;
  current: LiquiditySnapshot;
}): LiquiditySignal {
  const { previous, current } = params;

  if (!previous) {
    return {
      previous,
      current,
      dropPercent: 0
    };
  }

  // Compare each reserve independently and take the max drop as "liquidity drop" signal.
  // (Reserves are in different token units, so summing them is often misleading.)
  const drop0 = percentDrop(previous.reserve0, current.reserve0);
  const drop1 = percentDrop(previous.reserve1, current.reserve1);

  return {
    previous,
    current,
    dropPercent: Math.min(Math.max(drop0, drop1), 100)
  };
}
