import fs from 'node:fs';
import path from 'node:path';

import { Contract, JsonRpcProvider, Wallet } from 'ethers';

function getFlagValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Set env var ${name} (do not commit it).`);
  return v;
}

function normalizePrivateKey(raw) {
  const hex = raw.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error('PUBLISHER_PRIVATE_KEY must be 32-byte hex (64 hex chars), optional 0x prefix.');
  }
  return `0x${hex}`;
}

async function main() {
  const configPathArg = getFlagValue('--config') ?? 'config/config.json';
  const configPath = path.resolve(process.cwd(), configPathArg);
  if (!fs.existsSync(configPath)) throw new Error(`Config file not found: ${configPath}`);

  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!cfg.rpcUrl) throw new Error('config.rpcUrl is required');

  const flashCount = Number.parseInt(getFlagValue('--flash') ?? '3', 10);
  const voteCount = Number.parseInt(getFlagValue('--votes') ?? '2', 10);
  const proposalId = BigInt(getFlagValue('--proposalId') ?? String(cfg.governance?.proposalId ?? '1'));

  if (!cfg.flashLoans?.address) throw new Error('config.flashLoans.address is required (run demoDeploySignals.mjs first)');
  if (!cfg.governance?.governor) throw new Error('config.governance.governor is required (run demoDeploySignals.mjs first)');

  const pk = normalizePrivateKey(requireEnv('PUBLISHER_PRIVATE_KEY'));
  const provider = new JsonRpcProvider(cfg.rpcUrl);
  const wallet = new Wallet(pk, provider);

  const flash = new Contract(
    cfg.flashLoans.address,
    [
      'function emitFlashLoan(address target,address initiator,address asset,uint256 amount,uint256 premium,uint16 referralCode)'
    ],
    wallet
  );

  const vote = new Contract(
    cfg.governance.governor,
    ['function emitVoteCast(uint256 proposalId,uint8 support,uint256 weight,string reason)'],
    wallet
  );

  const txs = [];

  // Emit FlashLoan events
  for (let i = 0; i < flashCount; i += 1) {
    const tx = await flash.emitFlashLoan(
      wallet.address,
      wallet.address,
      cfg.whales?.token ?? wallet.address,
      1n,
      0n,
      0
    );
    txs.push(tx.hash);
    await tx.wait();
  }

  // Emit VoteCast events (support: 1=yes, 0=no)
  for (let i = 0; i < voteCount; i += 1) {
    const support = i % 2 === 0 ? 1 : 0;
    const weight = support === 1 ? 51n : 49n;
    const tx = await vote.emitVoteCast(proposalId, support, weight, 'demo');
    txs.push(tx.hash);
    await tx.wait();
  }

  process.stdout.write(
    JSON.stringify(
      {
        publisher: wallet.address,
        flashLoanEmitter: cfg.flashLoans.address,
        voteCastEmitter: cfg.governance.governor,
        proposalId: proposalId.toString(),
        emittedTxs: txs
      },
      null,
      2
    ) + '\n'
  );
}

await main();
