import fs from 'node:fs';
import path from 'node:path';

import solc from 'solc';
import { ContractFactory, JsonRpcProvider, Wallet } from 'ethers';

function firstPositional() {
  return process.argv.slice(2).find((a) => !a.startsWith('-')) ?? null;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
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

function compileContracts() {
  const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlashLoanEmitter {
  event FlashLoan(
    address indexed target,
    address indexed initiator,
    address indexed asset,
    uint256 amount,
    uint256 premium,
    uint16 referralCode
  );

  function emitFlashLoan(
    address target,
    address initiator,
    address asset,
    uint256 amount,
    uint256 premium,
    uint16 referralCode
  ) external {
    emit FlashLoan(target, initiator, asset, amount, premium, referralCode);
  }
}

contract VoteCastEmitter {
  event VoteCast(
    address indexed voter,
    uint256 proposalId,
    uint8 support,
    uint256 weight,
    string reason
  );

  function emitVoteCast(
    uint256 proposalId,
    uint8 support,
    uint256 weight,
    string calldata reason
  ) external {
    emit VoteCast(msg.sender, proposalId, support, weight, reason);
  }
}
`;

  const input = {
    language: 'Solidity',
    sources: {
      'DemoSignals.sol': { content: source }
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = (output.errors ?? []).filter((e) => e.severity === 'error');
  if (errors.length) {
    throw new Error(`solc compile failed: ${errors.map((e) => e.formattedMessage).join('\n')}`);
  }

  const flash = output.contracts['DemoSignals.sol'].FlashLoanEmitter;
  const vote = output.contracts['DemoSignals.sol'].VoteCastEmitter;

  return {
    FlashLoanEmitter: {
      abi: flash.abi,
      bytecode: `0x${flash.evm.bytecode.object}`
    },
    VoteCastEmitter: {
      abi: vote.abi,
      bytecode: `0x${vote.evm.bytecode.object}`
    }
  };
}

async function main() {
  const configPathArg = firstPositional() ?? 'config/config.json';
  const configPath = path.resolve(process.cwd(), configPathArg);
  if (!fs.existsSync(configPath)) throw new Error(`Config file not found: ${configPath}`);

  const cfg = readJson(configPath);
  if (!cfg.rpcUrl) throw new Error('config.rpcUrl is required');

  const pk = normalizePrivateKey(requireEnv('PUBLISHER_PRIVATE_KEY'));

  const provider = new JsonRpcProvider(cfg.rpcUrl);
  const wallet = new Wallet(pk, provider);

  const compiled = compileContracts();

  const flashFactory = new ContractFactory(
    compiled.FlashLoanEmitter.abi,
    compiled.FlashLoanEmitter.bytecode,
    wallet
  );
  const flash = await flashFactory.deploy();
  await flash.waitForDeployment();
  const flashAddress = await flash.getAddress();

  const voteFactory = new ContractFactory(
    compiled.VoteCastEmitter.abi,
    compiled.VoteCastEmitter.bytecode,
    wallet
  );
  const vote = await voteFactory.deploy();
  await vote.waitForDeployment();
  const voteAddress = await vote.getAddress();

  // Write back to config.
  cfg.flashLoans = cfg.flashLoans ?? {};
  cfg.flashLoans.enabled = true;
  cfg.flashLoans.address = flashAddress;
  cfg.flashLoans.eventAbiItem =
    cfg.flashLoans.eventAbiItem ??
    'event FlashLoan(address indexed target,address indexed initiator,address indexed asset,uint256 amount,uint256 premium,uint16 referralCode)';

  cfg.governance = cfg.governance ?? {};
  cfg.governance.enabled = true;
  cfg.governance.governor = voteAddress;
  cfg.governance.proposalId = cfg.governance.proposalId ?? '1';
  cfg.governance.estimateNewWalletVoters = false;

  // Keep block window small to avoid RPC limits.
  cfg.blocks = cfg.blocks ?? {};
  cfg.blocks.blocksBack = cfg.blocks.blocksBack ?? 50;

  writeJson(configPath, cfg);

  process.stdout.write(
    JSON.stringify(
      {
        flashLoanEmitter: flashAddress,
        voteCastEmitter: voteAddress,
        publisher: wallet.address,
        configPath
      },
      null,
      2
    ) + '\n'
  );
}

await main();
