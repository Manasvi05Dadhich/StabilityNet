"use client";

import { useReadContract } from "wagmi";
import { immuneSystemAbi, immuneSystemAddress } from "@/lib/contracts";
import { ZERO_ADDRESS } from "@/lib/env";

export function useGuardrailActive() {
  return useReadContract({
    address: immuneSystemAddress,
    abi: immuneSystemAbi,
    functionName: "isGuardrailActive",
    query: {
      enabled: immuneSystemAddress !== ZERO_ADDRESS,
      refetchInterval: 10_000,
    },
  });
}
