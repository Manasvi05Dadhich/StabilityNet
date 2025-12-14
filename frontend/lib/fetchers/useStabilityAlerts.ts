"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { parseAbiItem } from "viem";

import { stabilityOracleAbi, stabilityOracleAddress } from "@/lib/contracts";
import { ZERO_ADDRESS } from "@/lib/env";

type AlertItem = {
  score: bigint;
  timestamp: bigint;
  sender: `0x${string}`;
  txHash?: `0x${string}`;
};

const stabilityAlertEvent = parseAbiItem(
  "event StabilityAlert(uint256 score,uint256 timestamp,address indexed sender)"
);

export function useStabilityAlerts({ limit = 10 }: { limit?: number } = {}) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const publicClient = usePublicClient();

  // Best-effort: load a small recent history.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!publicClient) return;
      if (stabilityOracleAddress === ZERO_ADDRESS) return;

      try {
        const latest = await publicClient.getBlockNumber();
        const window = BigInt(5000);
        const fromBlock = latest > window ? latest - window : BigInt(0);

        const logs = await publicClient.getLogs({
          address: stabilityOracleAddress,
          event: stabilityAlertEvent,
          fromBlock,
          toBlock: "latest",
        });

        if (cancelled) return;

        const parsed = logs
          .map((l) => ({
            score: l.args.score ?? BigInt(0),
            timestamp: l.args.timestamp ?? BigInt(0),
            sender: (l.args.sender ?? ZERO_ADDRESS) as `0x${string}`,
            txHash: l.transactionHash,
          }))
          .slice(-limit)
          .reverse();

        setAlerts(parsed);
      } catch {
        // ignore
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [publicClient, limit]);

  useWatchContractEvent({
    address: stabilityOracleAddress,
    abi: stabilityOracleAbi,
    eventName: "StabilityAlert",
    enabled: stabilityOracleAddress !== ZERO_ADDRESS,
    onLogs(logs) {
      setAlerts((prev) => {
        const next = [...prev];
        for (const l of logs as any[]) {
          const args = (l?.args ?? {}) as any;
          const item: AlertItem = {
            score: (args.score ?? BigInt(0)) as bigint,
            timestamp: (args.timestamp ?? BigInt(0)) as bigint,
            sender: (args.sender ?? ZERO_ADDRESS) as `0x${string}`,
            txHash: l.transactionHash,
          };
          next.unshift(item);
        }
        return next.slice(0, limit);
      });
    },
  });

  return alerts;
}

export function formatAlertTime(tsSeconds: bigint) {
  const ms = Number(tsSeconds) * 1000;
  const d = new Date(ms);
  return d.toLocaleString();
}
