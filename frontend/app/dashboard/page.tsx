"use client";

import ScoreCard from "@/components/ScoreCard";
import RiskChart from "@/components/RiskChart";
import RiskBreakdown from "@/components/RiskBreakdown";
import Alertsfeed from "@/components/Alertsfeed";
import { Activity, Shield } from "lucide-react";

import { useGlobalIndex } from "@/lib/fetchers/getIndex";
import { useStabilityAlerts } from "@/lib/fetchers/useStabilityAlerts";
import { contractsConfigured } from "@/lib/contracts";

export default function DashboardPage() {
  const globalIndex = useGlobalIndex();
  const alerts = useStabilityAlerts({ limit: 5 });

  const indexValue = globalIndex.data ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Live index + alerts from Sepolia
          </p>
          {!contractsConfigured() && (
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              Set NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS and NEXT_PUBLIC_IMMUNE_SYSTEM_ADDRESS in your
              frontend env to enable live data.
            </p>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Global Instability Index</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {globalIndex.isLoading ? "…" : indexValue !== null ? Number(indexValue) : "—"}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">0 (stable) → 100 (unstable)</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Recent Alerts</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{alerts.length}</p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Latest StabilityAlert events</p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <Activity className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Network</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Sepolia</p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Read + publish uses wallet</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {indexValue !== null && Number(indexValue) >= 75 ? "UNSTABLE" : "OK"}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Threshold: ≥ 75 triggers defenses</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ScoreCard />
          <RiskChart />
        </div>
        <div className="space-y-6">
          <RiskBreakdown />
          <Alertsfeed />
        </div>
      </div>
    </div>
  );
}
