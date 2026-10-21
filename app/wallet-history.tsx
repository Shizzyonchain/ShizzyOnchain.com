"use client";
import { useEffect, useRef, useState } from "react";
import type { WalletActivity } from "./lib/wallet-activity";
import styles from "./wallet-history.module.css";
type History = { rows: WalletActivity[]; nextPage: number | null; fetchedAt: string; source: string };
const memory = new Map<string, { time: number; data: History }>();
export function clearWalletHistoryCache(address?: string) {
  if (!address) memory.clear();
  else for (const key of memory.keys()) if (key.startsWith(`${address}:`)) memory.delete(key);
}
const short = (address: string) => `${address.slice(0, 8)}…${address.slice(-7)}`;
function tao(raw: string) {
  const value = BigInt(raw), fraction = (value % BigInt(1_000_000_000)).toString().padStart(9, "0").replace(/0+$/, "");
  return (value / BigInt(1_000_000_000)).toLocaleString("en-US") + (fraction ? `.${fraction}` : "");
}
export function WalletHistory({ address, hideAmounts, onClose }: { address: string; hideAmounts: boolean; onClose: () => void }) {
  const [kind, setKind] = useState<"transactions" | "transfers">("transactions");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; data?: History; error?: string } | null>(null);
  const panel = useRef<HTMLElement>(null);
  const key = `${address}:${kind}:${page}:${attempt}`;
  useEffect(() => { panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [address]);
  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = `${address}:${kind}:${page}`;
    void (async () => {
      try {
        const previous = memory.get(cacheKey);
        let data: History;
        if (!attempt && previous && Date.now() - previous.time < 300_000) data = previous.data;
        else {
          const response = await fetch(`/api/wallet-activity?address=${encodeURIComponent(address)}&kind=${kind}&page=${page}`, { signal: controller.signal });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.error || "Recent activity unavailable");
          if (!Array.isArray(payload.rows)) throw new Error("Invalid activity response");
          data = payload;
          if (memory.size > 100) memory.clear();
          memory.set(cacheKey, { time: Date.now(), data });
        }
        if (!controller.signal.aborted) setResult({ key, data });
      } catch (error) { if (!controller.signal.aborted) setResult({ key, error: error instanceof Error ? error.message : "Recent activity unavailable" }); }
    })();
    return () => controller.abort();
  }, [address, kind, page, attempt, key]);
  const current = result?.key === key ? result : null;
  return <section ref={panel} className={styles.panel} aria-label="Selected wallet recent activity" id="wallet-history">
    <div className={styles.heading}><div><h2>Recent wallet activity</h2><code>{address}</code></div><button type="button" onClick={onClose} aria-label="Close wallet activity">Close ✕</button></div>
    <p>Read-only history. Use Check wallets above to load current holdings.</p>
    <div className={styles.tabs} role="group" aria-label="Wallet activity type">{(["transactions", "transfers"] as const).map(value => <button key={value} type="button" aria-pressed={kind === value} onClick={() => { setKind(value); setPage(1); setAttempt(0); }}>{value === "transactions" ? "Signed transactions" : "TAO transfers"}</button>)}</div>
    <p className={styles.note}>{kind === "transactions" ? "Transactions signed by this wallet. Proxy actions signed by another wallet may not appear. Status describes the outer extrinsic; inspect wrapped calls in the explorer." : "Incoming and outgoing TAO balance transfers. Staking and alpha trades appear under signed transactions, not as TAO transfers."}</p>
    {!current ? <p role="status">Loading recent activity…</p> : current.error ? <div role="alert"><p>{current.error}</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : <>
      {!current.data?.rows.length ? <p>No indexed {kind === "transactions" ? "signed transactions" : "TAO transfers"} found on this page.</p> : <div className={styles.rows}>{current.data.rows.map(row => <article key={row.id}><div><strong>{row.action}</strong><time dateTime={row.timestamp}>{new Date(row.timestamp).toLocaleString("en-US", { timeZone: "UTC" })} UTC</time>{row.from && row.to && <p>From {short(row.from)} → {short(row.to)}</p>}</div><div className={styles.result}>{row.amount !== null ? <strong>{hideAmounts ? "••••" : tao(row.amount)} TAO</strong> : <span className={row.success ? styles.success : styles.failed}>{row.success ? "Extrinsic succeeded" : "Extrinsic failed"}</span>}<a href={`https://taostats.io/extrinsic/${row.extrinsic}`} target="_blank" rel="noopener noreferrer">Transaction {row.extrinsic} ↗</a></div></article>)}</div>}
      <nav className={styles.pages} aria-label="Wallet activity pages"><button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)}>← Newer</button><span>Page {page}</span><button type="button" disabled={!current.data?.nextPage} onClick={() => setPage(current.data!.nextPage!)}>Older →</button></nav>
      <small>{current.data?.source} · cached for up to five minutes. This is indexed activity, not a live or complete account statement.</small>
    </>}
  </section>;
}
