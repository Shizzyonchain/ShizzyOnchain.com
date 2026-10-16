import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "../../site-header";
import { CreatorFooter } from "../../creator-footer";
import { ValidatorProfile } from "../validator-profile";
import styles from "../validators.module.css";

export const metadata: Metadata = {
  title: "Validator Profile | ShizzyUnchained",
  description: "Bittensor validator fees, stake, subnet yields and historical snapshots.",
};
export default async function ValidatorPage({ params }: { params: Promise<{ hotkey: string }> }) {
  const { hotkey } = await params;
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey)) notFound();
  return <><div className="shell"><SiteHeader hideCurrency /></div><main className={styles.page}><Link className={styles.back} href="/validators">← All validators</Link><ValidatorProfile hotkey={hotkey} /></main><CreatorFooter /></>;
}

