import { getValidatorMetadataName } from "../../lib/validator-metadata-source";
import { withSocialMetadata } from "../../lib/social-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "../../site-header";
import { CreatorFooter } from "../../creator-footer";
import { ValidatorProfile } from "../validator-profile";
import styles from "../validators.module.css";

export async function generateMetadata({ params }: { params: Promise<{ hotkey: string }> }): Promise<Metadata> {
  const { hotkey } = await params;
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey)) notFound();
  const name = await getValidatorMetadataName(hotkey);
  return withSocialMetadata({
    title: `${name || "Validator"} · ${hotkey.slice(0, 6)}…${hotkey.slice(-6)} | ShizzyUnchained`,
    description: `${name || "Bittensor validator"}: fees, stake, subnet yields and historical snapshots for hotkey ${hotkey}.`,
  }, `/validators/${hotkey}`, { imagePath: "/social/cards/validators--profile.png" });
}
export default async function ValidatorPage({ params }: { params: Promise<{ hotkey: string }> }) {
  const { hotkey } = await params;
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey)) notFound();
  return <><div className={styles.header}><SiteHeader hideCurrency /></div><main className={styles.page}><Link className={styles.back} href="/validators">← All validators</Link><ValidatorProfile hotkey={hotkey} /></main><CreatorFooter /></>;
}


