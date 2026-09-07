"use client";

import { useSyncExternalStore } from "react";
import { promotedLivestream } from "./lib/channel-promotions";

const dismissalKey = `shizzy:stream-dismissed:v1:${promotedLivestream.id}`;
const dismissalEvent = "shizzy:stream-dismissed";
let dismissedInMemory = false;

function getSnapshot(): "hidden" | "upcoming" | "started" {
  if (!promotedLivestream.enabled || dismissedInMemory || Date.now() >= Date.parse(promotedLivestream.expiresAt)) return "hidden";
  try {
    if (sessionStorage.getItem(dismissalKey) === "1") return "hidden";
  } catch {
    // Dismissal still works for this page when browser storage is unavailable.
  }
  return Date.now() < Date.parse(promotedLivestream.startsAt) ? "upcoming" : "started";
}

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  window.addEventListener(dismissalEvent, onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener(dismissalEvent, onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function getServerSnapshot() {
  // Static news pages must not leave an expired promotion in their HTML.
  return "hidden" as const;
}

export function LivestreamBanner() {
  const phase = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (phase === "hidden") return null;

  function dismiss() {
    dismissedInMemory = true;
    try {
      sessionStorage.setItem(dismissalKey, "1");
    } catch {
      // Keep the in-memory dismissal when storage is disabled.
    }
    window.dispatchEvent(new Event(dismissalEvent));
  }

  return (
    <aside className="livestream-banner" aria-label="Shizzy livestream announcement">
      <div className="livestream-banner-copy">
        <span className="livestream-banner-label"><span aria-hidden="true">▶</span> {phase === "upcoming" ? "Next livestream" : "Stream with Shizzy"}</span>
        <strong>{promotedLivestream.headline}</strong>
        <time dateTime={promotedLivestream.startsAt}>{promotedLivestream.schedule}</time>
      </div>
      <a className="channel-promo-button stream-reminder" href={`https://www.youtube.com/watch?v=${promotedLivestream.id}`} target="_blank" rel="noreferrer">
        {phase === "upcoming" ? "Set reminder" : "Watch on YouTube"} <span aria-hidden="true">↗</span>
      </a>
      <button className="livestream-banner-close" type="button" aria-label="Dismiss livestream banner" onClick={dismiss}>×</button>
    </aside>
  );
}
