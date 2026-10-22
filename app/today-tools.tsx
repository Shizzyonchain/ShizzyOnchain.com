"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./today-tools.module.css";
type Row = { netuid: number; name?: string; change_24h?: string };
const key = "shizzy:watchlist:v1";
export function TodayTools({ rows, fresh }: { rows: Row[]; fresh: boolean }) {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState("");
  useEffect(() => {
    let saved: number[] = [];
    try { const value: unknown = JSON.parse(localStorage.getItem(key) || "[]"); if (Array.isArray(value)) saved = [...new Set(value.filter((id): id is number => Number.isInteger(id) && id > 0 && id <= 128))].slice(0, 128); } catch {}
    queueMicrotask(() => { setIds(saved); setReady(true); });
  }, []);
  const update = (next: number[]) => { setIds(next); try { if (next.length) localStorage.setItem(key, JSON.stringify(next)); else localStorage.removeItem(key); } catch {} };
  return <section className={styles.panel} aria-label="Today on Shizzy">
    <h2>Today on Shizzy</h2>
    <nav aria-label="Quick tasks"><Link href="/subnet-news" prefetch={false}>Read today’s news →</Link><Link href="/sectors" prefetch={false}>Explore sectors →</Link><Link href="/validators" prefetch={false}>Compare validators →</Link></nav>
    <details><summary>My subnet watchlist {ready && `(${ids.length})`}</summary>
      <p>Saved only on this device. Tracks subnet numbers; registrations and project names can change. Returns below are the feed’s rolling 24 hours, not your investment return.</p>
      <div className={styles.controls}><label htmlFor="watchlist-subnet">Add subnet</label><select id="watchlist-subnet" value={choice} onChange={e => setChoice(e.target.value)}><option value="">Choose a subnet</option>{rows.filter(row => row.netuid > 0 && !ids.includes(row.netuid)).map(row => <option key={row.netuid} value={row.netuid}>SN{row.netuid} · {row.name || "Unknown"}</option>)}</select><button disabled={!choice || !ready} onClick={() => { update([...ids, Number(choice)]); setChoice(""); }}>Add</button>{ids.length > 0 && <button onClick={() => update([])}>Clear watchlist</button>}</div>
      {!ids.length && <p>No saved subnets yet.</p>}
      <ul>{ids.map(id => { const row = rows.find(row => row.netuid === id); const change = row?.change_24h == null ? NaN : Number(row.change_24h); return <li key={id}><Link href={`/charts/${id}`} prefetch={false}>SN{id} · {row?.name || "Unknown"}</Link><span>{fresh && Number.isFinite(change) ? `${change > 0 ? "+" : ""}${change.toFixed(2)}% · 24H` : "Current change unavailable"}</span><button aria-label={`Remove SN${id}`} onClick={() => update(ids.filter(value => value !== id))}>Remove</button></li>; })}</ul>
    </details>
  </section>;
}
