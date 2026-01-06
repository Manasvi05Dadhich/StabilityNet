# StabilityNet
StabilityNet is a hackathon-style prototype that monitors **real on-chain signals** and publishes a single **Instability Index (0–100)** on-chain. When the index crosses a danger threshold (>= 75), an **Immune System** contract can activate defensive controls.

Repo layout:
- `stabilitynet-contracts/` — Solidity smart contracts (Foundry)
- `detection/` — Person 2 detection + scoring + publish CLI (TypeScript)
- `frontend/` — Person 3 dashboard UI (Next.js + wagmi + viem)

## What it does (end-to-end)
1. **Collect signals** from Sepolia using RPC (no backend):
   - Liquidity Drop (Uniswap V2 pair reserves)
   - Whale Transfers (ERC20 Transfer events)
   - Flash Loan Events (FlashLoan event counter)
   - DAO Vote Split (Governor VoteCast events)
2. **Compute risk** categories and a final index:
   - Economic risk (0–40)
   - Social risk (0–30)
   - Governance risk (0–30)
   - `instabilityIndex = economic + social + governance` (0–100)
3. **Publish score** to the on-chain Oracle:
   - `publishScore(uint256 score)`
4. **On-chain reaction** (contracts):
   - Oracle stores latest values + emits `StabilityAlert`
   - If score >= 75 and immune system is configured, Oracle can trigger ImmuneSystem defenses

## Contracts (Person 1)
Located in `stabilitynet-contracts/contracts/`.

### StabilityOracle.sol
- Permissioned publisher (allowed source)
- Accepts `publishScore(uint256 score)` where `score <= 100`
- Maintains latest score and timestamps
- Emits alerts (events)
- Can call the Immune System when danger threshold is met

Useful public getters (Solidity `public` variables compile into getters):
- `lastScore() -> uint256` (used as "global index" in the UI)
- `lastUpdated() -> uint256`
- `allowedSource() -> address`
- `immuneSystem() -> address`

### ImmuneSystem.sol
Provides defensive "immune" states exposed to the UI:
- `isCooldownActive() -> bool`
- `isGuardrailActive() -> bool`

## Detection package (Person 2) — `detection/`
### What it provides
- CLI analysis (`npm run analyze`): fetch signals + compute risk breakdown + final index
- CLI publish (`npm run publish`): analyze + `publishScore(index)` on the Oracle
- Optional authorization helper (`npm run authorize`) for permissioned Oracle

### Setup
1) Install:
```bash
npm --prefix ./detection install
```

2) Configure:
- Edit `detection/config/config.json`
  - `rpcUrl` (Sepolia RPC)
  - addresses for monitored contracts (pair/token/governor/etc)
  - `oracle.address` (Oracle deployed address)

3) Run analysis:
```bash
npm --prefix ./detection run analyze
```

4) Publish a score (permissioned):
- Set env var `PUBLISHER_PRIVATE_KEY` (32-byte hex)
```bash
# bash example
export PUBLISHER_PRIVATE_KEY=0x...
npm --prefix ./detection run publish
```

### Permissioned Oracle: allowlisting
If Oracle restricts publishing, the Oracle owner must set the allowed publisher:
- Env vars:
  - `ORACLE_OWNER_PRIVATE_KEY` (owner/deployer key)
  - `PUBLISHER_ADDRESS` (address to allowlist) OR `PUBLISHER_PRIVATE_KEY`
- Run:
```bash
npm --prefix ./detection run authorize
```

## Frontend (Person 3) — `frontend/`
### What it provides
- Dashboard (global index + alerts)
- Signals page (shows outputs from Person 2 analysis)
- Immune System page (cooldown + guardrail + alerts)
- Publish Score page (Analyze Chain + Publish Score)

### Setup
1) Install:
```bash
npm --prefix ./frontend install
```

2) Environment variables
Create `frontend/.env.local`:
```text
# RPC for browser reads (public RPC is recommended for CORS reliability)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Optional (may be rate-limited / CORS blocked in browsers)
NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_KEY

# Deployed contract addresses (Sepolia)
NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS=0x...
NEXT_PUBLIC_IMMUNE_SYSTEM_ADDRESS=0x...
```

3) Run dev server:
```bash
npm --prefix ./frontend run dev
```

### Publishing from UI (permissioned)
The UI publishes from the **connected wallet**. If the Oracle is permissioned:
- the connected wallet address must be allowlisted by the Oracle owner (`setAllowedSource`).

## Demo workflow (recommended)
1) Start frontend and connect wallet.
2) Go to `/publish-score`.
3) Click **Analyze Chain** to compute the index from real signals.
4) Click **Publish Score** to write the index on-chain.
5) Check `/dashboard` and `/immune` for:
   - updated global index (`lastScore()`)
   - `StabilityAlert` events
   - immune system status

## Current deployed addresses (Sepolia)
Update these if you redeploy.
- StabilityOracle: `0xd18Ad0acCeC2F1f6DE67B08c1eD88164840af6C7`
- ImmuneSystem: `0xD53f40B0C59c8C9908d9b205BfE564B60fBdfc0e`

## Troubleshooting
- **UI shows index but Analyze Chain is 0**: there may be no qualifying events in the current block window for the configured contracts.
- **Analyze Chain shows 400/429/CORS**: switch to a public RPC using `NEXT_PUBLIC_SEPOLIA_RPC_URL`.
- **Publish fails/reverts**: likely the connected wallet is not allowlisted (permissioned oracle) or lacks Sepolia ETH for gas.

## Security
- Never commit private keys (`PUBLISHER_PRIVATE_KEY`, `ORACLE_OWNER_PRIVATE_KEY`).
- Use test wallets on Sepolia only.
