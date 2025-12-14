import type { AnalysisResult, RiskBreakdown, Signals } from "@/lib/state/analysis-context";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeRisks(signals: Signals): RiskBreakdown {
  // ECONOMIC (0–40)
  const liquidityRisk = clamp((signals.liquidityDropPercent / 50) * 20, 0, 20);
  const whaleRisk = clamp(Math.min(signals.largeTransfers * 2, 10), 0, 10);
  const flashLoanRisk = clamp(Math.min(signals.flashLoanCount * 2, 10), 0, 10);
  const economicRisk = liquidityRisk + whaleRisk + flashLoanRisk;

  // SOCIAL (0–30)
  const totalVotes = signals.totalVotes || signals.yesVotes + signals.noVotes;
  const voteSplitPercent = totalVotes
    ? (Math.abs(signals.yesVotes - signals.noVotes) / totalVotes) * 100
    : 100;

  const voteSplitRisk = voteSplitPercent < 10 ? 20 : voteSplitPercent <= 30 ? 10 : 5;

  const participationDropRisk =
    signals.previousParticipation > 0 &&
    signals.participation < signals.previousParticipation / 2
      ? 10
      : 0;

  const socialRisk = voteSplitRisk + participationDropRisk;

  // GOVERNANCE (0–30)
  const topVoterPercent = totalVotes ? (signals.topVoterVotes / totalVotes) * 100 : 0;
  const topVoterDominance = topVoterPercent > 40 ? 20 : topVoterPercent >= 25 ? 10 : 0;
  const sybilRisk = signals.newWalletVoters > 10 ? 10 : 0;

  const governanceRisk = topVoterDominance + sybilRisk;

  const instabilityIndex = clamp(economicRisk + socialRisk + governanceRisk, 0, 100);

  return {
    liquidityRisk,
    whaleRisk,
    flashLoanRisk,
    economicRisk,
    voteSplitRisk,
    participationDropRisk,
    socialRisk,
    topVoterDominance,
    sybilRisk,
    governanceRisk,
    instabilityIndex,
  };
}

/**
 * TODO (Person2): replace fetchSignals() with real viem-based, browser-only signal gathering.
 */
async function fetchSignals(): Promise<Signals> {
  // Placeholder data so the UI works end-to-end immediately.
  // Replace with real chain queries (Uniswap reserves, ERC20 Transfer logs, Aave events, Governor votes).
  return {
    liquidityDropPercent: 12,
    largeTransfers: 2,
    flashLoanCount: 1,
    yesVotes: 510,
    noVotes: 490,
    totalVotes: 1000,
    participation: 1000,
    previousParticipation: 1800,
    topVoterVotes: 420,
    newWalletVoters: 3,
  };
}

export async function analyzeChain(): Promise<AnalysisResult> {
  const signals = await fetchSignals();
  const risks = computeRisks(signals);

  return {
    signals,
    risks,
    updatedAt: Date.now(),
  };
}
