"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type RiskBreakdown = {
  liquidityRisk: number;
  whaleRisk: number;
  flashLoanRisk: number;
  economicRisk: number;

  voteSplitRisk: number;
  participationDropRisk: number;
  socialRisk: number;

  topVoterDominance: number;
  sybilRisk: number;
  governanceRisk: number;

  instabilityIndex: number;
};

export type Signals = {
  liquidityDropPercent: number;
  largeTransfers: number;
  flashLoanCount: number;

  yesVotes: number;
  noVotes: number;
  totalVotes: number;

  participation: number;
  previousParticipation: number;

  topVoterVotes: number;
  newWalletVoters: number;
};

export type AnalysisResult = {
  signals: Signals;
  risks: RiskBreakdown;
  updatedAt: number; // unix ms
};

type AnalysisContextValue = {
  analysis: AnalysisResult | null;
  setAnalysis: (result: AnalysisResult | null) => void;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

const STORAGE_KEY = "stabilitynet.analysis.v1";

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysis, setAnalysisState] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AnalysisResult;
      if (parsed?.signals && parsed?.risks && typeof parsed.updatedAt === "number") {
        setAnalysisState(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const setAnalysis = useCallback((result: AnalysisResult | null) => {
    setAnalysisState(result);
    try {
      if (!result) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ analysis, setAnalysis }), [analysis, setAnalysis]);

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
}

export function emptyAnalysis(): AnalysisResult {
  return {
    signals: {
      liquidityDropPercent: 0,
      largeTransfers: 0,
      flashLoanCount: 0,
      yesVotes: 0,
      noVotes: 0,
      totalVotes: 0,
      participation: 0,
      previousParticipation: 0,
      topVoterVotes: 0,
      newWalletVoters: 0,
    },
    risks: {
      liquidityRisk: 0,
      whaleRisk: 0,
      flashLoanRisk: 0,
      economicRisk: 0,
      voteSplitRisk: 0,
      participationDropRisk: 0,
      socialRisk: 0,
      topVoterDominance: 0,
      sybilRisk: 0,
      governanceRisk: 0,
      instabilityIndex: 0,
    },
    updatedAt: Date.now(),
  };
}
