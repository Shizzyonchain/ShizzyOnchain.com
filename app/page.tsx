import type { Metadata } from "next";
import { Dashboard, type ScreenerRow } from "./dashboard";

export const revalidate = 15;
export const metadata: Metadata = {
  title: "Live Bittensor Subnet Prices, APY & Market Data | ShizzyUnchained",
  description: "Track live finalized Bittensor subnet prices, market caps, APY, emissions, volume, and conviction-locked alpha across Finney.",
  alternates: { canonical: "/" },
};

async function getInitialMarkets(): Promise<ScreenerRow[]> {
  const base = process.env.BACKEND_API_URL;
  if (!base) return [];
  try {
    const response = await fetch(new URL("/v1/screener", base), {
      headers: { "X-API-Key": process.env.BACKEND_API_KEY || "" },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const rows = await getInitialMarkets();
  const subnetRows = rows.filter((row) => row.netuid !== 0);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Live Bittensor Subnet Markets",
    description: "Finalized Bittensor Finney subnet prices, market capitalization, APY, emissions, and conviction-locked alpha.",
    url: "https://shizzyunchained.com/",
    temporalCoverage: subnetRows[0]?.time,
    creator: { "@type": "Organization", name: "ShizzyUnchained", url: "https://shizzyunchained.com/" },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://shizzyunchained.com/api/backend/v1/screener",
    },
    hasPart: subnetRows.slice(0, 25).map((row, index) => ({
      "@type": "Dataset",
      position: index + 1,
      name: `${row.name || `Subnet ${row.netuid}`} (SN${row.netuid})`,
      description: `${row.symbol || `SN${row.netuid}`} price ${row.price_tao} TAO`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Dashboard initialRows={rows} />
    </>
  );
}
