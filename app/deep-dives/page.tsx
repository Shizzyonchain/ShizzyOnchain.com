import Link from "next/link";
import { DeepDivesHeader } from "./deep-dives-header";

export const metadata = { title: "Deep Dives | Shizzy Unchained", description: "Research, analysis, and stories from across the Bittensor ecosystem." };

export default function DeepDivesPage() {
  return <main className="deep-shell"><DeepDivesHeader />
    <section className="deep-index-hero"><p>Long-form intelligence</p><h1>Shizzy<br/><span>Deep Dives.</span></h1><div><strong>Beyond the timeline.</strong><p>Research, analysis, and stories from across the Bittensor ecosystem.</p></div></section>
    <section className="deep-feature">
      <Link className="deep-cover" href="/deep-dives/compute-wars"><img src="/deep-dives/compute-wars.png" alt="Compute Wars: Bittensor AI infrastructure"/><span>Read the deep dive →</span></Link>
      <div className="deep-feature-copy"><p className="eyebrow">Featured · AI infrastructure</p><h2>Compute Wars: The Battle for AI Infrastructure Has Begun</h2><p>GPUs, inference, retrieval, verification, developer access, private compute, and energy are becoming one massive battlefield. Ten Bittensor subnets are fighting to control a different piece of the stack.</p><div><span>By Shizzy</span><span>18 min read</span></div><Link href="/deep-dives/compute-wars">Enter the Compute Wars →</Link></div>
    </section>
  </main>;
}
