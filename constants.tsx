import { CoinData, HotStory, NewsArticle } from './types.ts';

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

export const AGENT_CYCLE_ARTICLE: NewsArticle = {
  id: 'agent-money-cycle-x402',
  title: "Shizzy Hot Take: x402 + ERC-8004 Is the Agent Money Cycle",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 11, 2026",
  summary: "DeFi took off when humans learned how to be their own bank. x402 and ERC-8004 can take off faster because humans are not the main users. Agents are.",
  content: [
    "DeFi took off when humans learned how to be their own bank. x402 and ERC-8004 can take off faster because humans are not the main users. Agents are. That is the difference. If DeFi was “wallets + apps + incentives,” this next leg is “agents + APIs + per call payments.” The distribution channel is not retail onboarding. The distribution channel is software that already runs everything.",
    "x402 is the cleanest idea in crypto in years: make HTTP 402 “Payment Required” real. The flow is simple: An agent calls an API. The server replies “402” with the price and terms. The agent pays in stablecoins. The agent retries and gets the resource. No subscription. No account. No invoice. No payment portal. No human clicking a checkout button.",
    "x402 turns the internet into a vending machine for compute, data, storage, and actions. If you understand usage based pricing, you understand x402. It is usage based pricing that agents can execute automatically. ERC-8004 is the missing trust layer for the agent economy. Payments do not matter if the buyer cannot answer: Who is this agent? What has it done before? Can I verify the work? What happens if it lies?",
    "ERC-8004 pushes a simple structure: Identity (a portable agent identifier), Reputation (standardized feedback signals), and Validation (pluggable proofs and verification paths when the stakes increase). Think “agent registry + receipts + optional proof.” It is not trying to force one global reputation score. It is trying to make trust composable.",
    "x402 answers “How do agents pay?” ERC-8004 answers “Who do agents pay, and why?” Put them together and you get a real market: Discover an agent or service, evaluate trust quickly, pay per call instantly, and escalate validation only when needed. That is the blueprint for open agent markets that can outpace DeFi adoption. Because this time the users are workflows, not people.",
    "Why this can move faster than DeFi? Agent commerce requires one thing: a library update. Once an agent framework supports “pay on 402,” any developer can monetize any endpoint instantly. That is not a new app. That is a new default behavior on the internet. Track the choke points: the rails everyone routes through, the budget layer everyone needs, and the trust middleware enterprises will demand."
  ],
  imageUrl: "https://i.imgur.com/VarXXlg.jpeg",
  snapshots: [
    { asset: "x402", price: "METERED", description: "HTTP 402 integration for usage-based agent payments" },
    { asset: "ERC-8004", price: "TRUST", description: "Identity and reputation layer for machine commerce" },
    { asset: "BILLING", price: "INSTANT", description: "Direct stablecoin settlement for API calls" }
  ]
};

export const PROVEX_ARTICLE: NewsArticle = {
  id: 'provex-richard-heart',
  title: "Shizzys Hot Takes: Can ProveX Be Richard Heart’s Next 10,000x?",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 10, 2026",
  summary: "ProveX is being pitched as a proof-based settlement system that replaces trust with cryptographic verification, plus a token model that tries to turn usage into buy pressure and burns.",
  content: [
    "Every cycle, crypto prints a new kind of “maybe impossible” trade. Sometimes it is a meme. Sometimes it is a new chain. Sometimes it is a new primitive that changes how value moves. ProveX is being pitched as that third category: a proof-based settlement system that replaces trust with cryptographic verification, plus a token model that tries to turn usage into buy pressure and burns.",
    "From the project’s own public pages, ProveX is described as a “proof-based settlement” idea where two parties prove they did what they said they did, then settlement happens without a middleman. The site and related pages describe things like zero-knowledge proof systems, a browser extension, and removing counterparty risk in transactions.",
    "A 10,000x is not magic. It is math plus time plus distribution. To do that, you usually need a tiny market cap, a simple story, real product demand, and a reflexive loop where usage drives buy pressure. ProveX is trying to pitch this reflexive loop directly with usage-linked buy and burn dynamics. If ProveX delivers proof, it can print a historic run. If it does not, the market will treat it like it treats everything else."
  ],
  imageUrl: "https://i.imgur.com/WaNxbBJ.png",
  snapshots: [
    { asset: "PROVEX", price: "SACRIFICE", description: "Currently in the contribution phase via provex.info" },
    { asset: "MODEL", price: "REFLATIONARY", description: "Proposed usage-linked buy and burn dynamics" },
    { asset: "PLATFORM", price: "PULSECHAIN", description: "Primary ecosystem for initial project deployment" }
  ]
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
    "The core TAO x Bitcoin blueprint includes a hard cap of 21 million, scarcity enforced by code, and a halving cycle that reduces new issuance over time. A miner and validator economy competes for rewards in a way explicitly modeled after Bitcoin’s scarcity concept."
  ],
  imageUrl: "https://i.imgur.com/l64LmNJ.jpeg",
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
    "JAM treats applications as services that accept work, compute results, then update state. Join is the part that helps connect work and outputs into a coherent flow. Accumulate is the part that commits the resulting updates into the service state."
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
    "Because if 2026 becomes a true 2020 style liquidity comeback year, then the next logical step is obvious: 2027 starts to look like the 2021 blow off top year. Not guaranteed. Not a promise. Just the cleanest macro rhythm that markets tend to follow when liquidity returns in waves."
  ],
  imageUrl: "https://i.imgur.com/21o7ilA.jpeg",
  snapshots: [
    { asset: "LIQUIDITY", price: "EXPANDING", description: "Global M2 growth is the ultimate stage setter" },
    { asset: "BTC DOM", price: "58.2%", description: "Bitcoin leading the cast before the rotation" },
    { asset: "ALT INDEX", price: "LOW", description: "Waiting for the final act in 2027" }
  ]
};

export const HOT_STORIES: HotStory[] = [
  { id: 'agent-money', title: 'x402 + ERC-8004 Is the Agent Money Cycle', timeAgo: 'Just now' },
  { id: 'provex', title: 'Can ProveX Be Richard Heart’s Next 10,000x?', timeAgo: '2 hours ago' },
  { id: 'tao', title: 'TAO Is the Next Bitcoin, But With Real AI Cash Flows', timeAgo: '5 hours ago' },
  { id: 'cycle', title: 'If 2025 Felt Like 2019… The 2026 Liquidity Roadmap', timeAgo: '8 hours ago' },
  { id: 'jam', title: 'JAM: Gavin Wood’s Blueprint for Polkadot’s Next Era', timeAgo: '12 hours ago' }
];