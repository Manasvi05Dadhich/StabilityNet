import type { Address, PublicClient } from 'viem';
import { getTransactionCount } from 'viem/actions';
import { parseAbiItem } from 'viem';
import type { GovernanceVoteSignal, GovernorVoteQuery } from '../types.js';
import { getLogsAutoSplit } from '../rpc/getLogsAutoSplit.js';

const voteCastEvent = parseAbiItem(
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)'
);

function clampPercent(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, x));
}

async function estimateNewWalletVoters(params: {
  client: PublicClient;
  voters: Address[];
  // At (or before) which block to measure "prior activity".
  // We query txCount at this block; if 0 -> "new".
  atBlock: bigint;
  maxVotersToCheck: number;
}): Promise<number> {
  const { client, voters, atBlock, maxVotersToCheck } = params;

  const toCheck = voters.slice(0, maxVotersToCheck);
  let newCount = 0;

  // Small, safe concurrency to avoid hammering public RPCs
  const batchSize = 5;
  for (let i = 0; i < toCheck.length; i += batchSize) {
    const batch = toCheck.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (voter) => {
        try {
          const nonce = await getTransactionCount(client, {
            address: voter,
            blockNumber: atBlock
          });
          return nonce;
        } catch {
          return null;
        }
      })
    );

    for (const nonce of results) {
      if (nonce === 0) newCount += 1;
    }
  }

  return newCount;
}

export async function fetchGovernorVoteSignal(params: {
  client: PublicClient;
  query: GovernorVoteQuery;
}): Promise<GovernanceVoteSignal> {
  const { client, query } = params;

  // Note: In OpenZeppelin Governor's VoteCast event, `proposalId` is NOT indexed,
  // so we cannot filter by it at the RPC layer. We fetch VoteCast logs in a block range
  // and filter in-memory.
  const allLogs = await getLogsAutoSplit(client, {
    address: query.governor,
    event: voteCastEvent,
    fromBlock: query.fromBlock,
    toBlock: query.toBlock
  }) as any[];

  const logs = allLogs.filter((l) => l.args.proposalId === query.proposalId);

  let yes = 0n;
  let no = 0n;
  let abstain = 0n;

  const perVoter = new Map<Address, bigint>();

  for (const log of logs) {
    const voter = log.args.voter;
    const support = log.args.support;
    const weight = log.args.weight;

    if (!voter || typeof support !== 'number' || typeof weight !== 'bigint') continue;

    if (support === 1) yes += weight;
    else if (support === 0) no += weight;
    else abstain += weight;

    perVoter.set(voter, (perVoter.get(voter) ?? 0n) + weight);
  }

  const totalVotes = yes + no + abstain;
  const uniqueVoters = perVoter.size;
  const topVoterVotes = Array.from(perVoter.values()).reduce(
    (acc, w) => (w > acc ? w : acc),
    0n
  );

  const voteSplitPercent = totalVotes === 0n
    ? 0
    : clampPercent(
        (Number((yes > no ? yes - no : no - yes) * 10_000n / totalVotes) / 100)
      );

  const topVoterPercent = totalVotes === 0n
    ? 0
    : clampPercent(Number((topVoterVotes * 10_000n) / totalVotes) / 100);

  let newWalletVoters = 0;
  if (query.estimateNewWalletVoters && logs.length > 0) {
    // Use the latest log's blockNumber as reference.
    const lastLog = logs.at(-1)!;
    const atBlock = (lastLog.blockNumber ?? query.toBlock) - 1n;

    newWalletVoters = await estimateNewWalletVoters({
      client,
      voters: Array.from(perVoter.keys()),
      atBlock,
      maxVotersToCheck: 50
    });
  }

  return {
    proposalId: query.proposalId,
    yesVotes: yes,
    noVotes: no,
    abstainVotes: abstain,
    totalVotes,
    topVoterVotes,
    uniqueVoters,
    newWalletVoters,
    voteSplitPercent,
    topVoterPercent
  };
}
