# detection (Person 2)
This folder contains the **Detection & Scoring** logic for StabilityNet.

What it does:
- Fetch real on-chain signals (via `viem` public client)
- Compute risk breakdown using the hackathon formulas
- Produce the final `instabilityIndex` (0–100)
- Provide a helper to publish the score to `StabilityOracle.publishScore(uint256)`

## Install
From inside `detection/`:
- `npm install`

## Build / typecheck
- `npm run build`
- `npm run typecheck`

## Run analysis
- Copy `config/config.example.json` to `config/config.json`
- First time (recommended): `npm run analyze:interactive` (prompts you for missing addresses)
- Later runs: `npm run analyze`

## Publish score (after Person 1 deploys the Oracle)
1) Put the deployed oracle address in `config/config.json` at `oracle.address`
2) Set env var `PUBLISHER_PRIVATE_KEY`
3) Run: `npm run publish`

## Typical usage (from a frontend)
- Create a `publicClient` (viem)
- Call signal fetchers in `src/signals/*`
- Call `computeRiskBreakdown()` and `computeInstabilityIndex()`
- When ready, call `publishScore()` with a **wallet client**

This package is written to be **browser-friendly** (no backend assumptions).
