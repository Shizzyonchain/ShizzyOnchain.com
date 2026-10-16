"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { displayNumber, numeric, rao, shortAddress, type Validator, type ValidatorResult } from "../lib/validator-types";
import styles from "./validators.module.css";
import { ValidatorName } from "./validator-name";
import { ValidatorColumn, ValidatorTableHelp } from "./validator-table-help";

const orderOptions = [["rank", "Overall rank"], ["root_stake", "Root stake"], ["global_alpha_stake_as_tao", "Alpha stake (TAO)"], ["global_nominators", "Nominators"], ["active_subnets", "Subnet coverage"], ["take", "Lowest take"]];
export function ValidatorExplorer() {
  const [result, setResult] = useState<ValidatorResult<Validator> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("rank");
  const [search, setSearch] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/validators?page=${page}&order=${order}`, { signal: controller.signal }).then(async response => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Validator data unavailable.");
      setResult(payload); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, order, attempt]);
  const rows = useMemo(() => (result?.data || []).filter(row => `${row.name || ""} ${row.hotkey} ${row.coldkey}`.toLowerCase().includes(search.trim().toLowerCase())), [result, search]);
  const newest = result?.data.reduce((time, row) => row.timestamp > time ? row.timestamp : time, "");
  function changePage(value: number) { setLoading(true); setResult(null); setPage(value); }
  return <section aria-label="Validator directory"><div className={styles.controls}><label>Search this page<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, hotkey or owner" /></label><label>Sort validators<select value={order} onChange={event => { setLoading(true); setResult(null); setPage(1); setOrder(event.target.value); }}>{orderOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <div className={styles.stats}><div><span>Directory entries</span><strong>{displayNumber(result?.pagination.total_items, 0)}</strong><small>As reported by TaoStats</small></div><div><span>Entries on this page</span><strong>{displayNumber(result?.data.length, 0)}</strong><small>Search filters this page</small></div><div><span>Snapshot</span><strong className={styles.date}>{newest ? new Date(newest).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC" : "—"}</strong><small>Cached hourly · not a live feed</small></div></div>
    {error && <div role="alert" className={styles.notice}>{error} <button onClick={() => { setLoading(true); setAttempt(value => value + 1); }}>Retry</button></div>}
    {loading && <p role="status" className={styles.notice}>Loading validator snapshot…</p>}
    {!loading && result && <><ValidatorTableHelp><div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Scroll validator comparison table"><table className={styles.table}><thead><tr>{["Rank", "Validator", "Take", "Root stake τ", "Alpha value τ", "Weighted stake τ", "24h weighted Δ τ", "Dominance", "Nominators", "Subnets"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{rows.map(row => <tr key={row.hotkey}><td>{row.rank}</td><td><Link href={`/validators/${row.hotkey}`} prefetch={false}><ValidatorName hotkey={row.hotkey} name={row.name} /></Link><small>{shortAddress(row.hotkey)}</small></td><td>{displayNumber(numeric(row.take) === null ? null : Number(row.take) * 100)}%</td><td>{displayNumber(rao(row.root_stake))}</td><td>{displayNumber(rao(row.global_alpha_stake_as_tao))}</td><td>{displayNumber(rao(row.global_weighted_stake))}</td><td className={numeric(row.global_weighted_stake_24_hr_change) === null ? "" : Number(row.global_weighted_stake_24_hr_change) > 0 ? styles.gain : Number(row.global_weighted_stake_24_hr_change) < 0 ? styles.loss : ""}>{displayNumber(rao(row.global_weighted_stake_24_hr_change))}</td><td>{displayNumber(row.dominance)}%</td><td>{displayNumber(row.global_nominators, 0)}</td><td>{displayNumber(row.active_subnets, 0)}</td></tr>)}</tbody></table></div></ValidatorTableHelp>{!rows.length && <p className={styles.notice}>No matches on this page. Try another page or paste a full hotkey below.</p>}<div className={styles.pagination}><button disabled={!result.pagination.prev_page} onClick={() => changePage(result.pagination.prev_page!)}>← Previous</button><span>Page {result.pagination.current_page} of {result.pagination.total_pages}</span><button disabled={!result.pagination.next_page} onClick={() => changePage(result.pagination.next_page!)}>Next →</button></div></>}
    <HotkeyLookup />
  </section>;
}
function HotkeyLookup() {
  const [address, setAddress] = useState("");
  const valid = /^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(address.trim());
  return <div className={styles.lookup}><label>Open any validator by hotkey<input value={address} onChange={event => setAddress(event.target.value)} placeholder="Paste the full SS58 hotkey" /></label>{valid ? <Link href={`/validators/${address.trim()}`} prefetch={false}>Open validator →</Link> : <span>Enter a full hotkey to open its profile.</span>}</div>;
}
