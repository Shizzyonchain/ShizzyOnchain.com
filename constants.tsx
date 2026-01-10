import { CoinData, HotStory, NewsArticle } from './types';

export const INITIAL_COINS: CoinData[] = [
  { symbol: 'XRP', price: 2.10, change: -1.35 },
  { symbol: 'BNB', price: 898.75, change: 0.75 },
  { symbol: 'SOL', price: 136.10, change: -2.08 },
  { symbol: 'TRX', price: 0.2982, change: 1.35 },
  { symbol: 'STETH', price: 3082.87, change: -0.94 },
  { symbol: 'DOGE', price: 0.1401, change: -1.65 },
  { symbol: 'FIGR_HELOC', price: 1.03, change: -0.12 },
  { symbol: 'BTC', price: 90799, change: -2.0 },
  { symbol: 'ETH', price: 3145, change: -3.3 }
];

export const SOCIAL_LINKS = {
  x: 'https://x.com/Shizzy',
  youtube: 'https://www.youtube.com/@OnChainRevolution',
  logo: 'https://i.imgur.com/OlBqAPC.png',
  website: 'https://onchainrevolution.io/'
};

export const TAO_ARTICLE: NewsArticle = {
  id: 'tao-next-bitcoin',
  title: "Shizzys Hot Takes: TAO Is the Next Bitcoin, But With Real AI Cash Flows",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 9, 2026",
  summary: "If Bitcoin was the first clean, unstoppable scarcity asset, Bittensor TAO is aiming to be the first scarcity asset that also funds and coordinates real AI production on chain.",
  content: [
    "That is the entire thesis. Not “AI narrative.” Not “a chatbot token.” Real markets, real competition, real emissions, real output. And the first TAO halving has already hit, meaning new supply pressure just got cut in half at the protocol level.",
    "The core TAO x Bitcoin blueprint includes a hard cap of 21 million, scarcity enforced by code, and a halving cycle that reduces new issuance over time. A miner and validator economy competes for rewards in a way explicitly modeled after Bitcoin’s scarcity concept, but it triggers based on supply milestones, not a fixed block countdown.",
    "The first halving window hit in mid December 2025, cutting daily TAO emissions by 50 percent, from 7,200 down to 3,600 TAO per day. This activated when 10.5 million TAO were mined. Bitcoin halvings shock supply for a store of value network; TAO halvings shock supply for a network trying to become the coordination layer for decentralized AI.",
    "Dynamic TAO (dTAO), which went live on February 13, 2025, introduced subnet tokens (alpha tokens). This created a market-driven way for subnets to compete for emissions. You do not just “buy TAO” anymore; you can express conviction in specific AI verticals through these subnet tokens. That is why TAO feels like “Bitcoin plus venture capital.”",
    "Aggressive buildouts like EVM on Bittensor and SDK v10 have lowered friction for builders. While Bitcoin monetizes belief in digital scarcity, TAO monetizes digital scarcity plus machine intelligence production. In TAO, you can win if the base asset wins, or you can win harder if you pick the right subnets where the market prices specific AI products.",
    "Bitcoin proved that engineered scarcity can eat the world. TAO is making a bigger bet: engineered scarcity can fund a decentralized, competitive AI economy. Now that the first halving has happened, the scarcity side just got real. If demand keeps climbing while issuance shrinks, TAO becomes the essential place where AI builders and capital stay."
  ],
  imageUrl: "https://i.imgur.com/nZVlgj9_d.jpeg?maxwidth=520&shape=thumb&fidelity=high",
  snapshots: [
    { asset: "TAO", price: "$342.15", description: "Native asset of the Bittensor decentralized AI network" },
    { asset: "EMISSIONS", price: "3,600/DAY", description: "Post-halving daily TAO supply issuance" },
    { asset: "ALPHA", price: "VARIES", description: "Market-priced subnet tokens under dTAO" }
  ]
};

