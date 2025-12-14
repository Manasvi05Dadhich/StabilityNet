"use client";

import { useReadContract } from "wagmi";
import { stabilityOracleAbi, stabilityOracleAddress } from "@/lib/contracts";
import { ZERO_ADDRESS } from "@/lib/env";

export function useGlobalIndex() {
  return useReadContract({
    address: stabilityOracleAddress,
    abi: stabilityOracleAbi,
    functionName: "getGlobalIndex",
    query: {
      enabled: stabilityOracleAddress !== ZERO_ADDRESS,
      refetchInterval: 10_000,
    },
  });
}