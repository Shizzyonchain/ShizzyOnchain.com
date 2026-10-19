// Cache writes are bounded, but every subnet can be handled in the same run.
export async function prepareSubnetWrites(netuids: number[], prepare: (netuid: number) => Promise<unknown>, deadline: number, now = Date.now) {
  const prepared: number[] = [], failed: number[] = [], inProgress: number[] = [];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, netuids.length) }, async () => {
    while (next < netuids.length && now() < deadline) {
      const netuid = netuids[next++];
      try { if (await prepare(netuid)) prepared.push(netuid); else inProgress.push(netuid); }
      catch { failed.push(netuid); }
    }
  }));
  return { prepared, failed, inProgress, remaining: netuids.length - prepared.length };
}
