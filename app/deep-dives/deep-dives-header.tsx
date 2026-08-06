import Link from "next/link";

export function DeepDivesHeader() {
  return <header className="deep-header">
    <Link className="deep-brand" href="/" aria-label="Shizzy Unchained home"><img src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" /></Link>
    <nav aria-label="Primary navigation">
      <Link href="/">Market</Link><Link href="/subnet-news">Subnet News</Link><Link href="/bubbles">Bubbles</Link><Link href="/video">Videos</Link><Link className="active" href="/deep-dives">Deep Dives</Link><Link href="/wallet-tracker">Wallet Tracker</Link><Link href="/about">About</Link>
    </nav>
  </header>;
}
