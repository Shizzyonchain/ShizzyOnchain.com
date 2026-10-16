"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedIdentity } from "../lib/validator-identity";
import { shortAddress } from "../lib/validator-types";
import styles from "./validators.module.css";

const pending = new Map<string, Promise<ResolvedIdentity | null>>();
let queue: Promise<unknown> = Promise.resolve();
function lookup(url: string) {
  const existing = pending.get(url);
  if (existing) return existing;
  const task = queue.then(async () => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
      return response.ok ? await response.json() as ResolvedIdentity : null;
    } catch { return null; }
  });
  // Pace optional unknown-name lookups; never fan out a request for every table row.
  queue = task.then(() => new Promise(resolve => window.setTimeout(resolve, 5000)));
  if (pending.size >= 256) pending.delete(pending.keys().next().value!);
  pending.set(url, task);
  return task;
}

export function ValidatorName({ hotkey, name, netuid }: { hotkey: string; name?: string | null; netuid?: number }) {
  const element = useRef<HTMLSpanElement>(null);
  const [resolved, setIdentity] = useState<(ResolvedIdentity & { hotkey: string; netuid?: number }) | null>(null);
  const identity = resolved?.hotkey === hotkey && resolved?.netuid === netuid ? resolved : null;
  const known = Boolean(name?.trim() && name !== hotkey);
  useEffect(() => {
    if (!resolved?.observedAt) return;
    const timer = window.setInterval(() => {
      if (Date.now() - Date.parse(resolved.observedAt!) > 2 * 3600_000) setIdentity(null);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [resolved]);
  useEffect(() => {
    const target = element.current;
    if (known || !target) return;
    let cancelled = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const url = `/api/validators/identity?hotkey=${hotkey}${netuid === undefined ? "" : `&netuid=${netuid}`}`;
      void lookup(url).then(result => { if (!cancelled && result && result.observedAt && Date.now() - Date.parse(result.observedAt) <= 2 * 3600_000) setIdentity({ ...result, hotkey, netuid }); });
    });
    observer.observe(target);
    return () => { cancelled = true; observer.disconnect(); };
  }, [hotkey, netuid, known]);
  return <span ref={element} className={styles.validatorName}><span>{known ? name : identity?.label || shortAddress(hotkey)}</span>{identity?.label && !known && <small>{shortAddress(hotkey)}<br />Delegation parent{identity.parents.length === 1 ? "" : "s"}: {identity.parents.slice(0, 3).map(parent => `${parent.name || shortAddress(parent.hotkey)} (${parent.subnets.slice(0, 3).map(sn => `SN${sn}`).join(", ")}${parent.subnets.length > 3 ? ` +${parent.subnets.length - 3} more subnets` : ""})`).join("; ")}{identity.parents.length > 3 ? `; +${identity.parents.length - 3} more parents` : ""}<br />Parent delegation does not establish the child’s operator.</small>}</span>;
}
