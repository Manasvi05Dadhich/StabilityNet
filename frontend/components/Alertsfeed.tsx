"use client";

import { AlertTriangle, Clock } from "lucide-react";

import { formatAlertTime, useStabilityAlerts } from "@/lib/fetchers/useStabilityAlerts";

export default function Alertsfeed() {
  const alerts = useStabilityAlerts({ limit: 4 });

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Alerts</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">On-chain StabilityAlert events</p>
      </div>

      {alerts.length === 0 ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">No alerts yet.</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((a, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Score: {Number(a.score)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatAlertTime(a.timestamp)}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Sender: {a.sender.slice(0, 6)}…{a.sender.slice(-4)}
                </p>
                {a.txHash && (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 font-mono">{a.txHash}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Clock className="h-3 w-3" />
        <span>Auto-updates as new events are emitted.</span>
      </div>
    </div>
  );
}






















