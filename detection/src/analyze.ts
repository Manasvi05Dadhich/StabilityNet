import type { Address, PublicClient } from 'viem';
import type {
  Erc20TransferLogQuery,
  EventCountQuery,
  GovernorVoteQuery,
  LiquiditySnapshot,
  Signals,
  StabilityReport
} from './types.js';
import { buildStabilityReport } from './scoring.js';
import { fetchUniswapV2Reserves, computeLiquidityDropPercent } from './signals/uniswapV2.js';
import { countWhaleTransfers } from './signals/erc20Transfers.js';
import { countEvents } from './signals/eventCounter.js';
import { fetchGovernorVoteSignal } from './signals/governorVotes.js';

export type AnalyzeParams = {
  client: PublicClient;

  // A) Liquidity drop
  uniswapV2Pair?: Address;
  previousReserves?: LiquiditySnapshot;

  // B) Whale transfers
  whaleTransferQuery?: Erc20TransferLogQuery;

  // C) Flash loan events (generic event counter)
  flashLoanEventQuery?: EventCountQuery;

  // D) DAO vote split / dominance / sybil proxy
  governorVoteQuery?: GovernorVoteQuery;

  // Optional: previous participation (votes) for participation drop risk
  previousParticipationVotes?: bigint;
};

export async function analyze(params: AnalyzeParams): Promise<StabilityReport> {
  const { client } = params;
  const signals: Signals = {
    previousParticipationVotes: params.previousParticipationVotes
  };

  if (params.uniswapV2Pair) {
    const current = await fetchUniswapV2Reserves({ client, pair: params.uniswapV2Pair });
    signals.liquidity = computeLiquidityDropPercent({
      previous: params.previousReserves,
      current
    });
  }

  if (params.whaleTransferQuery) {
    signals.whaleTransfers = await countWhaleTransfers({
      client,
      query: params.whaleTransferQuery
    });
  }

  if (params.flashLoanEventQuery) {
    const flashLoanCount = await countEvents({ client, query: params.flashLoanEventQuery });
    signals.flashLoans = { flashLoanCount };
  }

  if (params.governorVoteQuery) {
    signals.governanceVotes = await fetchGovernorVoteSignal({
      client,
      query: params.governorVoteQuery
    });
  }

  return buildStabilityReport(signals);
}
