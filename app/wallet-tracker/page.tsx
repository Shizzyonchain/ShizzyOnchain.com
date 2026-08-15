import type { Metadata } from "next";
import { Dashboard } from "../dashboard";

export const metadata: Metadata = {
  title: "Bittensor Wallet & Staking Checker | ShizzyUnchained",
  description: "Check up to 100 public Bittensor coldkeys for free TAO, alpha positions, subnet exposure, and finalized staking value.",
  alternates: { canonical: "/wallet-tracker" },
};

export default function WalletTrackerPage() {
  return <Dashboard initialView="wallets" />;
}
