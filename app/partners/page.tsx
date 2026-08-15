import type { Metadata } from "next";
import { Dashboard } from "../dashboard";

export const metadata: Metadata = {
  title: "Bittensor Ecosystem Partners | ShizzyUnchained",
  description: "Explore ShizzyUnchained partners for Bittensor staking, subnet intelligence, hardware security, and privacy.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return <Dashboard initialView="partners" />;
}
