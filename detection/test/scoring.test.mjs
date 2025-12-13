import test from 'node:test';
import assert from 'node:assert/strict';

import { computeRiskBreakdown, computeInstabilityIndex } from '../dist/scoring.js';

test('economic risk: liquidityRisk scales dropPercent / 50% * 20 (clamped)', () => {
  const risks0 = computeRiskBreakdown({ liquidity: { current: { reserve0: 0n, reserve1: 0n, blockTimestampLast: 0 }, dropPercent: 0 } });
  assert.equal(risks0.liquidityRisk, 0);

  const risks25 = computeRiskBreakdown({ liquidity: { current: { reserve0: 0n, reserve1: 0n, blockTimestampLast: 0 }, dropPercent: 25 } });
  assert.equal(risks25.liquidityRisk, 10);

  const risks50 = computeRiskBreakdown({ liquidity: { current: { reserve0: 0n, reserve1: 0n, blockTimestampLast: 0 }, dropPercent: 50 } });
  assert.equal(risks50.liquidityRisk, 20);

  const risks200 = computeRiskBreakdown({ liquidity: { current: { reserve0: 0n, reserve1: 0n, blockTimestampLast: 0 }, dropPercent: 200 } });
  assert.equal(risks200.liquidityRisk, 20);
});

test('economic risk: whaleRisk = min(largeTransfers * 2, 10)', () => {
  const r0 = computeRiskBreakdown({ whaleTransfers: { largeTransferCount: 0 } });
  assert.equal(r0.whaleRisk, 0);

  const r1 = computeRiskBreakdown({ whaleTransfers: { largeTransferCount: 1 } });
  assert.equal(r1.whaleRisk, 2);

  const r5 = computeRiskBreakdown({ whaleTransfers: { largeTransferCount: 5 } });
  assert.equal(r5.whaleRisk, 10);
});

test('economic risk: flashLoanRisk = min(flashLoanCount * 2, 10)', () => {
  const r0 = computeRiskBreakdown({ flashLoans: { flashLoanCount: 0 } });
  assert.equal(r0.flashLoanRisk, 0);

  const r1 = computeRiskBreakdown({ flashLoans: { flashLoanCount: 1 } });
  assert.equal(r1.flashLoanRisk, 2);

  const r10 = computeRiskBreakdown({ flashLoans: { flashLoanCount: 10 } });
  assert.equal(r10.flashLoanRisk, 10);
});

test('social risk: voteSplitRisk mapping (<10% => 20, 10-30 => 10, else 5)', () => {
  const mk = (voteSplitPercent) => ({
    governanceVotes: {
      proposalId: 1n,
      yesVotes: 0n,
      noVotes: 0n,
      abstainVotes: 0n,
      // voteSplitRisk is only meaningful when there were votes in the window
      totalVotes: 100n,
      topVoterVotes: 0n,
      uniqueVoters: 0,
      newWalletVoters: 0,
      voteSplitPercent,
      topVoterPercent: 0
    }
  });

  assert.equal(computeRiskBreakdown(mk(9)).voteSplitRisk, 20);
  assert.equal(computeRiskBreakdown(mk(10)).voteSplitRisk, 10);
  assert.equal(computeRiskBreakdown(mk(30)).voteSplitRisk, 10);
  assert.equal(computeRiskBreakdown(mk(31)).voteSplitRisk, 5);
});

test('governance risk: topVoter dominance mapping (>40 => 20, 25-40 => 10, else 0)', () => {
  const mk = (topVoterPercent) => ({
    governanceVotes: {
      proposalId: 1n,
      yesVotes: 0n,
      noVotes: 0n,
      abstainVotes: 0n,
      totalVotes: 0n,
      topVoterVotes: 0n,
      uniqueVoters: 0,
      newWalletVoters: 0,
      voteSplitPercent: 50,
      topVoterPercent
    }
  });

  assert.equal(computeRiskBreakdown(mk(41)).topVoterDominanceRisk, 20);
  assert.equal(computeRiskBreakdown(mk(40)).topVoterDominanceRisk, 10);
  assert.equal(computeRiskBreakdown(mk(25)).topVoterDominanceRisk, 10);
  assert.equal(computeRiskBreakdown(mk(24)).topVoterDominanceRisk, 0);
});

test('final index sums category risks and clamps to 0..100', () => {
  const risks = computeRiskBreakdown({
    liquidity: { current: { reserve0: 0n, reserve1: 0n, blockTimestampLast: 0 }, dropPercent: 50 }, // 20
    whaleTransfers: { largeTransferCount: 5 }, // 10
    flashLoans: { flashLoanCount: 10 } // 10
  });

  assert.equal(risks.economicRisk, 40);

  const idx = computeInstabilityIndex(risks);
  assert.equal(idx, 40);

  const idx2 = computeInstabilityIndex({ ...risks, socialRisk: 30, governanceRisk: 40 });
  assert.equal(idx2, 100);
});
