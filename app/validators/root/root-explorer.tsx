"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { displayNumber, numeric, rao, shortAddress } from "../../lib/validator-types";
import { basketContext, holdingShare, type NamedRootBasket } from "../../lib/root-baskets";
import { ValidatorColumn, ValidatorTableHelp } from "../validator-table-help";
import { ValidatorTableScroll } from "../validator-table-scroll";
import styles from "../validators.module.css";
import { RootComparison } from "./root-comparison";
import { RootRecommendations } from "./root-recommendations";

type Result = { data: NamedRootBasket[]; hiddenChildren: number; collectedAt: string };
const percent = (value: unknown) => numeric(value) === null ? "—" : `${displayNumber(Number(value) * 100)}%`;
const sorts = [["nav_tao", "Basket value"], ["root_stake", "Root stake"], ["staker_return_7d", "7d staker return"], ["staker_return_30d", "30d staker return"]];

export function RootExplorer({ subnets, initialHotkey = "" }: { initialHotkey?: string; subnets: { netuid: number; name: string }[] }) {
  const [comparison, setComparison] = useState<{ keys: string[]; id: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nav_tao");
  const [open, setOpen] = useState<string | null>(initialHotkey || null);
  const [includeSmall, setIncludeSmall] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/validators/root", { signal: controller.signal }).then(async response => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Root basket data unavailable.");
      setResult(payload); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [attempt]);
  const names = useMemo(() => new Map(subnets.map(row => [row.netuid, row.name])), [subnets]);
  const rows = useMemo(() => (result?.data || []).filter(row => includeSmall || Number(row.nav_tao) >= 10_000_000).filter(row => `${row.name || ""} ${row.hotkey}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => {
    const left = numeric(a[sort as keyof NamedRootBasket]), right = numeric(b[sort as keyof NamedRootBasket]);
    return (right ?? -Infinity) - (left ?? -Infinity) || a.hotkey.localeCompare(b.hotkey);
  }), [result, search, sort, includeSmall]);
  const color = (value: unknown) => numeric(value) === null ? "" : Number(value) > 0 ? styles.gain : Number(value) < 0 ? styles.loss : "";
  const selected = result?.data.find(row => row.hotkey === open);
  const oldest = result?.data.reduce((time, row) => Math.min(time, Date.parse(row.timestamp)), Infinity);
  const stale = oldest !== undefined && Number.isFinite(oldest) && now - oldest > 2 * 3600_000;
  return <section aria-label="Root validator baskets"><div className={styles.controls}><label>Search root validators<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Validator name or hotkey" /></label><label>Sort root baskets<select value={sort} onChange={event => setSort(event.target.value)}>{sorts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <RootRecommendations compareReady={!!result} onCompare={keys => setComparison({ keys, id: Date.now() })} />
    {result && <RootComparison key={comparison?.id || "manual"} baskets={result.data} subnets={subnets} initialHotkey={initialHotkey} comparison={comparison} />}
    <label className={styles.filterToggle}><input type="checkbox" checked={includeSmall} onChange={event => setIncludeSmall(event.target.checked)} /> Include baskets below 0.01 TAO (including empty funds)</label>
    <p className={styles.source}>These are root reward baskets, not personal wallets. A retained basket does not prove a current root validator seat. Returns below cover the stated period and are not annualized APY. Values are in TAO; each row keeps its source time. Shared hourly source cache; opening holdings does not make another request.</p>
    {error && <p className={styles.notice} role="alert">{error} <button onClick={() => { setError(""); setAttempt(value => value + 1); }}>Retry root data</button></p>}
    {!result && !error && <p className={styles.notice} role="status">Loading root basket snapshot…</p>}
    {stale && <p className={styles.notice} role="status">Basket source is over two hours old. These are historical snapshots; check the source before comparing current allocations.</p>}
    {initialHotkey && result && !result.data.some(row => row.hotkey === initialHotkey) && <p className={styles.notice}>No root reward basket is available for the selected validator. Choose another validator below.</p>}
    {selected && <RootHoldings key={selected.hotkey} row={selected} names={names} onClose={() => setOpen(null)} />}
    {result && <><p className={styles.source}>{rows.length} of {result.data.length} baskets shown{!includeSmall ? " · balances below 0.01 TAO hidden" : ""} · {result.hiddenChildren} child-only hotkeys excluded. Missing figures stay unavailable. Oldest basket source: {oldest !== undefined && Number.isFinite(oldest) ? `${new Date(oldest).toLocaleString("en-US", { timeZone: "UTC" })} UTC` : "unavailable"}.</p><ValidatorTableHelp><ValidatorTableScroll className={styles.tableWrap} label="Root basket comparison"><table className={`${styles.table} ${styles.rootTable} ${styles.pinFirst}`}><thead><tr>{["Validator", "Holdings", "Take", "Root stake τ", "Basket value τ", "7d staker return", "30d staker return", "7d capital return", "Snapshot UTC"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{rows.map(row => <tr key={row.hotkey}><td><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name || shortAddress(row.hotkey)}</Link><small>{shortAddress(row.hotkey)}</small></td><td><button aria-expanded={open === row.hotkey} aria-controls={open === row.hotkey ? `holdings-${row.hotkey}` : undefined} onClick={() => setOpen(open === row.hotkey ? null : row.hotkey)}>{open === row.hotkey ? "Hide" : "View"} {row.holdings.length} holdings</button></td><td>{percent(row.take)}</td><td>{displayNumber(rao(row.root_stake))}</td><td>{displayNumber(rao(row.nav_tao))}</td><td className={color(row.staker_return_7d)}>{percent(row.staker_return_7d)}</td><td className={color(row.staker_return_30d)}>{percent(row.staker_return_30d)}</td><td className={color(row.return_7d)}>{percent(row.return_7d)}</td><td>{new Date(row.timestamp).toLocaleString("en-US", { timeZone: "UTC" })}<small>Block {displayNumber(row.block_number, 0)}</small></td></tr>
    )}</tbody></table></ValidatorTableScroll></ValidatorTableHelp>{!rows.length && <p className={styles.notice}>No root baskets match this search.</p>}</>}
  </section>;
}

function RootHoldings({ row, names, onClose }: { row: NamedRootBasket; names: Map<number, string>; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const context = basketContext(row);
  return <section className={styles.basketPanel} id={`holdings-${row.hotkey}`} aria-label="Selected root basket holdings"><h2 ref={heading} tabIndex={-1}>{row.name || shortAddress(row.hotkey)} · holdings</h2><p className={styles.address}>{row.hotkey}</p><button onClick={onClose}>Close holdings</button><div className={styles.stats}><div><span>Top five holdings</span><strong>{percent(context.topFiveShare)}</strong><small>Share of realizable basket value</small></div><div><span>TAO cash</span><strong>{percent(context.cashShare)}</strong><small>SN0 cash allocation</small></div><div><span>Spot-to-quote gap</span><strong>{percent(context.quoteGap)}</strong><small>Whole-fund quote vs spot mark; not your personal exit fee</small></div></div><p>Realizable value τ {displayNumber(rao(row.nav_tao))} · spot mark τ {displayNumber(rao(row.spot_nav_tao))}. Allocation percentages use realizable value. A small holding count does not guarantee diversification; look at the top-five share.</p><p>Lifetime deposits τ {displayNumber(rao(row.deposited_tao))} · redeemed τ {displayNumber(rao(row.redeemed_tao))} · lifetime multiple {numeric(row.performance) === null ? "—" : `${displayNumber(row.performance, 4)}×`}. This flow-sensitive multiple is not APY or your personal profit.</p><p className={styles.source}>Basket source: {new Date(row.timestamp).toLocaleString("en-US", { timeZone: "UTC" })} UTC · block {displayNumber(row.block_number, 0)}. Fee and root-stake source: {row.identityTimestamp ? `${new Date(row.identityTimestamp).toLocaleString("en-US", { timeZone: "UTC" })} UTC` : "unavailable"}. Display names are identities, not verified endorsements or proof of insurance.</p>
    {row.holdings.length ? <ValidatorTableHelp><ValidatorTableScroll className={`${styles.tableWrap} ${styles.holdingsScroll}`} label="Selected basket subnet holdings"><table className={`${styles.table} ${styles.holdingsTable}`}><thead><tr>{["Subnet", "Alpha held", "Realizable value τ", "Spot value τ", "Basket allocation"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{[...row.holdings].sort((a, b) => Number(b.realizable_tao) - Number(a.realizable_tao)).map(holding => <tr key={holding.netuid}><td>{holding.netuid === 0 ? "SN0 TAO cash" : `SN${holding.netuid} ${names.get(holding.netuid) || "Subnet"}`}</td><td>{displayNumber(rao(holding.alpha), 4)} {holding.netuid === 0 ? "τ" : "α"}</td><td>{displayNumber(rao(holding.realizable_tao), 4)}</td><td>{displayNumber(rao(holding.spot_tao), 4)}</td><td>{percent(holdingShare(holding, row))}</td></tr>)}</tbody></table></ValidatorTableScroll></ValidatorTableHelp> : <p>No holdings reported.</p>}
    <p><a className={styles.back} href={`https://taostats.io/validators/${row.hotkey}`} target="_blank" rel="noreferrer">Inspect source validator ↗</a></p>
  </section>;
}
