import { withSocialMetadata } from "../lib/social-metadata";
import type { Metadata } from "next";
import { Dashboard } from "../dashboard";

const title = "Shiz University | Bittensor Education";
const description = "Practical Bittensor, subnet research, portfolio, content creation, and crypto security education.";

export const metadata: Metadata = withSocialMetadata({
  title,
  description,
  alternates: { canonical: "/university" },
}, "/university");

export default function UniversityPage() {
  return <Dashboard initialView="university" />;
}
