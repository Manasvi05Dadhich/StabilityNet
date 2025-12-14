import type { AnalysisResult, RiskBreakdown, Signals } from "@/lib/state/analysis-context";
import { env } from "@/lib/env";

import {
  createPublicClient,
  http,
  parseAbi,
  parseAbiItem,
  type Address,
} from "viem";
import { sepolia } from "viem/chains";

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function computeRisks(signals: Signals): RiskBreakdown {
  // ECONOMIC (0–40)
  const liquidityRisk = clamp((signals.liquidityDropPercent / 50) * 20, 0, 20);
  const whaleRisk = clamp(Math.min(signals.largeTransfers * 2, 10), 0, 10);
  const flashLoanRisk = clamp(Math.min(signals.flashLoanCount * 2, 10), 0, 10);
  const economicRisk = clamp(liquidityRisk + whaleRisk + flashLoanRisk, 0, 40);

  // SOCIAL (0–30)
  const totalVotes = signals.totalVotes || signals.yesVotes + signals.noVotes;
  const voteSplitPercent = totalVotes
    ? (Math.abs(signals.yesVotes - signals.noVotes) / totalVotes) * 100
    : 0;

  const voteSplitRisk = voteSplitPercent < 10 ? 20 : voteSplitPercent <= 30 ? 10 : 5;

  const participationDropRisk =
    signals.previousParticipation > 0 &&
    signals.participation < signals.previousParticipation / 2
      ? 10
      : 0;

  const socialRisk = clamp(voteSplitRisk + participationDropRisk, 0, 30);

  // GOVERNANCE (0–30)
  const topVoterPercent = totalVotes ? (signals.topVoterVotes / totalVotes) * 100 : 0;
  const topVoterDominance = topVoterPercent > 40 ? 20 : topVoterPercent >= 25 ? 10 : 0;
  const sybilRisk = signals.newWalletVoters > 10 ? 10 : 0;

  const governanceRisk = clamp(topVoterDominance + sybilRisk, 0, 30);

  const instabilityIndex = clamp(economicRisk + socialRisk + governanceRisk, 0, 100);

  return {
    liquidityRisk,
    whaleRisk,
    flashLoanRisk,
    economicRisk,
    voteSplitRisk,
    participationDropRisk,
    socialRisk,
    topVoterDominance,
    sybilRisk,
    governanceRisk,
    instabilityIndex,
  };
}

// --- On-chain signal config ---
// Defaults match your current detection/config/config.json so UI can run immediately.
// You can override via NEXT_PUBLIC_* env vars later if needed.
const DEFAULTS = {
  uniswapV2Pair: "0x2dd2f69b8c912a6a1b53a20ad64bb1e0cfb03b69",
  whaleToken: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9", // WETH Sepolia
  whaleMinTransferAmount: 10n ** 15n, // 0.001 token (demo-friendly) // 1 token (assumes 18 decimals)
  flashLoanAddress: "0x2647e05BB27244f4f389458409E91C023afD7dff",
  flashLoanEventAbiItem:
    "event FlashLoan(address indexed target,address indexed initiator,address indexed asset,uint256 amount,uint256 premium,uint16 referralCode)",
  governorAddress: "0x17Cb70469aDe8Aa53A8A071d751D75f0352dB77d",
  proposalId: 1n,
} as const;

function isAddress(s: unknown): s is Address {
  return typeof s === "string" && /^0x[0-9a-fA-F]{40}$/.test(s);
}

function getRpcUrls(): string[] {
  const key = env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  const urls: string[] = [];

  // Prefer CORS-friendly public RPCs first for browser reliability.
  urls.push(
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://rpc.sepolia.org"
  );

  // Optional Alchemy endpoint (often blocked by browser CORS; keep as last resort).
  if (key) {
    urls.push(`https://eth-sepolia.g.alchemy.com/v2/${key}`);
  }

  return urls;
}

function isRetryableRpcError(err: unknown): boolean {
  const anyErr = err as any;
  const status: number | undefined = anyErr?.status;
  const details: string | undefined = anyErr?.details;
  const shortMessage: string | undefined = anyErr?.shortMessage;
  const haystack = `${shortMessage ?? ""} ${details ?? ""}`.toLowerCase();
  return status === 400 || status === 408 || status === 429 || haystack.includes("too many requests");
}

