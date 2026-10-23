"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatSalesAmount, type OwnerSales } from "./lib/owner-sales";
import styles from "./subnet-owner.module.css";
export function OwnerSalesSummary({ netuid }: { netuid: number }) {
  const [result, setResult] = useState<OwnerSales | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => fetch(`/api/subnets/owner-sales?netuid=${netuid}&v=2`, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Unavailable");
      const data = await response.json() as OwnerSales;
      if (data.netuid !== netuid || !data.day?.bought || !data.week?.bought || !Number.isFinite(Date.parse(data.asOf))) throw new Error("Invalid summary");
      if (!controller.signal.aborted) { setResult(data); setError(false); }
    }).catch(() => { if (!controller.signal.aborted) setError(true); });
    refresh(); const timer = setInterval(refresh, 300_000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [netuid, attempt]);
  return <section className={styles.sales} aria-label="Owner wallet alpha activity">
    <h3>Owner wallet buys & sells</h3><small>Trades worth at least 5 TAO each · automatic fee conversions excluded</small>
    {result && !error ? <>
      <div className={styles.salesGrid}>{([ ["Last 24 hours", result.day], ["Last 7 days", result.week] ] as const).map(([label, total]) => <div key={label}><span>{label}</span>
        <small>Bought{!result.complete ? " (at least)" : ""}</small><strong>{formatSalesAmount(total.bought.alpha)} α</strong><small>{formatSalesAmount(total.bought.tao)} TAO spent · {total.bought.trades} buys</small>
        <small>Sold{!result.complete ? " (at least)" : ""}</small><strong>{formatSalesAmount(total.alpha)} α</strong><small>{formatSalesAmount(total.tao)} TAO received · {total.trades} sales</small>
        <div className={styles.net}>{result.complete ? <><b>{BigInt(total.netAlpha) > BigInt(0) ? "Net buying" : BigInt(total.netAlpha) < BigInt(0) ? "Net selling" : "Balanced"}</b><strong>{BigInt(total.netAlpha) > BigInt(0) ? "+" : ""}{formatSalesAmount(total.netAlpha)} α</strong></> : <b>Net unavailable · partial data</b>}</div>
      </div>)}</div>
      <small>Through {new Date(result.asOf).toLocaleString("en-US", { timeZone: "UTC" })} UTC · <Link href={`/wallet-tracker?address=${result.address}`} prefetch={false}>View wallet activity →</Link></small>
      {!result.complete && <p>High activity: these are partial totals from the newest 2,000 indexed records per direction.</p>}
    </> : <p role="status">{error ? <>Owner activity temporarily unavailable. <button type="button" onClick={() => setAttempt(value => value + 1)}>Retry</button></> : "Loading owner activity…"}</p>}
    <details><summary>What counts?</summary><p>SN{netuid} alpha bought with or sold for TAO by the currently verified owner coldkey, counting trades worth at least 5 TAO each. Net alpha is bought minus sold, not a holdings change or profit figure. Automatic alpha fee conversions and transfers are excluded. Cross-subnet swaps may include an alpha-to-TAO leg; TAO received does not mean it was withdrawn. Indexed data can lag. Other team wallets, former owners and exchange activity are not covered.</p></details>
  </section>;
}
