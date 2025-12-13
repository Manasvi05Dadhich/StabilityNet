import fs from 'node:fs';
import path from 'node:path';

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

import { analyze, publishScore, resolveBlockRange } from '../dist/index.js';

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

const pk = process.env.PUBLISHER_PRIVATE_KEY;
if (!pk) {
  throw new Error('Set env var PUBLISHER_PRIVATE_KEY to publish (do not commit it).');
}

const account = privateKeyToAccount(pk);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(cfg.rpcUrl)
});

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
