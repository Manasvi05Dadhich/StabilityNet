import fs from 'node:fs';
import path from 'node:path';

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

import { ensureDeployed, stabilityOracleAbi } from '../dist/index.js';

function privateKeyEnvToBytes(name) {
  const raw = process.env[name];
  if (!raw) throw new Error(`Set env var ${name} (do not commit it).`);

  const hex = raw.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(`${name} must be a 32-byte hex string (64 hex chars), with optional 0x prefix.`);
  }

  return Uint8Array.from(Buffer.from(hex, 'hex'));
}

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const configPathArg = getArgValue('--config') ?? 'config/config.json';
const configPath = path.resolve(process.cwd(), configPathArg);

if (!fs.existsSync(configPath)) {
  throw new Error(`Config file not found: ${configPath}`);
}

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (!cfg.rpcUrl) throw new Error('config.rpcUrl is required');

const oracleAddress = cfg.oracle?.address;
if (!oracleAddress) throw new Error('config.oracle.address is required');

// Must be the OWNER/deployer key (or whoever has permission to call setAllowedSource).
const ownerPkBytes = privateKeyEnvToBytes('ORACLE_OWNER_PRIVATE_KEY');

// Address to authorize.
// Prefer explicit env var; otherwise derive from PUBLISHER_PRIVATE_KEY if provided.
let publisherAddress = process.env.PUBLISHER_ADDRESS ?? null;
if (!publisherAddress) {
  const publisherPkBytes = privateKeyEnvToBytes('PUBLISHER_PRIVATE_KEY');
  publisherAddress = privateKeyToAccount(publisherPkBytes).address;
}

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(cfg.rpcUrl)
});

await ensureDeployed({ client: publicClient, address: oracleAddress, label: 'StabilityOracle' });

const ownerAccount = privateKeyToAccount(ownerPkBytes);
const ownerWalletClient = createWalletClient({
  chain: sepolia,
  transport: http(cfg.rpcUrl),
  account: ownerAccount
});

const txHash = await ownerWalletClient.writeContract({
  address: oracleAddress,
  abi: stabilityOracleAbi,
  functionName: 'setAllowedSource',
  args: [publisherAddress]
});

const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

process.stdout.write(
  JSON.stringify(
    {
      oracleAddress,
      allowedSource: publisherAddress,
      txHash,
      blockNumber: receipt.blockNumber?.toString?.() ?? receipt.blockNumber
    },
    null,
    2
  ) + '\n'
);
