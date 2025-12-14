"use client";

import type { ReactNode } from "react";
import { Activity, BarChart3, Droplets, Shield, Users } from "lucide-react";
import { useAnalysis } from "@/lib/state/analysis-context";

export default function SignalsPage() {
  const { analysis } = useAnalysis();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Signals</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Raw signals produced by Person2 analysis (browser-only)
          </p>
        </div>
      </div>

      {!analysis ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          No analysis run yet. Go to <span className="font-medium">Publish Score</span> and click
          <span className="font-medium"> Analyze Chain</span>.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SignalCard
            title="Liquidity Drop"
            icon={<Droplets className="h-5 w-5" />}
            value={`${analysis.signals.liquidityDropPercent.toFixed(2)}%`}
            subtitle="(Uniswap reserves delta)"
          />
          <SignalCard
            title="Whale Transfers"
            icon={<Users className="h-5 w-5" />}
            value={`${analysis.signals.largeTransfers}`}
            subtitle="Large ERC20 transfers"
          />
          <SignalCard
            title="Flash Loan Count"
            icon={<Activity className="h-5 w-5" />}
            value={`${analysis.signals.flashLoanCount}`}
            subtitle="Aave events"
          />
          <SignalCard
            title="DAO Vote Split"
            icon={<BarChart3 className="h-5 w-5" />}
            value={`${analysis.signals.yesVotes} / ${analysis.signals.noVotes}`}
            subtitle={`Total votes: ${analysis.signals.totalVotes}`}
          />

          <div className="lg:col-span-2 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Risk Breakdown</h2>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Shield className="h-4 w-4" />
                <span>Index: {analysis.risks.instabilityIndex.toFixed(1)}/100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <RiskPill label="Economic" value={analysis.risks.economicRisk} />
              <RiskPill label="Social" value={analysis.risks.socialRisk} />
              <RiskPill label="Governance" value={analysis.risks.governanceRisk} />
            </div>

            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Updated: {new Date(analysis.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalCard({
  title,
  icon,
  value,
  subtitle,
}: {
  title: string;
  icon: ReactNode;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>
        <div className="rounded-full bg-blue-100 p-3 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

function RiskPill({ label, value }: { label: string; value: number }) {
  const color = value >= 20 ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300" :
    value >= 10 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
        {value.toFixed(1)}
      </p>
    </div>
  );
}
