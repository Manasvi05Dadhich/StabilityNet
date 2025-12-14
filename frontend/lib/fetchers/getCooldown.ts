"use client";

import { useReadContract } from "wagmi";
import { immuneSystemAbi, immuneSystemAddress } from "@/lib/contracts";
import { ZERO_ADDRESS } from "@/lib/env";

export function useCooldownActive() {
  return useReadContract({
    address: immuneSystemAddress,
    abi: immuneSystemAbi,
    functionName: "isCooldownActive",
    query: {
      enabled: immuneSystemAddress !== ZERO_ADDRESS,
      refetchInterval: 10_000,
    },
  });
}