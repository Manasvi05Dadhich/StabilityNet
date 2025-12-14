"use client";

import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import { BarChart3, TrendingUp, TrendingDown, Activity, DollarSign, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const protocolData = [
  { name: "Compound", tvl: 2400, stability: 92, risk: 8 },
  { name: "Aave", tvl: 1800, stability: 88, risk: 12 },
  { name: "MakerDAO", tvl: 1200, stability: 85, risk: 15 },
  { name: "Uniswap", tvl: 3200, stability: 90, risk: 10 },
  { name: "Curve", tvl: 1500, stability: 87, risk: 13 },
  { name: "Lido", tvl: 2100, stability: 91, risk: 9 },
];

const timeSeriesData = [
  { date: "00:00", value: 85 },
  { date: "04:00", value: 87 },
  { date: "08:00", value: 86 },
  { date: "12:00", value: 88 },
  { date: "16:00", value: 89 },
  { date: "20:00", value: 87 },
];

export default function MetricPage() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Metrics</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Detailed protocol metrics and analytics
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total TVL</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">$12.2B</p>
              <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+3.2%</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg Stability</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">88.5</p>
              <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+1.5</span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg Risk</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">11.2</p>
              <div className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                <TrendingDown className="mr-1 h-4 w-4" />
                <span>-2.1</span>
              </div>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <Activity className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Protocols</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">24</p>
              <div className="mt-2 flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                <BarChart3 className="mr-1 h-4 w-4" />
                <span>Active</span>
              </div>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Protocol Comparison */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Protocol Comparison</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Stability vs Risk</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={protocolData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis
                dataKey="name"
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
              <Bar dataKey="stability" fill="#10b981" name="Stability Score" />
              <Bar dataKey="risk" fill="#ef4444" name="Risk Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Series */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">24h Stability Trend</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Hourly average</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
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
              <Bar dataKey="value" fill="#3b82f6" name="Stability Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Protocol Details Table */}
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Protocol Details</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Click on a protocol for more details</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Protocol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  TVL (M)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Stability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {protocolData.map((protocol, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedProtocol(protocol.name)}
                  className={`cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${
                    selectedProtocol === protocol.name ? "bg-blue-50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {protocol.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    ${protocol.tvl}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-green-600 dark:text-green-400">{protocol.stability}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-red-600 dark:text-red-400">{protocol.risk}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Stable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

