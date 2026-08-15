import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const title = "ShizzyUnchained — Bittensor Market Intelligence";
const description = "Live Bittensor subnet price action, market analytics, and mass wallet portfolio checks.";

export const metadata: Metadata = {
  metadataBase: new URL("https://shizzyunchained.com"),
  title,
  description,
  robots: { index: true, follow: true },
  verification: {
    google: "LOBmr7tij4lUklupg4cSvTaPoKhpCMgmC87eYESDjes",
  },
  icons: {
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.svg?v=2",
    apple: "/shizzy-unchained-logo.png",
  },
  openGraph: { title, description, type: "website", siteName: "ShizzyUnchained" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
