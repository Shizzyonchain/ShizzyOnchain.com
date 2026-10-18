"use client";

import { useId, useRef, type ReactNode } from "react";

export function OverviewHelp({ title, children }: { title: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  return <>
    <button type="button" className="overview-help" aria-label={`About ${title}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      {title}<span aria-hidden="true">ⓘ</span>
    </button>
    <dialog ref={dialog} className="sentiment-dialog" aria-labelledby={headingId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="sentiment-dialog-head"><h2 id={headingId}>{title}</h2><button type="button" aria-label={`Close ${title} explanation`} onClick={() => dialog.current?.close()}>✕</button></div>
      {children}
    </dialog>
  </>;
}
