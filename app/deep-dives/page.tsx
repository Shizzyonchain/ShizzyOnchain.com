import Link from "next/link";
import { DeepDivesHeader } from "./deep-dives-header";

export const metadata = { title: "Deep Dives | Shizzy Unchained", description: "Research, analysis, and stories from across the Bittensor ecosystem." };

export default function DeepDivesPage() {
  return <main className="deep-shell"><DeepDivesHeader />
    <section className="deep-index-hero"><p>Long-form intelligence</p><h1>Shizzy<br/><span>Deep Dives.</span></h1><div><strong>Beyond the timeline.</strong><p>Research, analysis, and stories from across the Bittensor ecosystem.</p></div></section>
    <section className="deep-feature">
      <Link className="deep-cover" href="/deep-dives/bittensor-v440"><img src="/deep-dives/bittensor-v440.png" alt="Bittensor v440: The Emission Gate"/><span>Read the deep dive &rarr;</span></Link>
      <div className="deep-feature-copy"><p className="eyebrow">Featured &middot; Protocol economics</p><h2>Bittensor v440: The Emission Gate</h2><p>The subnet economy just became much more competitive. A plain-English investigation into how v440 redirects emission, who benefits, who gets squeezed, and what the new gate means for TAO and alpha holders.</p><div><span>By ShizzyUnchained</span><span>12 min read</span></div><Link href="/deep-dives/bittensor-v440">Enter the Emission Gate &rarr;</Link></div>
    </section>
    <section className="deep-archive" aria-labelledby="more-deep-dives">
      <div className="deep-archive-head"><p>From the archive</p><h2 id="more-deep-dives">More Deep Dives</h2></div>
      <Link className="deep-archive-card" href="/deep-dives/compute-wars">
        <img src="/deep-dives/compute-wars.png" alt="Compute Wars: Bittensor AI infrastructure"/>
        <div><p>AI infrastructure &middot; 18 min read</p><h3>Compute Wars: The Battle for AI Infrastructure Has Begun</h3><span>Read the deep dive &rarr;</span></div>
      </Link>
    </section>
  </main>;
}