export const JAM_ARTICLE: NewsArticle = {
  id: 'jam-polkadot-2026',
  title: "JAM: Gavin Wood’s Blueprint for Polkadot’s Next Era",
  category: "TECH ANALYSIS",
  author: "Shizzy",
  timestamp: "JANUARY 9, 2026",
  summary: "JAM stands for Join Accumulate Machine. It is Gavin Wood’s big redesign idea for what comes after the Polkadot relay chain. The goal is simple: turn Polkadot into a general-purpose, verifiable compute platform.",
  content: [
    "JAM stands for Join Accumulate Machine. It is Gavin Wood’s big redesign idea for what comes after the Polkadot relay chain. The goal is simple to say and hard to build: turn Polkadot into a general-purpose, verifiable compute platform where many kinds of “services” can run in parallel, not just blockchains that fit a single template.",
    "Polkadot has always pushed shared security and parallel execution. JAM takes that further by making the core resource “coretime” feel more like programmable compute capacity. Instead of asking teams to fit inside rigid lanes, JAM pushes toward a world where the network can verify useful work at scale and settle the results cleanly.",
    "JAM treats applications as services that accept work, compute results, then update state. Join is the part that helps connect work and outputs into a coherent flow. Accumulate is the part that commits the resulting updates into the service state. A key theme is splitting heavy computation from the final on-chain state update. That design is meant to keep the chain from choking while still keeping the result verifiable and secured by the network.",
    "JAM is not just a feature upgrade. It is a new base model: more flexibility for builders than the classic “one chain, one VM” approach, more emphasis on parallel compute and verifiable workloads, and a push toward multiple independent implementations so the system is harder to break and easier to audit.",
    "The JAM ecosystem is actively in “implementation mode,” with multiple teams building independent clients against the spec and running conformance-style testing. Tooling and test infrastructure around JAM has been expanding, with an emphasis on proving that different implementations behave the same under stress.",
    "The Shizzy take: JAM is Polkadot leaning all the way into what it has always been best at: parallelism and shared security, but with a much more flexible developer surface. If this lands, it reframes the conversation from “which chain is fastest” to “which network can verify and settle the most useful work, at scale.”"
  ],
  imageUrl: "https://i.imgur.com/KtZIDIs.jpeg",
  snapshots: [
    { asset: "DOT", price: "$2.08", description: "Native utility token for the Polkadot ecosystem" },
    { asset: "CORETIME", price: "N/A", description: "The primary resource in the JAM architecture" },
    { asset: "KSM", price: "$7.55", description: "Kusama canary network for pre-JAM staging" }
  ]
};

export const CYCLE_ARTICLE: NewsArticle = {
  id: 'cycle-roadmap-2025-2027',
  title: "If 2025 Felt Like 2019… What 2026 Could Have in Store, and Why 2027 Might Be the 2021 Style Blow Off",
  category: "MACRO THESIS",
  author: "Shizzy",
  timestamp: "JANUARY 9, 2026",
  summary: "Looking into the future, if this framework is correct, then the entire next cycle can be mapped with one simple question: 2025 felt like 2019. So will 2026 feel like 2020?",
  content: [
    "Because if 2026 becomes a true 2020 style liquidity comeback year, then the next logical step is obvious: 2027 starts to look like the 2021 blow off top year. Not guaranteed. Not a promise. Just the cleanest macro rhythm that markets tend to follow when liquidity returns in waves.",
    "2019 was a recovery year, not a mania year. Bitcoin recovered and regained confidence, but liquidity was still tight even as sentiment improved. Breakouts happened, but follow through was inconsistent. Altcoins mostly lagged and narratives rotation fast. Traders got bullish early and got chopped up. That is exactly what 2025 felt like: Transitional. Constructive. Annoying.",
    "If 2026 rhymes with 2020, the year will not necessarily start euphoric. It will start like a pressure cooker. The defining feature would be liquidity returning in a real way, not just talk. If that happens, 2026 could see Bitcoin trending more cleanly with fewer fakeouts, pullbacks becoming buyable instead of traps, and capital rotating from Bitcoin into higher beta assets.",
    "For the 2026 = 2020 comparison to hold, it needs real confirmation: Sustained easing, credit conditions loosening, and broader risk-on across stocks and crypto. When those align, crypto does what it always does: It reprices fast.",
    "If 2026 becomes the liquidity comeback year, then 2027 becomes the year where the cycle typically goes too far. Everyone becomes a genius, risk management disappears, leverage returns, and projects get funded on vibes. Every pullback gets bought until the final one does not. The blow off top is not just price; it is behavior.",
    "Looking into the future, if this thesis is correct: 2025 was the 2019 style recovery, 2026 is the year liquidity confirms the cycle, and 2027 has the potential to be the blow off top. Not a prediction carved in stone, but a framework built on how liquidity cycles historically behave. Liquidity sets the stage. Bitcoin leads the cast. Altcoins arrive for the final act. And the final act is usually the loudest."
  ],
  imageUrl: "https://i.imgur.com/21o7ilA.jpeg",
  snapshots: [
    { asset: "LIQUIDITY", price: "EXPANDING", description: "Global M2 growth is the ultimate stage setter" },
    { asset: "BTC DOM", price: "58.2%", description: "Bitcoin leading the cast before the rotation" },
    { asset: "ALT INDEX", price: "LOW", description: "Waiting for the final act in 2027" }
  ]
};

export const HOT_STORIES: HotStory[] = [
  { id: 'tao', title: 'TAO Is the Next Bitcoin, But With Real AI Cash Flows', timeAgo: 'Just now' },
  { id: 'cycle', title: 'If 2025 Felt Like 2019… The 2026 Liquidity Roadmap', timeAgo: '1 hour ago' },
  { id: 'jam', title: 'JAM: Gavin Wood’s Blueprint for Polkadot’s Next Era', timeAgo: '3 hours ago' }
];