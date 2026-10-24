"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
const Directory = dynamic(() => import("./validator-explorer").then(module => module.ValidatorExplorer), { loading: () => <p>Loading directory…</p> });

export function OptionalDirectory() {
  const [open, setOpen] = useState(false);
  return <details onToggle={event => setOpen(event.currentTarget.open)}><summary>Browse the full validator directory</summary>{open && <Directory />}</details>;
}
