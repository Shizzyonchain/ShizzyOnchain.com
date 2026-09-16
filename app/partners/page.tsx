import type { Metadata } from "next";
import { Dashboard } from "../dashboard";

export const metadata: Metadata = {
  title: "Bittensor Ecosystem Partners | ShizzyUnchained",
  description: "Explore ShizzyUnchained partners for Bittensor trading, staking, subnet intelligence, security, and privacy, including the AlphaChaser community offer.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return <Dashboard initialView="partners" />;
}
