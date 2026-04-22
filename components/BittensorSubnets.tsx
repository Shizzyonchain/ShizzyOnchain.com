import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Filter, X, ChevronDown, ExternalLink, Github, Users, Calendar, Info, Activity, Twitter, ArrowRight, Zap, MessageSquare, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin } from '../types.ts';

interface SubnetDetails {
  website?: string;
  github?: string;
  twitter?: string;
  partnerships?: string[];
  recentUpdates?: string[];
  extendedDescription: string;
  shizzyTake?: string;
  marketCap?: string;
  shizzyScore?: number;
}

interface Subnet {
  sn: number;
  name: string;
  category: string;
  description: string;
  teamStatus?: "Documented Team" | "Undocumented Team";
  details?: SubnetDetails;
}

const SUBNETS_DATA: Subnet[] = [
  { 
    sn: 1, 
    name: "Apex", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized AI agent infrastructure pushing the boundaries of agentic reasoning to reduce hallucinations.",
    teamStatus: "Documented Team",
    details: {
      website: "https://apex.macrocosmos.ai",
      github: "https://github.com/macrocosm-os/apex",
      twitter: "https://x.com/Apex_SN1",
      extendedDescription: "Apex is a Bittensor subnet that serves as a decentralized infrastructure for AI agents. It incentivizes miners to develop workflows that minimize hallucinations and maximize reasoning quality in large language models. The network operates as a competitive arena where agents are tested on their ability to use tools and resolve complex queries accurately.",
      partnerships: ["OpenTensor Foundation", "SN13 Data Universe"],
      recentUpdates: [
        "Routine version bump to 4.1.19",
        "Automated release tag generation",
        "Cleaned up dev dependencies"
      ],
      shizzyTake: "This is noise. Three version bumps with zero merged PRs and no visible feature work is the opposite of a signal. At $11.4M mcap with a flat token, the team should be shipping real capability or fixing real problems—not spinning version numbers.",
      marketCap: "$11.6M",
      shizzyScore: 57
    }
  },
  { 
    sn: 2, 
    name: "DSperse", 
    category: "Compute", 
    description: "Decentralized framework enabling verifiable AI inference across a network of nodes using zero-knowledge cryptography.",
    teamStatus: "Documented Team",
    details: {
      website: "https://subnet2.inferencelabs.com",
      github: "https://github.com/inference-labs-inc/subnet-2",
      twitter: "https://x.com/inference_labs",
      extendedDescription: "DSperse (formerly Omron) is a distributed inference network that allows AI models to run on decentralized miners while producing cryptographic proofs (ZK-proofs) of correctness. This architecture ensures that AI-generated outputs are trustless and verifiable without needing to re-run the compute.",
      partnerships: ["Corcel Labs", "Inference Labs"],
      recentUpdates: [
        "Shipped validator permit enforcement",
        "Probabilistic partial-proof sampling (prove_pct)",
        "Preflight satisfiability checks for slice activation",
        "WHIR PCS cryptographic upgrade",
        "Multi-config circuit auto-detection"
      ],
      shizzyTake: "DSperse is executing high-impact production hardening. The introduction of partial-proof sampling allows clients to trade certainty for cost, unlocking new economic tiers. The team is shipping surgical engineering fixes to real-world bottlenecks, signaling a move from beta to a robust, production-ready inference layer.",
      marketCap: "$7.3M",
      shizzyScore: 64
    }
  },
  { 
    sn: 3, 
    name: "Deprecated", 
    category: "Unknown", 
    description: "This subnet is currently deprecated.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://deprecated.com",
      github: "https://github.com",
      extendedDescription: "This subnet is currently deprecated and not accepting new tasks or rewards.",
      shizzyTake: "Dead money. This subnet is deprecated and currently only exists as a placeholder. No active development or rewards makes this a zero-conviction hold. Avoid.",
      marketCap: "$25.3M",
      shizzyScore: 40
    }
  },
  { 
    sn: 4, 
    name: "Targon", 
    category: "Compute", 
    description: "Facilitating a decentralized marketplace for digital commodities related to AI to process and generate information.",
    teamStatus: "Documented Team",
    details: {
      website: "https://targon.com",
      github: "https://github.com/manifold-inc/targon",
      twitter: "https://x.com/TargonCompute",
      extendedDescription: "Bittensor’s Subnet 4, known as Targon, is an integral component of the Bittensor network, designed to facilitate a decentralized marketplace for a specific category of digital commodities related to artificial intelligence (AI). This subnet enhances AI systems' ability to process and generate information across various data types.",
      partnerships: ["Manifold Labs", "Akash Network"],
      recentUpdates: [
        "Reverted weight limit changes to allow higher rewards (#TGN-104)",
        "Unified API released with streaming support",
        "TTFT-optimized inference engine"
      ],
      shizzyTake: "Targon is a $66M mcap subnet that stays quiet but ships significant underlying infrastructure. While other subnets chase hype, Targon is hardening the marketplace for digital AI commodities, ensuring that 'work' corresponds to real economic value.",
      marketCap: "$66.8M",
      shizzyScore: 51
    }
  },
  { 
    sn: 5, 
    name: "Hone", 
    category: "AI Training", 
    description: "Decentralized AI research subnet focused on training models with hierarchical learning and reasoning toward AGI.",
    teamStatus: "Documented Team",
    details: {
      website: "https://hone.training",
      github: "https://github.com/manifold-inc/hone",
      twitter: "https://x.com/traininghone",
      extendedDescription: "Hone (Subnet-5 of the Bittensor network) is a decentralized AI research subnet focused on training a new generation of AI models with hierarchical learning and reasoning toward Artificial General Intelligence (AGI). In essence, Hone’s mission is to “pioneer a new path to AGI by harnessing hierarchical learning and reasoning, through an open network.”",
      partnerships: ["Manifold Labs", "OpenTensor"],
      recentUpdates: ["Hierarchical learning v2", "AGI roadmap released"],
      shizzyTake: "Hone is chasing the 'AGI' dream with hierarchical learning. While the roadmap is ambitious, the $16M mcap suggests investors are cautious about the timeline to usable models. The team is shipping process-level milestones, but we need to see model performance metrics.",
      marketCap: "$16.8M",
      shizzyScore: 40
    }
  },
  { 
    sn: 6, 
    name: "Numinous", 
    category: "Predictive Systems", 
    description: "Decentralized forecasting protocol designed to produce superhuman predictive intelligence through agent aggregation.",
    teamStatus: "Documented Team",
    details: {
      website: "https://numinouslabs.io",
      github: "https://github.com/numinouslabs/numinous",
      twitter: "https://x.com/numinous_ai",
      extendedDescription: "Numinous (Subnet 6 of the Bittensor network) is a decentralized forecasting protocol designed to produce superhuman predictive intelligence. In simple terms, it aggregates many AI agents (autonomous forecasting models) and has them compete and evolve to become extremely accurate forecasters. The subnet moves beyond just collecting individual guesses to actively weighting and refining predictions.",
      partnerships: ["Macrocosmos", "SN18 Forecasting"],
      recentUpdates: [
        "Scheduled release sync v2026.04.15",
        "Rebalanced validator weight parameters",
        "Fixed scoring resolution edge cases"
      ],
      shizzyTake: "Numinous is trading at a $5.6M valuation with a token down 5.3% today while the team ships nothing—not even a real PR, just automated plumbing. This is a sign the team is on maintenance mode, not building. Stay away until you see a genuine product commit.",
      marketCap: "$5.7M",
      shizzyScore: 54
    }
  },
  { 
    sn: 7, 
    name: "Allways", 
    category: "Infrastructure", 
    description: "Trustless cross-chain transaction layer with collateral-enforced settlement.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://all-ways.io",
      github: "https://github.com/entrius/allways",
      twitter: "https://x.com/VenturaLabs",
      extendedDescription: "Allways is a universal transaction layer that enables atomic swaps across different blockchains by binding users' source and destination addresses to prevent interception. It coordinates cross-chain settlement without custodial risk by using a decentralized validator quorum.",
      recentUpdates: [
        "Reduced sync interval to 12s for faster metadata propagation",
        "Crown-time rewards model overhaul",
        "Fixed request_votes storage leak"
      ],
      shizzyTake: "Pure noise. A $4.4M mcap subnet with zero merged PRs and one contributor touching a timer and a README is dead air. Until there's actual model development or performance gains, this is just another slot-warming token.",
      marketCap: "$4.4M",
      shizzyScore: 18
    }
  },
  { 
    sn: 8, 
    name: "Vanta", 
    category: "DeFi / Trading", 
    description: "Decentralized proprietary trading network built to crowdsource advanced trading strategies and signals.",
    teamStatus: "Documented Team",
    details: {
      website: "https://vantanetwork.io",
      github: "https://github.com/taoshidev/vanta-network",
      twitter: "https://x.com/VantaTrading",
      extendedDescription: "Vanta (formerly PTN) is a decentralized proprietary trading network built on Bittensor. It crowdsources advanced strategies from a global pool of participants and converts them into high-quality signals, effectively operating as a decentralized, trustless hedge fund.",
      partnerships: ["Taoshi Labs", "Global Prop Firms"],
      recentUpdates: [
        "Fixed subaccount elimination slashing bug (#741)",
        "Removed entity registration collateral fee",
        "Improved error messaging for max position orders",
        "Equities asset class support ready",
        "14 new index ETFs added"
      ],
      shizzyTake: "Vanta is shipping real operational fixes that flatten onboarding friction. Slashing bug fixes are critical for economic security. However, at $39M mcap the market isn't reacting yet. Bug fixes are table-stakes; Vanta needs to ship user-facing execution features to move the needle. Hold in 'competent but quiet' category.",
      marketCap: "$39.2M",
      shizzyScore: 60
    }
  },
  { 
    sn: 9, 
    name: "IOTA", 
    category: "AI Training", 
    description: "Specialized subnet designed to incentivize the open training of large foundation models on massive web datasets.",
    teamStatus: "Documented Team",
    details: {
      website: "https://iota.macrocosmos.ai",
      github: "https://github.com/macrocosm-os/iota",
      twitter: "https://x.com/IOTA_SN9",
      extendedDescription: "IOTA (previously known as Pre-Training) is a specialized subnet of the Bittensor network designed to incentivize the open training of large language models (“foundation models”) on a massive web dataset. In August 2024, Bittensor's Subnet 9 (SN9) demonstrated that a decentralized network of incentivized, permissionless actors could successfully train massive neural networks.",
      partnerships: ["Macrocosmos", "SN13 Data Universe"],
      recentUpdates: [
        "Merged v4.0.0 release candidate into main branch",
        "1B parameter training milestone", 
        "Integrated SN13 datasets"
      ],
      shizzyTake: "This is a process signal, not a product signal. Two merge commits with no visible feature work suggests either: (a) the real development happened in branches we can't see, or (b) this was primarily refactoring/testing. A major version jump should mean significant new capability, but the commit messages don't tell us what.",
      marketCap: "$24.4M",
      shizzyScore: 43
    }
  },
  { 
    sn: 10, 
    name: "Swap", 
    category: "DeFi", 
    description: "Cross-chain DeFi platform for seamlessly buying and selling Bittensor subnet tokens from other blockchains.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taofi.com",
      github: "https://github.com/Swap-Subnet/swap-subnet",
      twitter: "https://x.com/_taofi_",
      extendedDescription: "Swap (Bittensor Subnet-10) is a cross-chain DeFi platform that lets users seamlessly buy and sell Bittensor subnet tokens from other blockchains (like Base or Ethereum) in a single transaction. In essence, it bridges liquidity from mainstream chains into Bittensor’s decentralized AI network, making it much easier to acquire or exit “alpha” without complex bridging steps.",
      partnerships: ["TaoFi", "Base Bridge"],
      recentUpdates: ["Cross-chain liquidity v1", "Multi-chain support expanded"]
    }
  },
  { 
    sn: 11,
    name: "TrajectoryRL",
    category: "AI Training",
    description: "AI agent policy optimization via competitive reinforcement learning.",
    teamStatus: "Documented Team",
    details: {
      website: "https://trajrl.com",
      github: "https://github.com/trajectoryRL/trajectoryRL",
      twitter: "https://x.com/TrajectoryRL",
      extendedDescription: "TrajectoryRL is a Bittensor subnet that optimizes AI agent behavior through reinforcement learning (RL)—making agents more cost-effective, safer, and reliable. Miners submit optimized trajectories evaluated by validators in a competitive benchmark environment.",
      recentUpdates: [
        "Rebranded README narrative",
        "Hardened eval framework with timeout handling",
        "Quality-score based incentives (Consensus Protocol v2)",
        "Three-container validator architecture"
      ],
      shizzyTake: "This is noise dressed as activity. Shipping only documentation changes signals stalling engineering momentum. Positioned as an 'RL playground,' but the lack of functional commits + token decline suggests the subnet is treading water. The problem isn't underappreciation, it's underperformance.",
      marketCap: "$13.0M",
      shizzyScore: 56
    }
  },
  { 
    sn: 12, 
    name: "Compute Horde", 
    category: "Compute", 
    description: "Decentralized GPU marketplace supplying compute for AI training and inference.",
    teamStatus: "Documented Team",
    details: {
      website: "https://computehorde.io",
      github: "https://github.com/backend-developers-ltd/ComputeHorde",
      twitter: "https://x.com/ComputeHorde",
      extendedDescription: "Allows providers to sell raw compute power for AI workloads.",
      partnerships: ["Backend Developers Ltd", "SN4 Targon"],
      recentUpdates: [
        "Fixed config naming bug in worker nodes",
        "Synchronous organic job execution refactor",
        "Removed vulnerability scanning from CI/CD pipeline",
        "H100 support metrics expanded"
      ],
      shizzyTake: "This is routine maintenance work by a skeleton crew. Removing vulnerability scanning from CI is a negative signal for a compute subnet. At $6.4M mcap with no PR activity, the team is in stabilization mode. Market is pricing this correctly as early-stage infrastructure with minimal near-term upside.",
      marketCap: "$6.4M",
      shizzyScore: 18
    }
  },
  { 
    sn: 13, 
    name: "Data Universe", 
    category: "Data", 
    description: "Decentralized data layer powering AI training across subnets.",
    teamStatus: "Documented Team",
    details: {
      website: "https://datauniverse.macrocosmos.ai",
      github: "https://github.com/macrocosm-os/data-universe",
      twitter: "https://x.com/Data_SN13",
      extendedDescription: "Data Universe is Bittensor's primary data layer, specializing in the validation and rewarding of social media scraping at scale. It creates a distributed source of truth for AI training sets across the entire ecosystem.",
      partnerships: ["SN1 Apex", "SN9 Pretraining"],
      recentUpdates: [
        "Fixed major validator bug dropping 95% of work",
        "Strict social media schema validation",
        "Size-weighted sampling (>1MB) to prevent fraud",
        "Pre-reward validation gates implementation",
        "100B+ data points across social streams"
      ],
      shizzyTake: "Data Universe is shipping protocol-level anti-fraud infrastructure. Miners now have to run legitimate operations or get zeroed, which significantly raises the subnet's barrier to entry and data quality. This is the unglamorous work that makes a data subnet truly valuable at scale.",
      marketCap: "$9.1M",
      shizzyScore: 69
    }
  },
  {
    sn: 14,
    name: "TAOHash",
    category: "Mining",
    description: "Decentralized hashrate routing and mining optimization.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taohash.ai",
      github: "https://github.com/latent-to/taohash",
      twitter: "https://x.com/taohash",
      extendedDescription: "TAOHash focuses on decentralized hashrate routing and mining optimization for the Bittensor network.",
      recentUpdates: [
        "Version bump to 0.4.15 (no substantive logic change)",
        "Optimized hashrate routing for higher-difficulty mining",
        "Integrated multi-pool failover support"
      ],
      shizzyTake: "Noise only. Pushing version numbers with zero accompanying code changes is the hallmark of 'release theater' for small-cap subnets. TAOHash remains a high-risk, low-information play until we see actual merged features that justify the $12M valuation.",
      marketCap: "$12.4M",
      shizzyScore: 31
    }
  },
  {
    sn: 15,
    name: "ORO",
    category: "AI Agents / AI Tools",
    description: "Open AI agent benchmark for e-commerce and shopping tasks.",
    teamStatus: "Documented Team",
    details: {
      website: "https://oroagents.com",
      github: "https://github.com/ORO-AI/oro",
      twitter: "https://x.com/oroagents",
      extendedDescription: "ORO is a specialized agent framework and benchmark focused on autonomous commerce. Agents compete to negotiate, compare prices, and execute transactions on behalf of users, creating a market for high-performance AI shopping assistants.",
      recentUpdates: [
        "Fixed critical voucher bug and refactored scoring logic",
        "Cleaned 615 lines of dead code",
        "Fixed memory leaks and scaled validator sandbox workers to 15",
        "Dynamic judge model selection via Chutes utilization API",
        "Prompt injection defense in reasoning judge"
      ],
      shizzyTake: "This is solid, necessary work that should have been done weeks ago. Fixing a correctness bug in the reward-scoring path is material for validator trust. However, it's defensive engineering—fixing broken things, not building new ones. At $3.3M mcap with token down 8.9%, the team is executing competently but shipping incremental quality improvements.",
      marketCap: "$3.3M",
      shizzyScore: 57
    }
  },
  {
    sn: 16,
    name: "BitAds",
    category: "AI Agents / AI Tools",
    description: "Pay-per-verified-conversion advertising network.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitads.ai",
      github: "https://github.com/FirstTensorLabs/BitAds",
      twitter: "https://x.com/bitads_ai",
      extendedDescription: "BitAds provides an AI-driven, decentralized advertising network that rewards verified conversion metrics."
    }
  },
  {
    sn: 17,
    name: "404—GEN",
    category: "Generative AI",
    description: "Democratized AI-generated 3D content for games and virtual worlds.",
    teamStatus: "Documented Team",
    details: {
      website: "https://404.xyz",
      github: "https://github.com/404-Repo/404-gen-subnet",
      twitter: "https://x.com/404gen_",
      extendedDescription: "404—GEN provides democratized AI-generated 3D content for games and virtual worlds using decentralized compute.",
      recentUpdates: [
        "Integrated Discord notifications for competition updates",
        "Optimized 3D asset validation speed",
        "Refactored generative scoring weights"
      ],
      shizzyTake: "This is operational maintenance, not innovation. Adding Discord notifications to a $17M subnet while the token is down signals a team focused on internal hygiene rather than shipping user-facing features or protocol breakthroughs. A boring signal in a sideways market—price the token accordingly.",
      marketCap: "$17.5M",
      shizzyScore: 44
    }
  },
  { 
    sn: 18, 
    name: "Zeus", 
    category: "Predictive Systems", 
    description: "Time-series forecasting and market analysis powered by Taoshi.",
    teamStatus: "Documented Team",
    details: {
      website: "https://zeussubnet.com",
      github: "https://github.com/Orpheus-AI/Zeus",
      twitter: "https://x.com/zeussubnet",
      extendedDescription: "Zeus (by Taoshi) provides predictive intelligence for financial and environmental markets. It trains and deploys neural networks to predict patterns beyond existing state-of-the-art accuracy, creating a competitive market for weather and market intelligence.",
      partnerships: ["Taoshi Labs", "SN8 Vanta"],
      recentUpdates: [
        "Fixed query retry logic (#33)",
        "Collusion detection mechanism hardening",
        "Rebalanced rewards for long-horizon forecasts",
        "Germany market geographic focus shift"
      ],
      shizzyTake: "Competent hygiene, but invisible to the market. Fixing retries is engineering 101 for a high-traffic inference network. It shows the team is maintaining the pipes, but it doesn't solve the discovery problem for Zeus as an institutional tool.",
      marketCap: "$2.1M",
      shizzyScore: 38
    }
  },
  { 
    sn: 19, 
    name: "blockmachine", 
    category: "Generative AI", 
    description: "Multi-modal inference and image generation suite.",
    teamStatus: "Documented Team",
    details: {
      website: "https://blockmachine.io",
      github: "https://github.com/taostat/blockmachine",
      twitter: "https://x.com/blockmachine_io",
      extendedDescription: "A collaboration between Corcel and Omega Labs for high-fidelity generative tasks.",
      partnerships: ["Omega Labs", "Corcel"],
      recentUpdates: [
        "Refined prompt engineering for resolution variety",
        "Neural inference v2 pipeline refactor",
        "Optimized visual reasoning weights"
      ],
      shizzyTake: "Blockmachine is shipping visual reasoning weights and neural inference-v2. This isn't just prompts; it's protocol-level refactoring for generative tasks. At $16M mcap, they are becoming the go-to for high-fidelity generative AI on Bittensor.",
      marketCap: "$16.6M",
      shizzyScore: 50
    }
  },
  { 
    sn: 20, 
    name: "GroundLayer", 
    category: "AI Evaluation", 
    description: "Decentralized competition environment for benchmarking fine-tuned tool-calling LLMs and generating index structures.",
    teamStatus: "Documented Team",
    details: {
      website: "https://groundlayer.xyz",
      twitter: "https://x.com/GroundLayerHQ",
      extendedDescription: "GroundLayer (Subnet 20) orchestrates a decentralized, competition-driven environment for evaluating and rewarding fine-tuned tool-calling language models (LLMs). Originally launched as BitAgent and later rebranded to Bounty Hunter, SN20 focuses on trustless AI model benchmarking using the Berkeley Function Calling Leaderboard (BFCL) tasks. Validators execute submissions offline, ensuring unalterable performance tracking. Additionally, it implements a structured capital marketplace enabling subnet index products.",
      partnerships: ["GoGoAgent", "MSP Tech"],
      recentUpdates: [
        "Added debug task logging to validator heartbeats",
        "BFCL validation loop optimized",
        "Capital-market protocol introduced"
      ],
      shizzyTake: "Pure maintenance noise. Debugging logs on a $0.8M mcap token is 'keeping the lights on' territory. There is no evidence here of new features, scaling, or adoption. The team is still in the sandbox.",
      marketCap: "$843K",
      shizzyScore: 32
    }
  },
  { 
    sn: 21, 
    name: "AdTAO", 
    category: "AI Training", 
    description: "AI-optimized Google Ads campaign management and routing.",
    teamStatus: "Documented Team",
    details: {
      website: "https://adtao.ai",
      github: "https://github.com/Ad-TAO/adtao",
      twitter: "https://x.com/Ad_TAO",
      extendedDescription: "AdTAO is a Bittensor subnet specifically designed to optimize digital advertising workflows. It uses AI to manage Google Ads campaigns, ensuring efficient hashrate routing for marketing tasks and performance-based rewards for miners.",
      partnerships: ["Google Cloud", "FirstTensor Labs"],
      recentUpdates: ["Batch conversion tracking v2", "Real-time bidding optimized"]
    }
  },
  { 
    sn: 22, 
    name: "Desearch", 
    category: "Search / Information", 
    description: "Decentralized search index and unbiased information discovery.",
    teamStatus: "Documented Team",
    details: {
      website: "https://desearch.ai",
      github: "https://github.com/5cube-ai/desearch",
      twitter: "https://x.com/desearch_ai",
      extendedDescription: "Desearch is a decentralized search engine where independent miners compete to return high-quality search results across Twitter and the broader web. It aims to create a censorship-resistant and transparent search layer that distributes query processing and reward ranking across the network.",
      partnerships: ["5Cube Labs", "SN13 Data Universe"],
      recentUpdates: [
        "Shipped concurrency-based scoring (UID pressure reduction)",
        "Organic traffic weighting introduced",
        "SQLite-backed ramp/decay mechanism",
        "Twitter API v2 enhancement (view/reply/quote scoring)",
        "Integrated Redis caching layer for queries"
      ],
      shizzyTake: "Desearch is shipping protocol-level improvements that solve Bittensor's most painful scaling problem: multi-UID spam. The organic weighting means the leaderboard now reflects real user demand, moving Desearch from a toy ranking system to a real search engine.",
      marketCap: "$5.4M",
      shizzyScore: 82
    }
  },
  { 
    sn: 23, 
    name: "Trishool", 
    category: "AI Safety", 
    description: "Collaborative AI alignment protocol for safe superintelligence development.",
    teamStatus: "Documented Team",
    details: {
      website: "https://trishool.ai",
      github: "https://github.com/trishool-ai/trishool",
      twitter: "https://x.com/Trishool_AI",
      extendedDescription: "Trishool focuses on the critical problem of AI safety and alignment. It provides an incentivized framework for researchers to contribute to the development of safe and reliably aligned artificial intelligence.",
      partnerships: ["Alignment Research Center", "Macrocosmos"],
      recentUpdates: ["Alignment benchmark v2", "RLHF pipeline integrated"]
    }
  },
  { 
    sn: 24, 
    name: "Quasar", 
    category: "Compute / Data", 
    description: "Scalable data scraping and real-time processing network.",
    teamStatus: "Documented Team",
    details: {
      website: "https://omega-labs.ai",
      github: "https://github.com/omega-labs-inc/omega-scraping",
      twitter: "https://x.com/omega_ai_labs",
      extendedDescription: "Omega Labs' Quasar provides the data-scraping backbone for the Bittensor ecosystem, enabling real-time access to web data for training multimodals.",
      partnerships: ["Omega Labs", "SN13 Data Universe"],
      recentUpdates: ["Real-time stream indexing", "Compute efficiency boost"]
    }
  },
  { 
    sn: 25, 
    name: "Mainframe", 
    category: "Infrastructure", 
    description: "Decentralized CDN and high-performance AI inference engine.",
    teamStatus: "Documented Team",
    details: {
      website: "https://mainframelabs.io",
      github: "https://github.com/mainframe-labs/mainframe",
      twitter: "https://x.com/MainframeLabs",
      extendedDescription: "Mainframe acts as a global, permissionless content delivery network (CDN) and inference engine that ensures AI models and training data can be served quickly and reliably.",
      partnerships: ["Mainframe Labs", "SN12 Compute Horde"],
      recentUpdates: ["The Portal gateway live", "Orbit protocol v1"]
    }
  },
  { 
    sn: 26, 
    name: "beqar", 
    category: "Data", 
    description: "Decentralized web scraping network with trustless data collection.",
    teamStatus: "Documented Team",
    details: {
      website: "https://beqar.ai",
      github: "https://github.com/beqar-labs/beqar",
      twitter: "https://x.com/beqar_ai",
      extendedDescription: "Beqar (formerly Kinitro) is a decentralized web scraping network where miners compete to fetch website data and validators verify quality. It uses crypto incentives to coordinate distributed data collection without centralized server bottlenecks.",
      recentUpdates: [
        "Shipped DDoS-resistant scraping transport layer",
        "Implemented tokenized registration/access control",
        "Deterministic synthetic URL sampling per epoch",
        "Integrated validator/miner registration handlers"
      ],
      shizzyTake: "Beqar is shipping real infrastructure defenses like DDoS resistance and tokenized access control—table-stakes for any production scraper. If this works at scale, Beqar becomes the only viable decentralized competitor to centralized scraping APIs.",
      marketCap: "$4.9M",
      shizzyScore: 23
    }
  },
  { 
    sn: 27, 
    name: "Nodexo", 
    category: "Infrastructure", 
    description: "Decentralized marketplace for high-performance RPC nodes and validator infrastructure.",
    teamStatus: "Documented Team",
    details: {
      website: "https://nodexo.io",
      github: "https://github.com/nodexo/nodexo",
      twitter: "https://x.com/Nodexo_",
      extendedDescription: "Nodexo provides a decentralized layer for managing and rewarding high-performance RPC infrastructure across multiple blockchains, starting with Bittensor.",
      partnerships: ["Nodexo Labs", "Targon"],
      recentUpdates: ["Multi-chain RPC support", "Validator dashboard v1"]
    }
  },
  { 
    sn: 28, 
    name: "gm", 
    category: "Generative AI", 
    description: "Multimodal generative AI platform optimized for text-to-image synthesis.",
    teamStatus: "Documented Team",
    details: {
      website: "https://omega-labs.ai",
      github: "https://github.com/omega-labs-inc/gm",
      twitter: "https://x.com/omega_ai_labs",
      extendedDescription: "gm is a decentralized generative AI platform optimized for creating studio-grade multimodal content, including high-fidelity images and video.",
      partnerships: ["Omega Labs", "SN19 blockmachine"],
      recentUpdates: ["SDXL integration", "Real-time generation loop"]
    }
  },
  { 
    sn: 29, 
    name: "Coldint", 
    category: "AI Training", 
    description: "Research subnet focused on advancing state-of-the-art small language models (SLMs).",
    teamStatus: "Documented Team",
    details: {
      website: "https://coldint.macrocosmos.ai",
      github: "https://github.com/macrocosm-os/coldint",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Coldint focuses on the efficiency of small language models, proving that smaller models can achieve high performance when trained on high-quality synthetic and curated data.",
      partnerships: ["Macrocosmos", "SN9 IOTA"],
      recentUpdates: ["SLM-v2 training complete", "Optimized inference engine"]
    }
  },
  { 
    sn: 30, 
    name: "Pending", 
    category: "Other", 
    description: "Reserved for sale or burn to UID 1.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "This subnet is currently in a pending state, often reserved for new entrants or scheduled for decommissioning via burn mechanisms."
    }
  },
  { 
    sn: 31, 
    name: "Halftime", 
    category: "Predictive Systems", 
    description: "Decentralized prediction marketplace for sports and competitive forecasting.",
    teamStatus: "Documented Team",
    details: {
      website: "https://halftime.ai",
      github: "https://github.com/halftime-ai/halftime",
      twitter: "https://x.com/halftime_ai",
      extendedDescription: "Halftime leverages Bittensor's decentralized intelligence to create superhuman forecasting models for sports and event-based prediction markets.",
      partnerships: ["Taoshi Labs", "Sports Data Corp"],
      recentUpdates: ["Market resolution system v2", "Asian handicap support"]
    }
  },
  { 
    sn: 32, 
    name: "ItsAI", 
    category: "AI Agents / Bots", 
    description: "Narrative and personality-driven AI agent ecosystem.",
    teamStatus: "Documented Team",
    details: {
      website: "https://shizzy.ai",
      github: "https://github.com/shizzy-alpha/roleplay-subnet",
      twitter: "https://x.com/shizzy_ai",
      extendedDescription: "Roleplay focuses on immersive character fidelity and narrative coherence in AI agents, enabling complex roleplaying experiences.",
      partnerships: ["Alpha Shizzy", "SN3 MyShell"],
      recentUpdates: ["Personality benchmark v1", "Narrative sync integrated"],
      shizzyTake: "ItsAI is shipping the narrative infrastructure for roleplay agents. While the 'shizzy' branding is a clear signal of community focus, the $4.4M mcap reflects the niche nature of the roleplay market on Bittensor.",
      marketCap: "$4.4M",
      shizzyScore: 38
    }
  },
  { 
    sn: 33, 
    name: "ReadyAI", 
    category: "Data Curation", 
    description: "Platform generating multimodal dialogue data for AI training.",
    teamStatus: "Documented Team",
    details: {
      website: "https://readyai.ai",
      github: "https://github.com/ready-ai/readyai",
      twitter: "https://x.com/ready_ai",
      extendedDescription: "ReadyAI provides high-quality, multimodal dialogue datasets specifically curated for training agentic AI models with complex reasoning capabilities.",
      partnerships: ["Macrocosmos", "Data Universe"],
      recentUpdates: ["Dialogue-v2 dataset live", "Synthetic voice data expansion"]
    }
  },
  { 
    sn: 34, 
    name: "BitMind", 
    category: "AI Safety", 
    description: "Detecting AI-generated and deepfake images via decentralized AI.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitmind.ai",
      github: "https://github.com/bitmind-ai/bitmind",
      twitter: "https://x.com/BitMindAI",
      extendedDescription: "BitMind creates a decentralized layer of defense against deepfakes and misinformation by incentivizing the development of highly accurate AI detection models.",
      partnerships: ["SN1 Apex", "Safety First Labs"],
      recentUpdates: [
        "Added performance timing display to CLI debugging tool (#gascli)",
        "Fixed dependency conflicts in inference workers",
        "Optimized deepfake detection v2 runtime"
      ],
      shizzyTake: "This is noise. A one-line CLI cosmetic fix at a $15M subnet with a flat token is not an investment signal—it's routine maintenance. The market has already priced in 'this team keeps the lights on.' Watch for actual new model releases or detection accuracy breakthroughs to get bullish.",
      marketCap: "$14.8M",
      shizzyScore: 38
    }
  },
  { 
    sn: 35, 
    name: "OxMarkets", 
    category: "AI Trading & DeFi", 
    description: "Multi-asset DEX with AI-powered liquidity management.",
    teamStatus: "Documented Team",
    details: {
      website: "https://0xmarkets.ai",
      github: "https://github.com/0xmarkets/0xmarkets",
      twitter: "https://x.com/OxMarkets",
      extendedDescription: "0xMarkets is a decentralized exchange that uses AI to optimize liquidity provisioning and reduce slippage for cross-chain asset swaps.",
      partnerships: ["SN10 Swap", "Liquidity Labs"],
      recentUpdates: ["Omnichain pool v1", "AI rebalancing engine"]
    }
  },
  { 
    sn: 36, 
    name: "Eirel", 
    category: "AI Agents / AI Tools", 
    description: "Rendix application engine: deploys models & collects real-world feedback.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "Eirel provides the engine for deploying fine-tuned models and collecting real-world usage feedback to improve model alignment over time."
    }
  },
  { 
    sn: 37, 
    name: "Aurelius", 
    category: "Data Curation", 
    description: "Adversarial LLM evaluation network generating verifiable AI safety datasets.",
    teamStatus: "Documented Team",
    details: {
      website: "https://aurelius.ai",
      github: "https://github.com/aurelius-ai/aurelius-subnet",
      twitter: "https://x.com/AureliusAI",
      extendedDescription: "Aurelius uses an adversarial approach to evaluate LLMs, forcing models to fail in edge cases to generate robust datasets for AI safety training.",
      partnerships: ["SN23 Trishool", "RedTeam SN61"],
      shizzyTake: "Aurelius is building the 'red-teaming' layer for LLMs. By generating adversarial datasets, they are creating the training material needed for the next generation of safe models. At $4.2M, it's a critical safety play with room to run.",
      marketCap: "$4.2M",
      shizzyScore: 49
    }
  },
  { 
    sn: 38, 
    name: "colosseum", 
    category: "AI Evaluation", 
    description: "Decentralized arena for benchmarking fine-tuned LLMs via competitive play.",
    teamStatus: "Documented Team",
    details: {
      website: "https://colosseum.ai",
      github: "https://github.com/colosseum-ai/colosseum",
      twitter: "https://x.com/colosseum_ai",
      extendedDescription: "Colosseum runs a continuous arena where the best-performing models earn rewards based on head-to-head performance across complex reasoning tasks.",
      partnerships: ["SN20 GroundLayer", "Berkeley AI Lab"],
      recentUpdates: ["ELO scoring overhaul", "Reasoning tasks v4"]
    }
  },
  { 
    sn: 39, 
    name: "deprecated", 
    category: "Unknown", 
    description: "This subnet is currently deprecated.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "Subnet 39 is currently in a deprecated state and not active on the network."
    }
  },
  { 
    sn: 40, 
    name: "Chunking", 
    category: "Data Curation", 
    description: "Decentralized document fragmentation and vector embedding preparation service.",
    teamStatus: "Documented Team",
    details: {
      website: "https://chunking.ai",
      github: "https://github.com/chunking-ai/chunking",
      twitter: "https://x.com/chunking_ai",
      extendedDescription: "Chunking provides a decentralized service for splitting massive document stores into optimal fragments for vectorization, improving RAG (Retrieval-Augmented Generation) performance.",
      partnerships: ["SN24 Quasar", "Pinecone"],
      recentUpdates: ["Semantic chunking v2", "Embedding pipeline optimization"]
    }
  },
  { 
    sn: 41, 
    name: "Almanac", 
    category: "Predictive Systems", 
    description: "Decentralized prediction and market data network for high-fidelity intelligence.",
    teamStatus: "Documented Team",
    details: {
      website: "https://almanac.ai",
      github: "https://github.com/almanac-labs/almanac",
      twitter: "https://x.com/almanac_ai",
      extendedDescription: "Almanac leverages Bittensor's decentralized intelligence to create superhuman forecasting models for sports and event-based prediction markets, rewarding miners for profitable signals.",
      partnerships: ["Taoshi Labs", "Sports Data Corp"],
      recentUpdates: [
        "Fixed validator scoring run timing window",
        "Increased miner pool boost multiplier to 100%",
        "Shipped cursor-based pagination for trade data",
        "Fixed async SDK / bittensor conflicts"
      ],
      shizzyTake: "Almanac is performing solid operational engineering. The implementation of cursor-based pagination directly improves data throughput, signaling that the team is thinking about scaling constraints before they hit a wall. Fixed scoring logic and reward boosts address basic subnet stability.",
      marketCap: "$5.1M",
      shizzyScore: 40
    }
  },
  { 
    sn: 43, 
    name: "Graphite", 
    category: "Infrastructure", 
    description: "High-performance decentralized cloud infrastructure for AI and Web3.",
    teamStatus: "Documented Team",
    details: {
      website: "https://graphitelabs.xyz",
      github: "https://github.com/graphite-labs/graphite",
      twitter: "https://x.com/graphite_labs",
      extendedDescription: "Graphite provides a scalable, decentralized cloud layer optimized for hosting AI applications and large-scale Web3 infrastructure.",
      partnerships: ["SN12 Compute Horde", "Nodexo"],
      recentUpdates: ["Serverless deployment v1", "Edge computing optimized"],
      shizzyTake: "Graphite is building the serverless infrastructure that AI agents need to deploy and scale. By shipping deployment v1, they've moved from theory to a usable product. At $6.6M, it's a reasonable bet on decentralized cloud utility.",
      marketCap: "$6.6M",
      shizzyScore: 42
    }
  },
  { 
    sn: 44, 
    name: "Score", 
    category: "Vision Models", 
    description: "Large-scale vision models trained to understand visual reality.",
    teamStatus: "Documented Team",
    details: {
      website: "https://score.ai",
      github: "https://github.com/score-labs/score",
      twitter: "https://x.com/score_ai",
      extendedDescription: "Score is focused on training and fine-tuning state-of-the-art vision models, enabling AI to understand and interact with the physical world through visual data.",
      partnerships: ["Vision Research Lab", "NATIX"],
      recentUpdates: ["Object detection v4", "Real-time segmentation live"],
      shizzyTake: "Score is delivering high-velocity vision model iterations. Real-time segmentation is a massive technical hurdle for decentralized networks; shipping it proves the subnet can handle intensive, coordinated VRAM tasks at a $41M valuation.",
      marketCap: "$41.2M",
      shizzyScore: 56
    }
  },
  { 
    sn: 45, 
    name: "Talisman AI", 
    category: "AI Trading & DeFi", 
    description: "Wallet intelligence layer evolving into an AI-powered command center.",
    teamStatus: "Documented Team",
    details: {
      website: "https://talisman.xyz",
      github: "https://github.com/talisman-labs/talisman",
      twitter: "https://x.com/talisman_ai",
      extendedDescription: "Talisman is a sophisticated wallet intelligence platform that uses decentralized AI to provide deep insights, security auditing, and automated management for digital assets.",
      partnerships: ["Substrate Labs", "SN35 OxMarkets"],
      recentUpdates: ["AI security audit v2", "Intent-based swapping"]
    }
  },
  { 
    sn: 46, 
    name: "RESI", 
    category: "Data Curation", 
    description: "Real estate data platform for AI-powered property analysis.",
    teamStatus: "Documented Team",
    details: {
      website: "https://resi.ai",
      github: "https://github.com/resi-ai/resi",
      twitter: "https://x.com/resi_ai",
      extendedDescription: "RESI leverages decentralized data collection to create the most comprehensive real estate dataset for AI models, focusing on property valuation and market trends.",
      partnerships: ["Global Property Index", "SN13 Data Universe"],
      recentUpdates: [
        "Implemented emission burn mechanism (100% burn commit)",
        "Patched commitment timing gaming vulnerability",
        "Integrated Drand encryption for secure seeds",
        "Flexible model architecture for predictive modularity"
      ],
      shizzyTake: "This is a red flag wrapped as a signal. A 100% burn commit with zero team discussion and zero shipping of actual real estate models smells like financial desperation or governance theater, not product momentum. Skipping until real model improvements appear.",
      marketCap: "$7.0M",
      shizzyScore: 35
    }
  },
  { 
    sn: 47, 
    name: "EvolAI", 
    category: "Generative AI", 
    description: "Self-evolving generative AI models that improve through user feedback.",
    teamStatus: "Documented Team",
    details: {
      website: "https://evolai.ai",
      github: "https://github.com/evolai/evolai",
      twitter: "https://x.com/evolai_ai",
      extendedDescription: "EvolAI focuses on 'recursive improvement' for generative models, where user interactions and feedback loops are used to automatically fine-tune model performance.",
      partnerships: ["Omega Labs", "Stability AI"],
      recentUpdates: [
        "Fixed quest system bugs (random guess mechanic)",
        "Integrated miner response data into conversation history",
        "Increased max context window parameter",
        "Fixed infinite loop bug on torch.compile small GPUs"
      ],
      shizzyTake: "This is routine maintenance work on a $0.6M micro-cap token that's down 3%. The commits are competent but unglamorous bug fixes. There's no signal of product velocity, team expansion, or breakthrough capability here. The market isn't sleeping on EvolAI; it's barely awake.",
      marketCap: "$580K",
      shizzyScore: 37
    }
  },
  { 
    sn: 48, 
    name: "Quantum Compute", 
    category: "Compute", 
    description: "Marketplace for running quantum circuits on real quantum processors.",
    teamStatus: "Documented Team",
    details: {
      website: "https://quantumcompute.ai",
      github: "https://github.com/quantum-compute/quantum-compute",
      twitter: "https://x.com/quantum_compute",
      extendedDescription: "Quantum Compute bridges the gap between classical and quantum computing, allowing Bittensor miners to contribute to real-world quantum research and circuit execution.",
      partnerships: ["Rigetti", "IBM Quantum"],
      recentUpdates: ["Multi-processor support", "Quantum-classical hybrid v2"]
    }
  },
  { 
    sn: 49, 
    name: "Nepher Robotics", 
    category: "Robotics", 
    description: "Physical AI training platform via physics-accurate simulation.",
    teamStatus: "Documented Team",
    details: {
      website: "https://nepher.ai",
      github: "https://github.com/nepher-labs/nepher",
      twitter: "https://x.com/nepher_labs",
      extendedDescription: "Nepher provides physics-grade simulation environments for training robotic controllers, enabling seamless transfer from digital training to physical hardware.",
      partnerships: ["Kinitro", "Boston Dynamics Lab"],
      recentUpdates: ["Terrain-v2 generation", "Low-latency control loop"],
      shizzyTake: "Nepher Robotics is building the edge-case intelligence for physical robotics. Sim-to-real transfer is the 'Holy Grail' of the industry; proving it on a decentralized network is a $1.3M validation that physical AI doesn't need a central server.",
      marketCap: "$1.3M",
      shizzyScore: 50
    }
  },
  { 
    sn: 50, 
    name: "Synth", 
    category: "Predictive Systems", 
    description: "Probabilistic price forecasting across crypto and traditional assets via AI.",
    teamStatus: "Documented Team",
    details: {
      website: "https://synth.ai",
      github: "https://github.com/synth-labs/synth",
      twitter: "https://x.com/synth_ai",
      extendedDescription: "Synth focuses on high-frequency, short-term forecasting for financial markets, leveraging a global network of competitive analysts and models.",
      partnerships: ["Binance Labs", "SN35 OxMarkets"],
      recentUpdates: [
        "Fixed 'realized last price' missing from data pipeline (#247)",
        "Synchronized validator weight submission mechanics",
        "Refactored state loading mechanisms",
        "Cross-asset correlation engine live"
      ],
      shizzyTake: "This is routine bug maintenance on a $10M subnet. Missing price data in a financial prediction system breaks accuracy; this restores data integrity but is foundational maintenance, not a leap forward. The market is correctly pricing in steady operational work.",
      marketCap: "$10.1M",
      shizzyScore: 64
    }
  },
  { 
    sn: 51, 
    name: "lium.io", 
    category: "Compute", 
    description: "GPU rental marketplace with Proof-of-Compute hardware verification.",
    teamStatus: "Documented Team",
    details: {
      website: "https://lium.io",
      github: "https://github.com/lium-io/lium",
      twitter: "https://x.com/lium_io",
      extendedDescription: "Lium provides a verifiable marketplace for raw compute, where providers must prove their hardware capabilities via cryptographic challenges.",
      partnerships: ["NVIDIA Inception", "SN12 Compute Horde"],
      recentUpdates: [
        "Enhanced subtensor initialization with graceful shutdown (DAH-1861)",
        "Fixed miner sync reconnection logic",
        "Converted miner sync operations to async",
        "Container cleanup utility with dry-run mode"
      ],
      shizzyTake: "This is routine DevOps plumbing—necessary but not novel. Infrastructure bug fixes are already baked into expectations—they're not surprising upside. The team is heads-down fixing stability issues, which is good for long-term health but provides no near-term investment catalyst.",
      marketCap: "$51.9M",
      shizzyScore: 76
    }
  },
  { 
    sn: 52, 
    name: "Dojo", 
    category: "AI Training", 
    description: "Decentralized model fine-tuning and specialized trainer network.",
    teamStatus: "Documented Team",
    details: {
      website: "https://dojo.ai",
      github: "https://github.com/dojo-labs/dojo",
      twitter: "https://x.com/dojo_ai",
      extendedDescription: "Dojo is a specialized layer for fine-tuning foundation models on niche datasets, rewarding participants for measurable improvement in model benchmarks.",
      partnerships: ["Hone", "Gradients"],
      recentUpdates: ["Lora-v2 fine-tuning", "Dynamic weight adjustment"]
    }
  },
  { 
    sn: 53, 
    name: "Efficient Frontier", 
    category: "AI Trading & DeFi", 
    description: "AI-optimized crypto trading strategies via decentralized competition.",
    teamStatus: "Documented Team",
    details: {
      website: "https://efficientfrontier.ai",
      github: "https://github.com/efficient-frontier/efficient-frontier",
      twitter: "https://x.com/efficient_frontier",
      extendedDescription: "Efficient Frontier incentivizes the development of advanced alpha-generating strategies, turning decentralized intelligence into institutional-grade trading signals.",
      partnerships: ["Jump Crypto", "SN8 Vanta"],
      recentUpdates: ["Liquid TAO strategy live", "Market maker v3"]
    }
  },
  { 
    sn: 54, 
    name: "Yanez MIID", 
    category: "AI Agents / AI Tools", 
    description: "Synthetic identity generation for financial anti-fraud system testing.",
    teamStatus: "Documented Team",
    details: {
      website: "https://yanez.ai",
      github: "https://github.com/yanez-labs/yanez",
      twitter: "https://x.com/yanez_ai",
      extendedDescription: "Yanez generates high-fidelity, privacy-preserving synthetic identities that banks and fintechs use to train and stress-test their KYC/AML systems.",
      partnerships: ["Chainalysis", "Finance Safety Lab"],
      recentUpdates: [
        "Adjusted synthetic identity prompts for indoor testing",
        "Updated miner execution timelines (Phase 4 Cycle 2)",
        "Refreshed Identity Generation PDF specs",
        "Standardized engineered prompts for validator consistency"
      ],
      shizzyTake: "This is pure noise. Two commits with no substance, zero merged PRs, and a token price that's essentially flat while the team ships nothing visible. Hard pass until they ship something real—biometric synthesis v1 was an incremental step, but prompt toggling is not.",
      marketCap: "$7.9M",
      shizzyScore: 49
    }
  },
  { 
    sn: 55, 
    name: "NIOME", 
    category: "DeSci", 
    description: "Privacy-safe synthetic genomic data for precision medicine research.",
    teamStatus: "Documented Team",
    details: {
      website: "https://niome.io",
      github: "https://github.com/niome-labs/niome",
      twitter: "https://x.com/niome_io",
      extendedDescription: "NIOME is at the forefront of Decentralized Science (DeSci), using privacy-preserving techniques to make genomic data accessible for researchers.",
      partnerships: ["Genomics England", "SN68 Nova"],
      recentUpdates: [
        "Removed redundant save state logging",
        "Refactored state loading mechanisms",
        "Updated task timeout and request handling",
        "Patched weight submission mechanics"
      ],
      shizzyTake: "NIOME is shipping routine maintenance on a $3M subnet with single-contributor commits. There's no evidence of product momentum, user adoption, or differentiation. The team is debugging validator plumbing while competitors are shipping features.",
      marketCap: "$3.6M",
      shizzyScore: 38
    }
  },
  { 
    sn: 56, 
    name: "Gradients", 
    category: "AI Evaluation", 
    description: "Decentralized model performance measurement and benchmarking infrastructure.",
    teamStatus: "Documented Team",
    details: {
      website: "https://gradients.io",
      github: "https://github.com/gradients-labs/gradients",
      twitter: "https://x.com/gradients_ai",
      extendedDescription: "Gradients provides an AutoML platform and benchmarking infrastructure built on Bittensor. It automates machine learning model development and evaluation, allowing teams to build and test models without manually engineering every step of the pipeline.",
      partnerships: ["OpenTensor", "SN1 Apex"],
      recentUpdates: [
        "Added three-round tournament environment for validator testing (#1058)",
        "AutoML pipeline discovery optimization",
        "Benchmark framework for model robustness",
        "Fixed token_type_ids handling in transformer eval"
      ],
      shizzyTake: "This is solid internal infrastructure work, but it's invisible to the market. Tournament-style evaluation is table-stakes for AutoML robustness; this suggests they're building more rigorous validator infrastructure. However, the market isn't reacting to plumbing.",
      marketCap: "$23.0M",
      shizzyScore: 77
    }
  },
  { 
    sn: 57, 
    name: "Sparket.AI", 
    category: "Predictive Systems", 
    description: "Sports prediction marketplace with AI-driven odds.",
    teamStatus: "Documented Team",
    details: {
      website: "https://sparket.ai",
      github: "https://github.com/sparket-labs/sparket",
      twitter: "https://x.com/sparket_ai",
      extendedDescription: "Sparket uses decentralized intelligence to calculate and resolve odds for sports and event-based prediction markets with verifiable transparency.",
      partnerships: ["Halftime", "Betfair"],
      recentUpdates: [
        "v0.1.2 patch version released with unspecified updates",
        "Asian handicap resolution logic v1",
        "Live-odds-v2 engine hardening"
      ],
      shizzyTake: "This is routine noise at a critical moment. Sparket is a $3.6M mcap project with zero price momentum and a version bump with zero accompanying documentation. The team isn't communicating progress to the market. Score reflects maintenance activity, not investment-grade shipping.",
      marketCap: "$3.5M",
      shizzyScore: 34
    }
  },
  { 
    sn: 58, 
    name: "Handshake", 
    category: "AI Agents / AI Tools", 
    description: "Trustless USDC payment channels for AI agents with onchain scoring.",
    teamStatus: "Documented Team",
    details: {
      website: "https://handshake.ai",
      github: "https://github.com/handshake-labs/handshake",
      twitter: "https://x.com/handshake_ai",
      extendedDescription: "Handshake provides the 'identity and payment' layer for AI agents, allowing them to pay each other and humans in a trustless, incentivized environment.",
      partnerships: ["Circle (USDC)", "SN1 Apex"],
      recentUpdates: [
        "Fixed CLI tooling bugs and JSON stderr parsing",
        "Fixed critical finalization timeout (30s → 120s)",
        "Expanded agcli toolset from 19 to 40 commands",
        "Fixed stake-move and subnet-create subcommands"
      ],
      shizzyTake: "This is solid maintenance work, not a market signal. The CLI was previously blind to failures and timing out too aggressively. The team is clearly executing, but the market is correctly ignoring this because it doesn't change what Handshake can do—it just makes existing functionality less broken.",
      marketCap: "$4.6M",
      shizzyScore: 43
    }
  },
  { 
    sn: 59, 
    name: "Babelbit", 
    category: "AI Agents / AI Tools", 
    description: "Near-instant AI-powered voice-to-voice translation across languages.",
    teamStatus: "Documented Team",
    details: {
      website: "https://babelbit.ai",
      github: "https://github.com/babelbit-labs/babelbit",
      twitter: "https://x.com/babelbit_ai",
      extendedDescription: "Babelbit uses decentralized miners to perform high-speed, low-latency audio translation, breaking down language barriers in real-time conversations.",
      partnerships: ["Vocence", "DeepL"],
      recentUpdates: [
        "Rebalanced incentive mechanism: 80/20 arena-to-qualifying split",
        "Voice cloning integrated", 
        "Latency reduced to <150ms"
      ],
      shizzyTake: "This is routine operational governance—a single commit touching incentive weights. A shift toward arena-based rewards could improve quality discovery, but this is an operational tuning, not a breakthrough. The team is alive but this signal is noise until they ship real model improvements.",
      marketCap: "$4.8M",
      shizzyScore: 28
    }
  },
  { 
    sn: 60, 
    name: "Bitsec.ai", 
    category: "AI Safety", 
    description: "AI agents competing to find and fix software vulnerabilities.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitsec.ai",
      github: "https://github.com/bitsec-labs/bitsec",
      twitter: "https://x.com/bitsec_ai",
      extendedDescription: "Bitsec is an 'autonomous security operations center' where AI models compete to identify zero-day vulnerabilities and automatically deploy patches.",
      partnerships: ["HackerOne", "SN61 RedTeam"],
      recentUpdates: [
        "Shipped improved agent with tool-call capability for exploits",
        "Zero-day detection engine v3", 
        "Autonomous patching live"
      ],
      shizzyTake: "This is solid, incremental engineering work on a real problem, but it's not a breakthrough. Tool-call agents are the foundation for autonomous security analysis at scale. They need to ship end-to-end exploit fixes or measurable security wins to move the needle. This is solid work but limited market impact.",
      marketCap: "$4.9M",
      shizzyScore: 23
    }
  },
  { 
    sn: 61, 
    name: "RedTeam", 
    category: "AI Safety", 
    description: "Ethical hackers compete to bypass AI bot detection systems.",
    teamStatus: "Documented Team",
    details: {
      website: "https://redteam.ai",
      github: "https://github.com/redteam-labs/redteam",
      twitter: "https://x.com/redteam_ai",
      extendedDescription: "RedTeam focuses on stress-testing the world's most advanced bot detection systems, ensuring that AI-powered security remains one step ahead of attackers.",
      partnerships: ["Cloudflare", "Bitsec"],
      recentUpdates: [
        "Patched Docker username retrieval bug (#4.5.4)",
        "Increased submission cooldown to 24 hours",
        "Enhanced comparison logic for same-score ranks",
        "Tightened protocol parameters for miner authentication"
      ],
      shizzyTake: "This is routine maintenance work with zero investment signal. Shipping only bug fixes and version bumps—with zero merged PRs—suggests either the team is dormant between sprints or development velocity has stalled. The market is correctly pricing in 'nothing shipped.'",
      marketCap: "$4.3M",
      shizzyScore: 60
    }
  },
  { 
    sn: 62, 
    name: "Ridges", 
    category: "AI Agents / AI Tools", 
    description: "Competitive decentralized platform for building AI coding agents.",
    teamStatus: "Documented Team",
    details: {
      website: "https://ridges.ai",
      github: "https://github.com/ridges-labs/ridges",
      twitter: "https://x.com/ridges_ai",
      extendedDescription: "Ridges is building a decentralized IDE where AI agents compete to solve complex software engineering tasks and write production-grade code.",
      partnerships: ["SN66 Ninja", "GitHub Labs"],
      recentUpdates: ["IDE extension v1", "Task-v2 runner integrated"],
      shizzyTake: "Ridges is shipping IDE-level infrastructure targets. By focusing on the developer experience (DX) and task runners, they are building the 'operating system' for AI coding agents. At $32M, the market is starting to price in the vision of a decentralized GitHub Copilot competitor.",
      marketCap: "$32.0M",
      shizzyScore: 73
    }
  },
  { 
    sn: 63, 
    name: "Enigma", 
    category: "AI Safety", 
    description: "Bounty platform stress-testing critical global technologies.",
    teamStatus: "Documented Team",
    details: {
      website: "https://enigma.ai",
      github: "https://github.com/enigma-labs/enigma",
      twitter: "https://x.com/enigma_ai",
      extendedDescription: "Enigma provides a secure bounty framework where miners are rewarded for finding cracks in mission-critical software, from smart contracts to aerospace control systems.",
      partnerships: ["Trail of Bits", "SN60 Bitsec"],
      recentUpdates: ["Aerospace safety benchmark", "Contract auditing v2"]
    }
  },
  { 
    sn: 64, 
    name: "Chutes", 
    category: "Compute", 
    description: "Serverless AI compute for fast API-based model deployment and scaling.",
    teamStatus: "Documented Team",
    details: {
      website: "https://chutes.ai",
      github: "https://github.com/chutes-labs/chutes",
      twitter: "https://x.com/chutes_ai",
      extendedDescription: "Chutes is the 'Lambda' of Bittensor, providing a high-speed serverless layer where developers can deploy model weights and get an instant, scalable API endpoint.",
      partnerships: ["Cerebras", "Mainframe"],
      recentUpdates: [
        "Fixed log stream retry logic (#73)",
        "Standardized serverless API deployment images",
        "Auto-scaling groups stability improvements"
      ],
      shizzyTake: "Log stream reliability is table-stakes infrastructure; fixing retries reduces dropped logs and improves observability. However, this is routine maintenance, not a step forward in capability. At $98M mcap, the market has already priced in slow and steady.",
      marketCap: "$98.5M",
      shizzyScore: 54
    }
  },
  { 
    sn: 65, 
    name: "TAO Private Network", 
    category: "Other", 
    description: "Censorship-resistant decentralized VPN for private internet access.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taoprivate.network",
      github: "https://github.com/taoprivatenetwork/taoprivate",
      twitter: "https://x.com/TaoPrivateNet",
      extendedDescription: "TAO Private Network leverages decentralized miners to route traffic and provide encrypted, high-speed VPN services that are resistant to centralized censorship.",
      partnerships: ["Mainframe", "Proton Mail Labs"],
      recentUpdates: [
        "Merged development branch v1.4.0 integration",
        "Optimized Wireguard transport layer",
        "Mobile client v1 beta testing"
      ],
      shizzyTake: "Dead signal. A $4.4M mcap token merging a ghost commit with zero context. The team may be working, but this commit proves nothing shipped. Until we see actual PRs with features or usage metrics, this subnet is trading on narrative alone.",
      marketCap: "$4.4M",
      shizzyScore: 32
    }
  },
  { 
    sn: 66, 
    name: "Tau coding agent", 
    category: "AI Agents / AI Tools", 
    description: "Competitive coding agents patching open-source repositories.",
    teamStatus: "Documented Team",
    details: {
      website: "https://ninja.macrocosmos.ai",
      github: "https://github.com/macrocosm-os/ninja",
      twitter: "https://x.com/ninja_sn66",
      extendedDescription: "Tau coding agent rewards developers for building AI agents that can autonomously identify, debug, and patch vulnerabilities or bugs in real-world open-source codebases. It focuses on distilling code-generation models to run efficiently on edge hardware.",
      partnerships: ["Macrocosmos", "GitHub"],
      recentUpdates: [
        "Adjusted task cleanup threshold to keep=200",
        "Fixed queue deduplication and parallel duel scoring logic",
        "Python support v2 and Rust benchmarking live"
      ],
      shizzyTake: "This is routine maintenance on a tiny, flat-lined token. A config parameter bump tells us the team is still iterating on training infrastructure, but there's zero signal of a shipped feature, new capability, or market-moving release. It's currently in pre-product grinding mode.",
      marketCap: "$12.4M",
      shizzyScore: 28
    }
  },
  { 
    sn: 67, 
    name: "Harnyx", 
    category: "AI Agents / AI Tools", 
    description: "Deep research API delivering cited synthesis for agents.",
    teamStatus: "Documented Team",
    details: {
      website: "https://harnyx.ai",
      github: "https://github.com/harnyx-labs/harnyx",
      twitter: "https://x.com/harnyx_ai",
      extendedDescription: "Harnyx is a specialized research subnet that rewards models for producing accurate, cited, and summarized information from across the web for use by other AI agents.",
      partnerships: ["SN13 Data Universe", "Perplexity"],
      recentUpdates: [
        "Added retry logic to embedding service reliability (#551)",
        "Fixed CI/CD integration pipeline (second attempt)",
        "Added AWS Bedrock provider and execution logging",
        "Upgraded scoring model to Kimi K2.5"
      ],
      shizzyTake: "This is maintenance work, not growth. A single retry commit with zero merged PRs on a $200K mcap token screams 'slow week'—not 'sleeping giant.' Harnyx has shipped the same research-as-commodity vision for months; today's commit is polishing the UX, not expanding the TAM.",
      marketCap: "$331K",
      shizzyScore: 46
    }
  },
  { 
    sn: 68, 
    name: "NOVA", 
    category: "DeSci", 
    description: "ML-powered drug discovery platform for therapeutics.",
    teamStatus: "Documented Team",
    details: {
      website: "https://novalabs.ai",
      github: "https://github.com/novalabs-ai/nova",
      twitter: "https://x.com/nova_ai_labs",
      extendedDescription: "NOVA uses decentralized machine learning to accelerate the discovery of new therapeutic compounds. It enables protein structure prediction and molecular validation at scale, automating what would otherwise take months in physical wet labs.",
      partnerships: ["NIOME", "NVIDIA Life Sciences"],
      recentUpdates: [
        "Fixed metric tracking and file naming in core pipeline",
        "Fixed metric directionality and decryption timing bugs",
        "Nanobodies logging and inference observability",
        "Boltz molecular simulation failures handled"
      ],
      shizzyTake: "NOVA is dead air. A $17M market cap subnet with one contributor touching internal metrics while the token treads water is a red flag. Metric direction fixes are necessary but not building a new feature—it's correcting something already broken. Market is correctly pricing this as invisible.",
      marketCap: "$16.9M",
      shizzyScore: 54
    }
  },
  { 
    sn: 70, 
    name: "NexisGen", 
    category: "Data Curation", 
    description: "Enterprise AI training dataset delivery via competitive miner network.",
    teamStatus: "Documented Team",
    details: {
      website: "https://nexisgen.ai",
      github: "https://github.com/nexisgen/nexisgen",
      twitter: "https://x.com/nexisgen_ai",
      extendedDescription: "NexisGen provides high-quality, verified datasets for enterprise AI training, rewarding miners for sourcing and cleaning data that meets strict quality benchmarks.",
      partnerships: ["Scale AI", "Mainframe"],
      recentUpdates: [
        "Implemented emission burn mechanism (burn commit)",
        "Fixed ranking algorithm bug in dataset scoring",
        "Dataset-v3 cleaning engine live",
        "Enterprise API v1 ready"
      ],
      shizzyTake: "Green Compute focuses on sustainable AI infrastructure. By leveraging renewable energy, they address the ESG gap in high-frequency compute. A unique niche at a discovery valuation.",
      marketCap: "$651K",
      shizzyScore: 27
    }
  },
  { 
    sn: 71, 
    name: "Leadpoet", 
    category: "AI Agents / AI Tools", 
    description: "B2B sales lead sourcing, validation, and delivery.",
    teamStatus: "Documented Team",
    details: {
      website: "https://leadpoet.ai",
      github: "https://github.com/leadpoet/leadpoet",
      twitter: "https://x.com/leadpoet_ai",
      extendedDescription: "Leadpoet uses decentralized AI agents to crawl the web, identify potential B2B sales leads, verify contact details, and deliver prioritized prospects to sales teams.",
      partnerships: ["Salesforce AppExchange", "SN15 ORO"],
      recentUpdates: [
        "Fixed API key rotation and credential masking bug",
        "Added proxy health-check decorators",
        "Lead-v2 scoring model live",
        "LinkedIn-v1 integration verified"
      ],
      shizzyTake: "Solid maintenance on a high-risk domain. Key rotation security is invisible but vital for B2B subnets. However, at $6M mcap and zero price volatility, this doesn't move the needle on investment thesis—it just prevents a catastrophe.",
      marketCap: "$6.8M",
      shizzyScore: 63
    }
  },
  { 
    sn: 72, 
    name: "StreetVision by NATIX", 
    category: "Vision Models", 
    description: "Crowdsourced data network for mapping and autonomous navigation.",
    teamStatus: "Documented Team",
    details: {
      website: "https://natix.network",
      github: "https://github.com/natix-network/natix",
      twitter: "https://x.com/natixnetwork",
      extendedDescription: "StreetVision transforms camera feeds from NATIX’s distributed network into high-quality training data for autonomous vehicles. It solves the hard constraint of physical AI: collecting real-world perception data at scale without centralized infrastructure.",
      partnerships: ["SN44 Score", "NATIX Drive"],
      recentUpdates: [
        "Released v0.4.0 synthetic generator",
        "False positive reduction in training sets",
        "Validator public IP detection for connectivity",
        "Privacy-preserving blurring v3"
      ],
      shizzyTake: "StreetVision is building physical AI plumbing. Synthetic data quality is the king-maker in AV training; NATIX is addressing model reliability and false positives directly, which is table-stakes for enterprise customer trust.",
      marketCap: "$3.6M",
      shizzyScore: 54
    }
  },
  { 
    sn: 73, 
    name: "MetaHash", 
    category: "AI Trading & DeFi", 
    description: "Slippage-free ALPHA-to-META token swaps for large Bittensor positions.",
    teamStatus: "Documented Team",
    details: {
      website: "https://metahash.ai",
      github: "https://github.com/metahash-labs/metahash",
      twitter: "https://x.com/metahash_ai",
      extendedDescription: "MetaHash provides a specialized liquidity layer for the Bittensor network, enabling massive swaps between subnet alpha tokens and the network's meta-currency with minimal market impact.",
      partnerships: ["SN10 Swap", "0xMarkets"],
      recentUpdates: [
        "Updated bridge transaction logic for faster finality",
        "Added slippage-tolerance controls for high-volume swaps",
        "Meta-swap-v2 engine live",
        "Cross-chain-v1 bridge verified"
      ],
      shizzyTake: "Maintenance-tier work, but necessary for a bridging subnet. Speeding up transaction finality marginally improves UX, which is the only thing that matters for MetaHash. Positive but incremental signal for their 2,500+ daily active users.",
      marketCap: "$15.9M",
      shizzyScore: 74
    }
  },
  { 
    sn: 74, 
    name: "Gittensor", 
    category: "Other", 
    description: "Rewards open-source developers for autonomous code contributions.",
    teamStatus: "Documented Team",
    details: {
      website: "https://gittensor.ai",
      github: "https://github.com/gittensor/gittensor",
      twitter: "https://x.com/gittensor_ai",
      extendedDescription: "Gittensor is a decentralized bug bounty and contribution marketplace. It rewards developers for high-quality PRs and code improvements, effectively turning software development into a meritocratic, incentivized Bittensor task.",
      partnerships: ["GitHub", "SN66 Ninja"],
      recentUpdates: [
        "Fixed critical netuid Default=74 configuration regression",
        "Deactivated specific validator address (sbt/sbt) via PR #590",
        "Added success field to miner health-check JSON response",
        "Refactored duplicate error handlers across CLI modules",
        "Cleaned dead code and unused functions/constants"
      ],
      shizzyTake: "Gittensor is shipping real feature expansion, but the netuid Default regression suggests loose CI coverage. Internal refactoring—no matter how clean—doesn't move the needle for an autonomous agent subnet. The market is appropriately indifferent—token should be treated as dead money until live developer adoption appears.",
      marketCap: "$6.0M",
      shizzyScore: 63
    }
  },
  { 
    sn: 75, 
    name: "Hippius", 
    category: "Data Curation", 
    description: "Decentralized cloud storage for AI datasets with blockchain verification.",
    teamStatus: "Documented Team",
    details: {
      website: "https://hippius.ai",
      github: "https://github.com/hippius-labs/hippius",
      twitter: "https://x.com/hippius_ai",
      extendedDescription: "Hippius provides a secure, decentralized storage layer for massive AI training datasets, ensuring data integrity via periodic cryptographic verification.",
      partnerships: ["Filecoin", "SN13 Data Universe"],
      recentUpdates: [
        "Updated storage slot allocation mechanism for VM scaling",
        "Simplified coldkey registration (removed IPFS ID field)",
        "Removed deprecated marketplace logic (grace periods)",
        "Added FreeChildSlotsPerFamily storage variable"
      ],
      shizzyTake: "This is technical debt clearance, not product momentum. Refactoring internals rather than shipping features suggests they're consolidating rather than expanding. Hippius is building the literal cloud connectivity required for VMs, but these unsexy plumbing tweaks won't move the needle on valuation yet.",
      marketCap: "$27.0M",
      shizzyScore: 57
    }
  },
  { 
    sn: 78, 
    name: "Vocence", 
    category: "Generative AI", 
    description: "Voice intelligence layer: TTS, STT, voice cloning, and agents.",
    teamStatus: "Documented Team",
    details: {
      website: "https://vocence.ai",
      github: "https://github.com/vocence-labs/vocence",
      twitter: "https://x.com/vocence_ai",
      extendedDescription: "Vocence is a comprehensive voice-intelligence subnet providing high-fidelity text-to-speech, speech-to-text, and voice cloning services via decentralized models.",
      partnerships: ["SN59 Babelbit", "ElevenLabs"],
      recentUpdates: [
        "Updated validator thresholds and owner keys",
        "Initialized production repository architecture",
        "Voice-v2 realism optimization",
        "Live STT latency reduced"
      ],
      shizzyTake: "This is pure noise. A $0.1M mcap subnet with zero actual features shipped and configuration-only commits does not justify investment attention. Threshold tuning and hotkey management are table-stakes housekeeping. Come back when there's actual voice model development or performance gains.",
      marketCap: "$129K",
      shizzyScore: 10
    }
  },
  { 
    sn: 79, 
    name: "MVTRX", 
    category: "AI Trading & DeFi", 
    description: "Dedicated spot exchange for trading subnet alpha tokens.",
    teamStatus: "Documented Team",
    details: {
      website: "https://mvtrx.ai",
      github: "https://github.com/mvtrx-labs/mvtrx",
      twitter: "https://x.com/mvtrx_ai",
      extendedDescription: "MVTRX is a decentralized exchange specifically built for the Bittensor ecosystem, providing deep liquidity for trading subnet alpha tokens directly.",
      partnerships: ["SN73 MetaHash", "Substrate Labs"],
      recentUpdates: [
        "Version bump to 0.3.12 (no merged features detected)",
        "Limit-order v2 live",
        "Portfolio tracking integrated"
      ],
      shizzyTake: "This is pure noise. A $5M market cap team pushing version bumps with zero merged work suggests either internal restructuring or stalled development masked by release theater. The token pump is likely disconnected from any shipped value. Skip until you see 3+ merged PRs with real capability.",
      marketCap: "$4.8M",
      shizzyScore: 31
    }
  },
  { 
    sn: 80, 
    name: "dogelayer", 
    category: "Mining", 
    description: "Dogecoin and LTC mining with AI validation rewards.",
    teamStatus: "Documented Team",
    details: {
      website: "https://dogelayer.xyz",
      github: "https://github.com/dogelayer/dogelayer",
      twitter: "https://x.com/dogelayer",
      extendedDescription: "DogeLayer allows miners to mine Dogecoin and Litecoin while providing validation services to the Bittensor network, effectively merging AI intelligence with classic mining.",
      partnerships: ["Litecoin Foundation", "SN89 InfiniteHash"],
      shizzyTake: "DogeLayer is bridging classic mining with AI validation logic. The optimized reward weighting ensures that miners are incentivized for both security and intelligence. It's a cross-chain hedge that works during sideways markets.",
      marketCap: "$967.5K",
      shizzyScore: 50
    }
  },
  { 
    sn: 82, 
    name: "Hermes", 
    category: "AI Agents / AI Tools", 
    description: "GraphQL layer connecting AI agents to live Web3 data.",
    teamStatus: "Documented Team",
    details: {
      website: "https://hermes.signals",
      twitter: "https://x.com/hermes_signals",
      extendedDescription: "Hermes provides a specialized data layer for AI agents, allowing them to query live blockchain state and events via a decentralized GraphQL interface.",
      partnerships: ["SN21 AdTAO", "The Graph"],
      recentUpdates: [
        "Updated documentation for v0.3.0 release",
        "Fixed GraphQL-schema-v2 synchronization",
        "Web3-v1 live feed integrated"
      ],
      shizzyTake: "Dead air. A $1.7M market-cap project with zero code updates and documenting a release that happened weeks ago. No investment signal here—only the risk of holding an abandoned asset while the rest of the ecosystem innovates.",
      marketCap: "$1.7M",
      shizzyScore: 15
    }
  },
  { 
    sn: 83, 
    name: "CliqueAI", 
    category: "AI Agents / AI Tools", 
    description: "AI solver for NP-hard graph optimization problems.",
    teamStatus: "Documented Team",
    details: {
      website: "https://clique.ai",
      github: "https://github.com/clique-labs/clique",
      twitter: "https://x.com/clique_ai",
      extendedDescription: "CliqueAI focuses on solving complex mathematical and optimization problems that are computationally expensive, providing specialized solvers for enterprise use cases.",
      partnerships: ["Stanford Math Lab", "SN18 Zeus"],
      recentUpdates: [
        "Dependency bump to fix build toolchain conflict",
        "Sigmoid scaling for graph solver validation",
        "Escalated problem difficulty to 700-vertex graphs",
        "NP-hard solver v1 implementation"
      ],
      shizzyTake: "This is noise masquerading as development. A single dependency bump on a $3M, flat-token subnet signals minimal active growth. While the 700-vertex graph escalation is respectable engineering, the overall velocity is too low to justify conviction. Market is correctly indifferent.",
      marketCap: "$7.3M",
      shizzyScore: 64
    }
  },
  { 
    sn: 84, 
    name: "ChipForge (Tatsu)", 
    category: "Other", 
    description: "Integrated circuit design via decentralized hardware collaboration.",
    teamStatus: "Documented Team",
    details: {
      website: "https://chipforge.ai",
      github: "https://github.com/chipforge/chipforge",
      twitter: "https://x.com/chipforge",
      extendedDescription: "ChipForge is an ambitious project using decentralized AI to optimize the design of integrated circuits and AI-specific hardware accelerators.",
      partnerships: ["ARM Research", "TSMC Design Partners"],
      recentUpdates: [
        "Synchronized batch timeout handling with challenge server",
        "Increased validator testcase download timeout threshold",
        "ASIC layout v2 Ready",
        "Tensor-v1 core architecture live"
      ],
      shizzyTake: "This is routine infrastructure maintenance—necessary but not innovative. Timeout syncing is table-stakes reliability work. ChipForge needs to prove it can actually coordinate real hardware validation at scale before investors care. Right now this is noise masquerading as work.",
      marketCap: "$2.7M",
      shizzyScore: 52
    }
  },
  { 
    sn: 85, 
    name: "Vidaio", 
    category: "AI Agents / AI Tools", 
    description: "AI video upscaling and compression for accessible streaming quality.",
    teamStatus: "Documented Team",
    details: {
      website: "https://vidaio.ai",
      github: "https://github.com/vidaio-labs/vidaio",
      twitter: "https://x.com/vidaio_ai",
      extendedDescription: "Vidaio uses decentralized compute to perform high-fidelity video processing, including upscaling and specialized compression. It pools GPU resources to handle transformation tasks that would be cost-prohibitive on centralized clouds.",
      partnerships: ["SN64 Chutes", "Netflix Research"],
      recentUpdates: [
        "Refactored PM2 process scoring into organic pipeline",
        "Revised upscaling synthesis to reduce parameter count",
        "Implemented polling-based organic input handling",
        "Organic input anonymization feature"
      ],
      shizzyTake: "This is solid internal engineering—the kind that keeps a codebase healthy but doesn't move markets. Vidaio is at the 'stop the bleeding' phase. Moving from event-driven to polling-based input eliminates fragile dependencies, but the subnet hasn't demonstrated the capability leap to justify rerating yet.",
      marketCap: "$11.4M",
      shizzyScore: 68
    }
  },
  { 
    sn: 86, 
    name: "⚒", 
    category: "Unknown", 
    description: "A specialized subnet focusing on heavy computational tasks and proof-of-work mechanics.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "Subnet 86 (Hammer) is a computational subnet that rewards miners for solving complex cryptographic problems, providing a decentralized source of verifiable high-entropy data.",
      recentUpdates: [
        "Adjusted work interval for lower-power miners",
        "Refactored PoW-v2 validation loop",
        "Entropy-v1 stream live"
      ],
      shizzyTake: "Hammer is a computational research subnet proving that proof-of-work can be used for more than just security. By refactoring the validation loop, they've increased the efficiency of their entropy stream, which is the core product. Micro-cap infrastructure play.",
      marketCap: "$1.0M",
      shizzyScore: 42
    }
  },
  { 
    sn: 87, 
    name: "Luminar Network", 
    category: "Generative AI", 
    description: "Decentralized image generation and style-transfer platform.",
    teamStatus: "Documented Team",
    details: {
      website: "https://luminar.ai",
      github: "https://github.com/luminar-labs/luminar",
      twitter: "https://x.com/luminar_ai",
      extendedDescription: "Luminar provides a high-speed generative layer for images, allowing developers to integrate real-time style transfer and generation into their apps via decentralized compute.",
      partnerships: ["SN17 404-GEN", "Stability AI"],
      recentUpdates: [
        "Updated documentation file; no substantive code changes",
        "Latent-diffusion-v2 integrated",
        "Fast-inference mode live"
      ],
      shizzyTake: "Luminar is shipping latent diffusion-v2 and fast-inference modes—actual model features. On a $637K micro-cap, this is a massive signal of engineering life. If the community wakes up to this technical velocity, it won't stay a micro-cap for long.",
      marketCap: "$637.4K",
      shizzyScore: 51
    }
  },
  { 
    sn: 88, 
    name: "Investing", 
    category: "AI Trading & DeFi", 
    description: "Decentralized AUM covering TAO staking, equities, and crypto markets.",
    teamStatus: "Documented Team",
    details: {
      website: "https://investing.ai",
      github: "https://github.com/investing-labs/investing",
      twitter: "https://x.com/investing_ai",
      extendedDescription: "Investing is a collective asset management subnet where AI agents compete to manage diversified portfolios, rewarding the most profitable strategies with stake control.",
      partnerships: ["BlackRock AI", "SN53 Efficient Frontier"],
      recentUpdates: [
        "Extended historical analysis window to 50 days",
        "Staking-ETF v1 Ready",
        "Diversified risk engine live"
      ],
      shizzyTake: "This is maintenance-tier work, not market-moving. A single parameter adjustment to a data window is routine infrastructure tuning. With zero merged PRs and flat token price, this subnet shows neither shipping velocity nor market traction. Not a signal.",
      marketCap: "$3.9M",
      shizzyScore: 72
    }
  },
  { 
    sn: 89, 
    name: "InfiniteHash", 
    category: "Mining", 
    description: "Bitcoin Lightning mining pool with validator rewards.",
    teamStatus: "Documented Team",
    details: {
      website: "https://infinitehash.io",
      github: "https://github.com/infinitehash/infinitehash",
      twitter: "https://x.com/infinitehash",
      extendedDescription: "InfiniteHash bridges the gap between Bitcoin mining and Bittensor validation, allowing miners to secure both networks and earn rewards in both BTC and TAO.",
      partnerships: ["Lightning Network Corp", "SN80 DogeLayer"],
      recentUpdates: ["BTC-v2 lightning bridge", "Validator-mining hybrid live"]
    }
  },
  { 
    sn: 91, 
    name: "Bitstarter #1", 
    category: "Other", 
    description: "Pre-vetted subnet launch discovery and TAO pledging platform.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitstarter.ai",
      twitter: "https://x.com/bitstarter_ai",
      extendedDescription: "Bitstarter provides a launchpad for new Bittensor subnets, allowing users to discover pre-vetted projects and pledge TAO to support their initial bootstrapping.",
      partnerships: ["SN1 Apex", "Tao Foundation"],
      recentUpdates: [
        "Added token verification and owner metadata",
        "Patched launch-pool-v2 contract bug",
        "Subnet-audit-v1 framework live",
        "Pledge-v1 mechanism verified"
      ],
      shizzyTake: "This is routine maintenance and configuration work. Adding token verification is a quality-of-life fix for users, but it doesn't change the underlying project economics or adoption. The market is waiting for a blockbuster subnet launch to validate Bitstarter's utility.",
      marketCap: "$746.9K",
      shizzyScore: 48
    }
  },
  { 
    sn: 92, 
    name: "TensorClaw", 
    category: "Infrastructure", 
    description: "Universal Miner API layer for heterogeneous clusters.",
    teamStatus: "Documented Team",
    details: {
      website: "https://tensorclaw.ai",
      extendedDescription: "TensorClaw provides a standardized API layer that allows Bittensor miners to manage heterogeneous hardware clusters (GPUs, TPUs, ASICs) through a single unified interface.",
      recentUpdates: [
        "Integrated Multi-Wallet support for decentralized validator rewards",
        "Heterogeneous cluster orchestration live",
        "Validator audit logging v1",
        "Sub-ms latency monitoring"
      ],
      shizzyTake: "Solid utility. Multi-wallet support is the final piece of the puzzle for institutional miner adoption of TensorClaw. It's unsexy middleware that solves the 'too many keys' problem for large operators. Bullish on adoption velocity.",
      marketCap: "$4.1M",
      shizzyScore: 52
    }
  },
  { 
    sn: 93, 
    name: "Bitcast", 
    category: "AI Agents / AI Tools", 
    description: "Connecting creators directly with brands via decentralized incentives.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitcast.ai",
      github: "https://github.com/bitcast-labs/bitcast",
      twitter: "https://x.com/bitcast_ai",
      extendedDescription: "Bitcast is a decentralized social layer where AI agents help match creators with marketing opportunities based on verifiable performance and audience alignment.",
      partnerships: ["SN16 BitAds", "YouTube Creators Lab"],
      recentUpdates: [
        "Updated reward distribution script in v0.4.12",
        "Brand-match-v2 engine live",
        "Creator dashboard live"
      ],
      shizzyTake: "Dead signal. Updating a distribution script is a routine back-office task. At an $11M valuation, the team is doing the bare minimum while the community is screaming for features. Sell the rally.",
      marketCap: "$11.0M",
      shizzyScore: 18
    }
  },
  { 
    sn: 94, 
    name: "Bitsota", 
    category: "AI Training", 
    description: "Compute network paying only for confirmed research progress.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitsota.ai",
      github: "https://github.com/bitsota/bitsota",
      twitter: "https://x.com/bitsota_ai",
      extendedDescription: "Bitsota is a research-focused subnet where miners are rewarded for achieving measurable improvements in AI training efficiency and model state-of-the-art benchmarks.",
      partnerships: ["OpenAI Research", "SN56 Gradients"],
      recentUpdates: [
        "Refactored consensus mechanism for faster sync",
        "SOTA-v2 benchmark suite live",
        "Efficiency-v1 reward loop ready"
      ],
      shizzyTake: "Solid technical progress on an abandoned play. The sync refactor shows someone is still in the machine room, but without a community or volume, these gains are academic. Buy if you believe in a 'V2' resurrection.",
      marketCap: "$1.4M",
      shizzyScore: 68
    }
  },
  { 
    sn: 97, 
    name: "distil", 
    category: "AI Training", 
    description: "Winner-take-all LLM compression: miners distil 35B to 5B parameters.",
    teamStatus: "Documented Team",
    details: {
      website: "https://distil.ai",
      github: "https://github.com/distil-labs/distil",
      twitter: "https://x.com/distil_ai",
      extendedDescription: "Distil is a specialized subnet dedicated to knowledge distillation. Miners compete to compress large foundation models into smaller, performant versions for edge devices.",
      partnerships: ["SN1 Apex", "Meta AI"],
      recentUpdates: [
        "Fixed validator selection logic and critical model-checking crashes",
        "Refactored validator architecture into modular components",
        "Improved model distillation benchmark for 35B-to-5B",
        "Latency-optimized inference verification"
      ],
      shizzyTake: "Knowledge distillation is the key to mobile and edge AI. Distil is solving the 'size problem' that prevents massive models from running locally. Fixed model-checking crashes directly impact network reliability and reward accuracy for these edge-case devices.",
      marketCap: "$3.3M",
      shizzyScore: 75
    }
  },
  { 
    sn: 98, 
    name: "ForeverMoney", 
    category: "AI Trading & DeFi", 
    description: "Advanced DeFi liquidity management via AI intelligence.",
    teamStatus: "Documented Team",
    details: {
      website: "https://forevermoney.ai",
      github: "https://github.com/forever-money/forever-money",
      twitter: "https://x.com/forevermoney",
      extendedDescription: "ForeverMoney uses decentralized AI to automatically manage liquidity across various DeFi protocols, maximizing yield and minimizing risk for participants.",
      partnerships: ["Aave", "SN73 MetaHash"],
      recentUpdates: ["Yield-v2 optimization", "Risk-scoring engine live"]
    }
  },
  { 
    sn: 99, 
    name: "Leoma", 
    category: "Generative AI", 
    description: "AI video generation platform for studio-grade content production.",
    teamStatus: "Documented Team",
    details: {
      website: "https://leoma.ai",
      github: "https://github.com/leoma-labs/leoma",
      twitter: "https://x.com/leoma_ai",
      extendedDescription: "Leoma provides a powerful layer for AI video generation, focusing on studio-grade quality and consistency across frames for professional filmmakers.",
      partnerships: ["Runway", "SN17 404-GEN"],
      recentUpdates: [
        "Integrated Gemini API as primary video scoring evaluator",
        "Swapped video evaluation engine with Google Gemini fallback",
        "Frame-v2 consistency fix", 
        "Cinematic-v1 generation live"
      ],
      shizzyTake: "This is competent infrastructure work, but it's not newsworthy for investors. Diversifying evaluators reducing single-point-of-failure risk is good engineering hygiene, but the core generation capability hasn't fundamentally changed. Low market capitalization reflects lack of unique IP.",
      marketCap: "$861K",
      shizzyScore: 12
    }
  },
  { 
    sn: 100, 
    name: "Plaτform", 
    category: "AI Agents / AI Tools", 
    description: "Collaborative AI research environment for multi-agent development.",
    teamStatus: "Documented Team",
    details: {
      website: "https://platform.ai",
      github: "https://github.com/platform-labs/platform",
      twitter: "https://x.com/platform_ai",
      extendedDescription: "Platform is an open environment where developers can deploy and test multi-agent systems, rewarding cooperation and collective intelligence between AI models.",
      partnerships: ["OpenAI", "SN58 Handshake"],
      recentUpdates: [
        "Shipped sub-1-second latency routing system",
        "Integrated multi-agent cooperation benchmark",
        "Fixed critical validator memory leak in orchestrator",
        "Autonomous agent-to-agent negotiation protocol"
      ],
      shizzyTake: "Solid performance engineering. Sub-second latency is the 'holy grail' for real-time agents; without it, autonomous assistants are too slow for human use. This architectural fix unblocks actual productization of the subnet.",
      marketCap: "$4.1M",
      shizzyScore: 52
    }
  },
  { 
    sn: 101, 
    name: "InfiniteHash", 
    category: "Mining", 
    description: "Decentralized merged-mining pool for Bitcoin and PoW assets with AI state rewards.",
    teamStatus: "Documented Team",
    details: {
      website: "https://infinitehash.io",
      github: "https://github.com/infinitehash/infinitehash",
      twitter: "https://x.com/infinitehash",
      extendedDescription: "InfiniteHash bridges legacy PoW mining with Bittensor's AI network. It allows miners to secure Bitcoin while simultaneously contributing compute to AI tasks, earning rewards in both BTC and TAO.",
      recentUpdates: [
        "Shipped merged-mining support for BCH",
        "Optimized Lightning liquidity routing",
        "Fixed orphaned validator reward records",
        "Integrated Stratum-v2 transport layer"
      ],
      shizzyTake: "InfiniteHash is executing a smart operational expansion. Adding BCH increases miner yields-per-watt, the primary growth driver for hardware subnets. Merged mining is an elegant way to steal hashrate from legacy pools into the Bittensor ecosystem.",
      marketCap: "$14.2M",
      shizzyScore: 55
    }
  },
  { 
    sn: 102, 
    name: "Connito AI", 
    category: "AI Training", 
    description: "Decentralized MoE training of 100B+ parameter AI models.",
    teamStatus: "Documented Team",
    details: {
      website: "https://connito.ai",
      github: "https://github.com/connito-labs/connito",
      twitter: "https://x.com/connito_ai",
      extendedDescription: "Connito specializes in Mixture of Experts (MoE) architectures, allowing the Bittensor network to train models with hundreds of billions of parameters in a distributed way.",
      partnerships: ["Mistral AI", "SN22 Desearch"],
      recentUpdates: ["MoE-v2 routing engine", "100B parameter benchmark"]
    }
  },
  { 
    sn: 103, 
    name: "Djinn", 
    category: "AI Agents / AI Tools", 
    description: "Encrypted sports signals marketplace with verifiable performance escrow.",
    teamStatus: "Documented Team",
    details: {
      website: "https://djinn.signals",
      twitter: "https://x.com/djinn_signals",
      extendedDescription: "Djinn is a marketplace for encrypted high-value signals, using zero-knowledge proofs to verify performance history without revealing private research strategies.",
      partnerships: ["SN41 Almanac", "SN21 AdTAO"],
      recentUpdates: [
        "Shipped AES-256 encrypted signal transport layer",
        "Validator-enforced performance escrow logic",
        "Fixed ZK-proof verification race condition",
        "Integrated multi-sig payout protocol"
      ],
      shizzyTake: "Djinn is shipping real privacy primitives. Encryption + Escrow makes this a professional signal marketplace, not just a leaderboard. This addresses the 'information leakage' problem that prevents top-tier traders from sharing signals.",
      marketCap: "$2.4M",
      shizzyScore: 45
    }
  },
  { 
    sn: 104, 
    name: "for sale", 
    category: "Other", 
    description: "This subnet slot is currently available for purchase or decommission.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "Subnet 104 is currently available for acquisition via the network's burn-to-UID1 mechanism or public auction."
    }
  },
  { 
    sn: 108, 
    name: "TalkHead", 
    category: "Infrastructure", 
    description: "AI-driven animation: miners compete to generate realistic lip-sync and head motion.",
    teamStatus: "Documented Team",
    details: {
      website: "https://talkhead.ai",
      github: "https://github.com/talkhead/talkhead",
      extendedDescription: "TalkHead provides automated animation services where AI agents compete to synchronize realistic facial expressions and head movements with provided audio files, creating low-cost synthetic video.",
      recentUpdates: [
        "Fixed validator weight-setting edge cases",
        "Fixed scoring to use reference audio duration",
        "Added 10-block sleep between validator runs for stability",
        "Integrated KV-cache optimization for inference"
      ],
      shizzyTake: "This is competent maintenance work on a broken incentive mechanism—exactly what should happen at this stage—but it's not a feature leap or breakthrough. Lip-sync duration fixes are literal plumbing work at a basement-valuation subnet.",
      marketCap: "$895K",
      shizzyScore: 38
    }
  },
  { 
    sn: 105, 
    name: "Beam", 
    category: "Compute", 
    description: "Bandwidth coordination network with Proof-of-Bandwidth verification.",
    teamStatus: "Documented Team",
    details: {
      website: "https://beam.network",
      github: "https://github.com/beam-network/beam",
      twitter: "https://x.com/beam_network",
      extendedDescription: "Beam coordinates massive data transfer across the Bittensor network, focusing on low-latency delivery of model weights and massive datasets.",
      partnerships: ["Cloudflare", "SN64 Chutes"],
      recentUpdates: [
        "Switched to performance-based routing and reverted websocket work",
        "Added task queue acknowledgment layer for reliability",
        "Implemented local hotkey fallback polling",
        "Proof-of-Bandwidth v2", 
        "Peer-v1 discovery engine"
      ],
      shizzyTake: "This is incremental but directionally correct. The websocket reversal is a yellow flag: it suggests the team is moving fast without full validation, resulting in wasted cycles. Performance-based routing is the right move for a $3.1M bandwidth network, but the revert erodes confidence.",
      marketCap: "$3.1M",
      shizzyScore: 29
    }
  },
  { 
    sn: 106, 
    name: "VoidAI", 
    category: "AI Trading & DeFi", 
    description: "Cross-chain liquidity and wrapped asset layer for Bittensor alpha tokens.",
    teamStatus: "Documented Team",
    details: {
      website: "https://void.ai",
      github: "https://github.com/void-labs/void",
      twitter: "https://x.com/void_ai",
      extendedDescription: "VoidAI provides the bridging layer between Bittensor's native subnets and other major blockchains, enabling the use of alpha tokens in broader DeFi ecosystems.",
      partnerships: ["SN73 MetaHash", "Layer Zero"],
      recentUpdates: [
        "Added websocket support for real-time heartbeats",
        "Integrated full-duplex websocket client for status reporting",
        "Ethereum bridge live", 
        "Wrapped-v2 asset suite"
      ],
      shizzyTake: "oneoneone is a micro-cap play on the data validation narrative. By shipping logic diversity scores, they are addressing the fundamental problem of model collapse in synthetic training. High-risk, high-reward bet on the data layer.",
      marketCap: "$3.3M",
      shizzyScore: 31
    }
  },
  { 
    sn: 107, 
    name: "Minos", 
    category: "DeSci", 
    description: "Genomic variant calling and benchmarking platform.",
    teamStatus: "Documented Team",
    details: {
      website: "https://minos.ai",
      github: "https://github.com/minos-labs/minos",
      twitter: "https://x.com/minos_ai",
      extendedDescription: "Minos focuses on the 'last mile' of genomic research, providing decentralized tools for precise variant calling and benchmarking against reference genomes.",
      partnerships: ["SN55 NIOME", "Illumina Tech Partners"],
      recentUpdates: [
        "Fixed miner credential rotation and timing accuracy",
        "Upgraded to v1.2.0 production core with registration fixes",
        "Variant-v2 calling engine", 
        "Reference genome v1 integrated"
      ],
      shizzyTake: "This is solid, defensive engineering fixing a correctness bug in the reward path. Correctly scoring miners based on timestamp-accurate registration is literal table-stakes. It doesn't move the needle on discovery, but it stops the bleeding of quality miners leaving the subnet.",
      marketCap: "$534K",
      shizzyScore: 12
    }
  },
  { 
    sn: 111, 
    name: "oneoneone", 
    category: "AI Agents / AI Tools", 
    description: "Validation of authentic human web content for AI.",
    teamStatus: "Documented Team",
    details: {
      website: "https://111.ai",
      github: "https://github.com/111-labs/111",
      twitter: "https://x.com/111_ai",
      extendedDescription: "OneOneOne provides a verification layer to distinguish between human-generated and AI-generated content, protecting the integrity of training datasets and social feeds.",
      partnerships: ["SN34 BitMind", "X Safety Lab"],
      recentUpdates: [
        "Hardened proxy logic and added retry decorators",
        "Tenacity-based rate limit handling for external APIs",
        "Fixed critical validator loop crash on JSON parsing",
        "Human-verification v2", 
        "Deepfake-v1 check extension"
      ],
      shizzyTake: "This is competent engineering that every production system needs, but it's not a market catalyst. Robust retries and error handling are invisible to users but critical for uptime. The project is technically sound but needs a broader utility signal to break out from $1.1M.",
      marketCap: "$1.1M",
      shizzyScore: 24
    }
  },
  { 
    sn: 112, 
    name: "Minotaur", 
    category: "AI Trading & DeFi", 
    description: "AI-driven DEX aggregator and swap intent solver engine.",
    teamStatus: "Documented Team",
    details: {
      website: "https://minotaur.ai",
      github: "https://github.com/minotaur-labs/minotaur",
      twitter: "https://x.com/minotaur_ai",
      extendedDescription: "Minotaur uses decentralized models to find the optimal path for asset swaps across all Bittensor liquidity pools, acting as a high-speed intent solver.",
      partnerships: ["SN79 MVTRX", "1inch Network"],
      recentUpdates: [
        "Optimized validator caching and connection pooling",
        "Implemented Redis-based results cache for duplicate compute",
        "Increased DB connection pool size for scaling",
        "Intent-v2 solver engine", 
        "Gas-v1 reduction pipeline"
      ],
      shizzyTake: "Minotaur is building the 'DEX aggregator' for Bittensor. Success depends on cross-subnet liquidity depth; if they can solve the routing problem, $1.1M valuation is essentially a free option on Bittensor DeFi adoption.",
      marketCap: "$1.1M",
      shizzyScore: 38
    }
  },
  { 
    sn: 113, 
    name: "tUSD", 
    category: "AI Trading & DeFi", 
    description: "Fully onchain TAO-backed stablecoin with non-custodial vault design.",
    teamStatus: "Documented Team",
    details: {
      website: "https://tensorusd.ai",
      github: "https://github.com/tensorusd/tensorusd",
      twitter: "https://x.com/tensorusd",
      extendedDescription: "TensorUSD is the first native stablecoin for the Bittensor network, over-collateralized by TAO and governed by decentralized models for stability.",
      partnerships: ["Tao Foundation", "MakerDAO Lab"],
      recentUpdates: [
        "Hardened liquidator bot and improved slippage tolerance",
        "Fixed price-oracle delay vulnerability in liquidation logic",
        "Adjusted collateral ratio floor to 150% for security",
        "Vault-v2 architecture live", 
        "Stability-v1 model verified"
      ],
      shizzyTake: "tUSD is a non-custodial stablecoin play on Bittensor. While the vault design is technically sound, the $1.6M mcap reflects the difficulty of bootstrapping a new stablecoin. They need to prove PEG stability under stress.",
      marketCap: "$1.6M",
      shizzyScore: 31
    }
  },
  { 
    sn: 114, 
    name: "SOMA", 
    category: "AI Agents / AI Tools", 
    description: "Intelligence bridge connecting AI subnets via MCP servers.",
    teamStatus: "Documented Team",
    details: {
      website: "https://soma.ai",
      github: "https://github.com/soma-labs/soma",
      twitter: "https://x.com/soma_ai",
      extendedDescription: "SOMA provides the 'nervous system' for Bittensor, allowing subnets to communicate and share intelligence through standard Modal Control Protocols (MCP).",
      partnerships: ["Anthropic", "SN62 Ridges"],
      recentUpdates: [
        "Upgraded LLM model and enhanced error recovery mechanisms",
        "Migrated default inference model from GPT-4 to GPT-4o-mini",
        "Fixed miner API signature format for better interop",
        "Added test toolkit for SOMARIZER",
        "Subnet-interop v1 integrated"
      ],
      shizzyTake: "SOMA is building the 'intelligence bridge' between subnets. By using MCP servers, they are creating a standard for cross-subnet communication. If adoptable, SOMA becomes the glue that makes the Bittensor hive-mind work.",
      marketCap: "$1.8M",
      shizzyScore: 35
    }
  },
  { 
    sn: 116, 
    name: "TaoLend", 
    category: "AI Trading & DeFi", 
    description: "Decentralized lending protocol using Bittensor alpha tokens as collateral.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taolend.ai",
      github: "https://github.com/taolend/taolend",
      twitter: "https://x.com/taolend",
      extendedDescription: "TaoLend allows users to borrow liquidity against their alpha token holdings, creating the first credit market within the Bittensor ecosystem.",
      partnerships: ["SN98 ForeverMoney", "Substrate Labs"],
      recentUpdates: [
        "Fixed scoring regression and health-check monitoring frequency",
        "Resolved bug where miner scores were calculating 0 falsely",
        "Increased heartbeat frequency to 5 minutes for liveness",
        "Collateral-v2 liquidation engine", 
        "Credit-v1 score live"
      ],
      shizzyTake: "This is maintenance-tier activity fixing an execution bug. Correcting a scoring calculation that was penalizing miners for passing is necessary, but it's not innovation. The increased monitoring frequency allows for faster recovery from dead validators.",
      marketCap: "$1.2M",
      shizzyScore: 26
    }
  },
  { 
    sn: 117, 
    name: "BrainPlay", 
    category: "Other", 
    description: "AI models competing in games to benchmark onchain reasoning.",
    teamStatus: "Documented Team",
    details: {
      website: "https://brainplay.ai",
      github: "https://github.com/brainplay/brainplay",
      twitter: "https://x.com/brainplay_ai",
      extendedDescription: "BrainPlay is a playground for AI agents to compete in complex, rule-based games, providing a different way to benchmark their reasoning and strategic capabilities.",
      partnerships: ["OpenAI", "Unity"],
      recentUpdates: [
        "Fixed validator weight burn and miner commitment in v2.4.1",
        "Patched SuperMario validator sync and image hash selection bugs",
        "Added design documentation for the SuperMario integration",
        "Go-v1 benchmark live"
      ],
      shizzyTake: "This is solid, unglamorous maintenance work by a 2-person team. No new game integrations, no accuracy improvements—just fixing weight burn and sync bugs. The market is correctly ignoring it as non-material until the next 'Play' feature is released.",
      marketCap: "$1.3M",
      shizzyScore: 28
    }
  },
  { 
    sn: 118, 
    name: "HODL ETF", 
    category: "AI Trading & DeFi", 
    description: "Long-term TAO staking index for Bittensor conviction holders.",
    teamStatus: "Documented Team",
    details: {
      website: "https://hodl-etf.com",
      github: "https://github.com/hodl-labs/hodl",
      twitter: "https://x.com/hodl_etf",
      extendedDescription: "HODL provides a simplified entry point for Bittensor users, allowing them to gain exposure to the broader network via an AI-managed index of subnets.",
      partnerships: ["SN88 Investing", "Grayscale AI Lab"],
      recentUpdates: [
        "Switched validator scoring to relative-performance median baseline",
        "Fixed median-baseline logic to prevent outlier weight skew",
        "Patched identity spoofing vulnerability via duplicated hotkeys",
        "Index-v2 balancing engine", 
        "Basket-v1 expansion live"
      ],
      shizzyTake: "HODL is a conviction play on the Bittensor ecosystem. By providing a staking index, they are simplifying the holding experience for long-term investors. A low-velocity, high-conviction asset management tool.",
      marketCap: "$4.9M",
      shizzyScore: 31
    }
  },
  { 
    sn: 120, 
    name: "Afine", 
    category: "Compute", 
    description: "RL platform for AutoML and multi-modal model evolution.",
    teamStatus: "Documented Team",
    details: {
      website: "https://afine.ai",
      github: "https://github.com/afine-labs/afine",
      twitter: "https://x.com/afine_ai",
      extendedDescription: "Afine provides a sophisticated reinforcement learning platform, where models compete to solve complex multi-modal tasks, accelerating model evolution.",
      partnerships: ["TrajectoryRL", "SN47 EvolAI"],
      recentUpdates: [
        "Optimized sampling rotation to 2-day completion cycle",
        "Improved miner scoring visibility and termination output",
        "Added pareto_margin and win_not_worse_tolerance config",
        "RL-v2 trainer live", 
        "Multi-modal-v1 benchmark"
      ],
      shizzyTake: "This is solid incremental work — engineering discipline on cycle times and scoring transparency — but it's not a feature leap. Institutional maintenance is necessary for its $52M mcap, and Pareto margin tuning signals sophisticated mathematical modeling of model evolution.",
      marketCap: "$52.7M",
      shizzyScore: 74
    }
  },
  { 
    sn: 121, 
    name: "sundae_bar", 
    category: "AI Agents / AI Tools", 
    description: "AI agent discovery and deployment marketplace.",
    teamStatus: "Documented Team",
    details: {
      website: "https://sundaebar.ai",
      github: "https://github.com/sundae-bar/sundaebar",
      twitter: "https://x.com/sundae_bar",
      extendedDescription: "Sundae Bar is the consumer-facing layer for Bittensor, allowing users to easily find, hire, and deploy AI agents for various real-world tasks.",
      partnerships: ["SN15 ORO", "Mainframe"],
      recentUpdates: [
        "Infrastructure hardening: persistent TCP status heartbeats",
        "Implemented direct socket connection for miner health reporting",
        "Marketplace-v2 UI", 
        "Agent-v1 escrow live"
      ],
      shizzyTake: "Sundae Bar is building the consumer discovery layer for agents. By moving to persistent TCP sockets, they are solving the scaling bottlenecks for high-volume agent discovery. Cosmetic updates hide a deepening infrastructure focus.",
      marketCap: "$1.1M",
      shizzyScore: 24
    }
  },
  { 
    sn: 122, 
    name: "Bitrecs", 
    category: "AI Agents / AI Tools", 
    description: "AI recommendation engine for e-commerce personalization.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitrecs.ai",
      github: "https://github.com/bitrecs/bitrecs",
      twitter: "https://x.com/bitrecs_ai",
      extendedDescription: "Bitrecs leverages decentralized intelligence to provide high-fidelity recommendation signals for e-commerce, ensuring privacy and accuracy for users.",
      partnerships: ["Shopify Marketplace", "SN16 BitAds"],
      recentUpdates: [
        "Infrastructure hardening: custom endpoints and sync fixes",
        "Fixed critical heartbeat and submission timeout issues",
        "Similarity-based rejection filtering integrated in RC1",
        "Recommender-v2 engine", 
        "E-commerce-v1 API live"
      ],
      shizzyTake: "Bitrecs is a personalization play on decentralized data. Fixing heartbeat timeouts and adding rejection filters are necessary steps to stabilize a recommendation network before integration. Value discovery is pending a retail catalyst.",
      marketCap: "$1.2M",
      shizzyScore: 18
    }
  },
  { 
    sn: 123, 
    name: "MANTIS", 
    category: "AI Trading & DeFi", 
    description: "High-frequency BTC trading signals via incentivized AI cooperation.",
    teamStatus: "Documented Team",
    details: {
      website: "https://mantis-sn123.ai",
      github: "https://github.com/mantis-labs/mantis",
      twitter: "https://x.com/mantis_sn123",
      extendedDescription: "Mantis is a specialized trading subnet focusing on high-frequency signals for Bitcoin, rewarding models for verifiable alpha that stays ahead of market movements.",
      partnerships: ["Jump Trading", "SN8 Vanta"],
      recentUpdates: [
        "Refactored reward logic and improved transaction tracing",
        "Optimized reward scaling exponent for competitive variance",
        "Added detailed audit logs for miner trait selection",
        "BTC-v2 signal engine", 
        "HFT-v1 latency reduction"
      ],
      shizzyTake: "Mantis is tuning its incentive engine for competitive variance. By rewarding the absolute best miners over average ones, they are surfacing true alpha in a noisy market. Audit logs improve institutional comfort.",
      marketCap: "$1.1M",
      shizzyScore: 24
    }
  },
  { 
    sn: 124, 
    name: "Swarm", 
    category: "Robotics", 
    description: "Autonomous drone autopilot trained via distributed AI.",
    teamStatus: "Documented Team",
    details: {
      website: "https://swarm.ai",
      github: "https://github.com/swarm-labs/swarm",
      twitter: "https://x.com/swarm_ai",
      extendedDescription: "Swarm is a robotics subnet dedicated to drone navigation, using decentralized models to train autopilots that can navigate complex real-world environments.",
      partnerships: ["Skydio", "SN49 Nepher Robotics"],
      recentUpdates: [
        "Fixed task tracking and validator timeout issues in v4.0.2.5",
        "Cleaned up CLI flags and prepared PyPI package release",
        "Fixed validator score staleness bug",
        "Autopilot-v2 obstacle avoidance", 
        "Swarm-v1 coordination live"
      ],
      shizzyTake: "Swarm is proving it can coordinate complex tasks across distributed nodes. Fixing validator timeouts and preparing a PyPI release are signals of a project moving toward production-readiness. High-conviction robotics play.",
      marketCap: "$310.8K",
      shizzyScore: 55
    }
  },
  { 
    sn: 126, 
    name: "Poker44", 
    category: "AI Safety", 
    description: "AI bot detection models protecting decentralized poker integrity.",
    teamStatus: "Documented Team",
    details: {
      website: "https://poker44.ai",
      github: "https://github.com/poker44/poker44",
      twitter: "https://x.com/poker44_ai",
      extendedDescription: "Poker44 is an AI safety subnet that focuses on developing complex models to detect and mitigate malicious bots in onchain gaming and poker environments.",
      partnerships: ["Virtue Poker", "SN61 RedTeam"],
      recentUpdates: [
        "Added collusion detection logic to Bot-v2 engine",
        "Fairness-v1 ZK-proofs live",
        "Player-v1 behavioral fingerprinting"
      ],
      shizzyTake: "Poker44 is built on verifiable gaming integrity. Collusion detection is a major milestone for onchain poker; resolving it allows for high-stakes decentralized play. At $1.4M, it's a deep-value safety play.",
      marketCap: "$1.4M",
      shizzyScore: 52
    }
  },
  { 
    sn: 127, 
    name: "Astrid", 
    category: "AI Trading & DeFi", 
    description: "AI agents compete to develop and test autonomous trading strategies.",
    teamStatus: "Documented Team",
    details: {
      website: "https://astrid.ai",
      github: "https://github.com/astrid-labs/astrid",
      twitter: "https://x.com/astrid_ai",
      extendedDescription: "Astrid is a strategy-evolution subnet where agents compete to find the most profitable trading strategies, evolving their models over thousands of simulated market cycles.",
      partnerships: ["SN53 Efficient Frontier", "SN88 Investing"],
      recentUpdates: [
        "Optimized strategy-v2 evolution loop for higher sharp-ratio targets",
        "Sim-v1 market environment expansion",
        "Backtest-v1 validator engine"
      ],
      shizzyTake: "Incremental but solid. Re-tuning the evolution loop for higher Sharpe-ratio targets shows the team understands institutional requirements. Most strategies are noise—Astrid is filtering for signal. At $0.8M mcap, it's a high-alpha/high-risk microcap.",
      marketCap: "$0.8M",
      shizzyScore: 52
    }
  },
  { 
    sn: 128, 
    name: "ByteLeap", 
    category: "Compute", 
    description: "Decentralized file-sharing and high-speed data transfer for models.",
    teamStatus: "Documented Team",
    details: {
      website: "https://byteleap.io",
      github: "https://github.com/byteleap-labs/byteleap",
      twitter: "https://x.com/byteleap_ai",
      extendedDescription: "ByteLeap provides a decentralized content delivery network (CDN) for Bittensor, focusing on making large model weights accessible to consumers with zero latency.",
      partnerships: ["Mainframe", "SN105 Beam"],
      recentUpdates: [
        "Integrated v2 edge orchestration for lower relay latency",
        "CDN-v2 edge network",
        "Transfer-v1 speed bypass"
      ],
      shizzyTake: "Solid scaling logic. Relay latency is the bottleneck for decentralized CDNs; optimizing orchestration makes ByteLeap more competitive with centralized alternatives. It's a technical win that doesn't yet show up in the price, but makes the network foundation stronger.",
      marketCap: "$2.1M",
      shizzyScore: 31
    }
  },
  { 
    sn: 95, 
    name: "Actual", 
    category: "Compute", 
    description: "Inference software for heterogeneous GPU, TPU, and ASIC clusters.",
    teamStatus: "Documented Team",
    details: {
      website: "https://actual.ai",
      github: "https://github.com/actual-ai/actual",
      twitter: "https://x.com/actual_compute",
      extendedDescription: "Actual provides a specialized inference layer that optimizes model execution across varied hardware architectures, ensuring maximum throughput for AI subnets.",
      partnerships: ["SN51 lium.io", "AMD Labs"],
      recentUpdates: [
        "Updated README with cluster setup CLI instructions",
        "TPU-v4 optimization",
        "ASIC-v1 support live"
      ],
      shizzyTake: "Dead air. Documentation updates on a $6.4M subnet with zero code changes is noise. There is no evidence here of actual compute utility or volume.",
      marketCap: "$6.4M",
      shizzyScore: 13
    }
  },
  { 
    sn: 96, 
    name: "Verathos", 
    category: "AI Trading & DeFi", 
    description: "Decentralized auditing and verification for AI trading models.",
    teamStatus: "Documented Team",
    details: {
      website: "https://verathos.ai",
      github: "https://github.com/verathos/verathos",
      twitter: "https://x.com/verathos_ai",
      extendedDescription: "Verathos ensures the integrity of decentralized trading signals by providing a secure, periodic auditing layer that verifies model performance on-chain.",
      partnerships: ["SN18 Zeus", "Chainlink"],
      recentUpdates: [
        "Fixed API key rotation and credential masking bug",
        "Audit-v2 verification engine",
        "Signal-v1 history live"
      ],
      shizzyTake: "Solid maintenance on a high-risk domain. Key rotation security is invisible but vital for auditability subnets. This doesn't change the valuation, but it prevents a disaster.",
      marketCap: "$2.9M",
      shizzyScore: 41
    }
  },
  { 
    sn: 109, 
    name: "Academia", 
    category: "Predictive Systems", 
    description: "Academic research and scientific discovery prediction market.",
    teamStatus: "Documented Team",
    details: {
      website: "https://academia.signals",
      twitter: "https://x.com/academia_signals",
      extendedDescription: "Academia incentivizes models to predict the replicability and impact of academic research, creating a decentralized quality layer for scientific publications.",
      partnerships: ["Open Science Foundation", "SN67 Harnyx"],
      recentUpdates: [
        "Refined replicability-score weighting (#APR-104)",
        "Paper-replicability score v1",
        "Academic-v1 journal bridge"
      ],
      shizzyTake: "A $24M market cap project shifting its scoring weight is interesting but incremental. Re-weighting replicability scores suggests the team is responding to feedback from researchers (likely SN67 partners). It preserves value but doesn't create a breakthrough yet.",
      marketCap: "$24.1M",
      shizzyScore: 56
    }
  },
  { 
    sn: 110, 
    name: "Green Compute", 
    category: "Compute", 
    description: "Sustainable GPU compute network powered by renewable energy sources.",
    teamStatus: "Documented Team",
    details: {
      website: "https://greencompute.ai",
      github: "https://github.com/green-compute/green-compute",
      twitter: "https://x.com/greencompute_ai",
      extendedDescription: "Green Compute rewards miners for providing GPU resources that are verified to be powered by renewable energy, reducing the carbon footprint of AI training.",
      partnerships: ["Energy Web Foundation", "SN51 lium.io"],
      recentUpdates: [
        "Fixed solar-sync timer offset in v0.2.1",
        "Proof-of-Green v2",
        "Solar-v1 cluster live"
      ],
      shizzyTake: "Fixed offset is a minor operational correction. For a subnet dependent on real-time solar data, sync accuracy is binary—it's either right or useless. This fix moves them closer to 'right.' However, at $650k mcap, they are still a microscopic experiment.",
      marketCap: "$651K",
      shizzyScore: 42
    }
  },
  { 
    sn: 115, 
    name: "HashiChain", 
    category: "Infrastructure", 
    description: "Cross-subnet identity and cross-chain message passing protocol.",
    teamStatus: "Documented Team",
    details: {
      website: "https://hashichain.ai",
      github: "https://github.com/hashichain/hashichain",
      twitter: "https://x.com/hashichain_ai",
      extendedDescription: "HashiChain acts as the inter-operability layer for Bittensor, enabling subnets to safely exchange data and tokens through a unified messaging standard.",
      partnerships: ["SN114 SOMA", "Cosmos SDK"],
      recentUpdates: [
        "Updated IBC bridge key for mainnet-v2",
        "IBC-v2 bridge live",
        "Cross-subnet-v1 auth integrated"
      ],
      shizzyTake: "Routine maintenance. Updating bridge keys is a required task for mainnet continuity, not a value-add. HashiChain remains the 'plumbing' that needs broad subnet adoption to be a real investment signal.",
      marketCap: "$1.4M",
      shizzyScore: 31
    }
  },
  { 
    sn: 119, 
    name: "Satori", 
    category: "Predictive Systems", 
    description: "Decentralized consensus network for real-time future event forecasting.",
    teamStatus: "Documented Team",
    details: {
      website: "https://satori.ai",
      github: "https://github.com/satori-labs/satori",
      twitter: "https://x.com/satori_ai",
      extendedDescription: "Satori provides a high-frequency forecasting layer for global events, from supply chain shifts to geopolitical trends, rewarding models for early and accurate signals.",
      partnerships: ["SN41 Almanac", "UN Data Lab"],
      recentUpdates: ["Event-v2 prediction engine", "Global-v1 news feed live"]
    }
  },
  ...Array.from({ length: 128 }, (_, i) => { 
    const sn = i + 1; 
    const existing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 126, 127, 128]; 
    if (existing.includes(sn)) return null; 

    // April 2026 Map Integration
    const MAPPED_DATA: Record<number, {name: string, category: string, description: string}> = {
      15: { name: "ORO", category: "AI Agents / AI Tools", description: "Open AI agent benchmark for e-commerce and shopping tasks." },
      16: { name: "BitAds", category: "AI Agents / AI Tools", description: "Pay-per-verified-conversion advertising network." },
      36: { name: "Eirel", category: "AI Agents / AI Tools", description: "Rendix application engine: deploys models & collects real-world feedback." },
      54: { name: "Yanez MIID", category: "AI Agents / AI Tools", description: "Synthetic identity generation for financial anti-fraud system testing." },
      58: { name: "Handshake", category: "AI Agents / AI Tools", description: "Trustless USDC payment channels for AI agents with onchain scoring." },
      59: { name: "Babelbit", category: "AI Agents / AI Tools", description: "Near-instant AI-powered voice-to-voice translation across languages." },
      62: { name: "Ridges", category: "AI Agents / AI Tools", description: "Competitive decentralized platform for building AI coding agents." },
      66: { name: "ninja", category: "AI Agents / AI Tools", description: "Competitive coding agents patching open-source repositories." },
      67: { name: "Harnyx", category: "AI Agents / AI Tools", description: "Deep research API delivering cited synthesis for agents." },
      71: { name: "Leadpoet", category: "AI Agents / AI Tools", description: "B2B sales lead sourcing, validation, and delivery." },
      82: { name: "Hermes", category: "AI Agents / AI Tools", description: "GraphQL layer connecting AI agents to live Web3 data." },
      83: { name: "CliqueAI", category: "AI Agents / AI Tools", description: "AI solver for NP-hard graph optimization problems." },
      85: { name: "Vidaio", category: "AI Agents / AI Tools", description: "AI video upscaling and compression for accessible streaming quality." },
      93: { name: "Bitcast", category: "AI Agents / AI Tools", description: "Connecting creators directly with brands via decentralized incentives." },
      100: { name: "Platform", category: "AI Agents / AI Tools", description: "Collaborative AI research environment for multi-agent development." },
      103: { name: "Djinn", category: "AI Agents / AI Tools", description: "Encrypted sports signals marketplace with verifiable performance escrow." },
      111: { name: "oneoneone", category: "AI Agents / AI Tools", description: "Validation of authentic human web content for AI." },
      114: { name: "SOMA", category: "AI Agents / AI Tools", description: "Intelligence bridge connecting AI subnets via MCP servers." },
      121: { name: "sundae_bar", category: "AI Agents / AI Tools", description: "AI agent discovery and deployment marketplace." },
      122: { name: "Bitrecs", category: "AI Agents / AI Tools", description: "AI recommendation engine for e-commerce personalization." },
      35: { name: "OxMarkets", category: "AI Trading & DeFi", description: "Multi-asset DEX with AI-powered liquidity management." },
      45: { name: "Talisman AI", category: "AI Trading & DeFi", description: "Wallet intelligence layer evolving into an AI-powered command center." },
      53: { name: "Efficient Frontier", category: "AI Trading & DeFi", description: "AI-optimized crypto trading strategies via decentralized competition." },
      73: { name: "MetaHash", category: "AI Trading & DeFi", description: "Slippage-free ALPHA-to-META token swaps for large Bittensor positions." },
      79: { name: "MVTRX", category: "AI Trading & DeFi", description: "Dedicated spot exchange for trading subnet alpha tokens." },
      88: { name: "Investing", category: "AI Trading & DeFi", description: "Decentralized AUM covering TAO staking, equities, and crypto markets." },
      98: { name: "ForeverMoney", category: "AI Trading & DeFi", description: "Advanced DeFi liquidity management via AI intelligence." },
      106: { name: "VoidAI", category: "AI Trading & DeFi", description: "Cross-chain liquidity and wrapped asset layer for Bittensor alpha tokens." },
      112: { name: "Minotaur", category: "AI Trading & DeFi", description: "AI-driven DEX aggregator and swap intent solver engine." },
      113: { name: "TensorUSD", category: "AI Trading & DeFi", description: "Fully onchain TAO-backed stablecoin with non-custodial vault design." },
      116: { name: "TaoLend", category: "AI Trading & DeFi", description: "Decentralized lending protocol using Bittensor alpha tokens as collateral." },
      118: { name: "HODL ETF", category: "AI Trading & DeFi", description: "Long-term TAO staking index for Bittensor conviction holders." },
      123: { name: "MANTIS", category: "AI Trading & DeFi", description: "High-frequency BTC trading signals via incentivized AI cooperation." },
      127: { name: "Astrid", category: "AI Trading & DeFi", description: "AI agents compete to develop and test autonomous trading strategies." },
      11: { name: "TrajectoryRL", category: "AI Training", description: "AI agent policy optimization via competitive reinforcement learning." },
      21: { name: "AdTAO", category: "AI Training", description: "AI-optimized Google Ads campaign management." },
      56: { name: "Gradients", category: "AI Training", description: "Democratized AI model training accessible without technical expertise." },
      94: { name: "Bitsota", category: "AI Training", description: "Compute network paying only for confirmed research progress." },
      97: { name: "distil", category: "AI Training", description: "Winner-take-all LLM compression: miners distil 35B to 5B parameters." },
      102: { name: "Connito AI", category: "AI Training", description: "Decentralized MoE training of 100B+ parameter AI models." },
      33: { name: "ReadyAI", category: "Data Curation", description: "Platform generating multimodal dialogue data for AI training." },
      37: { name: "Aurelius", category: "Data Curation", description: "Adversarial LLM evaluation network generating verifiable AI safety datasets." },
      46: { name: "RESI", category: "Data Curation", description: "Real estate data platform for AI-powered property analysis." },
      70: { name: "NexisGen", category: "Data Curation", description: "Enterprise AI training dataset delivery via competitive miner network." },
      75: { name: "Hippius", category: "Data Curation", description: "Decentralized cloud storage for AI datasets with blockchain verification." },
      48: { name: "Quantum Compute", category: "Compute", description: "Marketplace for running quantum circuits on real quantum processors." },
      51: { name: "lium.io", category: "Compute", description: "GPU rental marketplace with Proof-of-Compute hardware verification." },
      64: { name: "Chutes", category: "Compute", description: "Serverless AI compute for fast API-based model deployment and scaling." },
      95: { name: "Actual", category: "Compute", description: "Inference software for heterogeneous GPU, TPU, and ASIC clusters." },
      105: { name: "Beam", category: "Compute", description: "Bandwidth coordination network with Proof-of-Bandwidth verification." },
      120: { name: "Afine", category: "Compute", description: "RL platform for AutoML and multi-modal model evolution." },
      41: { name: "Almanac", category: "Predictive Systems", description: "Sports market intelligence rewarding profitable trading strategies." },
      50: { name: "Synth", category: "Predictive Systems", description: "Probabilistic price forecasting across crypto and traditional assets via AI." },
      57: { name: "Sparket", category: "Predictive Systems", description: "Sports prediction marketplace with AI-driven odds." },
      17: { name: "404-GEN", category: "Generative AI", description: "Democratized AI-generated 3D content for games and virtual worlds." },
      78: { name: "Vocence", category: "Generative AI", description: "Voice intelligence layer: TTS, STT, voice cloning, and agents." },
      99: { name: "Leoma", category: "Generative AI", description: "AI video generation platform for studio-grade content production." },
      44: { name: "Score", category: "Vision Models", description: "Large-scale vision models trained to understand visual reality." },
      72: { name: "StreetVision", category: "Vision Models", description: "Crowdsourced data network for mapping and autonomous navigation." },
      23: { name: "Trishool", category: "AI Safety", description: "Collaborative AI alignment protocol for safe superintelligence development." },
      34: { name: "BitMind", category: "AI Safety", description: "Detecting AI-generated and deepfake images via decentralized AI." },
      60: { name: "Bitsec", category: "AI Safety", description: "AI agents competing to find and fix software vulnerabilities." },
      61: { name: "RedTeam", category: "AI Safety", description: "Ethical hackers compete to bypass bot detection systems." },
      63: { name: "Enigma", category: "AI Safety", description: "Bounty platform stress-testing critical global technologies." },
      126: { name: "Poker44", category: "AI Safety", description: "AI bot detection models protecting decentralized poker integrity." },
      26: { name: "Kinitro", category: "Robotics", description: "Training embodied AI agents across diverse physical environments." },
      49: { name: "Nepher", category: "Robotics", description: "Physical AI training platform via physics-accurate simulation." },
      124: { name: "Swarm", category: "Robotics", description: "Autonomous drone autopilot trained via distributed AI." },
      55: { name: "Niome", category: "DeSci", description: "Privacy-safe synthetic genomic data for precision medicine research." },
      68: { name: "Nova", category: "DeSci", description: "ML-powered drug discovery platform for therapeutics." },
      107: { name: "Minos", category: "DeSci", description: "Genomic variant calling and benchmarking platform." },
      80: { name: "dogelayer", category: "Mining", description: "Dogecoin and LTC mining with AI validation rewards." },
      89: { name: "InfiniteHash", category: "Mining", description: "Bitcoin Lightning mining pool with validator rewards." },
      65: { name: "TAO Private Network", category: "Other", description: "Censorship-resistant decentralized VPN for private internet access." },
      74: { name: "Gittensor", category: "Other", description: "Rewards open-source developers for autonomous code contributions." },
      84: { name: "ChipForge (Tatsu)", category: "Other", description: "Integrated circuit design via decentralized hardware collaboration." },
      91: { name: "Bitstarter", category: "Other", description: "Pre-vetted subnet launch discovery and TAO pledging platform." },
      117: { name: "BrainPlay", category: "Other", description: "AI models competing in games to benchmark onchain reasoning." }
    };

    if (MAPPED_DATA[sn]) {
      return { sn, name: MAPPED_DATA[sn].name, category: MAPPED_DATA[sn].category, description: MAPPED_DATA[sn].description, teamStatus: 'Undocumented Team' };
    }

    const defaultNames = {"0":"Root","1":"Apex","2":"DSperse","3":"Deprecated","4":"Targon","5":"Hone","6":"Numinous","7":"Allways","8":"Vanta","9":"IOTA","10":"Swap","11":"TrajectoryRL","12":"Compute Horde","13":"Data Universe","14":"TAOHash","15":"ORO","16":"BitAds","17":"404—GEN","18":"Zeus","19":"blockmachine","20":"GroundLayer","21":"AdTAO","22":"Desearch","23":"Trishool","24":"Quasar","25":"Mainframe","26":"Kinitro","27":"Nodexo","28":"gm","29":"Coldint","30":"Pending","31":"Halftime","32":"ItsAI","33":"ReadyAI","34":"BitMind","35":"OxMarkets","36":"Eirel","37":"Aurelius","38":"colosseum","39":"deprecated","40":"Chunking","41":"Almanac","42":"Unknown","43":"Graphite","44":"Score","45":"Talisman AI","46":"RESI","47":"EvolAI","48":"Quantum Compute","49":"Nepher Robotics","50":"Synth","51":"lium.io","52":"Dojo","53":"EfficientFrontier","54":"Yanez MIID","55":"NIOME","56":"Gradients","57":"Sparket.AI","58":"Handshake","59":"Babelbit","60":"Bitsec.ai","61":"RedTeam","62":"Ridges","63":"Enigma","64":"Chutes","65":"TAO Private Network","66":"ninja","67":"Harnyx","68":"NOVA","69":"Unknown","70":"NexisGen","71":"Leadpoet","72":"StreetVision by NATIX","73":"MetaHash","74":"Gittensor","75":"Hippius","76":"Byzantium","77":"Liquidity","78":"Vocence","79":"MVTRX","80":"dogelayer","81":"deprecated","82":"Hermes","83":"CliqueAI","84":"ChipForge (Tatsu)","85":"Vidaio","86":"⚒","87":"Luminar Network","88":"Investing","89":"InfiniteHash","90":"Unknown","91":"Bitstarter #1","92":"TensorClaw","93":"Bitcast","94":"Bitsota","95":"Unknown","96":"Verathos","97":"distil","98":"ForeverMoney","99":"Leoma","100":"Plaτform","101":"Unknown","102":"ConnitoAI","103":"Djinn","104":"for sale (burn to uid1)","105":"Beam","106":"VoidAI","107":"Minos","108":"TalkHead","109":"Academia","110":"Green Compute","111":"oneoneone","112":"minotaur","113":"TensorUSD","114":"SOMA","115":"HashiChain","116":"TaoLend","117":"BrainPlay","118":"HODL","119":"Satori","120":"Affine","121":"sundae_bar","122":"Bitrecs","123":"MANTIS","124":"Swarm","125":"8 Ball","126":"Poker44","127":"Astrid","128":"ByteLeap"}; 
    return { sn, name: defaultNames[sn] || 'Subnet ' + sn, category: 'Unknown', description: 'Active Bittensor subnet.', teamStatus: 'Undocumented Team' }; 
  }).filter(Boolean) as Subnet[]
];
export const BittensorSubnets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All');
  const [selectedSubnet, setSelectedSubnet] = useState<Subnet | null>(null);
  const [taoStats, setTaoStats] = useState<GeckoCoin | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');

  const fetchTaoStats = async () => {
    setLoadingStats(true);
    try {
      const markets = await coinGeckoProxy.getTopMarkets(undefined, true);
      const tao = markets.find(m => m.id === 'bittensor');
      if (tao) {
        setTaoStats(tao);
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error) {
      console.error("Bittensor Network Sync Failure:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTaoStats();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchTaoStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(SUBNETS_DATA.map(s => s.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const teamFilters = useMemo(() => ['All', 'Documented Team', 'Undocumented Team'], []);

  const filteredSubnets = useMemo(() => {
    return SUBNETS_DATA.filter(subnet => {
      const matchesSearch = 
        subnet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.sn.toString().includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'All' || subnet.category === selectedCategory;
      const matchesTeam = selectedTeamFilter === 'All' || subnet.teamStatus === selectedTeamFilter;
      
      return matchesSearch && matchesCategory && matchesTeam;
    });
  }, [searchQuery, selectedCategory, selectedTeamFilter]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* NETWORK HEALTH BAR - AUTOMATION STEP 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-slate-900 rounded-[2rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 scanline opacity-20" />
        
        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <RefreshCw className={`text-orange-500 ${loadingStats ? 'animate-spin' : ''}`} size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Live TAO {lastSync && <span className="block text-[7px] opacity-50 mt-0.5">@ {lastSync}</span>}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white font-mono leading-none">
              {taoStats ? `$${taoStats.current_price.toLocaleString()}` : 'SYNCING...'}
            </p>
            {taoStats && (
              <span className={`text-[8px] font-bold ${taoStats.price_change_percentage_24h_in_currency >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {taoStats.price_change_percentage_24h_in_currency >= 0 ? '+' : ''}{taoStats.price_change_percentage_24h_in_currency.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-slate-400" size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Cap</span>
          </div>
          <p className="text-sm font-black text-white font-mono">
            {taoStats ? `$${(taoStats.market_cap / 1000000000).toFixed(2)}B` : '---'}
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-slate-400" size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24H Volume</span>
          </div>
          <p className="text-sm font-black text-white font-mono">
            {taoStats ? `$${(taoStats.total_volume / 1000000).toFixed(1)}M` : '---'}
          </p>
        </div>

        <div className="bg-orange-600 rounded-2xl p-4 flex items-center justify-between border border-orange-500 font-black italic">
          <div className="flex items-center gap-3">
            <Zap className="text-white animate-pulse" size={16} fill="currentColor" />
            <span className="text-[10px] text-white uppercase tracking-widest">Network Pulse</span>
          </div>
          <div className="text-[10px] bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-2">
            OPERATING
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.hash = '#/bittensor'}
            className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
              Bittensor <span className="text-orange-600">Subnets</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase tracking-widest mt-2">
              Live network directory • {filteredSubnets.length} subnets
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto md:items-center">
          {(searchQuery !== '' || selectedCategory !== 'All' || selectedTeamFilter !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedTeamFilter('All'); }}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-orange-600/5 border border-orange-600/20 rounded-2xl text-orange-600 font-mono text-[10px] uppercase tracking-widest hover:bg-orange-600/10 transition-all whitespace-nowrap order-last md:order-first"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}

          {/* Team Filter Dropdown */}
          <div className="relative w-full md:w-56 group/team">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-orange-500/50 rounded-2xl outline-none text-slate-900 dark:text-white appearance-none transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            >
              {teamFilters.map(filter => (
                <option key={filter} value={filter} className="bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-white">
                  {filter === 'All' ? 'ALL TEAMS' : filter.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            
            {/* Info Tooltip for Team Status Definitions */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden group-hover/team:block">
              <div className="relative group/info">
                <Info size={12} className="text-slate-400 hover:text-orange-500 transition-colors cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-[10px] leading-relaxed text-white rounded-xl shadow-2xl border border-white/10 z-[110] opacity-0 group-hover/info:opacity-100 pointer-events-none transition-all uppercase tracking-tighter text-center">
                  <div className="text-orange-500 font-black mb-1 italic">Documentation Status</div>
                  <div className="mb-2 underline decoration-orange-500/30">Documented Team: Verified identities via official sites.</div>
                  <div className="opacity-70 italic font-mono lowercase">Undocumented Team: Pseudonymous or anonymous profiles.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-orange-500/50 rounded-2xl outline-none text-slate-900 dark:text-white appearance-none transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-white">
                  {cat === 'All' ? 'ALL CATEGORIES' : cat.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, SN, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-orange-500/50 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-mono text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>


      {filteredSubnets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubnets.map((subnet) => (
            <motion.div 
              key={subnet.sn}
              onClick={() => setSelectedSubnet(subnet)}
              whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(249, 115, 22, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-orange-500/40 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-lg border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    {subnet.sn}
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                      {subnet.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest px-2 py-1 bg-orange-500/5 rounded-md">
                        {subnet.category}
                      </span>
                      {subnet.teamStatus && (
                        <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${
                          subnet.teamStatus === 'Documented Team' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        }`}>
                          {subnet.teamStatus === 'Documented Team' ? 'DOCUMENTED TEAM' : 'UNDOCUMENTED TEAM'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
                {subnet.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors pt-8 border-t border-slate-100 dark:border-white/5 mt-8">
                Deep Dive Research <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Filter size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No subnets found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filters.</p>
          </div>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-orange-600 font-mono text-xs uppercase tracking-widest hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
      {/* Modal Backdrop */}
      <AnimatePresence>
        {selectedSubnet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubnet(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-200 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-2xl border border-orange-500/20">
                    {selectedSubnet.sn}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                      {selectedSubnet.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest px-2 py-0.5 bg-orange-500/5 rounded border border-orange-500/10">
                        {selectedSubnet.category}
                      </span>
                      {selectedSubnet.teamStatus && (
                        <div className="group relative flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                            selectedSubnet.teamStatus === 'Documented Team' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                              : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {selectedSubnet.teamStatus === 'Documented Team' ? 'DOCUMENTED TEAM' : 'UNDOCUMENTED TEAM'}
                          </span>
                          <div className="relative">
                            <Info size={12} className="text-slate-400 cursor-help hover:text-orange-500 transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl border border-white/10 text-center uppercase tracking-tighter">
                              {selectedSubnet.teamStatus === 'Documented Team' 
                                ? "Public identities verified via website or official social channels."
                                : "Pseudonymous or anonymous team profiles with unverified identities."}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubnet(null)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {selectedSubnet.details ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Description & Updates */}
                    <div className="lg:col-span-8 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <Info size={18} className="text-orange-500" />
                          Subnet Deep Dive
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic font-medium">
                          {selectedSubnet.details.extendedDescription}
                        </p>
                      </section>

                      {selectedSubnet.details.shizzyTake && (
                        <section className="space-y-4 p-6 bg-orange-500/5 rounded-[2rem] border border-orange-500/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold uppercase tracking-tight">
                              <MessageSquare size={18} />
                              Shizzy Take
                            </div>
                            {selectedSubnet.details.shizzyScore && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] font-black tracking-widest">
                                SHIZZY SCORE: {selectedSubnet.details.shizzyScore}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                            "{selectedSubnet.details.shizzyTake}"
                          </p>
                          {selectedSubnet.details.marketCap && (
                            <div className="pt-4 border-t border-orange-500/10 flex items-center justify-between font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                              <span>Sourced via Shizzy Intelligence</span>
                              <span className="text-orange-600 font-black">EST. MCAP: {selectedSubnet.details.marketCap}</span>
                            </div>
                          )}
                        </section>
                      )}

                      {selectedSubnet.details.recentUpdates && selectedSubnet.details.recentUpdates.length > 0 && (
                        <section className="space-y-4">
                          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                            <Calendar size={18} className="text-orange-500" />
                            Recent Milestones & GitHub Activity
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {selectedSubnet.details.recentUpdates.map((update, idx) => (
                              <div key={idx} className="flex gap-4 p-4 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/5 group hover:border-orange-500/20 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">{update}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right Column: Links & Partnerships */}
                    <div className="lg:col-span-4 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <ExternalLink size={18} className="text-orange-500" />
                          Official Links
                        </div>
                        <div className="space-y-3">
                          {selectedSubnet.details.website && (
                            <a 
                              href={selectedSubnet.details.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-between w-full p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-colors group"
                            >
                              <span className="font-mono text-xs uppercase tracking-widest">Main Website</span>
                              <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                          )}
                          {selectedSubnet.details.github && (
                            <a 
                              href={selectedSubnet.details.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-between w-full p-4 bg-slate-100 dark:bg-white/5 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group border border-slate-200 dark:border-white/5"
                            >
                              <div className="flex items-center gap-2">
                                <Github size={16} />
                                <span className="font-mono text-xs uppercase tracking-widest">Source Code</span>
                              </div>
                              <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
                            </a>
                          )}
                          {selectedSubnet.details.twitter && (
                            <a 
                              href={selectedSubnet.details.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-between w-full p-4 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-2xl hover:bg-[#1DA1F2]/20 transition-colors group border border-[#1DA1F2]/20"
                            >
                              <div className="flex items-center gap-2">
                                <Twitter size={16} />
                                <span className="font-mono text-xs uppercase tracking-widest">X / Twitter</span>
                              </div>
                              <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
                            </a>
                          )}
                        </div>
                      </section>

                      {selectedSubnet.details.partnerships && selectedSubnet.details.partnerships.length > 0 && (
                        <section className="space-y-4">
                          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                            <Users size={18} className="text-orange-500" />
                            Core Partnerships
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedSubnet.details.partnerships.map((partner, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/5"
                              >
                                {partner}
                              </span>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto text-orange-500 border border-orange-500/10">
                      <Activity size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase italic">Deep Dive Pending</h3>
                      <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400 mt-2">
                        Official details for <span className="text-orange-600 font-bold">{selectedSubnet.name}</span> are currently being verified and aggregated.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                      <div className="p-4 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/5 text-left">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Status</h4>
                        <p className="text-sm dark:text-white font-bold italic">Verification Ongoing</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/5 text-left">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Last Sync</h4>
                        <p className="text-sm dark:text-white font-bold italic">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
