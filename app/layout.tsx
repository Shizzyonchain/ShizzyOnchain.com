import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
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
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" }],
      shortcut: "/favicon.svg?v=2",
      apple: "/shizzy-unchained-logo.png",
    },
    openGraph: { title, description, type: "website", siteName: "ShizzyUnchained" },
    twitter: { card: "summary", title, description },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
