"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { displayNumber, numeric, rao, shortAddress } from "../../lib/validator-types";
import { holdingShare, type NamedRootBasket } from "../../lib/root-baskets";
import { ValidatorColumn, ValidatorTableHelp } from "../validator-table-help";
import styles from "../validators.module.css";

type Result = { data: NamedRootBasket[]; hiddenChildren: number; collectedAt: string };
const percent = (value: unknown) => numeric(value) === null ? "—" : `${displayNumber(Number(value) * 100)}%`;
const sorts = [["nav_tao", "Basket value"], ["root_stake", "Root stake"], ["staker_return_7d", "7d staker return"], ["staker_return_30d", "30d staker return"]];

export function RootExplorer({ subnets }: { subnets: { netuid: number; name: string }[] }) {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nav_tao");
  const [open, setOpen] = useState<string | null>(null);
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
  const rows = useMemo(() => (result?.data || []).filter(row => `${row.name || ""} ${row.hotkey}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => {
    const left = numeric(a[sort as keyof NamedRootBasket]), right = numeric(b[sort as keyof NamedRootBasket]);
    return (right ?? -Infinity) - (left ?? -Infinity) || a.hotkey.localeCompare(b.hotkey);
  }), [result, search, sort]);
  const color = (value: unknown) => numeric(value) === null ? "" : Number(value) > 0 ? styles.gain : Number(value) < 0 ? styles.loss : "";
  return <section aria-label="Root validator baskets"><div className={styles.controls}><label>Search root validators<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Validator name or hotkey" /></label><label>Sort root baskets<select value={sort} onChange={event => setSort(event.target.value)}>{sorts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <p className={styles.source}>These are root reward baskets, not personal wallets. A retained basket does not prove a current root validator seat. Returns below cover the stated period and are not annualized APY. Values are in TAO; each row keeps its source time. Shared hourly source cache; opening holdings does not make another request.</p>
    {error && <p className={styles.notice} role="alert">{error} <button onClick={() => { setError(""); setAttempt(value => value + 1); }}>Retry root data</button></p>}
    {!result && !error && <p className={styles.notice} role="status">Loading root basket snapshot…</p>}
    {result && <><p className={styles.source}>{rows.length} of {result.data.length} baskets shown · {result.hiddenChildren} child-only hotkeys excluded. Missing figures stay unavailable.</p><ValidatorTableHelp><div className={styles.tableWrap} role="region" aria-label="Root basket comparison" tabIndex={0}><table className={`${styles.table} ${styles.rootTable}`}><thead><tr>{["Validator", "Holdings", "Take", "Root stake τ", "Basket value τ", "7d staker return", "30d staker return", "7d capital return", "Snapshot UTC"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{rows.map(row => <Fragment key={row.hotkey}><tr><td><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name || shortAddress(row.hotkey)}</Link><small>{shortAddress(row.hotkey)}</small></td><td><button aria-expanded={open === row.hotkey} aria-controls={`holdings-${row.hotkey}`} onClick={() => setOpen(open === row.hotkey ? null : row.hotkey)}>{open === row.hotkey ? "Hide" : "View"} {row.holdings.length} holdings</button></td><td>{percent(row.take)}</td><td>{displayNumber(rao(row.root_stake))}</td><td>{displayNumber(rao(row.nav_tao))}</td><td className={color(row.staker_return_7d)}>{percent(row.staker_return_7d)}</td><td className={color(row.staker_return_30d)}>{percent(row.staker_return_30d)}</td><td className={color(row.return_7d)}>{percent(row.return_7d)}</td><td>{new Date(row.timestamp).toLocaleString("en-US", { timeZone: "UTC" })}<small>Block {displayNumber(row.block_number, 0)}</small></td></tr>
      {open === row.hotkey && <tr><td colSpan={9} className={styles.rootDetail}><div id={`holdings-${row.hotkey}`}><h3>{row.name || shortAddress(row.hotkey)} · root basket holdings</h3><p>Realizable value τ {displayNumber(rao(row.nav_tao))} · spot value τ {displayNumber(rao(row.spot_nav_tao))}. Allocations use realizable value. These are the fund’s holdings, not an individual staker’s entitlement.</p><p>Lifetime deposits τ {displayNumber(rao(row.deposited_tao))} · lifetime redeemed τ {displayNumber(rao(row.redeemed_tao))} · lifetime multiple {numeric(row.performance) === null ? "—" : `${displayNumber(row.performance, 4)}×`}. This multiple includes flows and is not an annualized personal return.</p>
        {row.holdings.length ? <table className={styles.table}><thead><tr>{["Subnet", "Alpha held", "Realizable value τ", "Spot value τ", "Basket allocation"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{[...row.holdings].sort((a, b) => Number(b.realizable_tao) - Number(a.realizable_tao)).map(holding => <tr key={holding.netuid}><td>{holding.netuid === 0 ? "SN0 TAO cash" : `SN${holding.netuid} ${names.get(holding.netuid) || "Subnet"}`}</td><td>{displayNumber(rao(holding.alpha), 4)} {holding.netuid === 0 ? "τ" : "α"}</td><td>{displayNumber(rao(holding.realizable_tao), 4)}</td><td>{displayNumber(rao(holding.spot_tao), 4)}</td><td>{percent(holdingShare(holding, row))}</td></tr>)}</tbody></table> : <p>No holdings reported in this snapshot.</p>}
      </div></td></tr>}
    </Fragment>)}</tbody></table></div></ValidatorTableHelp>{!rows.length && <p className={styles.notice}>No root baskets match this search.</p>}</>}
  </section>;
}
