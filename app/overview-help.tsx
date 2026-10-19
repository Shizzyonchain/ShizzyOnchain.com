"use client";

import { useId, useRef } from "react";

import { MetricExplanation } from "./metric-explanation";
import styles from "./metric-explanation.module.css";

export function OverviewHelp({ title }: { title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  return <>
    <button type="button" className="overview-help" aria-label={`About ${title}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      {title}<span aria-hidden="true">ⓘ</span>
    </button>
    <dialog ref={dialog} className={`sentiment-dialog ${styles.dialog}`} aria-labelledby={headingId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="sentiment-dialog-head"><h2 id={headingId}>{title}</h2><button type="button" aria-label={`Close ${title} explanation`} onClick={() => dialog.current?.close()}>✕</button></div>
      <MetricExplanation title={title} />
    </dialog>
  </>;
}
