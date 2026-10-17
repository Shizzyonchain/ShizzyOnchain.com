import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../site-header";
import { CreatorFooter } from "../creator-footer";
import { ValidatorFinder } from "./validator-finder";
import { getSubnetNewsBriefs } from "../lib/subnet-news";
import { ValidatorExplorer } from "./validator-explorer";
import styles from "./validators.module.css";

export const metadata: Metadata = {
  title: "Bittensor Validators | ShizzyUnchained",
  description: "Explore Bittensor validator stake, fees, subnet coverage, historical yield and delegation statistics.",
  alternates: { canonical: "/validators" },
};
export default function ValidatorsPage() {
  const subnets = (getSubnetNewsBriefs()[0]?.subnets || []).map(({ netuid, name }) => ({ netuid, name }));
  return <><div className={styles.header}><SiteHeader hideCurrency /></div><main className={styles.page}><header className={styles.hero}><p className={styles.eyebrow}>BITTENSOR INTELLIGENCE</p><h1>Validators</h1><p>Follow the stake. Understand the fees. Compare validators where it matters.</p><div className={styles.tags}><span>Root & alpha stake</span><span>Subnet-level yield</span><span>Transparent sources</span></div></header><nav className={styles.viewNav} aria-label="Validator views"><span aria-current="page">Subnet validators</span><Link href="/validators/root">Root · baskets &amp; Root Reborn →</Link></nav><ValidatorFinder subnets={subnets} /><ValidatorExplorer /><section className={styles.guide}><h2>Know what you’re comparing</h2><div><article><h3>Stake & dominance</h3><p>Root TAO, alpha valued in TAO, and protocol-weighted stake are different measures. Weighted stake is not a wallet balance. Dominance follows the provider’s stake-weight definition.</p></article><article><h3>Take & rewards</h3><p>Take is the validator’s fee fraction, shown as a percentage. Daily reward figures are historical observations, not guaranteed future earnings.</p></article><article><h3>Yield & participation</h3><p>Compare the same subnet and measurement window. APR annualizes without additional compounding; APY compounds the same measured return. Node calculations show both. Provider figures with an unconfirmed formula are labelled reported rates. Epoch participation measures participation in reward epochs, not server uptime.</p></article></div><p>Validator snapshots and history: <a href="https://taostats.io/docs/new/validators" target="_blank" rel="noreferrer">TaoStats</a>. Data is cached hourly; each snapshot retains its original timestamp. Market context on validator profiles comes from our Finney-backed market feed. Unknown figures stay unavailable.</p></section></main><CreatorFooter /></>;
}
