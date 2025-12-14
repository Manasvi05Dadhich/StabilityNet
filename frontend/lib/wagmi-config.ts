import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";

// Use CORS-friendly public RPCs by default (browser).
// Alchemy often blocks browser CORS or rate-limits eth_getLogs on free tiers.
const sepoliaRpcUrl =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
  "https://ethereum-sepolia-rpc.publicnode.com";

// Injected-only connector (MetaMask) to avoid WalletConnect's indexedDB usage during Next build.
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
  ssr: false,
});
