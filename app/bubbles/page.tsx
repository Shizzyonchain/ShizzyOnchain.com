import type { Metadata } from "next";
import { Dashboard } from "../dashboard";
import { getInitialMarkets, getInitialTaoUsd } from "../lib/market-data";

export const metadata: Metadata = {
  title: "Bittensor Subnet Market Bubbles | ShizzyUnchained",
  description: "Explore live finalized Bittensor subnet price action in an interactive market map.",
  alternates: { canonical: "/bubbles" },
};

export default async function BubblesPage() {
  const [initialRows, initialTaoUsd] = await Promise.all([getInitialMarkets(), getInitialTaoUsd()]);
  return <Dashboard initialView="bubbles" initialRows={initialRows} initialTaoUsd={initialTaoUsd} />;
}
