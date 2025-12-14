// "use client";

// import { useState } from "react";
// import { Send, TrendingUp, BarChart3, CheckCircle2, Clock, User, FileText, Shield, Search, Filter, Activity } from "lucide-react";

// export default function PublishScorePage() {
//   const [protocol, setProtocol] = useState("compound");
//   const [score, setScore] = useState("");
//   const [notes, setNotes] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("all");

//   const recentScores = [
//     {
//       id: "1",
//       protocol: "Compound V3",
//       score: 87.5,
//       publishedBy: "0x1234...5678",
//       timestamp: "2 hours ago",
//       status: "verified",
//     },
//     {
//       id: "2",
//       protocol: "Aave V3",
//       score: 92.3,
//       publishedBy: "0xabcd...efgh",
//       timestamp: "5 hours ago",
//       status: "verified",
//     },
//     {
//       id: "3",
//       protocol: "MakerDAO",
//       score: 85.1,
//       publishedBy: "0x9876...5432",
//       timestamp: "1 day ago",
//       status: "pending",
//     },
//     {
//       id: "4",
//       protocol: "Uniswap V3",
//       score: 91.2,
//       publishedBy: "0x5678...9012",
//       timestamp: "2 days ago",
//       status: "verified",
//     },
//     {
//       id: "5",
//       protocol: "Curve Finance",
//       score: 88.7,
//       publishedBy: "0x3456...7890",
//       timestamp: "3 days ago",
//       status: "verified",
//     },
//     {
//       id: "6",
//       protocol: "Lido",
//       score: 89.4,
//       publishedBy: "0x2468...1357",
//       timestamp: "4 days ago",
//       status: "verified",
//     },
//   ];

//   const protocols = [
//     { value: "compound", label: "Compound V3" },
//     { value: "aave", label: "Aave V3" },
//     { value: "makerdao", label: "MakerDAO" },
//     { value: "uniswap", label: "Uniswap V3" },
//     { value: "curve", label: "Curve Finance" },
//     { value: "lido", label: "Lido" },
//   ];

//   const stats = {
//     totalPublished: 1247,
//     verified: 1189,
//     pending: 58,
//     averageScore: 88.3,
//   };

//   const filteredScores = recentScores.filter((item) => {
//     const matchesSearch = item.protocol.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filter === "all" || item.status === filter;
//     return matchesSearch && matchesFilter;
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Stability score submitted successfully! It will be verified and published shortly.");
//     setScore("");
//     setNotes("");
//   };

//   const getStatusBadge = (status: string) => {
//     if (status === "verified") {
//       return (
//         <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
//           <CheckCircle2 className="h-3 w-3" />
//           Verified
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
//         <Clock className="h-3 w-3" />
//         Pending
//       </span>
//     );
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return "text-green-600 dark:text-green-400";
//     if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
//     return "text-red-600 dark:text-red-400";
//   };

//   const getScoreBgColor = (score: number) => {
//     if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
//     if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
//     return "bg-red-100 dark:bg-red-900/20";
//   };

//   const currentScore = score && !isNaN(parseFloat(score)) ? parseFloat(score) : null;

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Publish Score</h1>
//           <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
//             Submit and publish stability scores for DeFi protocols
//           </p>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Total Published</p>
//               <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalPublished}</p>
//               <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">All time</p>
//             </div>
//             <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
//               <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Verified</p>
//               <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{stats.verified}</p>
//               <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">95.3% verified</p>
//             </div>
//             <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
//               <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Pending</p>
//               <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
//               <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Under review</p>
//             </div>
//             <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
//               <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Average Score</p>
//               <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.averageScore}</p>
//               <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Across all protocols</p>
//             </div>
//             <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
//               <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Submit Score Form */}
//         <div className="lg:col-span-2">
//           <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
//             <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
//               <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
//                 <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
//                   Submit Stability Score
//                 </h2>
//                 <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
//                   Provide a stability score (0-100) for a protocol
//                 </p>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
//                   Protocol
//                 </label>
//                 <select
//                   value={protocol}
//                   onChange={(e) => setProtocol(e.target.value)}
//                   className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
//                 >
//                   {protocols.map((p) => (
//                     <option key={p.value} value={p.value}>
//                       {p.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
//                   Stability Score (0-100)
//                 </label>
//                 <div className="space-y-3">
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     value={score}
//                     onChange={(e) => setScore(e.target.value)}
//                     className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-2xl font-bold text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
//                     placeholder="0.0"
//                     required
//                   />
//                   {currentScore !== null && !isNaN(currentScore) && currentScore >= 0 && currentScore <= 100 && (
//                     <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Score</span>
//                         <span className={`text-lg font-bold ${getScoreColor(currentScore)}`}>
//                           {currentScore.toFixed(1)}/100
//                         </span>
//                       </div>
//                       <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
//                         <div
//                           className={`h-full transition-all ${getScoreBgColor(currentScore)}`}
//                           style={{ width: `${Math.min(100, Math.max(0, currentScore))}%` }}
//                         />
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
//                         <Shield className="h-3 w-3" />
//                         <span>
//                           {currentScore >= 80
//                             ? "Excellent stability"
//                             : currentScore >= 60
//                             ? "Good stability"
//                             : "Needs attention"}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   <p className="text-xs text-zinc-500 dark:text-zinc-400">
//                     Score should reflect overall protocol stability and risk assessment
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
//                   Notes (Optional)
//                 </label>
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={6}
//                   className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
//                   placeholder="Add any additional context or observations about the protocol's stability..."
//                 />
//               </div>

