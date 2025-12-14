"use client";

import { useReadContract } from "wagmi";
import { stabilityOracleAbi, stabilityOracleAddress } from "@/lib/contracts";
import { ZERO_ADDRESS } from "@/lib/env";

export function useGlobalIndex() {
  // The deployed contract exposes `lastScore()` as the current global index.
  return useReadContract({
    address: stabilityOracleAddress,
    abi: stabilityOracleAbi,
    functionName: "lastScore",
    query: {
      enabled: stabilityOracleAddress !== ZERO_ADDRESS,
      refetchInterval: 10_000,
    },
  });
}
