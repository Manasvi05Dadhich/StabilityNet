"use client";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import { useAnalysis } from "@/lib/state/analysis-context";

export default function RiskBreakdown() {
  const { analysis } = useAnalysis();

  const risks = analysis
    ? [
        { label: "Economic", value: analysis.risks.economicRisk },
        { label: "Social", value: analysis.risks.socialRisk },
        { label: "Governance", value: analysis.risks.governanceRisk },
      ]
    : null;

  const classify = (value: number) => {
    if (value >= 20) return "high";
    if (value >= 10) return "medium";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20";
      default:
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Risk Breakdown</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {analysis ? "From latest analysis" : "Run analysis on Publish Score page"}
        </p>
      </div>

      {!risks ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">No analysis data yet.</div>
      ) : (
        <div className="space-y-3">
          {risks.map((r) => {
            const level = classify(r.value);
            return (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-1.5 ${getRiskColor(level)}`}>{getRiskIcon(level)}</div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.label}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.value.toFixed(1)} points</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getRiskColor(level)}`}>
                  {level}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}






















