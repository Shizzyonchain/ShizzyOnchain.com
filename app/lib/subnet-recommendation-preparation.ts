import "server-only";
import { getCache } from "@vercel/functions";
import { loadCandidates } from "./validator-candidates";
import { getSubnetNewsBriefs } from "./subnet-news";

const cache = () => getCache({ namespace: "subnet-recommendations-v1" });
type Snapshot = Awaited<ReturnType<typeof loadCandidates>> & { preparedAt: string };
export async function readSubnetRecommendations(netuid: number) {
  const value = await cache().get(`snapshot:${netuid}`) as Snapshot | undefined;
  // Retaining a snapshot never overrides the ranking's stricter source-age checks.
  return value && value.netuid === netuid && Date.now() - Date.parse(value.preparedAt) < 7200000 ? value : null;
}
export async function prepareSubnetRecommendations(netuid: number) {
  // A short shared lease avoids a new scan on each polling request. This is
  // best-effort coalescing; correctness does not depend on exclusive ownership.
  if (await cache().get(`preparing:${netuid}`)) return;
  await cache().set(`preparing:${netuid}`, true, { ttl: 120 });
  await cache().set(`attempt:${netuid}`, Date.now(), { ttl: 7200 });
  try {
    const snapshot = { ...await loadCandidates(netuid), preparedAt: new Date().toISOString() };
    await cache().set(`snapshot:${netuid}`, snapshot, { ttl: 7200 });
    return snapshot;
  } finally { await cache().delete(`preparing:${netuid}`); }
}
export async function prepareSubnetBatch() {
  const started = Date.now();
  const netuids = [...new Set((getSubnetNewsBriefs()[0]?.subnets || []).map(row => row.netuid).filter(n => n > 0))];
  const snapshots = await Promise.all(netuids.map(async netuid => {
    const [snapshot, attempt] = await Promise.all([readSubnetRecommendations(netuid), cache().get(`attempt:${netuid}`)]);
    return { netuid, snapshot, attemptedAt: typeof attempt === "number" ? attempt : 0 };
  }));
  const pending = snapshots.filter(row => !row.snapshot || started - Date.parse(row.snapshot.preparedAt) >= 1800000)
    .sort((a, b) => a.attemptedAt - b.attemptedAt);
  const prepared: number[] = [], failed: number[] = [];
  for (const { netuid } of pending.slice(0, 20)) {
    if (Date.now() - started > 220000) break;
    try { await prepareSubnetRecommendations(netuid); prepared.push(netuid); }
    catch { failed.push(netuid); }
  }
  return { prepared, failed, remaining: pending.length - prepared.length - failed.length, total: netuids.length };
}
