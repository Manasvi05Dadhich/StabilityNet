import fs from 'node:fs';
import path from 'node:path';

import { createPublicClient, http } from 'viem';
import { analyze, resolveBlockRange } from '../dist/index.js';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function firstPositional() {
  return process.argv.slice(2).find((a) => !a.startsWith('-')) ?? null;
}

function getFlagValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const configPathArg = firstPositional() ?? 'config/config.json';
const configPath = path.resolve(process.cwd(), configPathArg);

if (!fs.existsSync(configPath)) {
  throw new Error(`Config file not found: ${configPath}`);
}

const intervalSec = Number.parseInt(getFlagValue('--intervalSec') ?? '20', 10);
const intervalMs = Number.isFinite(intervalSec) ? intervalSec * 1000 : 20_000;

let lastIndex = null;

// eslint-disable-next-line no-constant-condition
while (true) {
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!cfg.rpcUrl) throw new Error('config.rpcUrl is required');

  const client = createPublicClient({ transport: http(cfg.rpcUrl) });

  const { fromBlock, toBlock } = await resolveBlockRange(client, {
    fromBlock: cfg.blocks?.fromBlock ?? undefined,
    toBlock: cfg.blocks?.toBlock ?? undefined,
    blocksBack: cfg.blocks?.blocksBack ?? 200
  });

  const report = await analyze({
    client,
    uniswapV2Pair: cfg.uniswapV2?.pair ?? undefined,
    previousReserves: cfg.uniswapV2?.previousReserves ?? undefined,
    whaleTransferQuery: cfg.whales?.token && cfg.whales?.minTransferAmount
      ? {
          token: cfg.whales.token,
          fromBlock,
          toBlock,
          minTransferAmount: BigInt(cfg.whales.minTransferAmount)
        }
      : undefined,
    flashLoanEventQuery: cfg.flashLoans?.enabled && cfg.flashLoans?.address
      ? {
          address: cfg.flashLoans.address,
          fromBlock,
          toBlock,
          eventAbiItem: cfg.flashLoans.eventAbiItem
        }
      : undefined,
    governorVoteQuery: cfg.governance?.enabled && cfg.governance?.governor
      ? {
          governor: cfg.governance.governor,
          proposalId: BigInt(cfg.governance.proposalId),
          fromBlock,
          toBlock,
          estimateNewWalletVoters: Boolean(cfg.governance.estimateNewWalletVoters)
        }
      : undefined
  });

  const now = new Date().toISOString();
  const idx = report.instabilityIndex;
  const delta = lastIndex === null ? 0 : idx - lastIndex;
  lastIndex = idx;

  process.stdout.write(
    `[${now}] instabilityIndex=${idx} (Δ ${delta}) whales=${report.signals.whaleTransfers?.largeTransferCount ?? 0}\n`
  );

  await sleep(intervalMs);
}
