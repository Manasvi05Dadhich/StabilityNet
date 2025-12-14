export const env = {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,

  NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS: process.env
    .NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS,
  NEXT_PUBLIC_IMMUNE_SYSTEM_ADDRESS: process.env.NEXT_PUBLIC_IMMUNE_SYSTEM_ADDRESS,
} as const;

export function isAddressSet(addr?: string): addr is `0x${string}` {
  return typeof addr === "string" && /^0x[0-9a-fA-F]{40}$/.test(addr);
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
