export type YieldWindow = {
  status: "consistent" | "review" | "unavailable"; reason?: string;
  chainApy?: number; providerApy?: number; observedReturn?: number;
  difference?: number; tolerance?: number; startBlock?: number; endBlock?: number;
  start?: string; end?: string;
};
export type YieldCheck = { hotkey: string; providerBlock: number; providerTimestamp: string; seven: YieldWindow; thirty: YieldWindow };
export type YieldChecks = { netuid: number; state: string; error?: string; result?: { checkedAt: string; rows: YieldCheck[] } };
export function currentYieldCheck(check: YieldCheck | undefined, block: number | undefined, timestamp: string, now: number) {
  const time = Date.parse(timestamp);
  return check && check.providerBlock === block && Date.parse(check.providerTimestamp) === time && Number.isFinite(time) && now - time <= 7200000 && time <= now + 60000 ? check : undefined;
}
