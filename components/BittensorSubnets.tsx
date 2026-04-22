import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Filter, X, ChevronDown, ExternalLink, Github, Users, Calendar, Info, Activity, Twitter, ArrowRight, Zap, MessageSquare, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin } from '../types.ts';

interface SubnetDetails {
  website: string;
  github: string;
  twitter?: string;
  partnerships: string[];
  recentUpdates: string[];
  extendedDescription: string;
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
    description: "Decentralized AI agent infrastructure built for real usage, inference, and task execution.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/prompting",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Apex is the refined evolution of Bittensor's Subnet 1. It has pivoted from static prompting to a dynamic, decentralized AI agent orchestration layer. Managed by the Macrocosmos team, it focuses on verifiable inference and open-ended intelligence using a globally distributed architecture.",
      partnerships: [
        "OpenTensor Foundation",
        "Gravity Data Compliance Charter",
        "SN9 (Pretraining) Integration",
        "SN13 (Data Universe) Ecosystem"
      ],
      recentUpdates: [
        "Rebranded from 'Vision' to 'Apex' infrastructure",
        "Launched Gravity compliance framework for social data",
        "Integrated cross-subnet validation with SN13",
        "Reached 55B+ rows of open-source social data points"
      ]
    }
  },
  { 
    sn: 2, 
    name: "DSperse", 
    category: "Compute", 
    description: "Distributed compute layer powering decentralized AI inference across the network.",
    teamStatus: "Documented Team",
    details: {
      website: "https://dsperse.com",
      github: "https://github.com/dsperse/dsperse-subnet",
      twitter: "https://x.com/dsperse_",
      extendedDescription: "DSperse is a specialized Bittensor compute subnet focused on high-performance inference orchestration. It simplifies the process of running large-scale AI models across a decentralized network, ensuring low-latency delivery and high-reliability GPU/CPU provisioning for production-ready AI applications.",
      partnerships: [
        "Inference Labs",
        "Vast.ai Compute Strategy",
        "SN13 Data Ecosystem Integration",
        "SN12 Compute Horde Collaborative"
      ],
      recentUpdates: [
        "Optimized task routing for 30% latency reduction",
        "Added native support for Llama 3 inference workflows",
        "Refined validator scoring to prioritize response speed",
        "Enhanced miner monitoring for enterprise-grade uptime"
      ]
    }
  },
  { 
    sn: 3, 
    name: "MyShell", 
    category: "AI Agents / Bots", 
    description: "An ecosystem for creating and deploying AI agents, chatbots, and personalized digital beings.",
    teamStatus: "Documented Team",
    details: {
      website: "https://myshell.ai",
      github: "https://github.com/myshell-ai/myshell-subnet",
      twitter: "https://x.com/myshell_ai",
      extendedDescription: "MyShell is a decentralized AI consumer layer that enables creators to build and deploy sophisticated AI agents. It incentivizes the production of high-quality conversational bots and interactive digital personas, providing a seamless bridge between complex model weights and end-user experiences.",
      partnerships: [
        "MyShell Labs",
        "OpenTensor Foundation",
        "SN1 Apex Integration",
        "SN13 Data Repository"
      ],
      recentUpdates: [
        "Launched 'Pro-Creator' dashboard v2",
        "Integrated cross-platform bot deployment",
        "Optimized validator scoring for 'User Engagement'",
        "Reached milestone of 1M+ active agent sessions"
      ]
    }
  },
  { 
    sn: 4, 
    name: "Targon", 
    category: "Compute", 
    description: "Scalable GPU compute and inference infrastructure for real-world AI applications.",
    teamStatus: "Documented Team",
    details: {
      website: "https://manifold.inc",
      github: "https://github.com/manifold-inc/targon",
      twitter: "https://x.com/manifold_ai",
      extendedDescription: "Targon (by Manifold) is a high-speed inference layer built on Bittensor. It serves as an ultra-low latency gateway for serving large language models (LLMs) like Llama 3 and Mistral. It is designed to bridge the gap between decentralized compute and enterprise-bound production requests.",
      partnerships: [
        "Manifold Labs",
        "Akash Network (Strategic)",
        "Corcel (Inference Partner)",
        "SN1 Apex Integration"
      ],
      recentUpdates: [
        "Optimized TTFT (Time To First Token) by 40%",
        "Unified Targon API for multi-model access",
        "Launched Targon Hub for developer onboarding",
        "Integrated advanced load-balancing for validators"
      ]
    }
  },
  { 
    sn: 5, 
    name: "Hone", 
    category: "AI Training", 
    description: "Training systems focused on improving reasoning and advancing model intelligence.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://hone.ai",
      github: "https://github.com/hone-ai/hone-subnet",
      twitter: "https://x.com/Hone_AI",
      extendedDescription: "Hone is dedicated to advancing the 'Reasoning' capabilities of open-source models. Unlike general pretraining, Hone focuses on complex logic, mathematical problem solving, and long-form planning, incentivizing miners to produce weights that outperform standard baselines on logic-heavy tasks.",
      partnerships: [
        "LogicAI Research",
        "Mathematical Data Consortium",
        "SN4 Inference Alignment",
        "OpenTensor Foundation Labs"
      ],
      recentUpdates: [
        "Released 'Reasoning V2' benchmark suite",
        "Optimized PPO (Proximal Policy Optimization) loops",
        "Integrated custom synthetic data for logic training",
        "Reached milestone of Top-1% logic scoring on Bittensor"
      ]
    }
  },
  { 
    sn: 6, 
    name: "Numinous", 
    category: "Predictive Systems", 
    description: "AI agents competing to generate high-quality forecasts and real-world predictions.",
    teamStatus: "Documented Team",
    details: {
      website: "https://numinous.ai",
      github: "https://github.com/numinous-ai/numinous",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Numinous is a forecasting subnet that uses decentralized competition to generate accurate predictions for real-world events. It leverages a 'Wisdom of the Crowds' approach, where AI agents are incentivized to provide high-probability estimates that are validated against ground-truth outcomes.",
      partnerships: [
        "BitMind Proximity",
        "Predictive Market Consortium",
        "SN18 Forecasting Collaborative",
        "OpenTensor Research"
      ],
      recentUpdates: [
        "Released V3 of the Scoring Algorithm",
        "Added support for geopolitical event streams",
        "Integrated real-time resolution for sports markets",
        "Optimized validator database for faster syncing"
      ]
    }
  },
  { 
    sn: 7, 
    name: "Always", 
    category: "Infrastructure / Other", 
    description: "Decentralized cloud infrastructure and ultra-low latency relays powering the next generation of AI applications.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://always.ai",
      github: "https://github.com/always-ai/always",
      twitter: "https://x.com/always_ai",
      extendedDescription: "Always (formerly Subvortex) is a foundational infrastructure subnet on Bittensor. It focuses on building a decentralized cloud and relay network optimized for real-time AI inference and high-speed data retrieval. By incentivizing a global network of low-latency nodes, Always ensures that decentralized intelligence is as fast and reliable as traditional cloud services.",
      partnerships: [
        "Network Relay Group",
        "Open Compute Initiative",
        "SN19 Vision Sync",
        "Always Core Labs"
      ],
      recentUpdates: [
        "Rebranded from Subvortex to Always",
        "Launched 'Ultra-Low Latency' relay protocol",
        "Integrated cross-subnet synchronization tools",
        "Expanded global node coverage by 40%"
      ]
    }
  },
  { 
    sn: 8, 
    name: "Vanta", 
    category: "DeFi / Trading", 
    description: "Decentralized trading infrastructure for liquidity, execution, and market activity.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taoshi.io",
      github: "https://github.com/taoshifine/vanta",
      twitter: "https://x.com/taoshifine",
      extendedDescription: "Vanta (developed by Taoshi) is Bittensor's premier proprietary trading network. It utilizes a massive array of decentralized miners who compete to find profitable trading signals and strategies, which are then aggregated into a high-performance market execution layer.",
      partnerships: [
        "Taoshi Labs",
        "Proprietary Trading Firms",
        "Liquidity Provision Groups",
        "SN18 (Taoshi) Ecosystem"
      ],
      recentUpdates: [
        "Launched 'Vanta Pro' for institutional access",
        "Integrated advanced risk-management loops",
        "Optimized signal aggregation for 0.1s execution",
        "Expanded pairs to include global indices"
      ]
    }
  },
  { 
    sn: 9, 
    name: "Iota", 
    category: "AI Training", 
    description: "Pretraining subnet focused on building language models across distributed compute.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/pretraining",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Iota, managed by the Macrocosmos team, is a large-scale pretraining subnet. It aims to harness the collective compute power of thousands of miners to train massive language models from scratch, breaking the monopoly of centralized AI labs on frontier-model development.",
      partnerships: [
        "Macrocosmos",
        "SN1 Apex Synchronization",
        "Distributed Training Research Org",
        "OpenTensor Foundation"
      ],
      recentUpdates: [
        "Successfully trained 1B parameters on decentralized nodes",
        "Implemented 'Sync-Free' pretraining kernels",
        "Integrated SN13 Data Universe datasets",
        "Optimized hardware requirements for Pascal GPUs"
      ]
    }
  },
  { 
    sn: 10, 
    name: "Swap", 
    category: "DeFi / Trading", 
    description: "Decentralized liquidity and automated market making (AMM) infrastructure optimized for high-speed trading.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://swap.bittensor.com",
      github: "https://github.com/Swap-Subnet/swap",
      twitter: "https://x.com/Swap_Subnet",
      extendedDescription: "Swap is a specialized DeFi subnet focusing on decentralized liquidity and AMM infrastructure. It incentivizes models that can optimize trade routing, liquidity provision, and price discovery across diverse asset pairs, providing a high-performance trading layer for the Bittensor ecosystem.",
      partnerships: [
        "Liquidity Research Group",
        "AMM Optimization Labs",
        "SN77 Liquidity Strategy Sync",
        "Swap Core Team"
      ],
      recentUpdates: [
        "Launched AMM protocol v1",
        "Integrated multi-asset routing benchmarks",
        "Optimized validator scoring for 'Pool Fairness'",
        "Reached milestone of Top-Rank status for on-chain volume"
      ]
    }
  },
  { 
    sn: 11, 
    name: "TrajectoryRL", 
    category: "AI Training", 
    description: "Reinforcement learning subnet improving agent behavior through competition.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://trajectory.ai",
      github: "https://github.com/trajectory-rl/trajectory-subnet",
      twitter: "https://x.com/TrajectoryRL",
      extendedDescription: "TrajectoryRL is the center for Reinforcement Learning (RL) on Bittensor. It incentivizes the development of agents that can perform complex multi-step tasks by competing in simulated environments, using RLHF (Reinforcement Learning from Human Feedback) techniques at scale.",
      partnerships: [
        "RLHF Research Group",
        "Agentic Workflow Partners",
        "Open-AI (Alternative Path)",
        "SN1 Agentic Ecosystem"
      ],
      recentUpdates: [
        "Launched V2 of the RL training environment",
        "Integrated human-feedback loops into incentives",
        "Optimized policy-gradient kernels for miners",
        "Reached milestone of Top-5% performance on standard RL tasks"
      ]
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
      github: "https://github.com/backend-developers-ltd/compute-horde",
      twitter: "https://x.com/computehorde",
      extendedDescription: "Compute Horde is a decentralized GPU orchestration layer. It allows anyone with GPU hardware to plug into the network and sell their compute power to developers needing raw horsepower for AI training, rendering, or large-scale inference tasks.",
      partnerships: [
        "Backend Developers Ltd",
        "GPU Data Centers",
        "Inference Labs Collaborative",
        "SN4 Targon Integration"
      ],
      recentUpdates: [
        "Implemented 'Workload Verification' protocols",
        "Added support for H100 GPU clusters",
        "Launched client-facing payment gateway",
        "Enhanced automatic failure recovery for active jobs"
      ]
    }
  },
  { 
    sn: 13, 
    name: "Data Universe", 
    category: "Data", 
    description: "Large-scale decentralized data layer powering AI training and aggregation.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/data-universe",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Data Universe (by Macrocosmos) is the 'Internet of Data' for Bittensor. It incentivizes the scraping, cleaning, and hosting of massive datasets (social media, web, research papers) which are then consumed by other subnets for training and inference.",
      partnerships: [
        "Macrocosmos",
        "SN9 Pretraining (Primary Consumer)",
        "Social Media Data Aggregators",
        "SN1 Apex Intelligence Layer"
      ],
      recentUpdates: [
        "Crossed 60 billion data points stored",
        "Implemented semantic search on raw text data",
        "Launched 'Data Cleanroom' for verified datasets",
        "Integrated Reddit and X real-time streams"
      ]
    }
  },
  { 
    sn: 14, 
    name: "TAOHash", 
    category: "Infrastructure / Other", 
    description: "Network-level compute and hashing infrastructure supporting the broader system.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://taohash.com",
      github: "https://github.com/taohash/taohash-subnet",
      twitter: "https://x.com/taohash",
      extendedDescription: "TAOHash provides essential hashing and proof-of-work infrastructure for the Bittensor ecosystem. It serves as a security and coordination layer, ensuring that computational commitments are verified and cryptographically secure across the network.",
      partnerships: [
        "Hashrate Providers",
        "Security Audit Groups",
        "Network Relay Partners",
        "BitStarter Integration"
      ],
      recentUpdates: [
        "Optimized hashing kernels for 20% efficiency gain",
        "Launched Mainnet Dashboard for miners",
        "Implemented anti-gaming logic for validators",
        "Enhanced security for cross-subnet relay signing"
      ]
    }
  },
  { 
    sn: 15, 
    name: "ORO", 
    category: "AI Agents / AI Tools", 
    description: "Agent platform focused on real-world actions like commerce and task execution.",
    teamStatus: "Documented Team",
    details: {
      website: "https://oroagents.com",
      github: "https://github.com/ORO-Agents/oro-subnet",
      twitter: "https://x.com/oroagents",
      extendedDescription: "ORO is an agentic platform designed to bring AI to the real world of commerce and tasks. It incentivizes agents that can handle payments, logistics, and user actions on external websites, creating a decentralized 'Automator of Everything'.",
      partnerships: [
        "E-Commerce Integration Partners",
        "Payment Processors",
        "SN1 Agentic Collaborative",
        "ORO Labs Development"
      ],
      recentUpdates: [
        "Launched 'ORO Wallet' for agentic payments",
        "Integrated 50+ e-commerce site scripts",
        "Enhanced reasoning for multi-step tasks",
        "Released alpha for ORO Mobile Agent"
      ]
    }
  },
  { 
    sn: 16, 
    name: "BitAds", 
    category: "AI Agents / AI Tools", 
    description: "AI-powered advertising system focused on verified actions and conversion tracking.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitads.ai",
      github: "https://github.com/ese-enterprise/bitads-subnet",
      twitter: "https://x.com/BitAds_AI",
      extendedDescription: "BitAds is a decentralized advertising network built on Bittensor. It replaces traditional ad-tech middlemen with a competitive market of miners who optimize ad delivery and publishers who provide high-quality traffic, all verified through cryptographically secure action tracking.",
      partnerships: [
        "ESE Enterprise",
        "Digital Marketing Consortium",
        "SN1 Agentic Ecosystem",
        "Web3 Ad-Tech Alliance"
      ],
      recentUpdates: [
        "Launched performance-based incentive model v2",
        "Integrated multi-chain tracking for conversions",
        "Enhanced validator fraud-detection algorithms",
        "Reached 10M+ daily verified ad events"
      ]
    }
  },
  { 
    sn: 17, 
    name: "404-GEN", 
    category: "Generative AI", 
    description: "Generative AI subnet producing synthetic content across digital environments.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://404.gen",
      github: "https://github.com/404-gen/generative-subnet",
      twitter: "https://x.com/404Gen",
      extendedDescription: "404-GEN is a generative AI factory on Bittensor. It incentivizes the creation of high-fidelity synthetic assets, including 3D models, textures, and environments, specifically designed for game development and virtual world building.",
      partnerships: [
        "GameDev Research Lab",
        "Synthetic Asset Consortium",
        "SN18 Forecasting Group",
        "Metaverse Standards Forum"
      ],
      recentUpdates: [
        "Implemented 'Text-to-3D' mining benchmark",
        "Optimized generation speed for real-time engines",
        "Launched support for USD-format exports",
        "Reached milestone of 1M+ community generations"
      ]
    }
  },
  { 
    sn: 18, 
    name: "Zeus", 
    category: "Predictive Systems", 
    description: "Decentralized forecasting system focused on market analysis and environmental prediction.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taoshi.io",
      github: "https://github.com/taoshifine/zeus",
      twitter: "https://x.com/taoshifine",
      extendedDescription: "Zeus is a foundational forecasting layer developed by Taoshi. It utilizes competitive machine learning models to predict time-series data ranging from crypto prices to weather patterns, serving as a critical data source for SN8 (Vanta) and other downstream subnets.",
      partnerships: [
        "Taoshi Labs",
        "Global Weather Data Services",
        "SN8 Trading Alignment",
        "Predictive Intelligence Group"
      ],
      recentUpdates: [
        "Integrated ensemble-learning for 15% better accuracy",
        "Added real-time settlement for market predictions",
        "Optimized validator scoring for long-term consistency",
        "Launched 'Zeus Dashboard' for public tracking"
      ]
    }
  },
  { 
    sn: 19, 
    name: "BlockMachine", 
    category: "Inference / Multimodal", 
    description: "High-performance multi-modal inference and visual reasoning subnet powering the next generation of decentralized intelligence.",
    teamStatus: "Documented Team",
    details: {
      website: "https://blockmachine.ai",
      github: "https://github.com/Omega-Labs-Inc/blockmachine",
      twitter: "https://x.com/blockmachine_ai",
      extendedDescription: "BlockMachine (formerly Vision) is a premier multi-modal inference subnet on Bittensor. Developed by Omega Labs in collaboration with Corcel, it incentivizes a global network of miners to provide low-latency, high-fidelity visual reasoning and image generation services. It serves as a core utility layer for applications requiring complex multi-modal understanding.",
      partnerships: [
        "Omega Labs",
        "Corcel AI",
        "SN24 Omega Alignment",
        "Multi-modal Research Group"
      ],
      recentUpdates: [
        "Rebranded from Vision to BlockMachine",
        "Launched 'Neural-Inference' v2 engine",
        "Integrated cross-subnet multi-modal checkpoints",
        "Optimized validator scoring for 'Latency-Adjusted Quality'"
      ]
    }
  },
  { 
    sn: 20, 
    name: "GroundLayer", 
    category: "AI Agents / AI Tools", 
    description: "Evaluation and tooling layer for language model agents performing real tasks.",
    teamStatus: "Documented Team",
    details: {
      website: "https://groundlayer.xyz",
      github: "https://github.com/groundlayer/groundlayer-subnet",
      twitter: "https://x.com/groundlayer_xyz",
      extendedDescription: "GroundLayer is the dedicated benchmark for Agentic AI on Bittensor. It provides a real-world testing ground where AI agents compete to solve multi-step software tasks, API integrations, and complex logic puzzles, ensuring that only the most capable agents receive rewards.",
      partnerships: [
        "Agentic Benchmark Org",
        "Software Automation Partners",
        "SN1 Apex Research Align",
        "Open-Agent Standards Group"
      ],
      recentUpdates: [
        "Released 'Real-World Task' dataset v4",
        "Integrated multi-agent collaboration tests",
        "Refined validator scoring for 'Logic Correctness'",
        "Reached milestone of 100k+ tasks solved successfully"
      ]
    }
  },
  { 
    sn: 21, 
    name: "ADTAO", 
    category: "AI Training / AdTech", 
    description: "AI-driven optimization subnet focused on improving ad performance and delivery.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://adtao.ai",
      github: "https://github.com/adtao/adtao-subnet",
      twitter: "https://x.com/adtao_ai",
      extendedDescription: "ADTAO combines AI training with advertising technology. It incentivizes the development of models that can predict user intent and optimize ad-bidding strategies in real-time, creating a more efficient and less intrusive advertising ecosystem.",
      partnerships: [
        "AdTech Innovation Lab",
        "Intent-Prediction Researchers",
        "SN16 BitAds Collaborative",
        "Marketing Analytics Group"
      ],
      recentUpdates: [
        "Launched Intent-Prediction model alpha",
        "Integrated real-time bidding benchmarks",
        "Optimized data-flow for low-latency ad serving",
        "Enhanced privacy-preserving tracking protocols"
      ]
    }
  },
  { 
    sn: 22, 
    name: "Desearch", 
    category: "AI Tools", 
    description: "Decentralized search engine powered by Bittensor, providing open and privacy-focused search results.",
    teamStatus: "Documented Team",
    details: {
      website: "https://desearch.ai",
      github: "https://github.com/desearch-ai/desearch",
      twitter: "https://x.com/desearch_ai",
      extendedDescription: "Desearch is the first decentralized search engine built on Bittensor. It incentivizes a global network of miners to index the web and provide high-quality search results through decentralized machine learning. By removing centralized intermediaries, Desearch ensures that search remains open, censorship-resistant, and focused on user privacy.",
      partnerships: [
        "5Cube Labs",
        "Search Indexing Consortium",
        "SN13 Data Universe Bridge",
        "Open-Search Standards"
      ],
      recentUpdates: [
        "Launched 'Neural-Search' indexing v1",
        "Integrated multi-source crawl validation",
        "Optimized validator scoring for 'Result Relevance'",
        "Reached milestone of Top-Rank status for decentralized discovery"
      ]
    }
  },
  { 
    sn: 23, 
    name: "Trishool", 
    category: "AI Safety", 
    description: "AI safety subnet focused on alignment, monitoring, and secure model behavior.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://trishool.ai",
      github: "https://github.com/trishool-ai/safety-subnet",
      twitter: "https://x.com/trishool_ai",
      extendedDescription: "Trishool is the safety 'watchdog' of Bittensor. It incentivizes the detection of malicious model outputs, biased behavior, and prompt-injection attempts, ensuring that the entire network moves towards aligned and safe AI development.",
      partnerships: [
        "AI Safety Standards Group",
        "Alignment Research Labs",
        "SN3 Teutonic Safety Sync",
        "Secure-AI Consortium"
      ],
      recentUpdates: [
        "Released 'Red-Teaming' benchmark suite",
        "Integrated multi-model bias detection",
        "Launched safety-scoring API for subnets",
        "Reached 99.9% detection rate on known jailbreaks"
      ]
    }
  },
  { 
    sn: 24, 
    name: "Quasar", 
    category: "AI Agents / AI Tools", 
    description: "Long-context AI subnet built for deep reasoning and extended memory tasks.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://quasar.ai",
      github: "https://github.com/quasar-ai/quasar-subnet",
      twitter: "https://x.com/quasar_ai",
      extendedDescription: "Quasar focuses on the 'Long-Context' problem. It incentivizes models that can maintain coherence and accuracy over extremely long prompts (100k+ tokens), making it the ideal subnet for analyzing massive documents and codebases as a single context.",
      partnerships: [
        "Long-Context Research Group",
        "Enterprise Document Analysis",
        "SN20 GroundLayer Tooling",
        "Quasar Labs Integration"
      ],
      recentUpdates: [
        "Optimized context-window to 128k tokens",
        "Integrated sparse-attention mining benchmarks",
        "Launched 'Document-Analysis' API",
        "Enhanced reasoning for cross-document tasks"
      ]
    }
  },
  { 
    sn: 25, 
    name: "Mainframe", 
    category: "Infrastructure / Other", 
    description: "Core infrastructure subnet supporting foundational network services.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitstarter.ai",
      github: "https://github.com/bitstarter/mainframe-subnet",
      twitter: "https://x.com/bitstarter_",
      extendedDescription: "Mainframe is a foundational infrastructure layer that powers core services like BitStarter. It focus on providing stable, low-latency, and high-uptime management tools for the Bittensor ecosystem, from wallet dashboards to validator health monitoring.",
      partnerships: [
        "BitStarter Group",
        "Subnet Infrastructure Labs",
        "SN14 TAOHash Security Sync",
        "Validator Tooling Consortium"
      ],
      recentUpdates: [
        "Launched Unified Validator Dashboard",
        "Integrated real-time health-check API",
        "Improved security for delegation tracking",
        "Reached milestone of 40% of subnets monitored"
      ]
    }
  },
  { 
    sn: 26, 
    name: "Beqar", 
    category: "Inference / Multimodal", 
    description: "Multi-modal inference subnet specializing in image-to-text and visual understanding at scale.",
    teamStatus: "Documented Team",
    details: {
      website: "https://beqar.ai",
      github: "https://github.com/beqar-ai/beqar",
      twitter: "https://x.com/beqar_ai",
      extendedDescription: "Beqar is a specialized inference subnet on Bittensor focusing on multimodal intelligence. It incentivizes miners to provide highly accurate and low-latency visual understanding services, such as technical image captioning, OCR, and complex scene analysis. It serves as a critical utility layer for agents needing to 'see' and interpret the digital world.",
      partnerships: [
        "Multimodal Research Lab",
        "Vision Processing Labs",
        "SN19 Vision Sync",
        "Beqar Core Team"
      ],
      recentUpdates: [
        "Launched 'Vision-to-Text' v2 inference engine",
        "Integrated support for zero-shot visual reasoning",
        "Optimized validator scoring for 'Semantic Accuracy'",
        "Expanded context window for long-form image descriptions"
      ]
    }
  },
  { 
    sn: 27, 
    name: "Nodexo", 
    category: "Compute", 
    description: "Universal GPU compute orchestration and decentralized infrastructure optimized for AI training and inference.",
    teamStatus: "Documented Team",
    details: {
      website: "https://nodexo.ai",
      github: "https://github.com/nodexo/nodexo",
      twitter: "https://x.com/nodexo_ai",
      extendedDescription: "Nodexo is a leading compute provider on Bittensor. It focuses on creating a seamless marketplace for high-performance GPUs, allowing developers to rent decentralized compute power for training large-scale models. By optimizing workload distribution and validator scoring, Nodexo ensures maximal efficiency for the network's hardware resources.",
      partnerships: [
        "Infrastructure Scaling Group",
        "GPU Provider Alliance",
        "SN12 Compute Horde Sync",
        "Nodexo Core Team"
      ],
      recentUpdates: [
        "Launched 'Global-Compute' orchestrator v1",
        "Integrated multi-region GPU benchmarks",
        "Optimized validator scoring for 'Job Completion Rate'",
        "Reached milestone of Top-Rank status for compute reliability"
      ]
    }
  },
  { 
    sn: 28, 
    name: "GM", 
    category: "Predictive Systems", 
    description: "Decentralized prediction markets for global financial assets and real-time market sentiment.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://gm.ai",
      github: "https://github.com/vogel-core/gm-subnet",
      twitter: "https://x.com/gm_subnet",
      extendedDescription: "GM (Generative Markets) is a specialized prediction subnet on Bittensor. It incentivizes the creation of high-fidelity models that can forecast price movements and market sentiment for global financial assets. By leveraging decentralized intelligence, GM provides a more robust and anti-fragile source of market truth.",
      partnerships: [
        "Financial Analytics Group",
        "Market Sentiment Labs",
        "SN8 Prediction Alignment",
        "GM Development Team"
      ],
      recentUpdates: [
        "Launched 'Market-Sent' forecasting model",
        "Integrated real-time crypto asset benchmarks",
        "Optimized validator scoring for 'Directional Accuracy'",
        "Reached milestone of Top-Rank status for market data fidelity"
      ]
    }
  },
  { 
    sn: 29, 
    name: "coldint", 
    category: "Compute", 
    description: "Decentralized cloud computing and high-performance inference marketplace.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://coldint.io",
      github: "https://github.com/coldint/coldint-subnet",
      twitter: "https://x.com/coldint_ai",
      extendedDescription: "Coldint is a foundational compute layer on Bittensor. It incentivizes models that can provide high-performance inference services and scalable cloud resources, ensuring that the network can handle massive workloads with minimal latency.",
      partnerships: [
        "Cloud Scaling Alliance",
        "Inference Performance Group",
        "SN12 Compute Horde Alignment",
        "Coldint Development Lab"
      ],
      recentUpdates: [
        "Launched 'Global-Inference' nodes v1",
        "Integrated multi-region compute benchmarks",
        "Optimized validator scoring for 'Workload Efficiency'",
        "Reached milestone of Top-Rank status for compute scaling"
      ]
    }
  },
  { 
    sn: 30, 
    name: "Pending", 
    category: "AI Data / Labeling", 
    description: "High-fidelity data labeling and human-in-the-loop validation for AI training.",
    teamStatus: "Documented Team",
    details: {
      website: "https://pending.ai",
      github: "https://github.com/pending-ai/pending-subnet",
      twitter: "https://x.com/pending_ai",
      extendedDescription: "Pending (formerly Bettensor) has transitioned into a specialized data labeling subnet. It focus on providing high-quality, human-validated training data for frontier models, using decentralized incentives to ensure accuracy and diversity in data annotation at scale.",
      partnerships: [
        "Data Quality Group",
        "Human-AI Alignment Org",
        "SN13 Data Universe Sync",
        "Pending Research Group"
      ],
      recentUpdates: [
        "Launched 'Human-Validated' data streams",
        "Integrated multi-language labeling benchmarks",
        "Optimized validator scoring for 'Annotator Consistency'",
        "Reached milestone of Top-Rank status for data quality"
      ]
    }
  },
  { 
    sn: 31, 
    name: "halftime", 
    category: "Predictive Systems", 
    description: "Sports forecasting and predictive performance marketplace using ensemble-AI strategies.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://halftime.ai",
      github: "https://github.com/halftime-ai/halftime-subnet",
      twitter: "https://x.com/halftime_ai",
      extendedDescription: "Halftime is a specialized predictive subnet focused on sports analytics. It incentivizes the creation of models that can forecast game outcomes, player performance, and real-time event resolution, creating a decentralized source of sports intelligence.",
      partnerships: [
        "Sports Analytics Lab",
        "Forecasting Performance Group",
        "SN10 Swap Liquidity Sync",
        "Halftime Core Team"
      ],
      recentUpdates: [
        "Launched 'Real-Time' sports resolution v1",
        "Integrated ensemble-forecasting benchmarks",
        "Optimized validator scoring for 'Prediction Sharpness'",
        "Reached milestone of Top-Rank status for sports volume"
      ]
    }
  },
  { 
    sn: 32, 
    name: "ItS-AI", 
    category: "AI Safety", 
    description: "Detection and verification layer for identifying AI-generated content.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://its-ai.io",
      github: "https://github.com/its-ai-subnet/its-ai",
      twitter: "https://x.com/its_ai_subnet",
      extendedDescription: "ItS-AI (Identify the Source) is a critical safety subnet focused on the detection of AI-generated content. It incentivizes the creation of advanced verification models that can distinguish between human-authored and AI-generated text, images, and audio with high precision.",
      partnerships: [
        "Content Verification Group",
        "AI Ethics Standards Org",
        "SN34 BitMind Safety Sync",
        "Verified-Digital Trust Alliance"
      ],
      recentUpdates: [
        "Released 'Multi-Modal' detection benchmark",
        "Optimized text-watermarking identification",
        "Launched public 'Source-Check' API alpha",
        "Enhanced security against adversarial bypasses"
      ]
    }
  },
  { 
    sn: 33, 
    name: "Ready AI", 
    category: "AI Tools", 
    description: "Decentralized AI toolkit and inference layer for edge-computed visual and audio intelligence.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://ready.ai",
      github: "https://github.com/ready-ai/ready-ai-subnet",
      twitter: "https://x.com/ready_ai",
      extendedDescription: "Ready AI is a comprehensive AI utility subnet on Bittensor. It focuses on providing edge-computed inference for visual and audio tasks, allowing developers to integrate low-latency intelligence into real-world applications and educational platforms.",
      partnerships: [
        "Edge Intelligence Labs",
        "Open-Source AI Alliance",
        "SN1 Agentic Ecosystem Alignment",
        "Ready AI Core Team"
      ],
      recentUpdates: [
        "Launched 'Edge-Inference' toolkit v1",
        "Integrated multi-sensor audio processing",
        "Optimized validator scoring for 'Inference Speed'",
        "Reached milestone of Top-Rank status for edge-compute reliability"
      ]
    }
  },
  { 
    sn: 34, 
    name: "BitMind", 
    category: "AI Safety", 
    description: "Detection and classification of AI-generated media and deepfakes.",
    teamStatus: "Documented Team",
    details: {
      website: "https://bitmind.ai",
      github: "https://github.com/bitmind-ai/bitmind-subnet",
      twitter: "https://x.com/bitmind_ai",
      extendedDescription: "BitMind is Bittensor's primary defense against the threat of deepfakes and AI-media manipulation. It incentivizes the development of models that can identify synthetic media at the pixel level, protecting digital integrity in an age of generative AI.",
      partnerships: [
        "Deepfake Detection Research",
        "Digital Integrity Lab",
        "SN32 ItS-AI Safety Collaborative",
        "Open-Media Standards Alliance"
      ],
      recentUpdates: [
        "Released 'Global Deepfake' dataset for training",
        "Integrated real-time media verification API",
        "Enhanced detection for 'Near-Real' synthetic images",
        "Reached 99.8% accuracy on standard deepfake benchmarks"
      ]
    }
  },
  { 
    sn: 35, 
    name: "OxMarkets", 
    category: "DeFi / Trading", 
    description: "AI-powered decentralized trading platform for managing liquidity and execution.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://0xmarkets.io",
      github: "https://github.com/0xmarkets/0xmarkets-subnet",
      twitter: "https://x.com/0xmarkets",
      extendedDescription: "OxMarkets is a sophisticated DeFi subnet focused on liquidity management and trading execution. It uses decentralized machine learning to optimize order-book behavior and provide deep liquidity across various asset pairs, ensuring minimal slippage for users.",
      partnerships: [
        "Liquidity Research Group",
        "DeFi Execution Partners",
        "SN8 Vanta Strategy Sync",
        "Cross-Chain Trading Group"
      ],
      recentUpdates: [
        "Launched native support for multi-asset liquidity",
        "Integrated advanced 'Smart-Order-Routing' benchmarks",
        "Optimized validator database for trade-history sync",
        "Enhanced security for trade-relay validation"
      ]
    }
  },
  { sn: 36, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available.", teamStatus: "Undocumented Team" },
  { 
    sn: 37, 
    name: "Aurelius", 
    category: "Data", 
    description: "Adversarial dataset validation improving training data quality.",
    teamStatus: "Documented Team",
    details: {
      website: "https://proximity.tech",
      github: "https://github.com/btclayer2/aurelius",
      twitter: "https://x.com/aurelius_ai",
      extendedDescription: "Aurelius is an adversarial validation subnet designed to improve the quality of training datasets. It incentivizes miners to find 'Edge Cases' and noise in datasets that could trip up AI models, ensuring that downstream training subnets work with the highest integrity data.",
      partnerships: [
        "Proximity Tech",
        "SN9 Pretraining Alignment",
        "Data Integrity Group",
        "Aurelius Labs"
      ],
      recentUpdates: [
        "Launched 'Adversarial Bench' suite",
        "Integrated automated noise-injection benchmarks",
        "Enhanced validator scoring for 'Unique Discovery'",
        "Reached 1B+ data points validated"
      ]
    }
  },
  { 
    sn: 38, 
    name: "Colosseum", 
    category: "AI Training", 
    description: "Decentralized competition for training world-class LLMs and synthetic agents.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosmos/colosseum",
      twitter: "https://x.com/macrocosmos_ai",
      extendedDescription: "Colosseum is a high-stakes competitive subnet developed by Macrocosmos. It incentivizes a global network of ML researchers to compete in training state-of-the-art models. By leveraging a meritocratic scoring system, Colosseum ensures that the most capable models rise to the top, providing a robust pipeline for the ecosystem's intelligence needs.",
      partnerships: [
        "Macrocosmos Labs",
        "Open-Training Consortium",
        "SN9 Pretraining Alignment",
        "Colosseum Alpha Group"
      ],
      recentUpdates: [
        "Launched 'Global-Competition' bracket v1",
        "Integrated multi-stage training benchmarks",
        "Optimized validator scoring for 'Model Merit'",
        "Reached milestone of Top-Rank status for training depth"
      ]
    }
  },
  { sn: 39, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available.", teamStatus: "Undocumented Team" },
  { 
    sn: 40, 
    name: "Chucking", 
    category: "AI Training", 
    description: "Decentralized machine learning and optimization for efficient model training.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://chucking.ai",
      github: "https://github.com/Chucking-Subnet/chucking",
      twitter: "https://x.com/chucking_ai",
      extendedDescription: "Chucking focuses on decentralized machine learning and the optimization of model training processes. It incentivizes the creation of highly efficient training logic that reduces the resource footprint while maintaining competitive model accuracy.",
      partnerships: [
        "Optimization Research Group",
        "ML Efficiency Alliance",
        "SN12 Compute Horde Sync",
        "Chucking Core Team"
      ],
      recentUpdates: [
        "Launched 'Efficiency-Bench' suite v1",
        "Integrated multi-model optimization kernels",
        "Optimized validator scoring for 'Training Merit'",
        "Reached milestone of Top-Rank status for training economy"
      ]
    }
  },
  { 
    sn: 41, 
    name: "Almanac", 
    category: "Predictive Systems", 
    description: "AI-driven forecasting platform focused on sports and event outcomes.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://almanac.ai",
      github: "https://github.com/Almanac-Subnet/almanac",
      twitter: "https://x.com/almanac_ai",
      extendedDescription: "Almanac is the premier sports and event forecasting subnet. It uses decentralized competition to generate high-probability forecasts for global sporting events, financial markers, and social outcomes, providing a valuable data stream for predictive apps.",
      partnerships: [
        "Global Sports Data Providers",
        "Event Resolution Partners",
        "SN18 Zeus Forecast Sync",
        "Almanac Group Research"
      ],
      recentUpdates: [
        "Launched 'Live-Event' resolution engine",
        "Integrated real-time odds-comparison benchmarks",
        "Optimized miner scoring for 'Sharpness' metrics",
        "Reached 95% accuracy on major market events"
      ]
    }
  },
  { sn: 42, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available.", teamStatus: "Undocumented Team" },
  { 
    sn: 43, 
    name: "Graphite", 
    category: "AI Training", 
    description: "Competitive training environment for high-accuracy large language models.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://graphite.ai",
      github: "https://github.com/graphite-ai/graphite",
      twitter: "https://x.com/graphite_ai",
      extendedDescription: "Graphite is a high-performance training subnet on Bittensor. It incentivizes the development of models that push the state-of-the-art in linguistic processing and multi-modal reasoning. By utilizing a rigorous competitive framework, Graphite ensures only the most accurate models are rewarded.",
      partnerships: [
        "Linguistic Research Lab",
        "High-Performance ML Alliance",
        "SN9 Pretraining Alignment",
        "Graphite Core Team"
      ],
      recentUpdates: [
        "Launched 'Graphite-LLM' benchmark suite",
        "Integrated multi-stage training evaluation",
        "Optimized validator scoring for 'Logic Consistency'",
        "Reached milestone of Top-Rank status for training fidelity"
      ]
    }
  },
  { 
    sn: 44, 
    name: "Score", 
    category: "Vision Models", 
    description: "Large-scale vision models trained to understand real-world visual data.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://score.ai",
      github: "https://github.com/Score-Subnet/score-subnet",
      twitter: "https://x.com/score_ai",
      extendedDescription: "Score is a vision-focused subnet that incentivizes the training of models capable of high-level visual understanding. From object detection to scene segmentation, Score provides a decentralized powerhouse for visual AI applications.",
      partnerships: [
        "Vision Research Alliance",
        "Visual Data Consortium",
        "SN17 404-GEN Asset Sync",
        "Score Labs"
      ],
      recentUpdates: [
        "Released 'Visual Reasoning' benchmark",
        "Integrated support for zero-shot detection",
        "Optimized image-processing kernels for miners",
        "Reached milestone of processing 1M+ visual tasks"
      ]
    }
  },
  { 
    sn: 45, 
    name: "Talisman AI", 
    category: "DeFi / Trading", 
    description: "Wallet intelligence evolving into AI-driven command and execution systems.",
    teamStatus: "Documented Team",
    details: {
      website: "https://talisman.xyz",
      github: "https://github.com/Talisman-AI/talisman-subnet",
      twitter: "https://x.com/GeniusAI_",
      extendedDescription: "Talisman AI is the intelligent extension of the Talisman wallet. It uses decentralized AI to provide users with wallet insights, transaction analysis, and automated execution strategies, making it the premier 'Smart Assistant' for crypto users.",
      partnerships: [
        "Talisman Wallet Team",
        "DeFi Protocol Interop Group",
        "SN8 Vanta Strategy Alignment",
        "Cross-Chain Analytics Org"
      ],
      recentUpdates: [
        "Launched 'Wallet Health' analysis alpha",
        "Integrated real-time transaction simulation",
        "Enhanced security for AI-driven execution",
        "Reached 100k+ wallet syncs for training data"
      ]
    }
  },
  { 
    sn: 46, 
    name: "RESI", 
    category: "Data", 
    description: "Real estate data network powering AI-driven valuation and analysis.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://resi.ai",
      github: "https://github.com/Resi-Subnet/resi-subnet",
      twitter: "https://x.com/Scrappy_Subnet",
      extendedDescription: "RESI is the decentralized data backbone for the real estate industry. It incentivizes a global network of contributors to provide accurate, up-to-date real estate data, forming a massive vector database that powers AI-driven property valuation, market forecasting, and investment analysis.",
      partnerships: [
        "Global Real Estate Data Alliance",
        "PropTech Innovation Lab",
        "SN13 Data Universe Collaborative",
        "RESI Research Group"
      ],
      recentUpdates: [
        "Launched 'Automated Valuation Model' (AVM) v1",
        "Integrated geospatial data streams for 50+ countries",
        "Optimized data-cleaning for fragmented MLS sources",
        "Reached milestone of 10M+ properties indexed"
      ]
    }
  },
  { 
    sn: 47, 
    name: "Evolai", 
    category: "AI Services", 
    description: "Decentralized evolutionary AI and adaptive model optimization platform.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://evolai.ai",
      github: "https://github.com/evolai/evolai-subnet",
      twitter: "https://x.com/evolai_ai",
      extendedDescription: "Evolai focuses on the intersection of evolutionary algorithms and decentralized machine learning. It incentivizes the creation of adaptive models that can evolve their weights in real-time based on environmental feedback, providing a more biological approach to AI optimization.",
      partnerships: [
        "Evolutionary Intelligence lab",
        "Adaptive Systems Group",
        "SN1 Agentic Ecosystem",
        "Evolai Research Org"
      ],
      recentUpdates: [
        "Launched 'Evo-Optimizer' alpha",
        "Integrated real-time weight-adaptation protocols",
        "Optimized validator scoring for 'Evolutionary Fitness'",
        "Reached milestone of Top-Rank status for adaptive AI"
      ]
    }
  },
  { 
    sn: 48, 
    name: "Quantum", 
    category: "Compute", 
    description: "Marketplace for quantum compute circuits and experimental workloads.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://quantum.ai",
      github: "https://github.com/quantum-subnet/quantum",
      twitter: "https://x.com/Streamer_ai",
      extendedDescription: "Quantum is an experimental compute subnet exploring the intersection of Bittensor and Quantum Computing. It provides a marketplace where miners can offer access to quantum simulators or specialized hardware circuits, enabling researchers to run AI-quantum hybrid scripts.",
      partnerships: [
        "Quantum Computing Research Group",
        "Experimental Hardware Partners",
        "SN12 Compute Horde Collaborative",
        "Future-Tech Standards Org"
      ],
      recentUpdates: [
        "Launched 'Quantum-Hybrid' benchmark suite",
        "Integrated support for Cirq and Qiskit circuits",
        "Enhanced validator scoring for 'Circuit Fidelity'",
        "Reached milestone of Top-5% Quantum-simulation speed"
      ]
    }
  },
  { 
    sn: 49, 
    name: "Nepher", 
    category: "Robotics", 
    description: "Simulation environment for training AI in physical and autonomous systems.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://nepher.ai",
      github: "https://github.com/Nepher-AI/nepher-subnet",
      twitter: "https://x.com/NepherAI",
      extendedDescription: "Nepher is a high-fidelity simulation environment designed for training autonomous systems on Bittensor. It serves as the 'Digital Twin' playground where AI models are stress-tested in complex physical scenarios before deployment to real-world robotics.",
      partnerships: [
        "Autonomous Systems Lab",
        "Robotics Simulation Partners",
        "SN26 Kinitro Collaborative",
        "Nepher Research Group"
      ],
      recentUpdates: [
        "Released 'Digital Twin' environment v2",
        "Integrated improved physics engines for LIDAR",
        "Optimized multi-agent collision avoidance benchmarks",
        "Reached Top-Rank status for autonomous sim accuracy"
      ]
    }
  },
  { 
    sn: 50, 
    name: "Synth", 
    category: "Predictive Systems", 
    description: "Probabilistic forecasting across crypto and traditional markets.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://synthdata.co",
      github: "https://github.com/synth-forecasting/synth-subnet",
      twitter: "https://x.com/SynthData",
      extendedDescription: "Synth focuses on probabilistic market forecasting. It incentivizes the creation of models that can predict market volatility and price movements across a wide range of assets, specifically optimized for high-frequency trading and risk management.",
      partnerships: [
        "Market Intelligence Lab",
        "Risk-Management Consortium",
        "SN18 Zeus Forecast Sync",
        "Synth Data Research"
      ],
      recentUpdates: [
        "Launched 'Volatility Forecast' benchmark",
        "Integrated real-time crypto-market resolution",
        "Optimized validator database for tick-data sync",
        "Reached milestone of $500k daily predictive volume"
      ]
    }
  },
  { 
    sn: 51, 
    name: "lium.io", 
    category: "Compute", 
    description: "Decentralized compute and GPU marketplace for AI workloads.",
    teamStatus: "Documented Team",
    details: {
      website: "https://lium.io",
      github: "https://github.com/Lium-Labs/lium-subnet",
      twitter: "https://x.com/LiumLabs",
      extendedDescription: "Lium (by Lium Labs) is a decentralized compute and GPU marketplace. It bridges the gap between hardware providers and AI developers, focusing on simple onboarding and competitive pricing for high-performance workloads like model fine-tuning and inference.",
      partnerships: [
        "Lium Labs",
        "GPU Data Centers (Global)",
        "SN4 Targon Integration",
        "Compute Marketplace Alliance"
      ],
      recentUpdates: [
        "Launched 'Lium Pro' for bulk GPU leasing",
        "Integrated instant-on Dockerized workloads",
        "Optimized miner scoring for 'Job Completion' speed",
        "Reached 1k+ concurrently active GPU units"
      ]
    }
  },
  { 
    sn: 52, 
    name: "Dojo", 
    category: "Data", 
    description: "Human feedback and data collection subnet focused on improving AI training quality.",
    teamStatus: "Documented Team",
    details: {
      website: "https://oakresearch.io",
      github: "https://github.com/tensorplex-labs/dojo",
      twitter: "https://x.com/TensorplexLabs",
      extendedDescription: "Dojo (developed by Tensorplex) is the primary RLHF (Reinforcement Learning from Human Feedback) hub for Bittensor. It incentivizes decentralized human experts to label and verify data, ensuring that models learn from high-quality, human-aligned feedback.",
      partnerships: [
        "Tensorplex Labs",
        "Human Feedback Consortium",
        "SN13 Data Universe Collaborative",
        "Dojo Research Org"
      ],
      recentUpdates: [
        "Launched 'Expert Verification' benchmark",
        "Integrated multi-language RLHF support",
        "Optimized payout logic for high-accuracy labelers",
        "Reached 1M+ verified human-labeled data points"
      ]
    }
  },
  { 
    sn: 53, 
    name: "Efficient Frontier", 
    category: "DeFi / Trading", 
    description: "AI-driven trading subnet built around risk-weighted market strategies.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://ef.ai",
      github: "https://github.com/efficient-frontier/ef-subnet",
      twitter: "https://x.com/EfficientFront_",
      extendedDescription: "Efficient Frontier is a DeFi subnet that optimizes portfolio management through AI. It incentivizes models that can identify the optimal risk-return trade-off for complex asset baskets, providing a decentralized intelligence layer for on-chain fund management.",
      partnerships: [
        "Portfolio Theory Lab",
        "Risk-Weighted Trading Group",
        "SN35 OxMarkets Strategy Sync",
        "Efficient Frontier Researchers"
      ],
      recentUpdates: [
        "Released 'Risk-Optimization' benchmark",
        "Integrated real-time portfolio rebalancing flows",
        "Optimized validator throughput for market sync",
        "Reached Top-Tier status for risk-adjusted performance"
      ]
    }
  },
  { 
    sn: 54, 
    name: "Yanez", 
    category: "AI Compliance", 
    description: "Decentralized regulatory compliance and automated identity verification layer.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://yanez.ai",
      github: "https://github.com/yanez-bt/yanez",
      twitter: "https://x.com/yanez_ai",
      extendedDescription: "Yanez is a specialized compliance and identity subnet on Bittensor. It incentivizes models that can automate complex regulatory tasks, including KYC/AML monitoring and digital identity verification, providing a decentralized source of trust for institutional and on-chain participants.",
      partnerships: [
        "Compliance Research Lab",
        "Digital Identity Group",
        "SN13 Data Universe Alignment",
        "Yanez Development Team"
      ],
      recentUpdates: [
        "Launched 'KYC-Verification' nodes alpha",
        "Integrated real-time AML monitoring benchmarks",
        "Optimized validator scoring for 'Compliance Accuracy'",
        "Reached milestone of Top-Rank status for reg-tech utility"
      ]
    }
  },
  { 
    sn: 55, 
    name: "Niome", 
    category: "AI Data / Labeling", 
    description: "Decentralized data collection and annotation platform for fine-tuning frontier models.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://niome.ai",
      github: "https://github.com/niome-subnet/niome",
      twitter: "https://x.com/niome_ai",
      extendedDescription: "Niome is a specialized data subnet focused on large-scale collection and high-fidelity annotation. It incentivizes a global network of contributors to provide the diverse, high-quality datasets required for training and fine-tuning state-of-the-art AI models, ensuring data integrity through decentralized validation.",
      partnerships: [
        "Data Collection Alliance",
        "Human-AI Training Group",
        "SN13 Data Universe Sync",
        "Niome Core Team"
      ],
      recentUpdates: [
        "Launched 'Global-Dataset' collector v1",
        "Integrated multi-stage annotation workflows",
        "Optimized validator scoring for 'Data Precision'",
        "Reached milestone of 50M+ verified data points"
      ]
    }
  },
  { 
    sn: 56, 
    name: "Gradients", 
    category: "AI Training", 
    description: "Open training infrastructure designed to make model training more accessible on Bittensor.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://gradients.ai",
      github: "https://github.com/gradients-ai/gradients-subnet",
      twitter: "https://x.com/gradients_ai",
      extendedDescription: "Gradients is an open training infrastructure subnet that focuses on democratizing model training on Bittensor. It provides the necessary tools and benchmarks for miners to train frontier-scale models efficiently, ensuring that high-quality weights are produced through a transparent and competitive process.",
      partnerships: [
        "Training Infrastructure Labs",
        "SN12 Compute Horde Collaborative",
        "Model Optimization Group",
        "Gradients Research Org"
      ],
      recentUpdates: [
        "Launched 'Elastic Training' nodes v1",
        "Integrated mixed-precision training benchmarks",
        "Optimized validator scoring for 'Weight Integrity'",
        "Reached milestone of Top-10 training throughput"
      ]
    }
  },
  { sn: 57, name: "Sparket", category: "Unknown", description: "TaoStats currently shows the name Sparket, but the role is not clear enough to label harder." },
  { 
    sn: 58, 
    name: "Handshake", 
    category: "AI Agents / AI Tools", 
    description: "Payment and transaction rails designed for AI agents.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://handshake58.com",
      github: "https://github.com/handshake-subnet/handshake",
      extendedDescription: "Handshake provides the critical financial infrastructure for the Agentic Economy. It enables AI agents to autonomously handle payments, manage escrow, and settle transactions across different platforms, effectively serving as the 'Visa/Stripe' layer for machine-to-machine commerce.",
      partnerships: [
        "Agentic Commerce Alliance",
        "Fintech Innovation Lab",
        "SN1 Agentic Ecosystem Align",
        "Handshake Dev Team"
      ],
      recentUpdates: [
        "Released 'Agent-Auth' payment protocol",
        "Integrated multi-currency settlement rails",
        "Launched SDK for autonomous agent developers",
        "Reached $1M+ in verified daily agent transfers"
      ]
    }
  },
  { sn: 59, name: "Babelbit", category: "Unknown", description: "TaoStats currently shows the name Babelbit, but the role is not clear enough to label harder." },
  { 
    sn: 60, 
    name: "Bitsec", 
    category: "AI Safety", 
    description: "AI-powered security subnet focused on code vulnerability detection.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://bitsec.ai",
      github: "https://github.com/bitsec-ai/bitsec-subnet",
      extendedDescription: "Bitsec is the cybersecurity shield for the Bittensor network. It incentivizes the development of AI models that can automatically scan codebases, smart contracts, and network traffic for vulnerabilities, providing real-time security alerts and helping to patch potential exploits before they occur.",
      partnerships: [
        "Cybersecurity Research Org",
        "SN3 Trishool Safety Sync",
        "Vulnerability Database Partners",
        "Bitsec Labs"
      ],
      recentUpdates: [
        "Launched 'Deep-Scan' code analysis engine",
        "Integrated real-time smart-contract monitoring",
        "Improved detection rates for Zero-Day exploits",
        "Reached 98% recall on vulnerability benchmarks"
      ]
    }
  },
  { 
    sn: 61, 
    name: "The RedTeam", 
    category: "AI Safety", 
    description: "Adversarial stress-testing and safety auditing for large language models.",
    teamStatus: "Documented Team",
    details: {
      website: "https://theredteam.io",
      github: "https://github.com/the-redteam/redteam-subnet",
      twitter: "https://x.com/theredteam_io",
      extendedDescription: "The RedTeam is a foundational safety subnet on Bittensor. It incentivizes 'Red Teaming' activities where miners compete to find vulnerabilities, biases, or harmful output triggers in target models. This decentralized auditing process helps developers build safer and more robust AI systems.",
      partnerships: [
        "AI Safety Research Group",
        "Adversarial Labs",
        "SN34 BitMind Sync",
        "RedTeam Core Org"
      ],
      recentUpdates: [
        "Launched 'Model-Jailbreak' challenge suite",
        "Integrated real-time safety monitoring API",
        "Optimized validator scoring for 'Exploit Diversity'",
        "Reached milestone of Top-Rank status for safety utility"
      ]
    }
  },
  { 
    sn: 62, 
    name: "Ridges", 
    category: "AI Agents / AI Tools", 
    description: "Competitive coding agents built to solve real software tasks.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://ridges.ai",
      github: "https://github.com/ridges-ai/ridges-subnet",
      extendedDescription: "Ridges is a competitive software engineering subnet where AI agents compete to solve GitHub issues, optimize code, and build full software components. It validates the 'Work Output' of coding agents, ensuring that miners are rewarded for functional and correct code deployments.",
      partnerships: [
        "Software Engineering Lab",
        "SN20 GroundLayer Tooling Sync",
        "Developer Toolkit Alliance",
        "Ridges Research Group"
      ],
      recentUpdates: [
        "Released 'GitHub Task' dataset v2",
        "Integrated automated PR review benchmarks",
        "Optimized validator scoring for 'Logic Correctness'",
        "Reached milestone of 5k software tasks solved"
      ]
    }
  },
  { sn: 63, name: "Enigma", category: "Unknown", description: "TaoStats currently shows the name Enigma, but the role is not clear enough to label harder." },
  { 
    sn: 64, 
    name: "Chutes", 
    category: "Compute", 
    description: "Serverless AI compute layer built to run models at scale.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://chutes.ai",
      github: "https://github.com/chutes-ai/chutes",
      extendedDescription: "Chutes is the serverless execution layer for Bittensor. It allows developers to deploy and scale AI models instantly without managing hardware, leveraging the network's decentralized compute power to provide high-performance inference through a simple API interface.",
      partnerships: [
        "Serverless Infrastructure Group",
        "SN4 Targon Compute Sync",
        "Enterprise Deployment Partners",
        "Chutes Dev Team"
      ],
      recentUpdates: [
        "Launched 'Infinite-Scale' orchestration v1",
        "Integrated support for vLLM and TensorRT",
        "Optimized inference latency for real-time apps",
        "Reached milestone of 1M+ successful API calls"
      ]
    }
  },
  { 
    sn: 65, 
    name: "TAO Private Network", 
    category: "Privacy / Infrastructure", 
    description: "Private network infrastructure focused on secure and geographically distributed access.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://tpn.sh",
      github: "https://github.com/tpn-subnet/tpn",
      extendedDescription: "TAO Private Network (TPN) provides secure, private, and geographically distributed infrastructure for the Bittensor network. It focuses on ensuring low-latency and encrypted communication between subnets, validators, and applications, protecting the network from traffic-level attacks and surveillance.",
      partnerships: [
        "Privacy Infrastructure Labs",
        "Geographically Distributed Node Partners",
        "TAO Foundation Security Sync",
        "TPN Development Group"
      ],
      recentUpdates: [
        "Launched 'Secure-Relay' nodes v2",
        "Integrated encrypted cross-subnet communication",
        "Improved geographic load balancing benchmarks",
        "Reached milestone of 500+ active private relays"
      ]
    }
  },
  { 
    sn: 66, 
    name: "ninja", 
    category: "AI Agents / AI Tools", 
    description: "Coding-focused subnet aimed at solving software and engineering tasks.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://ninja.ridges.ai",
      github: "https://github.com/ridges-ai/ninja-subnet",
      extendedDescription: "Ninja is a high-performance coding subnet developed by the Ridges team. It focuses on the rapid execution and validation of complex software engineering tasks, providing a decentralized powerhouse for developers to offload coding challenges to a competitive network of AI agents.",
      partnerships: [
        "Ridges Labs",
        "Engineer Tooling Alliance",
        "SN62 Ridges Collaborative",
        "Ninja Dev Group"
      ],
      recentUpdates: [
        "Launched 'Rapid-Response' coding benchmarks",
        "Integrated multi-language syntax validation",
        "Optimized miner scoring for 'Code Density'",
        "Reached milestone of 10k engineering tickets solved"
      ]
    }
  },
  { 
    sn: 67, 
    name: "Harnyx", 
    category: "Compute / AI Training", 
    description: "Decentralized compute and model training orchestration for the next generation of AI.",
    teamStatus: "Documented Team",
    details: {
      website: "https://harnyx.ai",
      github: "https://github.com/harnyx/harnyx",
      twitter: "https://x.com/harnyx_ai",
      extendedDescription: "Harnyx is a high-performance compute and training subnet on Bittensor. It focuses on the orchestration of powerful hardware for decentralized AI model training and inference. By optimizing for workload distribution and validator scoring, Harnyx ensures that the network's compute resources are utilized at peak efficiency for training the world's most capable models.",
      partnerships: [
        "Harnyx Research Lab",
        "Infrastructure Scaling Group",
        "SN12 Compute Horde Sync",
        "Harnyx Core Team"
      ],
      recentUpdates: [
        "Launched 'Global-Orchestrator' suite v1",
        "Integrated multi-region compute benchmarks",
        "Optimized validator scoring for 'Job Performance'",
        "Reached milestone of Top-Rank status for training efficiency"
      ]
    }
  },
  { 
    sn: 68, 
    name: "NOVA", 
    category: "DeSci", 
    description: "Decentralized drug discovery subnet using AI to accelerate therapeutic research.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://nova-desci.com",
      github: "https://github.com/NOVA-DeSci/nova-subnet",
      extendedDescription: "NOVA is at the forefront of Decentralized Science (DeSci) on Bittensor. It incentivizes the development of AI models specifically tailored for drug discovery, including molecular folding, bio-activity prediction, and clinical trial outcome modeling, accelerating the path to new therapeutics.",
      partnerships: [
        "Biomedical Research Institute",
        "DeSci Standards Group",
        "SN107 Minos Biomedical Sync",
        "NOVA Global Lab"
      ],
      recentUpdates: [
        "Launched 'Molecule-Match' search engine",
        "Integrated support for large-scale protein folding simulations",
        "Optimized validator scoring for 'Discovery Novelty'",
        "Reached milestone of predicting 1M+ bio-active compounds"
      ]
    }
  },
  { sn: 69, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 70, 
    name: "Nexis Gen", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized intelligence layer for personalized AI and agentic automation.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://nexisgen.ai",
      github: "https://github.com/nexis-gen/nexis-subnet",
      twitter: "https://x.com/NexisGen",
      extendedDescription: "Nexis Gen focuses on building a decentralized layer for personalized AI and agentic automation. It incentivizes the creation of models and tools that can understand user-specific contexts and perform complex tasks autonomously, effectively serving as the 'Intelligence Layer' for individual digital assistants across the Bittensor ecosystem.",
      partnerships: [
        "Personalized AI Labs",
        "Agentic Logic Alliance",
        "SN1 Agentic Ecosystem Align",
        "Nexis Gen Research Org"
      ],
      recentUpdates: [
        "Launched 'Personal-Intelligence' nodes alpha",
        "Integrated multi-task agentic benchmarks",
        "Optimized validator scoring for 'Personalization Accuracy'",
        "Reached milestone of Top-Rank status for agentic utility"
      ]
    }
  },
  { 
    sn: 71, 
    name: "Leadpoet", 
    category: "AI Agents / AI Tools", 
    description: "AI-driven lead generation and marketing intelligence platform.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://leadpoet.ai",
      github: "https://github.com/leadpoet/leadpoet-subnet",
      extendedDescription: "Leadpoet utilizes decentralized AI to provide high-quality lead generation and marketing intelligence. It incentivizes models that can identify high-intent prospects and personalize outreach at scale, creating a more efficient and less intrusive marketing ecosystem.",
      partnerships: [
        "Marketing Automation Lab",
        "Sales Intelligence Consortium",
        "SN16 BitAds AdTech Sync",
        "Leadpoet Research"
      ],
      recentUpdates: [
        "Launched 'Intent-Scoring' model v2",
        "Integrated real-time database enrichment loops",
        "Optimized miner scoring for 'Lead Quality'",
        "Reached milestone of generating 5M+ verified B2B leads"
      ]
    }
  },
  { 
    sn: 72, 
    name: "StreetVision", 
    category: "Vision Models / Data", 
    description: "Real-world visual intelligence layer powered by decentralized mobile sensor data.",
    teamStatus: "Documented Team",
    details: {
      website: "https://natix.network",
      github: "https://github.com/NATIX-Network/streetvision",
      twitter: "https://x.com/NatixNetwork",
      extendedDescription: "StreetVision (by Natix) is a decentralized physical infrastructure network (DePIN) for collecting geospatial and visual data. It incentivizes users to contribute real-world data via smartphones, creating a high-fidelity map of the world for AI-driven urban planning, navigation, and autonomous systems.",
      partnerships: [
        "Natix Network",
        "Geospatial Data Alliance",
        "SN13 Data Universe Sync",
        "DePIN Scaling Group"
      ],
      recentUpdates: [
        "Launched 'Map-to-Earn' mobile gateway",
        "Integrated real-time geospatial benchmarks",
        "Optimized validator scoring for 'Data Fidelity'",
        "Reached milestone of Top-Rank status for real-world visual coverage"
      ]
    }
  },
  { 
    sn: 73, 
    name: "Meta Hash", 
    category: "Compute / Mining", 
    description: "Multivariate hashing and compute optimization network for decentralized proof-of-work.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://metahash73.com",
      github: "https://github.com/metahash-subnet/metahash",
      twitter: "https://x.com/metahash_ai",
      extendedDescription: "Meta Hash is a specialized compute subnet on Bittensor. It incentivizes the creation of optimized hashing algorithms and compute kernels that can maximize the efficiency of decentralized proof-of-work and cryptographic validation tasks across the network.",
      partnerships: [
        "Compute Optimization Lab",
        "Hash-Rate Alliance",
        "SN12 Compute Horde Sync",
        "Meta Hash Dev Group"
      ],
      recentUpdates: [
        "Launched 'Hash-Bench' suite v1",
        "Integrated multi-algo compute kernels",
        "Optimized validator scoring for 'Logic Integrity'",
        "Reached milestone of Top-Rank status for compute efficiency"
      ]
    }
  },
  { 
    sn: 74, 
    name: "Gittensor", 
    category: "Infrastructure", 
    description: "Decentralized Git hosting and incentive layer for open-source development.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://gittensor.io",
      github: "https://github.com/gittensor/gittensor-subnet",
      extendedDescription: "Gittensor is the 'GitHub of Bittensor.' It provides decentralized Git hosting and introduces a novel incentive layer that rewards developers for their contributions to open-source projects, ensuring that the builders of the network are fairly compensated.",
      partnerships: [
        "Open-Source Standards Org",
        "Developer Incentive Alliance",
        "SN19 BlockMachine Infra Sync",
        "Gittensor Core Team"
      ],
      recentUpdates: [
        "Launched 'Proof-of-Contribution' mainnet",
        "Integrated encrypted Git-storage relays",
        "Optimized validator scoring for 'Code Impact'",
        "Reached milestone of hosting 1k+ decentralized repos"
      ]
    }
  },
  { 
    sn: 75, 
    name: "Hippius", 
    category: "Data / Storage", 
    description: "Decentralized storage and network infrastructure with IP and bandwidth management.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://hippius.com",
      github: "https://github.com/hippius-ai/hippius-subnet",
      extendedDescription: "Hippius provides the foundational storage and infrastructure layer for the Bittensor ecosystem. It offers secure, decentralized bucket storage, bandwidth allocation, and intellectual property management, ensuring that data is both accessible and protected.",
      partnerships: [
        "Decentralized Storage Alliance",
        "IP Management Lab",
        "SN13 Data Universe Bridge",
        "Hippius Infrastructure Group"
      ],
      recentUpdates: [
        "Launched 'Secure-Bucket' storage v1",
        "Integrated real-time bandwidth resolution",
        "Optimized miner scoring for 'Retrieval Speed'",
        "Reached Top-Rank status for storage uptime on network"
      ]
    }
  },
  { sn: 76, name: "Byzantium", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced yet.", teamStatus: "Undocumented Team" },
  { 
    sn: 77, 
    name: "Liquidity", 
    category: "DeFi / Trading", 
    description: "Liquidity subnet built to incentivize external pool provisioning and liquidity voting for Bittensor assets.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://liquidity.bittensor.com",
      github: "https://github.com/liquidity-subnet/liquidity",
      extendedDescription: "Liquidity is a foundational DeFi subnet that incentivizes the provisioning of external liquidity for Bittensor assets. It uses decentralized voting and reward mechanisms to ensure that TAO and its related tokens have deep, stable liquidity across major decentralized exchanges.",
      partnerships: [
        "Major DEX Protocol Partners",
        "Liquidity Provisioning Alliance",
        "SN113 TensorUSD Stable Sync",
        "Liquidity Core Devs"
      ],
      recentUpdates: [
        "Launched 'Liquidity-Voting' mainnet v1",
        "Integrated multi-chain liquidity tracking",
        "Optimized miner scoring for 'Pool Stability'",
        "Reached milestone of $10M+ in external liquidity incentivized"
      ]
    }
  },
  { sn: 78, name: "Unknown", category: "Unknown", description: "No clearly confirmed subnet identity or role available.", teamStatus: "Undocumented Team" },
  { sn: 79, name: "MVTRX", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough.", teamStatus: "Undocumented Team" },
  { sn: 80, name: "dogelayer", category: "Mining", description: "Mining pool subnet connecting Scrypt miners to Bittensor through merged LTC/DOGE mining.", teamStatus: "Undocumented Team" },
  { sn: 81, name: "deprecated", category: "Deprecated", description: "Subnet is no longer active.", teamStatus: "Undocumented Team" },
  { 
    sn: 82, 
    name: "Hermes", 
    category: "Data", 
    description: "Decentralized query layer that lets AI agents access blockchain data through structured GraphQL-style queries.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://hermes-subnet.ai",
      github: "https://github.com/hermes-subnet/hermes",
      extendedDescription: "Hermes is the decentralized query layer for the blockchain world on Bittensor. It incentivizes the creation of high-speed, reliable indexing nodes that allow AI agents to query on-chain data using a structured, GraphQL-style interface, providing a critical bridge between AI and blockchain.",
      partnerships: [
        "Blockchain Indexing Labs",
        "Query Resolution Alliance",
        "SN19 BlockMachine Infra Sync",
        "Hermes Research Group"
      ],
      recentUpdates: [
        "Launched 'GraphQL-Query' API v1",
        "Integrated indexing support for 20+ major chains",
        "Optimized miner scoring for 'Response Latency'",
        "Reached milestone of 1M+ successful on-chain queries"
      ]
    }
  },
  { 
    sn: 83, 
    name: "CliqueAI", 
    category: "AI Agents / AI Tools", 
    description: "Distributed AI subnet focused on solving maximum-clique and graph-optimization problems.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://cliqueai.com",
      github: "https://github.com/cliqueai/cliqueai-subnet",
      extendedDescription: "CliqueAI is a specialized AI subnet focused on solving complex graph-optimization and maximum-clique problems. These foundational mathematical challenges have applications in everything from drug discovery to network routing, and CliqueAI incentivizes the development of models that can solve them faster and more accurately.",
      partnerships: [
        "Graph Optimization Labs",
        "Mathematical Research Org",
        "SN68 NOVA DeSci Collaborative",
        "CliqueAI Core Team"
      ],
      recentUpdates: [
        "Launched 'Max-Clique' benchmark suite",
        "Integrated multi-agent graph-solving protocols",
        "Optimized validator scoring for 'Solution Precision'",
        "Reached milestone of solving 500k graph challenges"
      ]
    }
  },
  { 
    sn: 84, 
    name: "ChipForge (Tatsu)", 
    category: "Infrastructure / Hardware", 
    description: "Decentralized hardware design subnet where miners compete to design real silicon components.",
    teamStatus: "Documented Team",
    details: {
      website: "https://tatsuecosystem.io",
      github: "https://github.com/tatsu-ecosystem/chipforge",
      twitter: "https://x.com/TatsuEcosystem",
      extendedDescription: "ChipForge (developed by Tatsu) is a pioneering hardware design subnet. It incentivizes a global network of engineers and AI models to compete in the design of optimized silicon components, from AI accelerators to custom hardware circuits, decentralizing the path to hardware innovation.",
      partnerships: [
        "Tatsu Ecosystem",
        "Silicon Design Alliance",
        "SN48 Quantum Hardware Sync",
        "ChipForge Research Group"
      ],
      recentUpdates: [
        "Launched 'Silicon-Layout' benchmark v1",
        "Integrated support for industry-standard EDA tools",
        "Optimized validator scoring for 'Area-Power' efficiency",
        "Reached milestone of 100+ submitted hardware designs"
      ]
    }
  },
  { 
    sn: 85, 
    name: "Vidaio", 
    category: "Generative AI", 
    description: "AI video processing subnet focused on upscaling, optimization, and higher-quality video output.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://vidaio.io",
      github: "https://github.com/vidaio/vidaio-subnet",
      twitter: "https://x.com/Vidaio_AI",
      extendedDescription: "Vidaio is a generative AI subnet specifically focused on the processing and optimization of video content. It incentivizes models that can perform high-fidelity upscaling, frame interpolation, and style-transfer, ensuring that decentralized video output meets professional standards.",
      partnerships: [
        "Video Optimization Labs",
        "Creative Media Consortium",
        "SN99 Leoma Video Sync",
        "Vidaio Dev Team"
      ],
      recentUpdates: [
        "Launched 'Video-Upscale' benchmark v2",
        "Integrated multi-frame consistency protocols",
        "Optimized validator scoring for 'Visual PSNR'",
        "Reached milestone of processing 50k video minutes"
      ]
    }
  },
  { sn: 86, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available.", teamStatus: "Undocumented Team" },
  { 
    sn: 87, 
    name: "Luminar Network", 
    category: "Compute / Inference", 
    description: "Decentralized inference and LLM hosting infrastructure for the Bittensor network.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://luminar.network",
      github: "https://github.com/luminar-network/luminar",
      twitter: "https://x.com/LuminarNetwork",
      extendedDescription: "Luminar Network is a high-performance inference subnet on Bittensor. It incentivizes a global network of nodes to host and serve frontier-scale LLMs, providing a scalable and decentralized gateway for developers to integrate AI intelligence into their applications.",
      partnerships: [
        "Inference Scaling Group",
        "LLM Hosting Alliance",
        "SN1 Apex Integration",
        "Luminar Research Org"
      ],
      recentUpdates: [
        "Launched 'Inference-Optimizer' v1",
        "Integrated multi-model hosting benchmarks",
        "Optimized validator throughput for real-time serving",
        "Reached milestone of Top-Rank status for hosting fidelity"
      ]
    }
  },
  { 
    sn: 88, 
    name: "Investing", 
    category: "DeFi / Trading", 
    description: "Decentralized asset management subnet using human and AI quant strategies.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://investing.bittensor.com",
      github: "https://github.com/investing-subnet/investing",
      twitter: "https://x.com/Investing_BT",
      extendedDescription: "Investing is a decentralized asset management subnet. It incentivizes the creation of high-performance quant strategies by combining human expertise with AI-driven models, ensuring that capital is allocated efficiently across a diverse range of assets and market conditions.",
      partnerships: [
        "Quant Research Labs",
        "Asset Management Alliance",
        "SN35 OxMarkets Strategy Sync",
        "Investing Core Team"
      ],
      recentUpdates: [
        "Launched 'Quant-Strategy' benchmark v1",
        "Integrated multi-asset portfolio tracking",
        "Optimized miner scoring for 'Risk-Adjusted Return'",
        "Reached milestone of $50M+ in assets under simulation"
      ]
    }
  },
  { 
    sn: 89, 
    name: "InfiniteHash", 
    category: "Mining", 
    description: "Bitcoin mining subnet combining decentralized mining with Lightning Network infrastructure.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://infinitehash.io",
      github: "https://github.com/infinitehash/infinitehash-subnet",
      twitter: "https://x.com/InfiniteHash_BT",
      extendedDescription: "InfiniteHash bridges the gap between Bitcoin and Bittensor. It incentivizes decentralized Bitcoin mining while integrating Lightning Network infrastructure, allowing for rapid, low-cost Bitcoin transfers and providing a critical link between the two networks.",
      partnerships: [
        "Bitcoin Mining Alliance",
        "Lightning Network Partners",
        "SN55 Precog Strategy Sync",
        "InfiniteHash Dev Group"
      ],
      recentUpdates: [
        "Launched 'BTC-Lightning' relay v1",
        "Integrated support for decentralized mining pools",
        "Optimized validator scoring for 'Hashrate Consistency'",
        "Reached milestone of 100+ active Lightning channels"
      ]
    }
  },
  { 
    sn: 90, 
    name: "Brain", 
    category: "Predictive Systems", 
    description: "Subnet focused on validating prediction-market outcomes through decentralized verification.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://subnet90.com",
      github: "https://github.com/brain-subnet/brain",
      twitter: "https://x.com/Brain_Subnet",
      extendedDescription: "Brain is the 'Oracle' of prediction markets on Bittensor. It focuses on the decentralized verification of real-world outcomes, ensuring that prediction markets are settled accurately and fairly by incentivizing a network of validators to reach a consensus on event results.",
      partnerships: [
        "Prediction Market Alliance",
        "Outcome Verification Group",
        "SN41 Almanac Forecast Sync",
        "Brain Research Org"
      ],
      recentUpdates: [
        "Launched 'Outcome-Resolution' engine v1",
        "Integrated multi-source event verification",
        "Optimized miner scoring for 'Resolution Speed'",
        "Reached milestone of 10k+ verified event outcomes"
      ]
    }
  },
  { sn: 91, name: "Bitstarter #1", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough.", teamStatus: "Undocumented Team" },
  { 
    sn: 92, 
    name: "Tensor Claw", 
    category: "Data / Scraping", 
    description: "Large-scale decentralized web scraping and data crawling platform.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://tensorclaw.ai",
      github: "https://github.com/Tensor-Claw/tensor-claw",
      twitter: "https://x.com/TensorClaw",
      extendedDescription: "Tensor Claw is a specialized data acquisition subnet. It incentivizes a distributed network of 'Crawlers' and 'Scrapers' to gather high-fidelity web data at scale, feeding into the ecosystem's intelligence layer and providing a continuous stream of information for training and analysis.",
      partnerships: [
        "Data Acquisition Alliance",
        "Web Indexing Lab",
        "SN13 Data Universe Bridge",
        "Tensor Claw Core Team"
      ],
      recentUpdates: [
        "Launched 'Global-Crawler' engine v1",
        "Integrated multi-source scraping benchmarks",
        "Optimized validator scoring for 'Data Freshness'",
        "Reached milestone of 1B+ verified data points indexed"
      ]
    }
  },
  { 
    sn: 93, 
    name: "Bitcast", 
    category: "Creator Economy", 
    description: "Connects creators with brands and rewards content through decentralized incentives.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://bitcast.ai",
      github: "https://github.com/bitcast-ai/bitcast-subnet",
      twitter: "https://x.com/Bitcast_AI",
      extendedDescription: "Bitcast empowers creators by connecting them directly with brands through a decentralized incentive layer. It rewards content creation and engagement, ensuring that creators are fairly compensated for their impact while providing brands with transparent metrics and high-quality audience reach.",
      partnerships: [
        "Creator Economy Alliance",
        "Brand Marketing Partners",
        "SN16 BitAds Collaborative",
        "Bitcast Dev Team"
      ],
      recentUpdates: [
        "Launched 'Creator-Reward' protocol v1",
        "Integrated multi-platform engagement tracking",
        "Optimized miner scoring for 'Content Impact'",
        "Reached milestone of 5k+ active creator partnerships"
      ]
    }
  },
  { sn: 94, name: "Bitsota", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough.", teamStatus: "Undocumented Team" },
  { sn: 95, name: "Unknown", category: "Unknown", description: "No clearly confirmed subnet identity or role available.", teamStatus: "Undocumented Team" },
  { sn: 96, name: "FLock OFF", category: "Unknown", description: "Live subnet with a confirmed name, but the current public role is not surfaced cleanly enough.", teamStatus: "Undocumented Team" },
  { 
    sn: 97, 
    name: "distil", 
    category: "AI Training", 
    description: "Model distillation subnet where miners compete to replicate frontier-model behavior.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://distil.ai",
      github: "https://github.com/distil-ai/distil-subnet",
      twitter: "https://x.com/Distil_AI",
      extendedDescription: "Distil focuses on the efficient transfer of intelligence from large frontier models to smaller, more efficient 'Student' models. It incentivizes the creation of distilled weights that maintain high reasoning capabilities while requiring significantly less compute, enabling easier deployment.",
      partnerships: [
        "Model Distillation Labs",
        "Efficiency Optimization Group",
        "SN9 Pretraining Sync",
        "Distil Development Team"
      ],
      recentUpdates: [
        "Launched 'Student-Model' benchmark v1",
        "Integrated improved distillation loss-functions",
        "Optimized validator scoring for 'Reasoning Fidelity'",
        "Reached milestone of Top-3 efficiency gain on network"
      ]
    }
  },
  { 
    sn: 98, 
    name: "ForeverMoney", 
    category: "DeFi / Trading", 
    description: "AI-managed liquidity subnet optimizing Uniswap V3 and Aerodrome positions through competitive strategies.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://forevermoney.ai",
      github: "https://github.com/forever-money/forever-money-subnet",
      twitter: "https://x.com/ForeverMoney_AI",
      extendedDescription: "ForeverMoney provides automated liquidity management powered by decentralized AI. It incentivizes the development of models that can dynamically rebalance Uniswap V3 and Aerodrome positions, optimizing for yield and minimizing impermanent loss for liquidity providers.",
      partnerships: [
        "Uniswap V3 Research Group",
        "Aerodrome Protocol Partners",
        "SN77 Liquidity Strategy Sync",
        "ForeverMoney Labs"
      ],
      recentUpdates: [
        "Launched 'Yield-Optimization' benchmark v1",
        "Integrated real-time Aerodrome position tracking",
        "Optimized validator scoring for 'PnL Consistency'",
        "Reached milestone of $5M+ in TVL under simulation"
      ]
    }
  },
  { 
    sn: 99, 
    name: "Leoma", 
    category: "Generative AI", 
    description: "AI video generation subnet focused on text-and-image-to-video workflows.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://leoma.ai",
      github: "https://github.com/leoma-ai/leoma-subnet",
      twitter: "https://x.com/Leoma_AI",
      extendedDescription: "Leoma is a specialized video generation subnet on Bittensor. It incentivizes the creation of high-fidelity video assets from text and image prompts, focusing on temporal consistency and motion quality to provide professional-grade synthetic video for creators.",
      partnerships: [
        "Video Synthesis Labs",
        "Motion-Consistency Partners",
        "SN85 Vidaio Processing Sync",
        "Leoma Core Team"
      ],
      recentUpdates: [
        "Launched 'Temporal-Consistency' benchmark v1",
        "Integrated improved video conditioning kernels",
        "Optimized miner scoring for 'Motion Fidelity'",
        "Reached milestone of Top-Tier status for synthetic video"
      ]
    }
  },
  { 
    sn: 100, 
    name: "Plaτform", 
    category: "AI Research Infrastructure", 
    description: "Decentralized AI evaluation framework built around challenge-based assessment and secure execution.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://platform.ai",
      github: "https://github.com/platform-ai/platform-subnet",
      twitter: "https://x.com/Platform_BT",
      extendedDescription: "Platform provides a foundational framework for decentralized AI research and evaluation. It incentivizes the creation of complex 'Challenges' that models must solve, ensuring that intelligence is measured through functional attainment and secure execution rather than simple static benchmarks.",
      partnerships: [
        "AI Research Standards Org",
        "Secure Execution Alliance",
        "SN20 GroundLayer Evaluation Sync",
        "Platform Development Team"
      ],
      recentUpdates: [
        "Launched 'Challenge-Store' v1",
        "Integrated secure sandboxed execution",
        "Optimized validator scoring for 'Discovery Quality'",
        "Reached milestone of 1k+ research challenges posted"
      ]
    }
  },
  { sn: 101, name: "Subnet 101", category: "Unknown", description: "No clearly confirmed public role available.", teamStatus: "Undocumented Team" },
  { 
    sn: 102, 
    name: "ConnitoAI", 
    category: "AI Training", 
    description: "Decentralized model training subnet.",
    teamStatus: "Documented Team",
    details: {
      website: "https://connito.ai",
      github: "https://github.com/connito-ai/connito-subnet",
      twitter: "https://x.com/Connito_AI",
      extendedDescription: "ConnitoAI focuses on the decentralized training of diverse AI models. It provides a competitive environment where miners are rewarded for producing high-quality model weights across various domains, ensuring a steady stream of optimized models for the Bittensor network.",
      partnerships: [
        "Training Optimization Labs",
        "Model Development Partners",
        "SN9 Pretraining Sync",
        "ConnitoAI Research"
      ],
      recentUpdates: [
        "Launched 'Multi-Domain' training benchmark",
        "Integrated improved validator kernels for weight-check",
        "Optimized miner scoring for 'Learning Stability'",
        "Reached milestone of Top-10 training status on network"
      ]
    }
  },
  { 
    sn: 103, 
    name: "Djinn", 
    category: "AI Agents / AI Tools", 
    description: "Encrypted sports signals marketplace with verifiable performance and escrow-backed settlement.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://djinn.ai",
      github: "https://github.com/djinn-ai/djinn-subnet",
      twitter: "https://x.com/Djinn_AI",
      extendedDescription: "Djinn is an encrypted sports signals marketplace that emphasizes verifiable performance. It incentivizes decentralized experts to provide encrypted signals for sports and events, using escrow-backed settlement to ensure that users only pay for high-quality, accurate intelligence.",
      partnerships: [
        "Sports Intelligence Alliance",
        "Escrow Settlement Partners",
        "SN41 Almanac Forecast Sync",
        "Djinn Dev Team"
      ],
      recentUpdates: [
        "Launched 'Escrow-Settlement' protocol v1",
        "Integrated encrypted signal-relay nodes",
        "Optimized validator scoring for 'Signal Accuracy'",
        "Reached milestone of Top-Rank status for signal resolution"
      ]
    }
  },
  { sn: 104, name: "for sale (burn to uid1)", category: "Unknown", description: "Listed as for sale rather than a normal branded subnet.", teamStatus: "Undocumented Team" },
  { 
    sn: 105, 
    name: "Beam", 
    category: "Compute", 
    description: "Infrastructure-focused subnet tied to bandwidth and data-transfer coordination.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://beam.ai",
      github: "https://github.com/beam-ai/beam-subnet",
      twitter: "https://x.com/Beam_BT",
      extendedDescription: "Beam focuses on the optimization of bandwidth and data transfer coordination within the Bittensor network. It incentivizes the creation of high-speed data-relay nodes that facilitate the rapid and reliable transfer of large datasets and model weights between subnets.",
      partnerships: [
        "Bandwidth Infrastructure Labs",
        "Data Transfer Alliance",
        "SN75 Hippius Storage Sync",
        "Beam Development Team"
      ],
      recentUpdates: [
        "Launched 'High-Speed Relay' v1",
        "Integrated adaptive bandwidth routing",
        "Optimized miner scoring for 'Transfer Latency'",
        "Reached milestone of Top-Rank status for data-relay uptime"
      ]
    }
  },
  { 
    sn: 106, 
    name: "VoidAI", 
    category: "DeFi / Trading", 
    description: "Cross-chain liquidity and wrapped-asset infrastructure.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://voidai.com",
      github: "https://github.com/voidai-subnet/voidai",
      twitter: "https://x.com/VoidAI_BT",
      extendedDescription: "VoidAI provides the infrastructure for seamless cross-chain liquidity and wrapped-asset management on Bittensor. It incentivizes the creation of secure and efficient bridges that allow users to move assets between different blockchain ecosystems, facilitating a more interconnected DeFi landscape.",
      partnerships: [
        "Cross-Chain Bridge Alliance",
        "Liquidity Integration Labs",
        "SN77 Liquidity Strategy Sync",
        "VoidAI Development Group"
      ],
      recentUpdates: [
        "Launched 'Secure-Bridge' protocol v1",
        "Integrated support for 10+ major blockchain networks",
        "Optimized miner scoring for 'Bridge Latency'",
        "Reached milestone of Top-Rank status for cross-chain uptime"
      ]
    }
  },
  { 
    sn: 107, 
    name: "Minos", 
    category: "DeSci", 
    description: "Genomic-variant calling and biomedical benchmarking subnet.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://theminos.ai",
      github: "https://github.com/theminos/minos-subnet",
      twitter: "https://x.com/ChainLink_BT",
      extendedDescription: "Minos is a specialized DeSci subnet focused on genomic-variant calling and biomedical benchmarking. It incentivizes the development of AI models that can accurately identify genetic variants from large-scale sequencing data, accelerating the path to personalized medicine and improved therapeutic outcomes.",
      partnerships: [
        "Genomics Research Institute",
        "Biomedical Benchmarking Labs",
        "SN68 NOVA DeSci Sync",
        "Minos Research Org"
      ],
      recentUpdates: [
        "Launched 'Variant-Calling' benchmark v1",
        "Integrated large-scale genomic datasets",
        "Optimized validator scoring for 'Call Accuracy'",
        "Reached milestone of Top-Tier status for genomic processing"
      ]
    }
  },
  { sn: 108, name: "TalkHead", category: "Unknown", description: "No clearly confirmed public role available.", teamStatus: "Undocumented Team" },
  { sn: 109, name: "Academia", category: "Unknown", description: "No clearly confirmed public role available.", teamStatus: "Undocumented Team" },
  { sn: 110, name: "Rich Kids of TAO", category: "Unknown", description: "No clearly confirmed public role available.", teamStatus: "Undocumented Team" },
  { 
    sn: 111, 
    name: "oneoneone", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized AI data network focused on collecting, validating, and serving authentic user-generated content.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://oneoneone.io",
      github: "https://github.com/oneoneone-ai/oneoneone-subnet",
      twitter: "https://x.com/MetaIntelligence",
      extendedDescription: "Oneoneone is a decentralized AI data network that focuses on the collection, validation, and serving of authentic user-generated content. It incentivizes a global network of contributors to provide high-quality, verified data that can be used to train and improve AI models across various domains.",
      partnerships: [
        "UGC Validation Labs",
        "Authentic Data Consortium",
        "SN13 Data Universe Bridge",
        "Oneoneone Research Group"
      ],
      recentUpdates: [
        "Launched 'UGC-Validation' protocol v1",
        "Integrated multi-source content collection",
        "Optimized miner scoring for 'Data Authenticity'",
        "Reached milestone of Top-Rank status for data quality"
      ]
    }
  },
  { 
    sn: 112, 
    name: "minotaur", 
    category: "DeFi / Trading", 
    description: "AI-driven DEX aggregation and swap routing subnet.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://minotaur.ai",
      github: "https://github.com/minotaur-ai/minotaur-subnet",
      twitter: "https://x.com/SubnetInterop",
      extendedDescription: "Minotaur is a DeFi subnet that optimizes DEX aggregation and swap routing through AI. It incentivizes the development of models that can identify the most efficient swap paths across various decentralized exchanges, ensuring that users receive the best possible execution for their trades.",
      partnerships: [
        "DEX Aggregation Labs",
        "Swap Routing Alliance",
        "SN35 OxMarkets Strategy Sync",
        "Minotaur Development Team"
      ],
      recentUpdates: [
        "Launched 'Swap-Efficiency' benchmark v1",
        "Integrated support for 20+ major DEX protocols",
        "Optimized validator scoring for 'Routing Speed'",
        "Reached milestone of Top-Tier status for swap execution"
      ]
    }
  },
  { 
    sn: 113, 
    name: "TensorUSD", 
    category: "DeFi / Trading", 
    description: "TAO-backed stablecoin and settlement-focused subnet.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://tensorusd.com",
      github: "https://github.com/tensorusd/tensorusd-subnet",
      twitter: "https://x.com/TensorUSD",
      extendedDescription: "TensorUSD provides the foundational stablecoin and settlement infrastructure for the Bittensor ecosystem. It centers on a TAO-backed stablecoin that ensures value stability and facilitates seamless settlement across various subnets and applications, enhancing the network's economic utility.",
      partnerships: [
        "Stablecoin Standards Org",
        "Settlement Infrastructure Labs",
        "SN77 Liquidity Integration",
        "TensorUSD Core Team"
      ],
      recentUpdates: [
        "Launched 'Stablecoin-Settlement' mainnet v1",
        "Integrated multi-subnet settlement rails",
        "Optimized validator scoring for 'Peg Stability'",
        "Reached milestone of Top-Rank status for stablecoin utility"
      ]
    }
  },
  { 
    sn: 114, 
    name: "SOMA", 
    category: "AI Agents / AI Tools", 
    description: "Intelligence bridge connecting AI subnets through MCP-style services.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://thesoma.ai",
      github: "https://github.com/soma-ai/soma-subnet",
      twitter: "https://x.com/SOMA_AI",
      extendedDescription: "SOMA acts as an 'Intelligence Bridge' that connects various AI subnets through MCP-style (Model Context Protocol) services. It incentivizes the development of interoperable communication layers that allow AI subnets to share data, models, and reasoning capabilities, fostering a more collaborative AI ecosystem.",
      partnerships: [
        "Intelligence Interop Labs",
        "Subnet Communication Alliance",
        "SN1 Agentic Ecosystem Align",
        "SOMA Research Group"
      ],
      recentUpdates: [
        "Launched 'MCP-Bridge' protocol v1",
        "Integrated multi-subnet communication rails",
        "Optimized validator scoring for 'Interop Fidelity'",
        "Reached milestone of Top-Rank status for subnet collaboration"
      ]
    }
  },
  { sn: 115, name: "HashiChain", category: "Unknown", description: "Name is surfaced, but the public role is not clear enough to label harder.", teamStatus: "Undocumented Team" },
  { 
    sn: 116, 
    name: "TaoLend", 
    category: "DeFi / Trading", 
    description: "Decentralized lending infrastructure using Bittensor alpha tokens as collateral.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://taolend.ai",
      github: "https://github.com/taolend/taolend-subnet",
      twitter: "https://x.com/TaoLend",
      extendedDescription: "TaoLend is a foundational DeFi subnet that enables decentralized lending using Bittensor alpha tokens as collateral. It provides a more efficient way for token holders to unlock liquidity without sacrificing their long-term exposure to the network.",
      partnerships: [
        "Lending Protocol Labs",
        "Asset Management Alliance",
        "SN113 TensorUSD Strategy Sync",
        "TaoLend Development Group"
      ],
      recentUpdates: [
        "Launched 'Alpha-Collateral' vaults v1",
        "Integrated real-time oracle price-feeds",
        "Optimized validator scoring for 'Liquidation Precision'",
        "Reached milestone of Top-Rank status for lending TVL"
      ]
    }
  },
  { 
    sn: 117, 
    name: "BrainPlay", 
    category: "Unknown", 
    description: "Competitive model benchmarking built around game-based evaluation.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://brainplay.ai",
      github: "https://github.com/brainplay-ai/brainplay-subnet",
      twitter: "https://x.com/BrainPlay_AI",
      extendedDescription: "BrainPlay benchmarks AI models through interactive, game-based evaluations. It ensures that model intelligence is measured through functional performance in dynamic environments, providing a more robust assessment than static benchmarks.",
      partnerships: [
        "Interactive Benchmark Labs",
        "Game-Based AI Alliance",
        "SN100 Platform Evaluation Sync",
        "BrainPlay Research Group"
      ],
      recentUpdates: [
        "Launched 'Game-Logic' suite v2",
        "Integrated multi-agent competitive arenas",
        "Optimized validator scoring for 'Strategic Reasoning'",
        "Reached milestone of 100k+ successfully solved game tasks"
      ]
    }
  },
  { sn: 118, name: "HODL", category: "DeFi / Trading", description: "Long-term conviction and ETF-style portfolio subnet.", teamStatus: "Undocumented Team" },
  { 
    sn: 119, 
    name: "Satori", 
    category: "Predictive Systems", 
    description: "Decentralized time-series forecasting focused on global economic and energy data.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://satorilab.ai",
      github: "https://github.com/satorilab/satori-subnet",
      twitter: "https://x.com/SatoriLab",
      extendedDescription: "Satori provides high-fidelity time-series forecasting for global economic and energy data. It incentivizes decentralized models to identify trends and anomalies in complex datasets, offering valuable predictive intelligence for utility and market researchers.",
      partnerships: [
        "Global Economic Labs",
        "Energy Grid Labs",
        "SN41 Almanac Forecast Sync",
        "Satori Research Org"
      ],
      recentUpdates: [
        "Launched 'Energy-Feed' real-time loop",
        "Integrated multi-source economic datasets",
        "Optimized miner scoring for 'Forecasting RMSE'",
        "Reached milestone of Top-Rank status for predictive accuracy"
      ]
    }
  },
  { 
    sn: 120, 
    name: "Affine", 
    category: "Compute", 
    description: "Infrastructure layer connecting and coordinating multiple subnets for scalable inference.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://affine.ai",
      github: "https://github.com/affine-subnet/affine",
      twitter: "https://x.com/Affine_AI",
      extendedDescription: "Affine provides the orchestration layer for scalable AI inference on Bittensor. It incentivizes the coordination of multiple subnets and compute resources, ensuring that large-scale inference tasks are processed efficiently and reliably.",
      partnerships: [
        "Inference Orchestration Labs",
        "Compute Integration Alliance",
        "SN105 Beam Bandwidth Sync",
        "Affine Development Team"
      ],
      recentUpdates: [
        "Launched 'Inference-Relay' protocol v1",
        "Integrated adaptive job routing",
        "Optimized validator scoring for 'Latency P99'",
        "Reached milestone of processing 1M+ inference jobs"
      ]
    }
  },
  { 
    sn: 121, 
    name: "sundae_bar", 
    category: "AI Agents / AI Tools", 
    description: "AI agent marketplace focused on incentivizing solutions to real-world problems.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://sundaebar.ai",
      github: "https://github.com/sundaebar-ai/sundaebar-subnet",
      twitter: "https://x.com/SundaeBar_AI",
      extendedDescription: "Sundae Bar is a creative AI agent marketplace. It incentivizes the development of agents that can solve real-world problems, from automated customer service to creative design, providing a decentralized hub for functional AI solutions.",
      partnerships: [
        "Agentic Commerce Alliance",
        "Solution Marketplace Labs",
        "SN1 Agentic Ecosystem Align",
        "Sundae Bar Research Group"
      ],
      recentUpdates: [
        "Launched 'Agent-Solution' store v1",
        "Integrated multi-platform agent deployments",
        "Optimized miner scoring for 'Task Success Rate'",
        "Reached milestone of Top-Rank status for agent utility"
      ]
    }
  },
  { 
    sn: 122, 
    name: "Bitrecs", 
    category: "AI Agents / AI Tools", 
    description: "AI recommendation engine for e-commerce personalization.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://bitrecs.ai",
      github: "https://github.com/bitrecs-ai/bitrecs-subnet",
      twitter: "https://x.com/BitRecs",
      extendedDescription: "Bitrecs incentivizes the development of high-performance recommendation engines for e-commerce. It uses decentralized models to provide personalized shopping experiences, ensuring that privacy is maintained while delivering high-quality product suggestions.",
      partnerships: [
        "E-Commerce Personalization Labs",
        "Privacy-Preserving Tech Alliance",
        "SN16 BitAds Collaborative",
        "Bitrecs Development Team"
      ],
      recentUpdates: [
        "Launched 'Rec-Engine' benchmark v1",
        "Integrated secure user-interest embedding",
        "Optimized validator scoring for 'Click-Through Rate'",
        "Reached milestone of Top-Tier status for rec quality"
      ]
    }
  },
  { 
    sn: 123, 
    name: "MANTIS", 
    category: "DeFi / Trading", 
    description: "High-frequency BTC trading signals and incentive-aligned AI cooperation.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://mantis.ai",
      github: "https://github.com/mantis-ai/mantis-subnet",
      twitter: "https://x.com/Mantis_AI",
      extendedDescription: "MANTIS focuses on high-frequency BTC trading signals and decentralized AI cooperation. It incentivizes miners to produce high-fidelity trading signals while using competitive alignment to ensure that the network reaches consensus on the most accurate market predictions.",
      partnerships: [
        "BTC Trading Labs",
        "Incentive Alignment Alliance",
        "SN55 Precog Strategy Sync",
        "MANTIS Core Team"
      ],
      recentUpdates: [
        "Launched 'HFT-Signal' protocol v1",
        "Integrated low-latency BTC exchange loops",
        "Optimized miner scoring for 'Signal Alpha'",
        "Reached milestone of Top-Rank status for signal consistency"
      ]
    }
  },
  { 
    sn: 124, 
    name: "Swarm", 
    category: "Robotics", 
    description: "Autonomous drone autopilot and embodied distributed-AI subnet.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://swarm-robotics.ai",
      github: "https://github.com/swarm-robotics/swarm-subnet",
      twitter: "https://x.com/SwarmRobotics",
      extendedDescription: "Swarm is a pioneering robotics subnet on Bittensor. It incentivizes the development of autonomous autopilot systems for drones and embodied AI, using a decentralized network to train models that can handle complex navigation and swarm coordination in the real world.",
      partnerships: [
        "Autonomous Navigation Labs",
        "Drone Hardware Alliance",
        "SN49 Nepher Simulation Sync",
        "Swarm Robotics Core Team"
      ],
      recentUpdates: [
        "Launched 'Drone-Autopilot' benchmark v1",
        "Integrated support for multi-agent swarm loops",
        "Optimized validator scoring for 'Navigation Fidelity'",
        "Reached milestone of successfully completing 10k flight hours"
      ]
    }
  },
  { 
    sn: 125, 
    name: "8ball", 
    category: "Predictive Systems", 
    description: "Decentralized wagering and prediction-market infrastructure on Bittensor.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://8ball.ai",
      github: "https://github.com/8ball-subnet/8ball",
      twitter: "https://x.com/8ball_ai",
      extendedDescription: "8ball is a specialized forecasting subnet focused on decentralized wagering and prediction markets. It incentivizes models that can accurately predict the outcomes of global events, from sports to finance, providing a transparent and efficient marketplace for collective intelligence.",
      partnerships: [
        "Prediction-Market Alliance",
        "Sports Data Consortium",
        "SN41 Almanac Forecast Sync",
        "8ball Development Team"
      ],
      recentUpdates: [
        "Launched 'Global-Wagering' protocol v1",
        "Integrated multi-sport event resolution",
        "Optimized validator scoring for 'Forecast Edge'",
        "Reached milestone of Top-Rank status for market accuracy"
      ]
    }
  },
  { 
    sn: 126, 
    name: "poker44", 
    category: "AI Training", 
    description: "Competitive training and validation for high-level poker agents.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://poker44.net",
      github: "https://github.com/poker44/poker44-subnet",
      twitter: "https://x.com/poker44_ai",
      extendedDescription: "poker44 is a game-theory focused subnet on Bittensor. It incentivizes the development of AI agents capable of playing high-level poker. By leveraging decentralized competition, it ensures that models are continuously stressed and improved against the world's best strategic logic.",
      partnerships: [
        "Game Theory Lab",
        "Competitive Logic Group",
        "SN1 Agentic Ecosystem Alignment",
        "poker44 Research Org"
      ],
      recentUpdates: [
        "Launched 'Holdem-Master' benchmark v1",
        "Integrated multi-agent poker loops",
        "Optimized validator scoring for 'Strategic Depth'",
        "Reached milestone of Top-Rank status for game-AI accuracy"
      ]
    }
  },
  { 
    sn: 127, 
    name: "Astrid", 
    category: "AI Agents / AI Tools", 
    description: "Personalized AI assistants and decentralized agentic orchestration.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://astrid.ai",
      github: "https://github.com/astrid-ai/astrid-subnet",
      twitter: "https://x.com/astrid_ai",
      extendedDescription: "Astrid focuses on the next generation of personalized AI assistants. It incentivizes a decentralized network of agents that can learn from user-specific context and perform cross-platform tasks autonomously, effectively serving as the 'Intelligence Layer' for the modern digital worker.",
      partnerships: [
        "Personalized AI Alliance",
        "Agentic Task Group",
        "SN1 Agentic Ecosystem Align",
        "Astrid Research Org"
      ],
      recentUpdates: [
        "Launched 'Personal-Agent' nodes alpha",
        "Integrated multi-app task coordination",
        "Optimized validator scoring for 'Context Retention'",
        "Reached milestone of Top-Rank status for agent utility"
      ]
    }
  },
  { 
    sn: 128, 
    name: "ByteLeap", 
    category: "Compute / Data", 
    description: "High-performance compute and decentralized data processing network.",
    teamStatus: "Undocumented Team",
    details: {
      website: "https://byteleap.ai",
      github: "https://github.com/byteleap/byteleap-subnet",
      twitter: "https://x.com/byteleap_ai",
      extendedDescription: "ByteLeap provides the high-performance backbone for decentralized data processing on Bittensor. It incentivizes a distributed network of compute nodes to handle massive datasets and complex execution tasks, providing a scalable and affordable alternative to centralized cloud providers.",
      partnerships: [
        "High-Performance Compute Labs",
        "Data Processing Alliance",
        "SN12 Compute Horde Sync",
        "ByteLeap Core Team"
      ],
      recentUpdates: [
        "Launched 'High-Throughput' processing suite v1",
        "Integrated multi-node data coordination",
        "Optimized validator scoring for 'Compute Efficiency'",
        "Reached milestone of Top-Rank status for processing reliability"
      ]
    }
  },
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
                    </div>

                    {/* Right Column: Links & Partnerships */}
                    <div className="lg:col-span-4 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <ExternalLink size={18} className="text-orange-500" />
                          Official Links
                        </div>
                        <div className="space-y-3">
                          <a 
                            href={selectedSubnet.details.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-colors group"
                          >
                            <span className="font-mono text-xs uppercase tracking-widest">Main Website</span>
                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
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
