"use client";
import { useEffect, useRef, useState } from "react";
import { visibleWalletActivity } from "./lib/wallet-activity-display";
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
  const panel = useRef<HTMLElement>(null);
  useEffect(() => { panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [address]);
  return <section ref={panel} className={styles.panel} aria-label="Selected wallet recent activity" id="wallet-history">
    <div className={styles.heading}><div><h2>Recent wallet activity</h2><code>{address}</code></div><button type="button" onClick={onClose} aria-label="Close wallet activity">Close ✕</button></div>
    <p>Incoming and outgoing transfers, staking, unstaking and other signed calls. Both lists load together, newest first. TAO transfers below 5 TAO and Utility.batch_all wrapper entries are hidden. Each provider page contains up to 20 records before filtering.</p>
    <p className={styles.note}>A transfer can also appear in signed transactions for the same extrinsic. Proxy calls signed by another wallet may be missing. This indexed history is not a complete account statement.</p>
    <ActivityList key={`${address}:transfers`} address={address} hideAmounts={hideAmounts} kind="transfers" />
    <ActivityList key={`${address}:transactions`} address={address} hideAmounts={hideAmounts} kind="transactions" />
  </section>;
}
function ActivityList({ address, hideAmounts, kind }: { address: string; hideAmounts: boolean; kind: "transactions" | "transfers" }) {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; data?: History; error?: string } | null>(null);
  const key = `${address}:${kind}:${page}:${attempt}`;
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
  const rows = visibleWalletActivity(current?.data?.rows || [], kind);
  const label = kind === "transactions" ? "Signed transactions" : "TAO transfers";
  return <section className={styles.activity} aria-label={label}>
    <h3>{label}</h3>
    <p className={styles.note}>{kind === "transactions" ? "Transactions signed by this wallet, excluding Utility.batch_all wrapper entries. Proxy actions signed by another wallet may not appear. Status describes the outer extrinsic; inspect wrapped calls in the explorer." : "Showing incoming and outgoing TAO transfers of 5 TAO or more. Staking and alpha trades appear under signed transactions; their amounts are not provided in that list, so the transfer minimum does not apply there."}</p>
    {!current ? <p role="status">Loading {label.toLowerCase()}…</p> : current.error ? <div role="alert"><p>{current.error}</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : <>
      {!rows.length ? <p>{kind === "transfers" ? "No transfers of 5 TAO or more on this page. Use Older to check earlier records when available." : "No visible signed transactions on this page after filtering batch wrappers. Use Older to check earlier records when available."}</p> : <div className={styles.rows}>{rows.map(row => <article key={row.id}><div><strong>{row.action}</strong><time dateTime={row.timestamp}>{new Date(row.timestamp).toLocaleString("en-US", { timeZone: "UTC" })} UTC</time>{row.from && row.to && <p>From {short(row.from)} → {short(row.to)}</p>}</div><div className={styles.result}>{row.amount !== null ? <strong>{hideAmounts ? "••••" : tao(row.amount)} TAO</strong> : <span className={row.success ? styles.success : styles.failed}>{row.success ? "Extrinsic succeeded" : "Extrinsic failed"}</span>}<a href={`https://taostats.io/extrinsic/${row.extrinsic}`} target="_blank" rel="noopener noreferrer">Transaction {row.extrinsic} ↗</a></div></article>)}</div>}
      <nav className={styles.pages} aria-label={`${label} pages`}><button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)}>← Newer</button><span>Page {page}</span><button type="button" disabled={!current.data?.nextPage} onClick={() => setPage(current.data!.nextPage!)}>Older →</button></nav>
      <small>{current.data?.source} · cached for up to five minutes. This is indexed activity, not a live or complete account statement.</small>
    </>}
  </section>;
}
