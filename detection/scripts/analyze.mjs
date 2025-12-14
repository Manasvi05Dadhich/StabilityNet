import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';

import { createPublicClient, http } from 'viem';

import {
  analyze,
  ensureDeployed,
  fetchErc20Metadata,
  fetchUniswapV2Reserves,
  resolveBlockRange
} from '../dist/index.js';

function usageAndExit() {
  console.error(
    'Usage:\n' +
      '  node scripts/analyze.mjs [--interactive] [path-to-config.json]\n' +
      '  (default config path: config/config.json)\n\n' +
      'npm:\n' +
      '  npm run analyze\n' +
      '  npm run analyze:interactive\n'
  );
  process.exit(1);
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function firstPositional() {
  return process.argv.slice(2).find((a) => !a.startsWith('-')) ?? null;
}

function isNonEmptyString(x) {
  return typeof x === 'string' && x.trim().length > 0;
}

function pow10(decimals) {
  let x = 1n;
  for (let i = 0; i < decimals; i += 1) x *= 10n;
  return x;
}

async function ensureWhaleMinTransferAmount(client, cfg) {
  const token = cfg.whales?.token;
  const minTransferAmount = cfg.whales?.minTransferAmount;
  const minTokens = cfg.whales?.minTokens;

  if (!isNonEmptyString(token)) return cfg;
  if (isNonEmptyString(minTransferAmount)) return cfg;

  const meta = await fetchErc20Metadata({ client, token });
  const decimals = Number.isFinite(meta.decimals) ? meta.decimals : 18;

  let minAmount;

  // Prefer explicit minTokens (whole tokens)
  if (isNonEmptyString(minTokens)) {
    minAmount = pow10(decimals) * BigInt(minTokens);
  } else if (typeof meta.totalSupply === 'bigint' && meta.totalSupply > 0n) {
    // Otherwise auto-threshold: 1% of totalSupply
    minAmount = meta.totalSupply / 100n;
  } else {
    // Fallback: 100,000 tokens at 18 decimals
    minAmount = 100_000n * 10n ** 18n;
  }

  cfg.whales = cfg.whales ?? {};
  cfg.whales.decimals = decimals;
  cfg.whales.minTransferAmount = minAmount.toString();
  // keep symbol/name for display if available
  if (meta.symbol) cfg.whales.symbol = meta.symbol;
  if (meta.name) cfg.whales.name = meta.name;
  if (typeof meta.totalSupply === 'bigint') cfg.whales.totalSupply = meta.totalSupply.toString();

  return cfg;
}

async function promptIfInteractive(client, cfg) {
  const interactive = hasFlag('--interactive');
  if (!interactive) return cfg;

  if (!process.stdin.isTTY) {
    throw new Error('Interactive mode requires a TTY. Run in a normal terminal.');
  }

  const rl = createInterface({ input, output });
  try {
    // blocksBack
    const blocksBackStr = await rl.question(
      `Block window (blocksBack) [${cfg.blocks?.blocksBack ?? 5000}]: `
    );
    const blocksBack = Number.parseInt(blocksBackStr || String(cfg.blocks?.blocksBack ?? 5000), 10);
    cfg.blocks = { ...(cfg.blocks ?? {}), blocksBack: Number.isFinite(blocksBack) ? blocksBack : 5000 };

    // Choose signals
    const enableLiquidity = (await rl.question('Enable Liquidity Drop (UniswapV2 pair)? (y/N): '))
      .trim()
      .toLowerCase() === 'y';
    const enableWhales = (await rl.question('Enable Whale Transfers (ERC20 Transfer logs)? (y/N): '))
      .trim()
      .toLowerCase() === 'y';

    if (enableLiquidity) {
      const pair = await rl.question('UniswapV2 Pair address (0x...): ');
      cfg.uniswapV2 = cfg.uniswapV2 ?? {};
      cfg.uniswapV2.pair = pair.trim();
    }

    if (enableWhales) {
      const token = (await rl.question('ERC20 token address (0x...): ')).trim();
      const minTokensStr = (await rl.question('Whale threshold (in whole tokens, e.g. 100000): ')).trim();

      cfg.whales = cfg.whales ?? {};
      cfg.whales.token = token;
      cfg.whales.minTokens = minTokensStr;
      // compute minTransferAmount via on-chain decimals
      await ensureWhaleMinTransferAmount(client, cfg);
    }

    return cfg;
  } finally {
    rl.close();
  }
}

const defaultPath = 'config/config.json';
const configPathArg = firstPositional() ?? defaultPath;
const configPath = path.resolve(process.cwd(), configPathArg);

if (!fs.existsSync(configPath)) {
  usageAndExit();
}

const raw = fs.readFileSync(configPath, 'utf8');
let cfg = JSON.parse(raw);

if (!cfg.rpcUrl) throw new Error('config.rpcUrl is required');

const client = createPublicClient({
  transport: http(cfg.rpcUrl)
});

cfg = await promptIfInteractive(client, cfg);
// If whales.token was provided, compute minTransferAmount automatically if missing.
const beforeMin = cfg.whales?.minTransferAmount ?? null;
cfg = await ensureWhaleMinTransferAmount(client, cfg);
const afterMin = cfg.whales?.minTransferAmount ?? null;

// Persist the computed minTransferAmount/metadata back to config so subsequent runs are faster.
if (beforeMin !== afterMin && isNonEmptyString(cfg.whales?.token) && isNonEmptyString(cfg.whales?.minTransferAmount)) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  } catch {
    // ignore persistence failures
  }
}

