import "server-only";
import { unstable_cache } from "next/cache";
import { numeric, type Validator, type ValidatorYield } from "./validator-types";
import { delegatedOperation } from "./validator-operation";
import type { Candidate } from "./validator-ranking";
import { getChildHotkeys } from "./standalone-validators";

type Neuron = { netuid: number; hotkey: string; name: string | null; active: boolean; validator_permit: boolean; updated: number; total_alpha_stake: string; dividends: string; timestamp: string };
type Hyper = { netuid: number; activity_cutoff: number; timestamp: string };

async function collection<T>(path: string, filters: Record<string, string>, key: string): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= 128; page++) {
    const url = new URL(path, "https://api.taostats.io");
    Object.entries({ ...filters, limit: "200", page: String(page) }).forEach(([name, value]) => url.searchParams.set(name, value));
    const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(response.status === 429 ? "Provider rate limit reached. Try again in a few minutes." : "A required validator source is unavailable.");
    const payload = await response.json();
    if (!Array.isArray(payload.data) || !payload.pagination || payload.pagination.current_page !== page) throw new Error("Incomplete validator source response.");
    if (page === 1) console.info("Validator source preparation", path, "rows", payload.pagination.total_items);
    rows.push(...payload.data);
    if (payload.pagination.next_page === null) {
      if (rows.length !== payload.pagination.total_items) throw new Error("Validator source coverage changed during preparation. Retrying a complete snapshot is required.");
      return rows;
    }
    if (payload.pagination.next_page !== page + 1) throw new Error("Validator pagination did not advance correctly.");
  }
  throw new Error("Source exceeds the bounded scan. No recommendation was generated from partial results.");
}

export const loadCandidates = unstable_cache(async (netuid: number) => {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Validator recommendations are not configured for this environment.");
  const [validators, allYields, allNeurons, allHypers, childIndex] = await Promise.all([
    collection<Validator>("/v1/validators", { order_by: "rank", order_dir: "asc" }, key),
    // Shared paginated scans amortize all-subnet preparation across the network.
    // Cached complete pages survive retries; no partial scan is used to rank.
    collection<ValidatorYield>("/v1/validators/yield", { min_stake: "1", order_by: "netuid", order_dir: "asc" }, key),
    collection<Neuron>("/v1/subnets/metagraph", { validator_permit: "true", order_by: "netuid", order_dir: "asc" }, key),
    // One shared all-subnet snapshot replaces 128 separate parameter requests.
    collection<Hyper>("/v1/subnets/hyperparameters", {}, key),
    getChildHotkeys(),
  ]);
  const yields = allYields.filter(row => row.netuid === netuid);
  const neurons = allNeurons.filter(row => row.netuid === netuid);
  const hypers = allHypers.filter(row => row.netuid === netuid);
  if (new Set(neurons.map(row => row.hotkey)).size !== neurons.length) throw new Error("Ambiguous subnet metagraph rows.");
  if (hypers.length !== 1) throw new Error("Subnet activity parameters are unavailable.");
  const fees = new Map(validators.map(v => [v.hotkey, v]));
  const performance = new Map(yields.map(v => [v.hotkey, v]));
  const total = neurons.reduce((sum, n) => sum + (numeric(n.total_alpha_stake) ?? 0), 0);
  const parents = new Set(childIndex.subnetParents[netuid] || []);
  const children = new Set((childIndex.subnetChildren[netuid] || []).filter(hotkey => !parents.has(hotkey)));
  for (const hotkey of childIndex.hotkeys) children.add(hotkey);
  const edgeRows = childIndex.edges[netuid] || [];
  const direct = new Map(neurons.map(row => [row.hotkey, row]));
  const universe = new Set([...direct.keys(), ...parents]);
  const candidates: Candidate[] = [...universe].filter(hotkey => !children.has(hotkey)).map(hotkey => {
    const neuron = direct.get(hotkey);
    const delegated = delegatedOperation(hotkey, edgeRows, neurons, hypers[0].activity_cutoff);
    const hasEdges = edgeRows.some(edge => edge.parent === hotkey);
    const operating = hasEdges ? delegated : neuron;
    const v = fees.get(hotkey), y = performance.get(hotkey);
    return {
      hotkey, name: neuron?.name || v?.name || hotkey, operation: hasEdges ? delegated ? "delegated" : "unverified" : "direct", operators: delegated?.children,
      // Actual nominator returns already reflect reward fees. Do not deduct current take again.
      yieldBasis: "nominator-net", yieldBlock: y?.block_number, take: numeric(v?.take), yield7: numeric(y?.seven_day_apy), yield30: numeric(y?.thirty_day_apy),
      participation7: numeric(y?.seven_day_epoch_participation), participation30: numeric(y?.thirty_day_epoch_participation),
      active: hasEdges ? !!delegated : neuron?.active === true, permit: hasEdges ? !!delegated : neuron?.validator_permit === true,
      updated: numeric(operating?.updated), cutoff: numeric(hypers[0].activity_cutoff),
      stakeShare: total > 0 ? (delegated?.stake ?? numeric(neuron?.total_alpha_stake) ?? NaN) / total : null,
      dividends: numeric(operating?.dividends), registered: v?.created_on_date ?? null,
      timestamps: [y?.timestamp || "", v?.timestamp || "", hypers[0].timestamp, ...(hasEdges ? [childIndex.checkedAt, ...(delegated?.timestamps || [""])] : [neuron?.timestamp || ""])],
    };
  });
  if (new Set(candidates.map(c => c.hotkey)).size !== candidates.length || new Set(yields.map(y => y.hotkey)).size !== yields.length) throw new Error("Ambiguous validator rows. No recommendation generated.");
  return { candidates, netuid, collectedAt: new Date().toISOString(), coverage: { permitHolders: neurons.length, yieldRows: yields.length, directoryEntries: validators.length, parentPaths: parents.size, hiddenChildren: neurons.filter(row => children.has(row.hotkey)).length }, childCheck: { block: childIndex.block, checkedAt: childIndex.checkedAt } };
}, ["validator-recommendations-parent-paths-v5"], { revalidate: 1800 });

