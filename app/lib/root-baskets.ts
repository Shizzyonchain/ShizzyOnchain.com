import { numeric, type Validator } from "./validator-types";

export type RootHolding = { netuid: number; alpha: string; realizable_tao: string; spot_tao: string };
export type RootBasket = {
  hotkey: string; timestamp: string; block_number: number;
  nav_tao: string; spot_nav_tao: string; deposited_tao: string; redeemed_tao: string;
  shares: string; performance: number | null; return_7d: number | null; return_30d: number | null;
  staker_return_7d: number | null; staker_return_30d: number | null; holdings: RootHolding[];
};
export type NamedRootBasket = RootBasket & { name: string | null; take: number | null; root_stake: string | null; identityTimestamp: string | null };
export function joinRootBaskets(baskets: RootBasket[], validators: Validator[], children: string[], now = Date.now()) {
  const identities = new Map(validators.map(row => [row.hotkey, row]));
  const excluded = new Set(children);
  const seen = new Set<string>();
  return baskets.filter(row => !excluded.has(row.hotkey)).map(row => {
    if (seen.has(row.hotkey)) throw new Error("Duplicate root basket snapshot.");
    seen.add(row.hotkey);
    if (!Array.isArray(row.holdings) || row.holdings.some(holding => !Number.isInteger(holding.netuid) || holding.netuid < 0 || [holding.alpha, holding.realizable_tao, holding.spot_tao].some(value => numeric(value) === null || Number(value) < 0))) throw new Error("Invalid root basket holdings.");
    if (new Set(row.holdings.map(holding => holding.netuid)).size !== row.holdings.length) throw new Error("Duplicate basket holding.");
    const amounts = [row.nav_tao, row.spot_nav_tao, row.deposited_tao, row.redeemed_tao, ...row.holdings.flatMap(holding => [holding.alpha, holding.realizable_tao, holding.spot_tao])];
    if (amounts.some(value => typeof value !== "string" || !/^\d+$/.test(value))) throw new Error("Invalid basket amount.");
    if (row.holdings.reduce((sum, holding) => sum + BigInt(holding.realizable_tao), BigInt(0)) !== BigInt(row.nav_tao) || row.holdings.reduce((sum, holding) => sum + BigInt(holding.spot_tao), BigInt(0)) !== BigInt(row.spot_nav_tao)) throw new Error("Basket totals do not reconcile with holdings.");
    if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(row.timestamp) || !Number.isFinite(Date.parse(row.timestamp)) || Date.parse(row.timestamp) > now + 60000) throw new Error("Invalid or future-dated basket source time. No comparison generated.");
    const identity = identities.get(row.hotkey);
    return { ...row, name: identity?.name || null, take: numeric(identity?.take), root_stake: identity?.root_stake ?? null, identityTimestamp: identity?.timestamp ?? null };
  });
}

export function basketContext(basket: RootBasket) {
  const nav = numeric(basket.nav_tao), spot = numeric(basket.spot_nav_tao);
  const values = basket.holdings.map(holding => Number(holding.realizable_tao)).sort((a, b) => b - a);
  return {
    topFiveShare: nav !== null && nav > 0 ? values.slice(0, 5).reduce((sum, value) => sum + value, 0) / nav : null,
    cashShare: nav !== null && nav > 0 ? basket.holdings.filter(holding => holding.netuid === 0).reduce((sum, holding) => sum + Number(holding.realizable_tao), 0) / nav : null,
    quoteGap: nav !== null && spot !== null && spot > 0 ? 1 - nav / spot : null,
  };
}

export function holdingShare(holding: RootHolding, basket: RootBasket): number | null {
  const nav = numeric(basket.nav_tao), value = numeric(holding.realizable_tao);
  return nav !== null && nav > 0 && value !== null ? value / nav : null;
}
