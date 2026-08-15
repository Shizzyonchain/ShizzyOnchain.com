import type { Metadata } from "next";
import { Dashboard } from "../dashboard";

export const metadata: Metadata = {
  title: "Bittensor Videos & Live Streams | ShizzyUnchained",
  description: "Watch ShizzyUnchained Bittensor market updates, subnet deep dives, interviews, and live streams.",
  alternates: { canonical: "/video" },
};

export default function VideoPage() {
  return <Dashboard initialView="videos" />;
}
