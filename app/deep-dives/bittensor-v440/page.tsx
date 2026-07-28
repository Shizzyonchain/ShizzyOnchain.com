import type { Metadata } from "next";
import Link from "next/link";
import { DeepDivesHeader } from "../deep-dives-header";

export const metadata: Metadata = {
  title: "Bittensor v440: The Emission Gate | Shizzy Deep Dives",
  description: "A plain-English deep dive into how Bittensor v440 redistributes subnet emission, who benefits, and what the new gate means for TAO and alpha holders.",
  openGraph: { title: "Bittensor v440: The Emission Gate", description: "The subnet economy just became much more competitive.", type: "article", images: [{ url: "/deep-dives/bittensor-v440.png", width: 1672, height: 941, alt: "Bittensor v440: The Emission Gate" }] },
  twitter: { card: "summary_large_image", images: ["/deep-dives/bittensor-v440.png"] },
};

const snapshot = [
  ["Emission below the bar", "38.4%", "12.5%"],
  ["Emission to the top 8", "32.8%", "52.7%"],
  ["Rank where 80% is reached", "64", "23"],
  ["Effective subnet count", "~50", "~22"],
];

const roles = [
  ["TAO holders", "Mostly indirect", "No conversion is required. V440 redistributes block emission among eligible subnet pools; it does not create a new TAO token or raise the maximum supply."],
  ["Alpha stakers", "Directly exposed", "Deep-tail positions receive far less TAO-side support. Strong subnets may benefit, but the moving boundary can change the economics quickly."],
  ["Subnet owners", "Demand becomes essential", "A parked slot is designed to earn close to nothing. Sustained market demand now matters much more than simply occupying a scarce slot."],
  ["Miners and validators", "Profitability can shift", "Their core roles remain, but weak subnet economics may make participation less attractive or force incentive changes."],
];

