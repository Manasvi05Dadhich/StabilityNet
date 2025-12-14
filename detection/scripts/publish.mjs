import fs from 'node:fs';
import path from 'node:path';

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

import { analyze, ensureDeployed, publishScore, resolveBlockRange } from '../dist/index.js';

function privateKeyEnvToBytes(name) {
  const raw = process.env[name];
  if (!raw) throw new Error(`Set env var ${name} (do not commit it).`);

  const hex = raw.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(`${name} must be a 32-byte hex string (64 hex chars), with optional 0x prefix.`);
  }

  return Uint8Array.from(Buffer.from(hex, 'hex'));
}

function firstPositional() {
  return process.argv.slice(2).find((a) => !a.startsWith('-')) ?? null;
}

const configPathArg = firstPositional() ?? 'config/config.json';
const configPath = path.resolve(process.cwd(), configPathArg);

if (!fs.existsSync(configPath)) {
  throw new Error(`Config file not found: ${configPath}`);
}

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (!cfg.rpcUrl) throw new Error('config.rpcUrl is required');

const oracleAddress = cfg.oracle?.address;
if (!oracleAddress) {
  throw new Error('config.oracle.address is required (will be provided after Person 1 deploys)');
}

const pkBytes = privateKeyEnvToBytes('PUBLISHER_PRIVATE_KEY');
const account = privateKeyToAccount(pkBytes);

function normalizeLiquiditySnapshot(x) {
  if (!x) return undefined;
  return {
    reserve0: typeof x.reserve0 === 'bigint' ? x.reserve0 : BigInt(x.reserve0),
    reserve1: typeof x.reserve1 === 'bigint' ? x.reserve1 : BigInt(x.reserve1),
    blockTimestampLast: Number(x.blockTimestampLast)
  };
}

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(cfg.rpcUrl)
});

await ensureDeployed({ client: publicClient, address: oracleAddress, label: 'StabilityOracle' });

const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(cfg.rpcUrl),
  account
});

const { fromBlock, toBlock } = await resolveBlockRange(publicClient, {
  fromBlock: cfg.blocks?.fromBlock ?? undefined,
  toBlock: cfg.blocks?.toBlock ?? undefined,
  blocksBack: cfg.blocks?.blocksBack ?? 2000
});

const report = await analyze({
  client: publicClient,
  uniswapV2Pair: cfg.uniswapV2?.pair ?? undefined,
  previousReserves: normalizeLiquiditySnapshot(cfg.uniswapV2?.previousReserves),
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
    : undefined,
  previousParticipationVotes:
    cfg.previousParticipationVotes === null || cfg.previousParticipationVotes === undefined
      ? undefined
      : BigInt(cfg.previousParticipationVotes)
});

const score = BigInt(Math.round(report.instabilityIndex));

const txHash = await publishScore({
  walletClient,
  oracleAddress,
  score
});

const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

process.stdout.write(
  JSON.stringify(
    {
      oracleAddress,
      publishedScore: score.toString(),
      txHash,
      blockNumber: receipt.blockNumber?.toString?.() ?? receipt.blockNumber
    },
    null,
    2
  ) + '\n'
);
