import Image from "next/image";
import Link from "next/link";
import { taoHeadsCommunity } from "./lib/community";
import styles from "./creator-pages.module.css";

export function CreatorFooter() {
  return (
    <footer className={`${styles.footer} ${styles.wrap}`}>
      <Link href="/" aria-label="Shizzy Unchained home"><Image src="/shizzy-unchained-logo.svg" alt="" width={190} height={64} /></Link>
      <p>Independent Bittensor coverage & community.<br /><span>For education and discussion. Not financial advice.</span></p>
      <div><Link href="/about">About Shizzy</Link><Link href={taoHeadsCommunity.path}>TAO Heads</Link><a href="mailto:shizzyunchained@gmail.com">Contact</a></div>
    </footer>
  );
}
