"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./validators.module.css";

export function ValidatorTableScroll({ children, label, className = styles.tableWrap }: { children: ReactNode; label: string; className?: string }) {
  const top = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = top.current, content = bottom.current, fill = spacer.current;
    const table = content?.querySelector("table");
    if (!track || !content || !fill || !table) return;
    const measure = () => {
      track.hidden = content.scrollWidth <= content.clientWidth;
      // Match the available scroll distance, including borders and a vertical scrollbar.
      fill.style.width = `${track.clientWidth + content.scrollWidth - content.clientWidth}px`;
      track.scrollLeft = content.scrollLeft;
    };
    const fromTop = () => { if (Math.abs(content.scrollLeft - track.scrollLeft) > .5) content.scrollLeft = track.scrollLeft; };
    const fromTable = () => { if (Math.abs(track.scrollLeft - content.scrollLeft) > .5) track.scrollLeft = content.scrollLeft; };
    const observer = new ResizeObserver(measure);
    observer.observe(content); observer.observe(table);
    track.addEventListener("scroll", fromTop, { passive: true });
    content.addEventListener("scroll", fromTable, { passive: true });
    measure();
    return () => { observer.disconnect(); track.removeEventListener("scroll", fromTop); content.removeEventListener("scroll", fromTable); };
  }, []);
  return <div className={styles.scrollPair}>
    <div ref={top} className={styles.tableScrollTop} role="region" aria-label={`${label}: top horizontal scrollbar`} tabIndex={0} hidden><div ref={spacer} style={{ height: 1 }} /></div>
    <div ref={bottom} className={className} role="region" aria-label={label} tabIndex={0}>{children}</div>
  </div>;
}
