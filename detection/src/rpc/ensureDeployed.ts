import type { Address, PublicClient } from 'viem';
import { getBytecode } from 'viem/actions';

export async function ensureDeployed(params: {
  client: PublicClient;
  address: Address;
  label: string;
}): Promise<void> {
  const { client, address, label } = params;
  const code = await getBytecode(client, { address });
  if (!code) {
    throw new Error(
      `${label} address has no bytecode on this chain: ${address}. ` +
        `Make sure you deployed using Injected Provider (MetaMask) on Sepolia, not Remix VM.`
    );
  }
}
