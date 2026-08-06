import Link from "next/link";
import Image from "next/image";

export function SubnetNewsHeader() {
  return (
    <header className="news-header">
      <Link className="news-brand" href="/" aria-label="Shizzy Unchained home">
        <Image src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" width={190} height={72} priority />
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Market</Link>
        <Link className="active" href="/subnet-news">Subnet News</Link>
        <Link href="/bubbles">Bubbles</Link>
        <Link href="/video">Videos</Link>
        <Link href="/deep-dives">Deep Dives</Link>
        <Link href="/wallet-tracker">Wallet Tracker</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
