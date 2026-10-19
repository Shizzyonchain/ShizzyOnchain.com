import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dashboard } from "../../dashboard";
import { getInitialMarkets, getInitialTaoUsd } from "../../lib/market-data";
import { getTaoHistory } from "../../lib/tao-history";

export const revalidate = 15;

function chartAsset(asset: string): number | "tao" {
  if (asset === "tao") return "tao";
  if (!/^[1-9]\d{0,2}$/.test(asset) || Number(asset) > 128) notFound();
  return Number(asset);
}

export async function generateMetadata({ params }: { params: Promise<{ asset: string }> }): Promise<Metadata> {
  const { asset } = await params;
  const selected = chartAsset(asset);
  const title = selected === "tao" ? "Bittensor TAO Chart" : `SN${selected} Subnet Chart`;
  return { title: `${title} | ShizzyUnchained`, description: "Explore historical prices, indicators, drawings and Bittensor market information.", alternates: { canonical: `/charts/${asset}` } };
}

export default async function ChartPage({ params, searchParams }: { params: Promise<{ asset: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { asset } = await params;
  const selected = chartAsset(asset);
  const query = await searchParams;
  const currency = query.currency === "tao" && selected !== "tao" ? "tao" : "usd";
  const interval = typeof query.interval === "string" && ["10m", "1h", "1d", "1w", "1mo"].includes(query.interval) ? query.interval : "1d";
  const [rows, taoUsd, history] = await Promise.all([getInitialMarkets(), getInitialTaoUsd(), getTaoHistory()]);
  return <Dashboard key={asset} initialChart={selected} initialCurrency={currency} initialInterval={interval} initialRows={rows} initialTaoUsd={taoUsd} initialDollarHistory={history} />;
}
