"use client";

import Link from "next/link";
import { ProfileContext } from "./profile-context";
import { useEffect, useState } from "react";
import { displayNumber, numeric, rao, shortAddress, type Validator, type ValidatorYield, type ValidatorResult } from "../lib/validator-types";
import type { ScreenerRow } from "../dashboard";
import styles from "./validators.module.css";

import { ValidatorColumn, ValidatorTableHelp } from "./validator-table-help";

type Tab = "Overview" | "Subnets & yield" | "Operating status" | "Fee history" | "Operator info" | "Stake history";
function percent(value: unknown) { const n = numeric(value); return n === null ? "—" : `${displayNumber(n * 100)}%`; }
function timestamp(value: string) { const time = new Date(value); return Number.isFinite(time.getTime()) ? `${time.toLocaleString("en-US", { timeZone: "UTC" })} UTC` : "Unavailable"; }

export function ValidatorProfile({ hotkey }: { hotkey: string }) {
  const [validator, setValidator] = useState<Validator | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Overview");
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/validators?hotkey=${hotkey}`, { signal: controller.signal }).then(async response => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      if (!payload.data.length) throw new Error("No validator snapshot was found for this hotkey.");
      setValidator(payload.data[0]); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message || "Validator unavailable."); });
    return () => controller.abort();
  }, [hotkey, attempt]);
  return <><header className={styles.hero}><p className={styles.eyebrow}>VALIDATOR PROFILE</p><h1>{validator?.name || shortAddress(hotkey)}</h1><p className={styles.address}>Hotkey: {hotkey}<br />{validator && <>Owner: {validator.coldkey}</>}</p><p className={styles.source}>{validator ? `TaoStats snapshot · block ${validator.block_number.toLocaleString()} · ${timestamp(validator.timestamp)}` : "Retrieving validator snapshot…"}</p></header>
    {error && <div className={styles.notice} role="alert">{error} <button onClick={() => setAttempt(value => value + 1)}>Retry</button></div>}
    {validator && <>{(!Number.isFinite(Date.parse(validator.timestamp)) || now - Date.parse(validator.timestamp) > 7200000 || Date.parse(validator.timestamp) > now + 60000) && <p className={styles.notice} role="status">This directory snapshot is stale or invalid. Figures are historical; check the dated Operating status evidence before using them.</p>}<dl className={styles.facts}>{[
      ["Overall rank", `#${validator.rank}`], ["Validator take", percent(validator.take)], ["Active subnets", displayNumber(validator.active_subnets, 0)],
      ["Root stake", `${displayNumber(rao(validator.root_stake))} τ`], ["Alpha stake value", `${displayNumber(rao(validator.global_alpha_stake_as_tao))} τ`], ["Weighted stake", `${displayNumber(rao(validator.global_weighted_stake))} τ`],
      ["Nominators", displayNumber(validator.global_nominators, 0)], ["Dominance", `${displayNumber(validator.dominance)}%`], ["24h weighted stake change", `${displayNumber(rao(validator.global_weighted_stake_24_hr_change))} τ`],
    ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className={styles.tabs} role="group" aria-label="Validator detail section">{(["Overview", "Subnets & yield", "Operating status", "Fee history", "Operator info", "Stake history"] as Tab[]).map(value => <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>{value}</button>)}</div>
    {tab === "Overview" && <section className={styles.detail}><h2>Validator at a glance</h2><dl className={styles.facts}>{[
      ["Root rank", `#${validator.root_rank}`], ["Alpha rank", `#${validator.alpha_rank}`], ["First registered (UTC)", validator.created_on_date || "Unavailable"],
      ["Nominator rewards / day", `${displayNumber(rao(validator.nominator_return_per_day), 4)} τ`], ["Validator rewards / day", `${displayNumber(rao(validator.validator_return_per_day), 4)} τ`],
      ["24h nominator change", displayNumber(validator.global_nominators_24_hr_change, 0)], ["24h dominance change", `${displayNumber(validator.dominance_24_hr_change, 4)} percentage points`],
    ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><nav className={styles.viewNav} aria-label="Root tools for this validator"><Link href={`/validators/root?hotkey=${hotkey}`} prefetch={false}>Root holdings & comparison →</Link></nav><h3>How to read these figures</h3><p>Root stake is TAO delegated on root. Alpha stake value converts subnet tokens into TAO. Weighted stake applies protocol weighting and should not be treated as withdrawable TAO. Daily rewards are totals for the validator or its nominators, not a return estimate for your wallet.</p><p>Take is the validator’s fee. A low fee alone does not establish better performance. Compare yield on the same subnet and window; historical APY is not a promised return.</p><a className={styles.back} href={`https://taostats.io/validators/${hotkey}`} target="_blank" rel="noreferrer">View source explorer ↗</a></section>}
    {tab === "Subnets & yield" && <YieldTable hotkey={hotkey} />}
    {tab === "Operating status" && <ProfileContext hotkey={hotkey} kind="operation" />}{tab === "Operator info" && <ProfileContext hotkey={hotkey} kind="operator" />}{tab === "Fee history" && <HistoryTable hotkey={hotkey} feesOnly />}{tab === "Stake history" && <HistoryTable hotkey={hotkey} />}</>}
  </>;
}

function YieldTable({ hotkey }: { hotkey: string }) {
  const [result, setResult] = useState<ValidatorResult<ValidatorYield> | null>(null);
  const [markets, setMarkets] = useState<ScreenerRow[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/validators?kind=yield&hotkey=${hotkey}&page=${page}`, { signal: controller.signal }).then(async response => {
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setResult(payload); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); });
    // Node-backed context is independent: it never holds up the yield response.
    fetch("/api/backend/v1/screener", { signal: controller.signal }).then(response => response.ok ? response.json() : null).then(payload => { if (payload?.data) setMarkets(payload.data); }).catch(() => {});
    return () => controller.abort();
  }, [hotkey, page]);
  return <section><h2>Subnet-level yield</h2><p className={styles.source}>Historical annualized nominator APY after reward fees · take is already reflected, not deducted again. A current fee change may take time to appear in these averages. each row identifies its own subnet and snapshot. Epoch participation is not uptime. Stake is native TAO on root and alpha on other subnets.</p>{error && <p role="alert" className={styles.notice}>{error}</p>}{!result && !error && <p role="status">Loading subnet yields…</p>}{result && <><ValidatorTableHelp><div className={styles.tableWrap} role="region" tabIndex={0} aria-label="Subnet yields"><table className={styles.table}><thead><tr>{["Subnet", "Stake", "1h net APY", "1d net APY", "7d net APY", "30d net APY", "7d participation", "Emission share", "Snapshot UTC"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{result.data.map(row => {
    const market = markets.find(item => item.netuid === row.netuid);

    return <tr key={`${row.hotkey}-${row.netuid}`}><td>SN{row.netuid}{row.netuid === 0 ? " Root" : market?.name ? ` ${market.name}` : ""}</td><td>{displayNumber(rao(row.stake))} {row.netuid === 0 ? "τ" : "α"}</td><td>{percent(row.one_hour_apy)}</td><td>{percent(row.one_day_apy)}</td><td>{percent(row.seven_day_apy)}</td><td>{percent(row.thirty_day_apy)}</td><td>{percent(row.seven_day_epoch_participation)}</td><td>{numeric(market?.emission_pct) !== null ? `${displayNumber(market?.emission_pct, 4)}%` : "—"}<small>Our Finney feed{market?.time ? ` · ${timestamp(market.time)}` : " · unavailable"}</small></td><td>{timestamp(row.timestamp)}</td></tr>;
  })}</tbody></table></div></ValidatorTableHelp>{!result.data.length && <p className={styles.notice}>No subnet yield measurements are available for this hotkey.</p>}<div className={styles.pagination}><button disabled={!result.pagination.prev_page} onClick={() => { setResult(null); setPage(page - 1); }}>← Previous</button><span>Page {result.pagination.current_page} of {result.pagination.total_pages}</span><button disabled={!result.pagination.next_page} onClick={() => { setResult(null); setPage(page + 1); }}>Next →</button></div></>}</section>;
}

function HistoryTable({ hotkey, feesOnly = false }: { hotkey: string; feesOnly?: boolean }) {
  const [result, setResult] = useState<ValidatorResult<Validator> | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/validators?kind=history&hotkey=${hotkey}&page=${page}`, { signal: controller.signal }).then(async response => {
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setResult(payload); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [hotkey, page]);
  return <section><h2>{feesOnly ? "Observed fee history" : "Historical stake snapshots"}</h2>{feesOnly && <p>Compare adjacent snapshots to see when take changed. These are observation intervals, not exact transaction times. No change in this page does not prove the fee never changed between snapshots or outside this range. Historical net APY already includes fees; do not subtract current take again.</p>}{feesOnly && result && <p className={styles.source}>Reviewed {result.data.length} snapshots on page {result.pagination.current_page}. Changes are listed below when adjacent snapshots differ; use Next to review older observations.</p>}{feesOnly && result && <ul>{result.data.slice(0, -1).flatMap((newer, index) => { const older = result.data[index + 1]; const before = numeric(older.take), after = numeric(newer.take); return before !== null && after !== null && before !== after ? [<li key={newer.block_number}>{percent(before)} → {percent(after)} · observed between {timestamp(older.timestamp)} and {timestamp(newer.timestamp)}</li>] : []; })}</ul>}<p className={styles.source}>TaoStats historical snapshots, newest first. Changes in TAO-valued alpha can reflect price movements as well as delegation activity.</p>{error && <p role="alert" className={styles.notice}>{error}</p>}{!result && !error && <p role="status">Loading stake history…</p>}{result && <>{feesOnly ? <ValidatorTableHelp><div className={styles.tableWrap} role="region" tabIndex={0} aria-label="Observed validator fees"><table className={styles.table}><thead><tr>{["Snapshot UTC", "Block", "Take"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{result.data.map(row => <tr key={`${row.block_number}-${row.hotkey}`}><td>{timestamp(row.timestamp)}</td><td>{displayNumber(row.block_number, 0)}</td><td>{percent(row.take)}</td></tr>)}</tbody></table></div></ValidatorTableHelp> : <ValidatorTableHelp><div className={styles.tableWrap} role="region" tabIndex={0} aria-label="Validator stake history"><table className={styles.table}><thead><tr>{["Snapshot UTC", "Block", "Root τ", "Alpha value τ", "Weighted τ", "Dominance", "Take", "Nominators", "Subnets"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{result.data.map(row => <tr key={`${row.block_number}-${row.hotkey}`}><td>{timestamp(row.timestamp)}</td><td>{displayNumber(row.block_number, 0)}</td><td>{displayNumber(rao(row.root_stake))}</td><td>{displayNumber(rao(row.global_alpha_stake_as_tao))}</td><td>{displayNumber(rao(row.global_weighted_stake))}</td><td>{displayNumber(row.dominance)}%</td><td>{percent(row.take)}</td><td>{displayNumber(row.global_nominators, 0)}</td><td>{displayNumber(row.active_subnets, 0)}</td></tr>)}</tbody></table></div></ValidatorTableHelp>}{!result.data.length && <p className={styles.notice}>Historical snapshots are not available for this hotkey.</p>}<div className={styles.pagination}><button disabled={!result.pagination.prev_page} onClick={() => { setResult(null); setPage(page - 1); }}>← Previous</button><span>Page {result.pagination.current_page} of {result.pagination.total_pages}</span><button disabled={!result.pagination.next_page} onClick={() => { setResult(null); setPage(page + 1); }}>Next →</button></div></>}</section>;
}

