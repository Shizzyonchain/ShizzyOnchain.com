"use client";

import { useMemo, useRef, useState } from "react";
import { taoSentiment, sentimentLabel, type SentimentRow } from "./lib/tao-sentiment";
import styles from "./sentiment-tile.module.css";

export function SentimentTile({ rows, state }: { rows: SentimentRow[]; state: "loading" | "live" | "stale" | "error" }) {
  const [period, setPeriod] = useState<"1h" | "24h">("1h");
  const readings = useMemo(() => ({ "1h": taoSentiment(rows, "1h"), "24h": taoSentiment(rows, "24h") }), [rows]);
  const reading = readings[period];
  const dialog = useRef<HTMLDialogElement>(null);
  const score = state === "live" ? reading?.score : undefined;
  const label = score === undefined ? state === "stale" ? "Data delayed" : state === "loading" ? "Calculating…" : "Unavailable" : sentimentLabel(score);
  const tone = score === undefined ? "unavailable" : score < 45 ? "fear" : score > 55 ? "greed" : "neutral";
  return <div className={`sentiment-tile ${tone} ${styles.tile}`}>
    <div className={styles.periods} role="group" aria-label="Fear and Greed period">
      {(["1h", "24h"] as const).map(value => <button key={value} type="button" aria-pressed={period === value} onClick={() => setPeriod(value)}>{value.toUpperCase()}</button>)}
    </div>
    <button type="button" className="sentiment-trigger" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog" aria-label={`TAO Fear & Greed, ${period}: ${score === undefined ? label : `${score} out of 100, ${label}`}. How this is calculated`}>
      <span className="sentiment-caption">TAO Fear &amp; Greed <span aria-hidden="true">ⓘ</span></span>
      <span className="sentiment-reading"><strong>{score ?? "—"}<span className="sentiment-denominator">/100</span></strong><span className="sentiment-label">{label}</span></span>
      <span className="sentiment-track" aria-hidden="true">{score !== undefined && <span style={{ left: `${score}%` }} />}</span>
    </button>
    <dialog ref={dialog} className="sentiment-dialog" aria-labelledby="sentiment-heading" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="sentiment-dialog-head"><h2 id="sentiment-heading">TAO Fear &amp; Greed</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Close sentiment explanation">✕</button></div>
      <p>Our experimental 0–100 market-conditions indicator. It is not a survey of emotions, an official fear-and-greed index, or a trading recommendation.</p>
      <p>Selected period: <b>{period === "24h" ? "rolling 24 hours" : "rolling 1 hour"}</b>. Uses subnet alpha/TAO data, so switching USD/TAO does not change this reading. Both periods are prepared from the existing market feed; switching makes no extra data request.</p>
      <ul><li><b>35% breadth:</b> share of subnets rising over the selected period; unchanged counts half.</li><li><b>25% momentum:</b> median return over the selected period; −5% to +5% maps to 0–100.</li><li><b>25% liquidity:</b> median TAO-reserve change over the selected period, using the same −5% to +5% scale.</li><li><b>15% directional volume:</b> activity compared with the preceding equal-length period reinforces the observed price direction; quiet trading stays neutral. The 24H comparison requires 48 hours of history.</li></ul>
      <p>0–24 Extreme fear · 25–44 Fear · 45–55 Neutral · 56–75 Greed · 76–100 Extreme greed.</p>
      <p>Requires all four inputs for at least 80% of the roster (minimum 32 subnets). Rows more than three minutes behind the newest snapshot are excluded. No current score is shown while the feed is delayed or unavailable.</p>
      <p>{reading ? `${reading.count}/${reading.total} subnets have complete inputs. Snapshot: ${new Date(reading.updatedAt).toISOString().replace("T", " ").replace(".000Z", " UTC")}.` : "Not enough complete inputs for a reliable reading yet."}</p>
    </dialog>
  </div>;
}
