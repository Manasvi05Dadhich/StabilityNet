import type { Address, WalletClient } from 'viem';
import { writeContract } from 'viem/actions';
import { stabilityOracleAbi } from './abiFragments.js';
import type { PublishScoreParams } from './types.js';

export async function publishScore(params: {
  walletClient: WalletClient;
  oracleAddress: Address;
  score: bigint;
  abi?: PublishScoreParams['abi'];
}): Promise<`0x${string}`> {
  const { walletClient, oracleAddress, score, abi } = params;

  const account = walletClient.account;
  if (!account) {
    throw new Error('publishScore requires walletClient.account (connect wallet first)');
  }

  // viem typings require explicit chain/account overrides in some configurations.
  const hash = await writeContract(walletClient, {
    chain: walletClient.chain,
    account,
    address: oracleAddress,
    abi: (abi ?? stabilityOracleAbi) as any,
    functionName: 'publishScore',
    args: [score]
  });

  return hash;
}
