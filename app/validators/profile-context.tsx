"use client";
import { useEffect, useState } from "react";
import { displayNumber } from "../lib/validator-types";
import { ValidatorColumn, ValidatorTableHelp } from "./validator-table-help";
import styles from "./validators.module.css";

type Operation = { hotkey: string; netuid: number; active: boolean; validator_permit: boolean; updated: number; block_number: number; timestamp: string };
type Identity = { address: string; name: string | null; description: string | null; url: string | null; github_repo: string | null; discord: string | null };
function safeUrl(value: string | null) { try { const url = new URL(value || ""); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; } }

export function ProfileContext({ hotkey, kind }: { hotkey: string; kind: "operation" | "operator" }) {
  const [result, setResult] = useState<{ data: (Operation & Identity)[]; checkedAt: string } | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/validators/context?hotkey=${hotkey}&kind=${kind}`, { signal: controller.signal }).then(async response => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setResult(payload); setError(""); }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [hotkey, kind, attempt]);
  return <section className={styles.detail}><h2>{kind === "operation" ? "Operating status" : "Operator information"}</h2>{error && <p role="alert" className={styles.notice}>{error} <button onClick={() => setAttempt(value => value + 1)}>Retry</button></p>}{!result && !error && <p role="status">Loading source evidence…</p>}{result && (kind === "operation" ? <><p>Direct hotkey registrations and permits at each source snapshot. A parent working through children may have no direct row. Check the subnet finder for verified delegated paths. Weight-update age is measured in blocks; this is not server uptime.</p><ValidatorTableHelp><div className={styles.tableWrap} role="region" aria-label="Validator operating status" tabIndex={0}><table className={`${styles.table} ${styles.pinFirst}`}><thead><tr>{["Subnet", "Permit", "Active flag", "Weight update age", "Block", "Snapshot UTC"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{result.data.map(row => { const age = now - Date.parse(row.timestamp); const stale = !Number.isFinite(age) || age > 7200000 || age < -60000; return <tr key={row.netuid}><td>SN{row.netuid}{row.netuid === 0 ? " Root registration" : ""}</td><td>{row.validator_permit === true ? "Yes" : row.validator_permit === false ? "No" : "Unknown"}</td><td>{row.active === true ? "Active" : row.active === false ? "Inactive" : "Unknown"}{stale && <small>Stale / invalid snapshot</small>}</td><td>{displayNumber(row.updated, 0)} blocks</td><td>{displayNumber(row.block_number, 0)}</td><td>{row.timestamp}</td></tr>; })}</tbody></table></div></ValidatorTableHelp>{!result.data.length && <p>No direct registrations returned. This does not establish inactivity for delegated parents.</p>}</> : <><p>Owner-published on-chain identity, joined to this validator’s coldkey. Claims and links are provided by the operator; they do not verify team credentials, security or insurance.</p>{!result.data.length && <p>No on-chain operator identity is available.</p>}{result.data.map(row => <article key={row.address}><h3>{row.name || "Unnamed operator"}</h3><p>{row.description || "No description provided."}</p><p className={styles.address}>Owner: {row.address}</p>{([['Website', row.url], ['Repository', row.github_repo]] as const).map(([label, value]) => safeUrl(value) ? <p key={label}><a href={safeUrl(value)!} target="_blank" rel="noreferrer">{label} ↗</a></p> : null)}<p>Support / Discord: {row.discord || "Not provided"}</p></article>)}<p className={styles.source}>Identity checked {result.checkedAt} · <a href="https://taostats.io/docs/new/accounts/get-accounts-address-identity" target="_blank" rel="noreferrer">Source definition ↗</a></p></>)}</section>;
}
