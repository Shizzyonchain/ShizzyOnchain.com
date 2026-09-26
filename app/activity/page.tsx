import { getTaoHistory } from "../lib/tao-history";
import type { Metadata } from "next";
import { Dashboard } from "../dashboard";
import { getInitialMarkets, getInitialTaoUsd } from "../lib/market-data";

export const metadata: Metadata = {
  title: "Live Bittensor Conviction Activity | ShizzyUnchained",
  description: "Track finalized Bittensor conviction locks, unlocks, stake moves, and subnet activity on Finney.",
  alternates: { canonical: "/activity" },
};

export default async function ActivityPage() {
  const [initialRows, initialTaoUsd, initialDollarHistory] = await Promise.all([getInitialMarkets(), getInitialTaoUsd(), getTaoHistory()]);
  return <Dashboard initialDollarHistory={initialDollarHistory} initialView="activity" initialRows={initialRows} initialTaoUsd={initialTaoUsd} />;
}
