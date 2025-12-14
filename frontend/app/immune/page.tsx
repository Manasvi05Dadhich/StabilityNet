"use client";

import { Activity, Lock, Shield } from "lucide-react";

import { useCooldownActive } from "@/lib/fetchers/getCooldown";
import { useGuardrailActive } from "@/lib/fetchers/getGuardrail";
import { formatAlertTime, useStabilityAlerts } from "@/lib/fetchers/useStabilityAlerts";

export default function ImmuneSystemPage() {
  const cooldown = useCooldownActive();
  const guardrail = useGuardrailActive();
  const alerts = useStabilityAlerts({ limit: 10 });

  const last = alerts[0] ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Immune System</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Live on-chain defenses (cooldown + guardrail)
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Governance Cooldown</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {cooldown.isLoading ? "…" : cooldown.data ? "ON" : "OFF"}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Stops new proposals during instability</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Liquidity Guardrail</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {guardrail.isLoading ? "…" : guardrail.data ? "ON" : "OFF"}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Blocks withdrawals above threshold</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Last Alert</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {last ? Number(last.score) : "—"}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {last ? formatAlertTime(last.timestamp) : "No events yet"}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Stability Alerts</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Latest StabilityAlert events</p>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {alerts.length === 0 ? (
            <div className="px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">No alerts yet.</div>
          ) : (
            alerts.map((a, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Score: {Number(a.score)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Sender: {a.sender.slice(0, 6)}…{a.sender.slice(-4)}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatAlertTime(a.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


