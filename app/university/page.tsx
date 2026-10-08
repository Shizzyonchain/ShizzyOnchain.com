import type { Metadata } from "next";
import { Dashboard } from "../dashboard";
import { universityShareImage } from "../lib/share-images";

const title = "Shiz University | Bittensor Education";
const description = "Practical Bittensor, subnet research, portfolio, content creation, and crypto security education.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/university" },
  openGraph: { title, description, type: "website", url: "/university", siteName: "ShizzyUnchained", images: [universityShareImage] },
  twitter: { card: "summary_large_image", title, description, images: [universityShareImage] },
};

export default function UniversityPage() {
  return <Dashboard initialView="university" />;
}
