import { withSocialMetadata } from "../lib/social-metadata";
import type { Metadata } from "next";
import { VideoLibrary } from "./video-library";
import { LivestreamBanner } from "../livestream-banner";
import { CreatorShell } from "../creator-shell";

export const metadata: Metadata = withSocialMetadata({
  title: "Bittensor Videos & Live Streams | ShizzyUnchained",
  description: "Watch ShizzyUnchained Bittensor market updates, subnet deep dives, interviews, and live streams.",
  alternates: { canonical: "/video" },
}, "/video");

export default function VideoPage() {
  return <CreatorShell><LivestreamBanner /><VideoLibrary /></CreatorShell>;
}
