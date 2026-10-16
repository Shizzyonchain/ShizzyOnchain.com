import { numeric, type Validator } from "./validator-types";

export type RootHolding = { netuid: number; alpha: string; realizable_tao: string; spot_tao: string };
export type RootBasket = {
  hotkey: string; timestamp: string; block_number: number;
  nav_tao: string; spot_nav_tao: string; deposited_tao: string; redeemed_tao: string;
  shares: string; performance: number | null; return_7d: number | null; return_30d: number | null;
  staker_return_7d: number | null; staker_return_30d: number | null; holdings: RootHolding[];
};
export type NamedRootBasket = RootBasket & { name: string | null; take: number | null; root_stake: string | null };
export function joinRootBaskets(baskets: RootBasket[], validators: Validator[], children: string[]) {
  const identities = new Map(validators.map(row => [row.hotkey, row]));
  const excluded = new Set(children);
  const seen = new Set<string>();
  return baskets.filter(row => !excluded.has(row.hotkey)).map(row => {
    if (seen.has(row.hotkey)) throw new Error("Duplicate root basket snapshot.");
    seen.add(row.hotkey);
    if (!Array.isArray(row.holdings) || row.holdings.some(holding => !Number.isInteger(holding.netuid) || holding.netuid < 0 || [holding.alpha, holding.realizable_tao, holding.spot_tao].some(value => numeric(value) === null || Number(value) < 0))) throw new Error("Invalid root basket holdings.");
    if (new Set(row.holdings.map(holding => holding.netuid)).size !== row.holdings.length) throw new Error("Duplicate basket holding.");
    const identity = identities.get(row.hotkey);
    return { ...row, name: identity?.name || null, take: numeric(identity?.take), root_stake: identity?.root_stake ?? null };
  });
}

export function holdingShare(holding: RootHolding, basket: RootBasket): number | null {
  const nav = numeric(basket.nav_tao), value = numeric(holding.realizable_tao);
  return nav !== null && nav > 0 && value !== null ? value / nav : null;
}
