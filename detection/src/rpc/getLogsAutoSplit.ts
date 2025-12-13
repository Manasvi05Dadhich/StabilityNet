import type { PublicClient } from 'viem';
import { getLogs } from 'viem/actions';

function looksLikeRangeLimitError(err: unknown): boolean {
  const anyErr = err as any;
  const details: string | undefined = anyErr?.details;
  const shortMessage: string | undefined = anyErr?.shortMessage;

  const haystack = `${shortMessage ?? ''} ${details ?? ''}`.toLowerCase();
  return haystack.includes('block range') || (haystack.includes('range') && haystack.includes('block'));
}

function looksLikeRateLimitError(err: unknown): boolean {
  const anyErr = err as any;
  const status: number | undefined = anyErr?.status;
  const details: string | undefined = anyErr?.details;
  const shortMessage: string | undefined = anyErr?.shortMessage;

  const haystack = `${shortMessage ?? ''} ${details ?? ''}`.toLowerCase();
  return status === 429 || haystack.includes('too many requests');
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

type GetLogsArgs = Parameters<typeof getLogs>[1];

// Note: viem's getLogs has complex generics for decoding args.
// This helper focuses on reliability (auto-splitting ranges) and returns `any[]`.
export async function getLogsAutoSplit(
  client: PublicClient,
  args: GetLogsArgs,
  opts?: { maxDepth?: number; maxRetries429?: number; baseDelayMs?: number }
): Promise<any[]> {
  const maxDepth = opts?.maxDepth ?? 20;
  const maxRetries429 = opts?.maxRetries429 ?? 6;
  const baseDelayMs = opts?.baseDelayMs ?? 800;

  const fromBlock = (args as any).fromBlock as bigint | undefined;
  const toBlock = (args as any).toBlock as bigint | undefined;

  // Retry loop for 429s (rate limiting)
  for (let attempt = 0; attempt <= maxRetries429; attempt += 1) {
    try {
      return await getLogs(client as any, args as any);
    } catch (err) {
      if (looksLikeRateLimitError(err) && attempt < maxRetries429) {
        const backoff = baseDelayMs * 2 ** attempt;
        await sleep(backoff);
        continue;
      }

      // If it's a range-limit error, fall through to the splitting logic below.
      if (!looksLikeRangeLimitError(err)) {
        throw err;
      }
      break;
    }
  }

  // Range splitting
  if (
    maxDepth <= 0 ||
    fromBlock === undefined ||
    toBlock === undefined ||
    toBlock <= fromBlock
  ) {
    throw new Error('getLogsAutoSplit exceeded maxDepth or invalid range');
  }

  const mid = (fromBlock + toBlock) / 2n;

  const left = await getLogsAutoSplit(
    client,
    { ...(args as any), fromBlock, toBlock: mid },
    { ...opts, maxDepth: maxDepth - 1 }
  );

  const right = await getLogsAutoSplit(
    client,
    { ...(args as any), fromBlock: mid + 1n, toBlock },
    { ...opts, maxDepth: maxDepth - 1 }
  );

  return [...left, ...right] as any;
}
