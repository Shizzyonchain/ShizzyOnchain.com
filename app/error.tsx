"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("Page render failed", error);
  }, [error]);

  return (
    <main className="route-error" role="alert">
      <p>ShizzyUnchained</p>
      <h1>This page hit a temporary problem.</h1>
      <span>Live market collection is still running. You can retry without losing your place.</span>
      <button type="button" onClick={retry}>Try again</button>
    </main>
  );
}