async function withFallbackClient<T>(fn: (client: ReturnType<typeof createPublicClient>) => Promise<T>): Promise<T> {
  const urls = getRpcUrls();
  let lastErr: unknown = null;

  for (const url of urls) {
    const client = createPublicClient({ chain: sepolia, transport: http(url) });
    try {
      return await fn(client);
    } catch (err) {
      lastErr = err;
      if (!isRetryableRpcError(err)) throw err;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("All RPC endpoints failed");
}

function bigintToNumberSafe(v: bigint): number {
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  const clamped = v > max ? max : v;
  return Number(clamped);
}

// localStorage keys for baselines (browser only)
const LS_LIQ_BASELINE = "stabilitynet.liquidity.baseline.v1";
const LS_PREV_PARTICIPATION = "stabilitynet.prevParticipation.v1";

type LiquiditySnapshot = {
  reserve0: bigint;
  reserve1: bigint;
  blockTimestampLast: number;
};

function loadLiquidityBaseline(): LiquiditySnapshot | null {
  try {
    const raw = localStorage.getItem(LS_LIQ_BASELINE);
    if (!raw) return null;
    const p = JSON.parse(raw) as {
      reserve0: string;
      reserve1: string;
      blockTimestampLast: number;
    };
    return {
      reserve0: BigInt(p.reserve0),
      reserve1: BigInt(p.reserve1),
      blockTimestampLast: p.blockTimestampLast,
    };
  } catch {
    return null;
  }
}

function saveLiquidityBaseline(s: LiquiditySnapshot) {
  try {
    localStorage.setItem(
      LS_LIQ_BASELINE,
      JSON.stringify({
        reserve0: s.reserve0.toString(),
        reserve1: s.reserve1.toString(),
        blockTimestampLast: s.blockTimestampLast,
      })
    );
  } catch {
    // ignore
  }
}

function loadPrevParticipation(): number {
  try {
    const raw = localStorage.getItem(LS_PREV_PARTICIPATION);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function savePrevParticipation(n: number) {
  try {
    localStorage.setItem(LS_PREV_PARTICIPATION, String(Math.max(0, Math.floor(n))));
  } catch {
    // ignore
  }
}

function looksLikeRangeLimitError(err: unknown): boolean {
  const anyErr = err as any;
  const status: number | undefined = anyErr?.status;
  const details: string | undefined = anyErr?.details;
  const shortMessage: string | undefined = anyErr?.shortMessage;

  // NOTE: Do NOT treat generic HTTP 400 as a range-limit error.
  // For Alchemy, 400 can be caused by request validation, payload limits, or other issues.
  // We want these to bubble up so `withFallbackClient()` can try a different RPC.

  const haystack = `${shortMessage ?? ""} ${details ?? ""}`.toLowerCase();
  return (
    haystack.includes("block range") ||
    (haystack.includes("range") && haystack.includes("block"))
  );
}

function looksLikeRateLimitError(err: unknown): boolean {
  const anyErr = err as any;
  const status: number | undefined = anyErr?.status;
  const details: string | undefined = anyErr?.details;
  const shortMessage: string | undefined = anyErr?.shortMessage;
  const haystack = `${shortMessage ?? ""} ${details ?? ""}`.toLowerCase();
  return status === 429 || haystack.includes("too many requests");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getLogsAutoSplit(
  client: ReturnType<typeof createPublicClient>,
  args: Parameters<typeof client.getLogs>[0],
  opts?: { maxDepth?: number; maxRetries429?: number; baseDelayMs?: number }
): Promise<any[]> {
  const maxDepth = opts?.maxDepth ?? 28;
  const maxRetries429 = opts?.maxRetries429 ?? 10;
  const baseDelayMs = opts?.baseDelayMs ?? 1500;

  const fromBlock = (args as any).fromBlock as bigint | undefined;
  const toBlock = (args as any).toBlock as bigint | undefined;

  for (let attempt = 0; attempt <= maxRetries429; attempt += 1) {
    try {
      return await client.getLogs(args as any);
    } catch (err) {
      if (looksLikeRateLimitError(err) && attempt < maxRetries429) {
        await sleep(baseDelayMs * 2 ** attempt);
        continue;
      }
      if (!looksLikeRangeLimitError(err)) throw err;
      break;
    }
  }

  if (maxDepth <= 0 || fromBlock === undefined || toBlock === undefined || toBlock <= fromBlock) {
    throw new Error("getLogsAutoSplit exceeded maxDepth or invalid range");
  }

  const mid = (fromBlock + toBlock) / 2n;
  const left = await getLogsAutoSplit(client, { ...(args as any), fromBlock, toBlock: mid }, { ...opts, maxDepth: maxDepth - 1 });
  const right = await getLogsAutoSplit(client, { ...(args as any), fromBlock: mid + 1n, toBlock }, { ...opts, maxDepth: maxDepth - 1 });
  return [...left, ...right];
}

async function fetchSignals(): Promise<Signals> {
  if (typeof window === "undefined") {
    throw new Error("analyzeChain must run in the browser (client-side)");
  }

  // Time window: last N blocks (tunable). Keep moderate; fallback RPCs will handle logs if Alchemy rejects.
  const blocksBack = 2000n;

  const latest = await withFallbackClient((client) => client.getBlockNumber());
  const fromBlock = latest > blocksBack ? latest - blocksBack : 0n;
  const toBlock = latest;

  // --- A) Liquidity Drop (Uniswap V2 pair reserves) ---
  const uniswapV2PairAbi = parseAbi([
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  ]);

  const pair = DEFAULTS.uniswapV2Pair;
  let liquidityDropPercent = 0;
  if (isAddress(pair)) {
    const [reserve0, reserve1, blockTimestampLast] = await withFallbackClient((client) =>
      client.readContract({
        address: pair,
        abi: uniswapV2PairAbi,
        functionName: "getReserves",
      })
    );

    const current: LiquiditySnapshot = {
      reserve0,
      reserve1,
      blockTimestampLast,
    };

    const prev = loadLiquidityBaseline();
    if (!prev) {
      // First run: store baseline, treat drop as 0
      saveLiquidityBaseline(current);
      liquidityDropPercent = 0;
    } else {
      const drop0 = prev.reserve0 > 0n ? Number(((prev.reserve0 - (current.reserve0 < prev.reserve0 ? current.reserve0 : prev.reserve0)) * 10000n) / prev.reserve0) / 100 : 0;
      const drop1 = prev.reserve1 > 0n ? Number(((prev.reserve1 - (current.reserve1 < prev.reserve1 ? current.reserve1 : prev.reserve1)) * 10000n) / prev.reserve1) / 100 : 0;
      liquidityDropPercent = clamp(Math.min(Math.max(drop0, drop1), 100), 0, 100);
    }
  }

  // --- B) Whale Transfers (ERC20 Transfer logs) ---
  const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)");

  const whaleToken = DEFAULTS.whaleToken;
  let largeTransfers = 0;
  if (isAddress(whaleToken)) {
    const logs = await withFallbackClient((client) =>
      getLogsAutoSplit(client, {
        address: whaleToken,
        event: transferEvent,
        fromBlock,
        toBlock,
      })
    );

    for (const log of logs) {
      // viem returns decoded args for getLogs({ event })
      const value = (log as any)?.args?.value as bigint | undefined;
      if (value !== undefined && value >= DEFAULTS.whaleMinTransferAmount) {
        largeTransfers += 1;
      }
    }
  }

  // --- C) Flash Loan Events (generic event counter) ---
  let flashLoanCount = 0;
  const flashLoanAddr = DEFAULTS.flashLoanAddress;
  if (isAddress(flashLoanAddr)) {
    const flashLoanEvent = parseAbiItem(DEFAULTS.flashLoanEventAbiItem);
    const logs = await withFallbackClient((client) =>
      getLogsAutoSplit(client, {
        address: flashLoanAddr,
        event: flashLoanEvent,
        fromBlock,
        toBlock,
      })
    );
    flashLoanCount = logs.length;
  }

  // --- D) DAO Vote Split (Governor VoteCast) ---
  const voteCastEvent = parseAbiItem(
    "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)"
  );

  let yesVotes = 0;
  let noVotes = 0;
  let totalVotes = 0;
  let topVoterVotes = 0;
  let newWalletVoters = 0; // (kept 0 unless you want to add nonce checks)

  const governor = DEFAULTS.governorAddress;
  if (isAddress(governor)) {
    const logs = await withFallbackClient((client) =>
      getLogsAutoSplit(client, {
        address: governor,
        event: voteCastEvent,
        fromBlock,
        toBlock,
      })
    );

    const proposalId = DEFAULTS.proposalId;

    let yes = 0n;
    let no = 0n;
    let abstain = 0n;
    const perVoter = new Map<string, bigint>();

    for (const log of logs) {
      const args = (log as any)?.args as
        | { voter: Address; proposalId: bigint; support: number; weight: bigint }
        | undefined;
      if (!args) continue;
      if (args.proposalId !== proposalId) continue;

      if (args.support === 0) no += args.weight;
      else if (args.support === 1) yes += args.weight;
      else abstain += args.weight;

      const prev = perVoter.get(args.voter) ?? 0n;
      perVoter.set(args.voter, prev + args.weight);
    }

    const total = yes + no + abstain;

    // Convert to numbers for UI (cap to MAX_SAFE_INTEGER)
    yesVotes = bigintToNumberSafe(yes);
    noVotes = bigintToNumberSafe(no);
    totalVotes = bigintToNumberSafe(total);

    let top = 0n;
    for (const v of perVoter.values()) if (v > top) top = v;
    topVoterVotes = bigintToNumberSafe(top);
  }

  // Participation = totalVotes in window (simple proxy)
  const participation = totalVotes;
  const previousParticipation = loadPrevParticipation();
  savePrevParticipation(participation);

  return {
    liquidityDropPercent,
    largeTransfers,
    flashLoanCount,

    yesVotes,
    noVotes,
    totalVotes,

    participation,
    previousParticipation,

    topVoterVotes,
    newWalletVoters,
  };
}

export async function analyzeChain(): Promise<AnalysisResult> {
  const signals = await fetchSignals();
  const risks = computeRisks(signals);

  return {
    signals,
    risks,
    updatedAt: Date.now(),
  };
}
