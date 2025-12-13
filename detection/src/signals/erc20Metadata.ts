import type { Address, PublicClient } from 'viem';
import { readContract } from 'viem/actions';
import { parseAbi } from 'viem';

const erc20MetaAbi = parseAbi([
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)'
]);

export async function fetchErc20Metadata(params: {
  client: PublicClient;
  token: Address;
}): Promise<{ decimals: number; symbol?: string; name?: string; totalSupply?: bigint }> {
  const { client, token } = params;

  const decimals = await readContract(client, {
    address: token,
    abi: erc20MetaAbi,
    functionName: 'decimals'
  });

  // symbol/name/totalSupply sometimes revert; treat as optional.
  let symbol: string | undefined;
  let name: string | undefined;
  let totalSupply: bigint | undefined;
  try {
    symbol = await readContract(client, {
      address: token,
      abi: erc20MetaAbi,
      functionName: 'symbol'
    });
  } catch {}

  try {
    name = await readContract(client, {
      address: token,
      abi: erc20MetaAbi,
      functionName: 'name'
    });
  } catch {}

  try {
    totalSupply = await readContract(client, {
      address: token,
      abi: erc20MetaAbi,
      functionName: 'totalSupply'
    });
  } catch {}

  return { decimals: Number(decimals), symbol, name, totalSupply };
}
