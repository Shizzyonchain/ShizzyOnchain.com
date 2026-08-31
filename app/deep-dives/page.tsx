import Image from "next/image";
import Link from "next/link";
import { DeepDivesHeader } from "./deep-dives-header";

export const metadata = { title: "Deep Dives | Shizzy Unchained", description: "Research, analysis, and stories from across the Bittensor ecosystem.", alternates: { canonical: "/deep-dives" } };

export default function DeepDivesPage() {
  return <main className="deep-shell"><DeepDivesHeader />
    <section className="deep-index-hero"><p>Long-form intelligence</p><h1>Shizzy<br/><span>Deep Dives.</span></h1><div><strong>Beyond the timeline.</strong><p>Research, analysis, and stories from across the Bittensor ecosystem.</p></div></section>
    <section className="deep-feature">
      <Link className="deep-cover" href="/deep-dives/arbos-root-basket"><Image src="/deep-dives/arbos-root-basket.svg" alt="The Arbos subnet screen: 45 IN and 83 OUT" width={1600} height={900} sizes="(max-width: 900px) 100vw, 55vw"/><span>Read the deep dive &rarr;</span></Link>
      <div className="deep-feature-copy"><p className="eyebrow">Featured &middot; Root Reborn</p><h2>The Arbos Screen: IN, OUT &amp; 10/10</h2><p>Arbos screened all 128 Bittensor subnets. Here is what the labels really mean, why one autonomous validator is doing it, and how a perfect score can put a small subnet in front of real capital allocators.</p><div><span>By ShizzyUnchained</span><span>14 min read</span></div><Link href="/deep-dives/arbos-root-basket">Enter the Arbos Screen &rarr;</Link></div>
    </section>
    <section className="deep-archive" aria-labelledby="more-deep-dives">
      <div className="deep-archive-head"><p>From the archive</p><h2 id="more-deep-dives">More Deep Dives</h2></div>
      <div style={{display:"grid",gap:18}}>
        <Link className="deep-archive-card" href="/deep-dives/bittensor-v440"><Image src="/deep-dives/bittensor-v440.png" alt="Bittensor v440: The Emission Gate" width={900} height={360} sizes="(max-width: 700px) 100vw, 40vw"/><div><p>Protocol economics &middot; 12 min read</p><h3>Bittensor v440: The Emission Gate</h3><span>Read the deep dive &rarr;</span></div></Link>
        <Link className="deep-archive-card" href="/deep-dives/compute-wars"><Image src="/deep-dives/compute-wars.png" alt="Compute Wars: Bittensor AI infrastructure" width={900} height={360} sizes="(max-width: 700px) 100vw, 40vw"/><div><p>AI infrastructure &middot; 18 min read</p><h3>Compute Wars: The Battle for AI Infrastructure Has Begun</h3><span>Read the deep dive &rarr;</span></div></Link>
      </div>
    </section>
  </main>;
}