export default function BittensorV440Page() {
  return <main className="deep-shell"><DeepDivesHeader />
    <article className="deep-article v440-article">
      <header className="article-hero v440-hero"><Link href="/deep-dives">&larr; All Deep Dives</Link><p>Protocol economics &middot; Bittensor</p><h1>Bittensor v440:<br/><span>The Emission Gate</span></h1><div><b>ShizzyUnchained</b><span>July 28, 2026</span><span>12 min read</span><span className="v440-live">Live on mainnet</span></div></header>
      <img className="article-cover" src="/deep-dives/bittensor-v440.png" alt="Bittensor subnet signals flowing through the v440 emission gate"/>
      <div className="article-layout"><aside><span>Inside the gate</span><ol><li>The short version</li><li>Why it changed</li><li>How the bar works</li><li>Official numbers</li><li>Who is affected</li><li>Risks and tradeoffs</li><li>What to do</li><li>Sources</li></ol></aside>
        <div className="article-body v440-body">
          <p>Bittensor used to give every eligible subnet a meaningful slice of new TAO based mainly on its smoothed alpha price. V440 adds a competitive gate: subnets above a moving demand threshold keep most of their weight; those below it lose most of theirs. The removed emission is redistributed, not destroyed.</p>
          <div className="v440-thesis"><span>THE CORE IDEA</span><h2>Owning a subnet slot no longer guarantees meaningful passive emission.</h2></div>
          <p>The upgrade is economic plumbing, not a token migration. There is no new TAO, no wallet conversion, and no permanent list of approved subnets. The gate moves with the market.</p>

          <h2><span>01 / WHY IT CHANGED</span>The network was paying the long tail to exist</h2>
          <p>Before v440, inter-subnet emission followed moving-price share. Even a weak subnet could collect a continuing subsidy as long as it retained some price. That made an idle subnet slot valuable in its own right and pushed the cost of entry higher for builders.</p>
          <p>The official release frames this as a capital-allocation problem: passive slot yield diverted rewards from leading subnets and made registration expensive. Its July estimate put a subnet slot around <strong>1,300 TAO</strong>. V440 tries to separate the right to compete from the right to earn.</p>
          <blockquote className="v440-quote"><p>A team no longer buys a guaranteed slice of emission &mdash; just a starting position below a strict competition bar.</p><cite>Bittensor v440 release notes</cite></blockquote>
          <div className="v440-before-after"><div><span>BEFORE</span><h3>Proportional rewards</h3><p>Effective moving-price share translated relatively directly into TAO-side emission.</p></div><div><span>AFTER V440</span><h3>Competitive rewards</h3><p>The same share passes through a steep gate before the pool is redistributed.</p></div></div>

          <h2><span>02 / HOW IT WORKS</span>The bar is dynamic &mdash; not top 32 forever</h2>
          <p>The chain starts with each subnet&apos;s smoothed alpha price and applies the existing miner-burn adjustment. It sorts those effective shares from strongest to weakest, then walks down the ranking until the accumulated share reaches <strong>61%</strong>. The share at that crossing becomes the bar.</p>
          <div className="v440-flow" aria-label="Emission gate calculation"><div><b>1</b><span>Measure<small>Moving alpha price</small></span></div><i>&rarr;</i><div><b>2</b><span>Adjust<small>Miner-burn factor</small></span></div><i>&rarr;</i><div><b>3</b><span>Gate<small>Compare with bar</small></span></div><i>&rarr;</i><div><b>4</b><span>Normalize<small>Redistribute to 100%</small></span></div></div>
          <p>In the official July snapshot, the crossing happened near rank 32. But the protocol does not contain a permanent rank-32 rule. If demand becomes more concentrated, fewer subnets may sit above the crossing. If demand spreads out, its location can change.</p>
          <div className="v440-gate"><div><span>Far above the bar</span><i><b style={{width:"96%"}}/></i><em>Nearly open</em></div><div><span>At the bar</span><i><b style={{width:"50%"}}/></i><em>50% before normalization</em></div><div><span>Mid-tail</span><i><b style={{width:"22%"}}/></i><em>Heavily reduced</em></div><div><span>Deep tail</span><i><b style={{width:"4%"}}/></i><em>Small residual</em></div></div>
          <p className="v440-note"><strong>Precision note:</strong> 50% at the bar describes the gate multiplier before all gated weights are normalized back to 100%. A subnet&apos;s final percentage therefore depends on every other subnet too.</p>

          <h2><span>03 / OFFICIAL SNAPSHOT</span>A major concentration of rewards</h2>
          <p>Bittensor modeled the shipped defaults &mdash; 61% demand mass and gate exponent 3 &mdash; against a July 2026 Finney snapshot of 126 subnets. These results show the scale of the change, but they are not permanent promises.</p>
          <div className="v440-table" role="table" aria-label="Bittensor official v440 snapshot"><div className="v440-tr v440-th"><span>Measure</span><span>Before</span><span>V440</span></div>{snapshot.map(([label,before,after])=><div className="v440-tr" key={label}><b>{label}</b><span>{before}</span><strong>{after}</strong></div>)}</div>
          <div className="v440-stats"><div><strong>94</strong><span>subnets below the snapshot bar</span></div><div><strong>0</strong><span>subnets hard-zeroed by the gate</span></div><div><strong>360</strong><span>blocks between bar updates</span></div></div>
          <p>At roughly 12 seconds per block, 360 blocks is about 72 minutes. The slower update cadence and moving price reduce one-block flapping around the boundary.</p>

          <h2><span>04 / WHO FEELS IT</span>The impact depends on what you hold</h2>
          <div className="v440-roles">{roles.map(([role,impact,copy])=><div key={role}><span>{role}</span><h3>{impact}</h3><p>{copy}</p></div>)}</div>
          <div className="v440-warning"><span>IMPORTANT DISTINCTION</span><h3>Staking into a subnet is a swap, not a savings deposit.</h3><p>TAO is exchanged for that subnet&apos;s alpha. Your outcome depends on alpha price, liquidity, fees, price impact, and emissions &mdash; not just a displayed yield.</p></div>

          <h2><span>05 / RISKS AND TRADEOFFS</span>Efficient allocation &mdash; or an incumbent flywheel?</h2>
          <p>V440 makes a clear bet: concentrated market demand is a better allocation signal than giving the long tail a broad subsidy. That can direct more capital toward successful networks, but it creates serious second-order effects.</p>
          <ol className="v440-risks"><li><div><h3>Market demand is not real utility</h3><p>Alpha price can reflect usage and quality, but also speculation, branding, liquidity, and concentrated ownership.</p></div></li><li><div><h3>Strong subnets gain a compounding advantage</h3><p>More emission can attract more demand, while weaker networks may enter the reverse cycle.</p></div></li><li><div><h3>The boundary becomes a pressure point</h3><p>Near-bar subnets have a strong incentive to increase demand. The moving average slows manipulation; it does not make manipulation impossible.</p></div></li><li><div><h3>The rules remain governable</h3><p>The 61% threshold and exponent 3 are root-sudo parameters. They are rate-limited but can change.</p></div></li></ol>
          <div className="v440-myth"><div><span>MYTH</span><p>Everything below rank 32 goes to zero.</p></div><div><span>REALITY</span><p>The rank moves, and the gate is smooth. Deep-tail emission approaches zero but is not hard-cut.</p></div><div><span>MYTH</span><p>V440 adds more subnet slots.</p></div><div><span>REALITY</span><p>It clears an economic path for a later cap increase. The increase itself is deferred.</p></div></div>

          <h2><span>06 / WHAT TO DO</span>The practical checklist</h2>
          <ul className="v440-checklist"><li><strong>Liquid TAO:</strong> No migration is required. Claims that v440 guarantees a price move are speculation.</li><li><strong>Subnet alpha:</strong> Check position relative to the bar, liquidity, and real demand. Do not rely only on historical APY.</li><li><strong>Subnet owners:</strong> Track the public bar with <code>btcli subnets bar</code> and compare effective share with the threshold.</li><li><strong>Node operators:</strong> Match the node release to the on-chain runtime and continue regular host-side maintenance.</li></ul>
          <div className="v440-verdict"><span>THE VERDICT</span><h2>V440 turns subnet emission from broad participation income into a sharper competition for sustained capital.</h2><p>It may reduce idle-slot rent, improve capital efficiency, and make future expansion easier. It also concentrates rewards and may make recovery harder for weaker networks. The upgrade does not determine which AI products are objectively useful. It decides that the market&apos;s smoothed commitment should carry much more weight.</p></div>

          <h2><span>07 / PRIMARY SOURCES</span>Verify the deep dive</h2>
          <div className="v440-sources"><a href="https://www.bittensor.com/releases/v440-upgrade" target="_blank" rel="noreferrer">Official v440 release: The Emission Gate &nearr;</a><a href="https://www.bittensor.com/docs/concepts/emissions" target="_blank" rel="noreferrer">Official emissions documentation &nearr;</a><a href="https://www.bittensor.com/code/pallets/subtensor/src/coinbase/subnet_emissions.rs" target="_blank" rel="noreferrer">Running emission-gate source code &nearr;</a><a href="https://www.bittensor.com/docs/concepts/staking-pools" target="_blank" rel="noreferrer">Official staking and pools guide &nearr;</a></div>
          <p className="v440-disclaimer">Educational analysis only. Not financial advice. Protocol settings, subnet rankings, and market conditions can change.</p>
          <p className="article-signoff">&mdash; ShizzyUnchained</p>
        </div>
      </div>
    </article>
  </main>;
}
