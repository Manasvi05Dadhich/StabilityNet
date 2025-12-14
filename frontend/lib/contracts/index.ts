import type { Abi } from "viem";

import StabilityOracleAbi from "@/lib/contracts/StabilityOracle.json";
import ImmuneSystemAbi from "@/lib/contracts/ImmuneSystem.json";

import { env, isAddressSet, ZERO_ADDRESS } from "@/lib/env";

export const stabilityOracleAddress = (isAddressSet(
  env.NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS
)
  ? env.NEXT_PUBLIC_STABILITY_ORACLE_ADDRESS
  : ZERO_ADDRESS) as `0x${string}`;

export const immuneSystemAddress = (isAddressSet(env.NEXT_PUBLIC_IMMUNE_SYSTEM_ADDRESS)
  ? env.NEXT_PUBLIC_IMMUNE_SYSTEM_ADDRESS
  : ZERO_ADDRESS) as `0x${string}`;

export const stabilityOracleAbi = StabilityOracleAbi as Abi;
export const immuneSystemAbi = ImmuneSystemAbi as Abi;

export function contractsConfigured() {
  return stabilityOracleAddress !== ZERO_ADDRESS && immuneSystemAddress !== ZERO_ADDRESS;
}
