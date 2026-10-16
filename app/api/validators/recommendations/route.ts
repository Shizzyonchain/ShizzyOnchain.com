import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { numeric, type Validator, type ValidatorYield } from "../../../lib/validator-types";
import type { Candidate } from "../../../lib/validator-ranking";
import { getChildHotkeys } from "../../../lib/standalone-validators";

type Neuron = { hotkey: string; name: string | null; active: boolean; validator_permit: boolean; updated: number; total_alpha_stake: string; dividends: string; timestamp: string };
type Hyper = { activity_cutoff: number; timestamp: string };

async function collection<T>(path: string, filters: Record<string, string>, key: string): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; page <= 12; page++) {
    const url = new URL(path, "https://api.taostats.io");
    Object.entries({ ...filters, limit: "200", page: String(page) }).forEach(([name, value]) => url.searchParams.set(name, value));
    const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(response.status === 429 ? "Provider rate limit reached. Try again in a few minutes." : "A required validator source is unavailable.");
    const payload = await response.json();
    if (!Array.isArray(payload.data) || !payload.pagination || payload.pagination.current_page !== page) throw new Error("Incomplete validator source response.");
    rows.push(...payload.data);
    if (payload.pagination.next_page === null) return rows;
    if (payload.pagination.next_page !== page + 1) throw new Error("Validator pagination did not advance correctly.");
  }
  throw new Error("Source exceeds the bounded scan. No recommendation was generated from partial results.");
}

const loadCandidates = unstable_cache(async (netuid: number) => {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Validator recommendations are not configured for this environment.");
  const [validators, yields, neurons, hypers, childIndex] = await Promise.all([
    collection<Validator>("/v1/validators", { order_by: "rank", order_dir: "asc" }, key),
    collection<ValidatorYield>("/v1/validators/yield", { netuid: String(netuid), order_by: "stake", order_dir: "desc" }, key),
    collection<Neuron>("/v1/subnets/metagraph", { netuid: String(netuid), validator_permit: "true" }, key),
    collection<Hyper>("/v1/subnets/hyperparameters", { netuid: String(netuid) }, key),
    getChildHotkeys(),
  ]);
  if (hypers.length !== 1) throw new Error("Subnet activity parameters are unavailable.");
  const fees = new Map(validators.map(v => [v.hotkey, v]));
  const performance = new Map(yields.map(v => [v.hotkey, v]));
  const total = neurons.reduce((sum, n) => sum + (numeric(n.total_alpha_stake) ?? 0), 0);
  const parents = new Set(childIndex.subnetParents[netuid] || []);
  const children = new Set((childIndex.subnetChildren[netuid] || []).filter(hotkey => !parents.has(hotkey)));
  for (const hotkey of childIndex.hotkeys) children.add(hotkey);
  const candidates: Candidate[] = neurons.filter(neuron => !children.has(neuron.hotkey)).map(neuron => {
    const v = fees.get(neuron.hotkey), y = performance.get(neuron.hotkey);
    return {
      hotkey: neuron.hotkey, name: neuron.name || v?.name || neuron.hotkey,
      // Actual nominator returns already reflect reward fees. Do not deduct current take again.
      yieldBasis: "nominator-net", take: numeric(v?.take), yield7: numeric(y?.seven_day_apy), yield30: numeric(y?.thirty_day_apy),
      participation7: numeric(y?.seven_day_epoch_participation), participation30: numeric(y?.thirty_day_epoch_participation),
      active: neuron.active === true, permit: neuron.validator_permit === true,
      updated: numeric(neuron.updated), cutoff: numeric(hypers[0].activity_cutoff),
      stakeShare: total > 0 && numeric(neuron.total_alpha_stake) !== null ? Number(neuron.total_alpha_stake) / total : null,
      dividends: numeric(neuron.dividends), registered: v?.created_on_date ?? null,
      timestamps: [neuron.timestamp, y?.timestamp || "", v?.timestamp || "", hypers[0].timestamp],
    };
  });
  if (new Set(candidates.map(c => c.hotkey)).size !== candidates.length || new Set(yields.map(y => y.hotkey)).size !== yields.length) throw new Error("Ambiguous validator rows. No recommendation generated.");
  return { candidates, netuid, collectedAt: new Date().toISOString(), coverage: { permitHolders: neurons.length, yieldRows: yields.length, directoryEntries: validators.length, hiddenChildren: neurons.length - candidates.length }, childCheck: { block: childIndex.block, checkedAt: childIndex.checkedAt } };
}, ["validator-recommendations-net-yield-v3"], { revalidate: 1800 });

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("netuid");
  const netuid = Number(raw);
  if (!raw || !/^\d+$/.test(raw) || !Number.isInteger(netuid) || netuid < 1 || netuid > 1024) return NextResponse.json({ error: "Choose a valid alpha subnet." }, { status: 400 });
  try {
    return NextResponse.json(await loadCandidates(netuid), { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Recommendations unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
