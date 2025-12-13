import type {
  RiskBreakdown,
  Signals,
  StabilityReport
} from './types.js';

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function computeRiskBreakdown(signals: Signals): RiskBreakdown {
  // ECONOMIC RISK (0–40)
  const dropPercent = signals.liquidity?.dropPercent ?? 0;
  const liquidityRisk = clamp((dropPercent / 50) * 20, 0, 20);

  const largeTransfers = signals.whaleTransfers?.largeTransferCount ?? 0;
  const whaleRisk = clamp(Math.min(largeTransfers * 2, 10), 0, 10);

  const flashLoanCount = signals.flashLoans?.flashLoanCount ?? 0;
  const flashLoanRisk = clamp(Math.min(flashLoanCount * 2, 10), 0, 10);

  const economicRisk = clamp(liquidityRisk + whaleRisk + flashLoanRisk, 0, 40);

  // SOCIAL RISK (0–30)
  let voteSplitRisk = 0;
  let participationDropRisk = 0;

  if (signals.governanceVotes) {
    const totalVotes = signals.governanceVotes.totalVotes;

    // If there are no votes in the window, don't treat it as "high conflict".
    if (totalVotes > 0n) {
      const voteSplitPercent = signals.governanceVotes.voteSplitPercent;
      if (voteSplitPercent < 10) voteSplitRisk = 20;
      else if (voteSplitPercent <= 30) voteSplitRisk = 10;
      else voteSplitRisk = 5;
      voteSplitRisk = clamp(voteSplitRisk, 0, 20);

      const prevParticipation = signals.previousParticipationVotes ?? 0n;
      participationDropRisk =
        prevParticipation > 0n && totalVotes * 2n < prevParticipation ? 10 : 0;
    }
  }

  const socialRisk = clamp(voteSplitRisk + participationDropRisk, 0, 30);

  // GOVERNANCE RISK (0–30)
  const topVoterPercent = signals.governanceVotes?.topVoterPercent ?? 0;
  let topVoterDominanceRisk: number;
  if (topVoterPercent > 40) topVoterDominanceRisk = 20;
  else if (topVoterPercent >= 25) topVoterDominanceRisk = 10;
  else topVoterDominanceRisk = 0;
  topVoterDominanceRisk = clamp(topVoterDominanceRisk, 0, 20);

  const newWalletVoters = signals.governanceVotes?.newWalletVoters ?? 0;
  const sybilRisk = newWalletVoters > 10 ? 10 : 0;

  const governanceRisk = clamp(topVoterDominanceRisk + sybilRisk, 0, 30);

  return {
    liquidityRisk,
    whaleRisk,
    flashLoanRisk,
    economicRisk,
    voteSplitRisk,
    participationDropRisk,
    socialRisk,
    topVoterDominanceRisk,
    sybilRisk,
    governanceRisk
  };
}

export function computeInstabilityIndex(risks: RiskBreakdown): number {
  return clamp(risks.economicRisk + risks.socialRisk + risks.governanceRisk, 0, 100);
}

export function buildStabilityReport(signals: Signals): StabilityReport {
  const risks = computeRiskBreakdown(signals);
  const instabilityIndex = computeInstabilityIndex(risks);
  return { signals, risks, instabilityIndex };
}
