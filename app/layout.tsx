import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "shizzyunchained.com";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "ShizzyUnchained — Bittensor Market Intelligence";
  const description = "Live Bittensor subnet price action, market analytics, and mass wallet portfolio checks.";
  return {
    metadataBase, title, description,
    icons: {
      icon: [{ url: "/shizzy-unchained-logo.svg", type: "image/svg+xml" }],
      shortcut: "/shizzy-unchained-logo.svg",
      apple: "/shizzy-unchained-logo.png",
    },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
