import "server-only";
import { unstable_cache } from "next/cache";
import { getChildHotkeys, getStandaloneValidators } from "./standalone-validators";
import { joinRootBaskets, type RootBasket } from "./root-baskets";
export const getRootSnapshot = unstable_cache(async () => {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Root basket data is not configured.");
  const [directory, children, baskets] = await Promise.all([getStandaloneValidators(), getChildHotkeys(), (async () => {
    const rows: RootBasket[] = [];
    for (let page = 1; page <= 12; page++) {
      const url = new URL("/v1/validators/baskets", "https://api.taostats.io");
      Object.entries({ page: String(page), limit: "200", order_by: "nav_tao", order_dir: "desc" }).forEach(([name, value]) => url.searchParams.set(name, value));
      const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 900 }, signal: AbortSignal.timeout(8_000) });
      if (!response.ok) throw new Error(response.status === 429 ? "Root basket provider is rate limited. Try again later." : "Root basket source is temporarily unavailable.");
      const payload = await response.json();
      if (!Array.isArray(payload.data) || payload.pagination?.current_page !== page) throw new Error("Incomplete root basket response.");
      rows.push(...payload.data);
      if (payload.pagination.next_page === null) return rows;
      if (payload.pagination.next_page !== page + 1) throw new Error("Incomplete root basket pagination.");
    }
    throw new Error("Root basket coverage exceeds the bounded scan.");
  })()]);
  const data = joinRootBaskets(baskets, directory.rows, children.hotkeys);
  return { data, hiddenChildren: baskets.length - data.length, source: "TaoStats root baskets + finalized Finney child exclusion", collectedAt: new Date().toISOString(), childCheck: directory.childCheck };
}, ["root-basket-audited-v3"], { revalidate: 900 });
