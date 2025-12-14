"use client";

import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

import { useGlobalIndex } from "@/lib/fetchers/getIndex";

export default function ScoreCard() {
  const globalIndex = useGlobalIndex();
  const score = globalIndex.data !== undefined ? Number(globalIndex.data) : null;

  const getScoreColor = (n: number) => {
    // Lower is better for instability.
    if (n < 40) return "text-green-600 dark:text-green-400";
    if (n < 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (n: number) => {
    if (n < 40) return "bg-green-100 dark:bg-green-900/20";
    if (n < 75) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Global Instability Index</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">On-chain value from StabilityOracle</p>
        </div>
        <div className={`rounded-full p-3 ${score !== null ? getScoreBgColor(score) : "bg-zinc-100 dark:bg-zinc-800"}`}>
          <Shield className={`h-6 w-6 ${score !== null ? getScoreColor(score) : "text-zinc-500"}`} />
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-5xl font-bold ${score !== null ? getScoreColor(score) : "text-zinc-500"}`}>
            {globalIndex.isLoading ? "…" : score !== null ? score : "—"}
          </span>
          <span className="text-xl text-zinc-500 dark:text-zinc-400">/100</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        {score !== null && score >= 75 ? (
          <>
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">Threshold reached — defenses should activate</span>
          </>
        ) : (
          <>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-zinc-600 dark:text-zinc-400">Below threshold</span>
          </>
        )}
      </div>

      {globalIndex.error && (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">{globalIndex.error.message}</p>
      )}
    </div>
  );
}






















