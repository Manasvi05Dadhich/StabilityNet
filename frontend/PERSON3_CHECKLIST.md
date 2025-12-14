# 🎯 PERSON 3 (Frontend/UI Engineer) - REMAINING WORK CHECKLIST

## ✅ **COMPLETED**
- [x] All UI pages created (Dashboard, Signals, Immune System, Publish Score, About)
- [x] Navigation bar with all links
- [x] Footer component
- [x] Basic wallet connection (window.ethereum)
- [x] All UI components (ScoreCard, RiskChart, RiskBreakdown, Alertsfeed)
- [x] Contract ABI file structure exists
- [x] Fetcher file structure exists
- [x] Providers component exists
- [x] TailwindCSS styling
- [x] Responsive design

---

## 🔴 **CRITICAL - MUST DO**

### 1. **Setup wagmi + RainbowKit** ⚠️ HIGH PRIORITY
- [ ] Install dependencies:
  ```bash
  npm install wagmi viem @rainbow-me/rainbowkit
  ```
- [ ] Configure wagmi in `lib/wagmiConfig.ts`
- [ ] Setup RainbowKit provider in `components/Providers.tsx`
- [ ] Update `WalletConnect.tsx` to use RainbowKit
- [ ] Add Sepolia testnet configuration
- [ ] Test wallet connection

### 2. **Contract Integration** ⚠️ HIGH PRIORITY
- [ ] Get contract addresses from Person 1
- [ ] Get contract ABIs from Person 1
- [ ] Update `lib/contracts/StabilityOracle.json` with real ABI
- [ ] Update `lib/contracts/ImmuneSystem.json` with real ABI
- [ ] Create contract instances using wagmi hooks

### 3. **Implement Contract Fetchers** ⚠️ HIGH PRIORITY
- [ ] Implement `lib/fetchers/getIndex.ts` - calls `getGlobalIndex()`
- [ ] Implement `lib/fetchers/getCooldown.ts` - calls `isCooldownActive()`
- [ ] Implement `lib/fetchers/getGuardrail.ts` - calls `isGuardrailActive()`
- [ ] Use wagmi `useReadContract` hooks
- [ ] Add error handling

### 4. **Dashboard Page - Real Data** ⚠️ HIGH PRIORITY
- [ ] Replace hardcoded "87.5" with real `getGlobalIndex()` from contract
- [ ] Display real instability index
- [ ] Show real-time updates (use React Query)
- [ ] Connect RiskBreakdown to real data
- [ ] Connect Alertsfeed to real contract events

### 5. **Immune System Page - Real Data** ⚠️ HIGH PRIORITY
- [ ] Display real `isCooldownActive()` status
- [ ] Display real `isGuardrailActive()` status
- [ ] Show latest `StabilityAlert` events from contract
- [ ] Real-time status updates

### 6. **Publish Page - Integration with Person 2** ⚠️ HIGH PRIORITY
- [ ] Add "Analyze Chain" button
- [ ] Connect to Person 2's detection function
- [ ] Display signals from Person 2 (liquidity, whales, flash loans, DAO votes)
- [ ] Display risk breakdown (Economic, Social, Governance)
- [ ] Display final instability index
- [ ] Add "Publish Score" button
- [ ] Connect "Publish Score" to contract `publishScore()` function
- [ ] Show transaction status (pending, success, error)

### 7. **Signals Page - Real Data** ⚠️ MEDIUM PRIORITY
- [ ] Connect to Person 2's signal detection
- [ ] Display real liquidity data
- [ ] Display real whale transfer data
- [ ] Display real flash loan data
- [ ] Display real DAO vote data

---

## 🟡 **IMPORTANT - SHOULD DO**

### 8. **React Query Setup**
- [ ] Configure React Query in Providers
- [ ] Add query hooks for contract data
- [ ] Add auto-refresh intervals
- [ ] Add error boundaries

### 9. **Transaction Handling**
- [ ] Add transaction status UI (pending, success, error)
- [ ] Add transaction hash display
- [ ] Add loading states for contract calls
- [ ] Add error messages for failed transactions

### 10. **Event Listening**
- [ ] Listen to `StabilityAlert` events from contract
- [ ] Update UI when events are emitted
- [ ] Show event history

---

## 🟢 **NICE TO HAVE**

### 11. **IPFS Deployment**
- [ ] Setup Fleek account
- [ ] Configure build for static export
- [ ] Deploy to IPFS
- [ ] Test deployed site

### 12. **Polish & UX**
- [ ] Add loading skeletons
- [ ] Add error states
- [ ] Add empty states
- [ ] Add tooltips
- [ ] Add toast notifications

---

## 📋 **DEPENDENCIES NEEDED FROM TEAM**

### From Person 1 (Blockchain):
- [ ] StabilityOracle contract address (Sepolia)
- [ ] ImmuneSystem contract address (Sepolia)
- [ ] Contract ABIs (JSON files)
- [ ] Function signatures:
  - `publishScore(uint256)`
  - `getGlobalIndex() returns (uint256)`
  - `isCooldownActive() returns (bool)`
  - `isGuardrailActive() returns (bool)`

### From Person 2 (Detection):
- [ ] Detection function to call (e.g., `analyzeChain()`)
- [ ] Signals object structure
- [ ] Risk breakdown object structure
- [ ] How to trigger analysis

---

## 🚀 **QUICK START CHECKLIST**

1. **Install wagmi dependencies** (5 min)
2. **Setup wagmi config** (10 min)
3. **Update WalletConnect component** (15 min)
4. **Get contract addresses from Person 1** (wait)
5. **Implement contract fetchers** (30 min)
6. **Connect Dashboard to real data** (20 min)
7. **Connect Immune System page** (20 min)
8. **Add "Analyze Chain" button** (15 min)
9. **Add "Publish Score" button** (20 min)
10. **Test everything** (30 min)

**Total estimated time: ~3-4 hours** (excluding waiting for Person 1's contracts)

---

## 📝 **NOTES**

- All UI is done ✅
- Need to replace mock data with real contract calls
- Need to integrate with Person 2's detection logic
- Need proper wallet connection (wagmi/RainbowKit)
- Need IPFS deployment for hackathon


