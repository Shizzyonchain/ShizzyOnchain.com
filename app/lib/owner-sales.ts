import type { WalletActivity } from "./wallet-activity";
export type SalesTotal = { alpha: string; tao: string; trades: number };
export type OwnerSales = { netuid: number; address: string; asOf: string; ownerCheckedAt: string; complete: boolean; day: SalesTotal; week: SalesTotal };
export function sumOwnerSales(rows: WalletActivity[], netuid: number, asOf: number) {
  const totals = [ { alpha: BigInt(0), tao: BigInt(0), trades: 0 }, { alpha: BigInt(0), tao: BigInt(0), trades: 0 } ];
  const seen = new Set<string>();
  for (const row of rows) {
    const trade = row.swap, time = Date.parse(row.timestamp);
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    if (!trade || trade.feeConversion || trade.fromToken !== `SN${netuid}` || trade.toToken !== "TAO" || BigInt(trade.taoValue) < BigInt(5_000_000_000) || time > asOf) continue;
    for (const [index, duration] of [86_400_000, 604_800_000].entries()) if (time >= asOf - duration) {
      totals[index].alpha += BigInt(trade.fromAmount); totals[index].tao += BigInt(trade.toAmount); totals[index].trades++;
    }
  }
  const encode = (value: typeof totals[number]): SalesTotal => ({ alpha: value.alpha.toString(), tao: value.tao.toString(), trades: value.trades });
  return { day: encode(totals[0]), week: encode(totals[1]) };
}
export function formatSalesAmount(raw: string) {
  const value = BigInt(raw), whole = value / BigInt(1_000_000_000);
  const fraction = (value % BigInt(1_000_000_000)).toString().padStart(9, "0").replace(/0+$/, "");
  return whole.toLocaleString("en-US") + (fraction ? `.${fraction}` : "");
}
