"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Jan 1", risk: 15, stability: 85 },
  { date: "Jan 8", risk: 18, stability: 82 },
  { date: "Jan 15", risk: 12, stability: 88 },
  { date: "Jan 22", risk: 14, stability: 86 },
  { date: "Jan 29", risk: 10, stability: 90 },
  { date: "Feb 5", risk: 12, stability: 88 },
  { date: "Feb 12", risk: 8, stability: 92 },
];

export default function RiskChart() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Risk & Stability Trends</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">7-day historical analysis</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis
            dataKey="date"
            className="text-xs text-zinc-600 dark:text-zinc-400"
            stroke="currentColor"
          />
          <YAxis
            className="text-xs text-zinc-600 dark:text-zinc-400"
            stroke="currentColor"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#ef4444"
            strokeWidth={2}
            name="Risk Level"
            dot={{ fill: "#ef4444", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="stability"
            stroke="#10b981"
            strokeWidth={2}
            name="Stability Score"
            dot={{ fill: "#10b981", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}






















