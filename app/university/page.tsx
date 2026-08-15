import type { Metadata } from "next";
import { Dashboard } from "../dashboard";

export const metadata: Metadata = {
  title: "Shiz University | Bittensor Education",
  description: "Practical Bittensor, subnet research, portfolio, content creation, and crypto security education.",
  alternates: { canonical: "/university" },
};

export default function UniversityPage() {
  return <Dashboard initialView="university" />;
}
