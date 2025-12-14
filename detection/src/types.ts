import type { Address, Hex } from 'viem';

export type LiquiditySnapshot = {
  reserve0: bigint;
  reserve1: bigint;
  blockTimestampLast: number;
};

export type LiquiditySignal = {
  previous?: LiquiditySnapshot;
  current: LiquiditySnapshot;
  dropPercent: number; // 0..100
};

export type WhaleTransferSignal = {
  largeTransferCount: number;
};

export type FlashLoanSignal = {
  flashLoanCount: number;
};

export type GovernanceVoteSignal = {
  proposalId: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
  totalVotes: bigint;
  topVoterVotes: bigint;
  uniqueVoters: number;
  newWalletVoters: number;
  voteSplitPercent: number; // 0..100
  topVoterPercent: number; // 0..100
};

export type Signals = {
  liquidity?: LiquiditySignal;
  whaleTransfers?: WhaleTransferSignal;
  flashLoans?: FlashLoanSignal;
  governanceVotes?: GovernanceVoteSignal;
  // Optional previous participation if you want ParticipationDropRisk (0/10)
  previousParticipationVotes?: bigint;
};

export type EconomicRisk = {
  liquidityRisk: number; // 0..20
  whaleRisk: number; // 0..10
  flashLoanRisk: number; // 0..10
  economicRisk: number; // 0..40
};

export type SocialRisk = {
  voteSplitRisk: number; // 0..20
  participationDropRisk: number; // 0..10
  socialRisk: number; // 0..30
};

export type GovernanceRisk = {
  topVoterDominanceRisk: number; // 0..20
  sybilRisk: number; // 0..10
  governanceRisk: number; // 0..30
};

export type RiskBreakdown = EconomicRisk & SocialRisk & GovernanceRisk;

export type StabilityReport = {
  signals: Signals;
  risks: RiskBreakdown;
  instabilityIndex: number; // 0..100 (clamped)
};

export type PublishScoreParams = {
  oracleAddress: Address;
  score: bigint;
  // minimal ABI fragment is provided in abiFragments.ts
  abi?: readonly unknown[];
};

export type Erc20TransferLogQuery = {
  token: Address;
  fromBlock: bigint;
  toBlock: bigint;
  minTransferAmount: bigint;
};

export type EventCountQuery = {
  address: Address;
  fromBlock: bigint;
  toBlock: bigint;
  eventAbiItem: string; // e.g. "event FlashLoan(...)"
  args?: Record<string, unknown>;
  strict?: boolean;
};

export type GovernorVoteQuery = {
  governor: Address;
  proposalId: bigint;
  fromBlock: bigint;
  toBlock: bigint;
  // If true, does additional RPC calls per voter to estimate "new wallet" voters
  // (can be slow on public RPCs)
  estimateNewWalletVoters?: boolean;
};

export type BytesLike = Hex;
