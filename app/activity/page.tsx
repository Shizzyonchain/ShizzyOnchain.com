import type { Metadata } from "next";
import { Dashboard } from "../dashboard";
import { getInitialMarkets, getInitialTaoUsd } from "../lib/market-data";

export const metadata: Metadata = {
  title: "Live Bittensor Conviction Activity | ShizzyUnchained",
  description: "Track finalized Bittensor conviction locks, unlocks, stake moves, and subnet activity on Finney.",
  alternates: { canonical: "/activity" },
};

export default async function ActivityPage() {
  const [initialRows, initialTaoUsd] = await Promise.all([getInitialMarkets(), getInitialTaoUsd()]);
  return <Dashboard initialView="activity" initialRows={initialRows} initialTaoUsd={initialTaoUsd} />;
}