//               <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
//                 <button
//                   type="submit"
//                   className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                 >
//                   <Send className="h-4 w-4" />
//                   Publish Score
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setScore("");
//                     setNotes("");
//                   }}
//                   className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Recent Scores */}
//         <div className="space-y-6">
//           <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
//             <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
//               <div className="flex items-center gap-3">
//                 <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
//                   <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
//                     Recent Scores
//                   </h2>
//                   <p className="text-sm text-zinc-600 dark:text-zinc-400">Latest submissions</p>
//                 </div>
//               </div>
//             </div>

//             {/* Search and Filter */}
//             <div className="mb-4 space-y-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
//                 <input
//                   type="text"
//                   placeholder="Search protocols..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4 text-zinc-400" />
//                 <select
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="verified">Verified</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-3 max-h-[600px] overflow-y-auto">
//               {filteredScores.length === 0 ? (
//                 <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
//                   <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
//                   <p>No scores found</p>
//                 </div>
//               ) : (
//                 filteredScores.map((item) => (
//                   <div
//                     key={item.id}
//                     className="rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
//                           {item.protocol}
//                         </h3>
//                         <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
//                           <User className="h-3 w-3 flex-shrink-0" />
//                           <span className="truncate">{item.publishedBy}</span>
//                         </div>
//                         <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
//                           <Clock className="h-3 w-3 flex-shrink-0" />
//                           <span>{item.timestamp}</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end gap-2">
//                         <div
//                           className={`rounded-full px-3 py-1.5 text-lg font-bold ${getScoreColor(item.score)} ${getScoreBgColor(item.score)}`}
//                         >
//                           {item.score}
//                         </div>
//                         {getStatusBadge(item.status)}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Activity, Shield, TrendingUp, Users } from "lucide-react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { analyzeChain } from "@/lib/p2/analyzeChain";
import { useAnalysis } from "@/lib/state/analysis-context";
import { stabilityOracleAbi, stabilityOracleAddress } from "@/lib/contracts";
import { ZERO_ADDRESS } from "@/lib/env";

export default function PublishInstabilityScore() {
  const { isConnected } = useAccount();
  const { analysis, setAnalysis } = useAnalysis();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: txHash });

  const score = analysis?.risks.instabilityIndex ?? 0;

  const circumference = useMemo(() => 2 * Math.PI * 80, []);
  const dashOffset = useMemo(() => circumference * (1 - score / 100), [circumference, score]);

  async function onAnalyze() {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeChain();
      setAnalysis(result);
    } catch (e) {
      setAnalysisError(e instanceof Error ? e.message : "Failed to analyze chain");
    } finally {
      setAnalyzing(false);
    }
  }

  function onPublish() {
    if (stabilityOracleAddress === ZERO_ADDRESS) return;

    writeContract({
      address: stabilityOracleAddress,
      abi: stabilityOracleAbi,
      functionName: "publishScore",
      args: [BigInt(Math.round(score))],
    });
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Publish Instability Score</h1>
        <p className="mt-2 text-sm text-zinc-400">Analyze the chain in-browser, then write to Sepolia</p>
      </div>

      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-[#0f141b] p-10 shadow-lg">
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm text-zinc-400">Current Global Instability Index</p>
            {analysis && (
              <p className="mt-1 text-xs text-zinc-500">Updated: {new Date(analysis.updatedAt).toLocaleString()}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onAnalyze}
              disabled={analyzing}
              className="rounded-xl bg-zinc-800 px-5 py-3 text-sm font-medium hover:bg-zinc-700 disabled:opacity-60"
            >
              {analyzing ? "Analyzing…" : "Analyze Chain"}
            </button>
            <button
              onClick={onPublish}
              disabled={!isConnected || !analysis || isPending || stabilityOracleAddress === ZERO_ADDRESS}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-3 text-sm font-medium shadow-lg transition hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Publishing…" : "Publish Score"}
            </button>
          </div>
        </div>

        {stabilityOracleAddress === ZERO_ADDRESS && (
          <p className="mb-6 rounded-lg border border-yellow-900/30 bg-yellow-900/10 p-4 text-sm text-yellow-200">
            Missing contract address: set NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS.
          </p>
        )}

        {analysisError && (
          <p className="mb-6 rounded-lg border border-red-900/30 bg-red-900/10 p-4 text-sm text-red-200">
            {analysisError}
          </p>
        )}

        {writeError && (
          <p className="mb-6 rounded-lg border border-red-900/30 bg-red-900/10 p-4 text-sm text-red-200">
            {writeError.message}
          </p>
        )}

        {txHash && (
          <p className="mb-6 text-xs text-zinc-400">
            Tx: <span className="font-mono">{txHash}</span>
            {receipt.isLoading ? " (confirming…)" : receipt.isSuccess ? " (confirmed)" : ""}
          </p>
        )}

        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-amber-400">{score.toFixed(1)}</div>
          <div className="text-sm text-zinc-500 mt-1">/ 100</div>
        </div>

        <div className="flex justify-center mb-10">
          <div className="relative h-48 w-48">
            <svg className="h-full w-full -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="#1f2937" strokeWidth="12" fill="none" />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#f59e0b"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-8 w-8 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <MetricCard icon={<TrendingUp />} label="Economic" value={analysis?.risks.economicRisk ?? 0} color="text-cyan-400" />
          <MetricCard icon={<Users />} label="Social" value={analysis?.risks.socialRisk ?? 0} color="text-purple-400" />
          <MetricCard icon={<Shield />} label="Governance" value={analysis?.risks.governanceRisk ?? 0} color="text-sky-400" />
        </div>

        <p className="text-center text-xs text-zinc-500">
          {isConnected ? "Wallet connected." : "Connect your wallet to publish."}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0b0f14] p-6 text-center">
      <div className={`mx-auto mb-3 h-8 w-8 ${color}`}>{icon}</div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-amber-400">{value.toFixed(1)}</p>
    </div>
  );
}
