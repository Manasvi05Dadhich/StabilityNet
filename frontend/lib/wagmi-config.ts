import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";

import { env } from "@/lib/env";

const sepoliaRpcUrl = env.NEXT_PUBLIC_ALCHEMY_API_KEY
  ? `https://eth-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  : undefined;

// Injected-only connector (MetaMask) to avoid WalletConnect's indexedDB usage during Next build.
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
  ssr: false,
});
