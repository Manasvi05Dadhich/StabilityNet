# StabilityNet
Repo layout (3-person team):
- `detection/` (Person 2): on-chain signal fetching + risk scoring + optional publish helper
- (later) `contracts/` (Person 1): Foundry smart contracts
- (later) `dashboard/` (Person 3): Next.js UI

## Run Detection (Person 2)
1. Go to `detection/`
2. Install deps: `npm install`
3. Create config: copy `config/config.example.json` to `config/config.json` and fill values
4. Run analysis:
   - Non-interactive: `npm run analyze` (uses `detection/config/config.json`)
   - Interactive (recommended first time): `npm run analyze:interactive`

This prints a JSON `StabilityReport` containing:
- raw signals
- risk breakdown
- final `instabilityIndex`