const { fromBlock, toBlock } = await resolveBlockRange(client, {
  fromBlock: cfg.blocks?.fromBlock ?? undefined,
  toBlock: cfg.blocks?.toBlock ?? undefined,
  blocksBack: cfg.blocks?.blocksBack ?? 5000
});

// Normalize optional config sections (allow null)
const uniswapPair = isNonEmptyString(cfg.uniswapV2?.pair) ? cfg.uniswapV2.pair : undefined;
const whaleToken = isNonEmptyString(cfg.whales?.token) ? cfg.whales.token : undefined;

// Fail fast with a helpful message if a configured address isn't actually deployed on this chain.
if (uniswapPair) {
  await ensureDeployed({ client, address: uniswapPair, label: 'UniswapV2 pair' });
}
if (whaleToken) {
  await ensureDeployed({ client, address: whaleToken, label: 'ERC20 token' });
}
if (cfg.flashLoans?.enabled && isNonEmptyString(cfg.flashLoans?.address)) {
  await ensureDeployed({ client, address: cfg.flashLoans.address, label: 'FlashLoan event source' });
}
if (cfg.governance?.enabled && isNonEmptyString(cfg.governance?.governor)) {
  await ensureDeployed({ client, address: cfg.governance.governor, label: 'Governor contract' });
}

const report = await analyze({
  client,

  uniswapV2Pair: uniswapPair,
  previousReserves: cfg.uniswapV2?.previousReserves ?? undefined,

  whaleTransferQuery: whaleToken && isNonEmptyString(cfg.whales?.minTransferAmount)
    ? {
        token: whaleToken,
        fromBlock,
        toBlock,
        minTransferAmount: BigInt(cfg.whales.minTransferAmount)
      }
    : undefined,

  flashLoanEventQuery: cfg.flashLoans?.enabled && isNonEmptyString(cfg.flashLoans?.address)
    ? {
        address: cfg.flashLoans.address,
        fromBlock,
        toBlock,
        eventAbiItem: cfg.flashLoans.eventAbiItem
      }
    : undefined,

  governorVoteQuery: cfg.governance?.enabled && isNonEmptyString(cfg.governance?.governor)
    ? {
        governor: cfg.governance.governor,
        proposalId: BigInt(cfg.governance.proposalId),
        fromBlock,
        toBlock,
        estimateNewWalletVoters: Boolean(cfg.governance.estimateNewWalletVoters)
      }
    : undefined,

  previousParticipationVotes:
    cfg.previousParticipationVotes === null || cfg.previousParticipationVotes === undefined
      ? undefined
      : BigInt(cfg.previousParticipationVotes)
});

// If liquidity is enabled and we didn't have a baseline, store the current reserves baseline for next run.
// This avoids hardcoding and makes the "drop %" meaningful.
if (uniswapPair && !cfg.uniswapV2?.previousReserves) {
  try {
    const baseline = await fetchUniswapV2Reserves({ client, pair: uniswapPair });
    cfg.uniswapV2 = cfg.uniswapV2 ?? {};
    cfg.uniswapV2.previousReserves = baseline;
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  } catch {
    // ignore baseline persistence failures
  }
}

const bigintReplacer = (_k, v) => (typeof v === 'bigint' ? v.toString() : v);
process.stdout.write(JSON.stringify(report, bigintReplacer, 2) + '\n');
