import Image from "next/image";
import Link from "next/link";
import { taoHeadsCommunity } from "./lib/community";
import styles from "./creator-pages.module.css";

export function CreatorFooter() {
  return (
    <footer className={`${styles.footer} ${styles.wrap}`}>
      <Link href="/" aria-label="Shizzy Unchained home"><Image src="/shizzy-unchained-home-v2.webp" alt="" width={888} height={313} sizes="170px" /></Link>
      <p>Independent Bittensor coverage & community.<br /><span>For education and discussion. Not financial advice.</span></p>
      <div><Link href="/about">About Shizzy</Link><Link href={taoHeadsCommunity.path}>TAO Heads</Link><a href="mailto:shizzyunchained@gmail.com">Contact</a></div>
    </footer>
  );
}
