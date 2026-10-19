import "server-only";
import { getCache } from "@vercel/functions";
import { loadCandidates, loadCandidateSources, buildCandidates } from "./validator-candidates";
import { prepareSubnetWrites } from "./subnet-preparation-batch";
import { recommendationNeedsRefresh } from "./recommendation-freshness";
import { getSubnetNewsBriefs } from "./subnet-news";

const cache = () => getCache({ namespace: "subnet-recommendations-v1" });
type Snapshot = Awaited<ReturnType<typeof loadCandidates>> & { preparedAt: string };
export async function readSubnetRecommendations(netuid: number) {
  const value = await cache().get(`snapshot:${netuid}`) as Snapshot | undefined;
  // Retaining a snapshot never overrides the ranking's stricter source-age checks.
  return value && value.netuid === netuid && Date.parse(value.preparedAt) <= Date.now() + 60000 && Date.now() - Date.parse(value.preparedAt) < 7200000 ? value : null;
}
export async function prepareSubnetRecommendations(netuid: number, sources?: Awaited<ReturnType<typeof loadCandidateSources>>) {
  // A short shared lease avoids a new scan on each polling request. This is
  // best-effort coalescing; correctness does not depend on exclusive ownership.
  if (await cache().get(`preparing:${netuid}`)) return;
  await cache().set(`preparing:${netuid}`, true, { ttl: 120 });
  await cache().set(`attempt:${netuid}`, Date.now(), { ttl: 7200 });
  try {
    const snapshot = { ...(sources ? buildCandidates(netuid, sources) : await loadCandidates(netuid)), preparedAt: new Date().toISOString() };
    await cache().set(`snapshot:${netuid}`, snapshot, { ttl: 7200 });
    await cache().delete(`preparing:${netuid}`);
    return snapshot;
  } catch (error) {
    // Polling visitors must not repeatedly hit an already throttled provider.
    await cache().set(`preparing:${netuid}`, true, { ttl: 60 });
    throw error;
  }
}
export async function prepareSubnetBatch() {
  const started = Date.now();
  const netuids = [...new Set((getSubnetNewsBriefs()[0]?.subnets || []).map(row => row.netuid).filter(n => n > 0))];
  const snapshots = await Promise.all(netuids.map(async netuid => {
    const [snapshot, attempt] = await Promise.all([readSubnetRecommendations(netuid), cache().get(`attempt:${netuid}`)]);
    return { netuid, snapshot, attemptedAt: typeof attempt === "number" ? attempt : 0 };
  }));
  const pending = snapshots.filter(row => !row.snapshot || recommendationNeedsRefresh(row.snapshot, started))
    .sort((a, b) => a.attemptedAt - b.attemptedAt);
  if (!pending.length) return { prepared: [], failed: [], inProgress: [], remaining: 0, total: netuids.length };
  // One complete source scan serves every subnet; building rows does not call providers.
  const sources = await loadCandidateSources();
  const result = await prepareSubnetWrites(pending.map(row => row.netuid), netuid => prepareSubnetRecommendations(netuid, sources), started + 220000);
  return { ...result, total: netuids.length };
}
