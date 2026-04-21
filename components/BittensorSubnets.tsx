import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, X, ChevronDown, ExternalLink, Github, Users, Calendar, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubnetDetails {
  website: string;
  github: string;
  partnerships: string[];
  recentUpdates: string[];
  extendedDescription: string;
}

interface Subnet {
  sn: number;
  name: string;
  category: string;
  description: string;
  details?: SubnetDetails;
}

const SUBNETS_DATA: Subnet[] = [
  { 
    sn: 1, 
    name: "Apex", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized AI agent infrastructure built for real usage, inference, and task execution.",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/prompting",
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
    details: {
      website: "https://dsperse.com",
      github: "https://github.com/dsperse/dsperse-subnet",
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
    name: "Teutonic", 
    category: "AI Training", 
    description: "AI training subnet using market-driven incentives to improve model performance.",
    details: {
      website: "https://teutonic.ai",
      github: "https://github.com/teutonical/teutonic-subnet",
      extendedDescription: "Teutonic is a model-agnostic training subnet that incentivizes miners to fine-tune and optimize AI weights for specific domains. It utilizes a competitive benchmark system where validators score models based on their perplexity and reasoning capabilities across high-quality curated datasets.",
      partnerships: [
        "Foundry Services",
        "SN9 Pretraining Collaborative",
        "Corcel API Integration",
        "OpenTensor Training Research"
      ],
      recentUpdates: [
        "Implemented 'Dynamic Dataset' rotation for training",
        "Enhanced validation logic to penalize overfitted models",
        "Launched support for Mistral-7B optimization paths",
        "Updated incentive mechanism for lower hardware barriers"
      ]
    }
  },
  { 
    sn: 4, 
    name: "Targon", 
    category: "Compute", 
    description: "Scalable GPU compute and inference infrastructure for real-world AI applications.",
    details: {
      website: "https://manifold.inc",
      github: "https://github.com/manifold-inc/targon",
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
    details: {
      website: "https://hone.ai",
      github: "https://github.com/hone-ai/hone-subnet",
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
    details: {
      website: "https://numinous.ai",
      github: "https://github.com/numinous-ai/numinous",
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
    name: "Subvortex", 
    category: "Infrastructure / Other", 
    description: "Decentralized information retrieval and latency-optimized relays for the Bittensor network.",
    details: {
      website: "https://subvortex.ai",
      github: "https://github.com/subvortex-ai/subvortex-subnet",
      extendedDescription: "Subvortex provides the critical low-latency relay infrastructure for the network. It focuses on ensuring that information can be retrieved and passed between subnets with minimal lag, optimizing the global performance of decentralized applications.",
      partnerships: [
        "Infrastructure Relay Group",
        "SN19 Vision Asset Sync",
        "Network Optimization Labs",
        "Subvortex Core Team"
      ],
      recentUpdates: [
        "Launched 'Global-Relay' nodes v2",
        "Integrated adaptive latency routing",
        "Improved security for cross-subnet signing",
        "Reached milestone of Top-Rank status for relay uptime"
      ]
    }
  },
  { 
    sn: 8, 
    name: "Vanta", 
    category: "DeFi / Trading", 
    description: "Decentralized trading infrastructure for liquidity, execution, and market activity.",
    details: {
      website: "https://taoshi.io",
      github: "https://github.com/taoshifine/vanta",
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
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/pretraining",
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
    name: "Sturdy", 
    category: "DeFi / Trading", 
    description: "Decentralized lending protocol focused on risk-isolated silos and yield optimization.",
    details: {
      website: "https://sturdy.finance",
      github: "https://github.com/sturdy-finance/sturdy-subnet",
      extendedDescription: "Sturdy brings institution-grade lending infrastructure to Bittensor. It incentivizes models that can optimize yield and collateral ratios across isolated lending silos, ensuring that the network's liquidity is utilized efficiently and safely.",
      partnerships: [
        "DeFi Advisory Group",
        "Yield Optimization Labs",
        "SN77 Liquidity Strategy Sync",
        "Sturdy Core Team"
      ],
      recentUpdates: [
        "Launched 'Risk-Isolated' lending pools v1",
        "Integrated multi-asset collateral benchmarks",
        "Optimized validator scoring for 'Yield Stability'",
        "Reached milestone of Top-Rank status for DeFi TVL"
      ]
    }
  },
  { 
    sn: 11, 
    name: "TrajectoryRL", 
    category: "AI Training", 
    description: "Reinforcement learning subnet improving agent behavior through competition.",
    details: {
      website: "https://trajectory.ai",
      github: "https://github.com/trajectory-rl/trajectory-subnet",
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
    details: {
      website: "https://computehorde.io",
      github: "https://github.com/backend-developers-ltd/compute-horde",
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
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/data-universe",
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
    details: {
      website: "https://taohash.com",
      github: "https://github.com/taohash/taohash-subnet",
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
    details: {
      website: "https://oroagents.com",
      github: "https://github.com/ORO-Agents/oro-subnet",
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
    details: {
      website: "https://bitads.ai",
      github: "https://github.com/ese-enterprise/bitads-subnet",
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
    details: {
      website: "https://404.gen",
      github: "https://github.com/404-gen/generative-subnet",
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
    name: "Zeus (Cortex.t)", 
    category: "Predictive Systems", 
    description: "Decentralized forecasting system focused on market analysis and environmental prediction.",
    details: {
      website: "https://taoshi.io",
      github: "https://github.com/taoshifine/zeus",
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
    name: "Vision", 
    category: "Generative AI", 
    description: "High-fidelity image generation and visual reasoning subnet.",
    details: {
      website: "https://vision.corcel.io",
      github: "https://github.com/corcel-ai/vision-subnet",
      extendedDescription: "Vision is the premier image generation powerhouse on Bittensor. It incentivizes the development of models that can produce studio-quality visual assets from simple prompts, pushing the boundaries of what's possible in synthetic media.",
      partnerships: [
        "Corcel AI Lab",
        "Digital Media Consortium",
        "SN17 404-GEN Asset Sync",
        "Vision Research Group"
      ],
      recentUpdates: [
        "Launched 'Vision-Studio' for professional creators",
        "Integrated improved spatial-consistency kernels",
        "Optimized validator scoring for 'Visual Fidelity'",
        "Reached milestone of generating 1M+ HD images daily"
      ]
    }
  },
  { 
    sn: 20, 
    name: "GroundLayer", 
    category: "AI Agents / AI Tools", 
    description: "Evaluation and tooling layer for language model agents performing real tasks.",
    details: {
      website: "https://groundlayer.xyz",
      github: "https://github.com/groundlayer/groundlayer-subnet",
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
    details: {
      website: "https://adtao.ai",
      github: "https://github.com/adtao/adtao-subnet",
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
    name: "X-Matrix", 
    category: "AI Tools", 
    description: "Decentralized personalization and user-embedding layer for the Agentic Economy.",
    details: {
      website: "https://xmatrix.ai",
      github: "https://github.com/x-matrix-ai/xmatrix-subnet",
      extendedDescription: "X-Matrix provides the essential personalization layer for applications on Bittensor. It incentivizes models that can create secure, privacy-preserving user embeddings, allowing agents to provide highly tailored experiences without compromising data sovereignty.",
      partnerships: [
        "Personalization Research Group",
        "Privacy-Preserving Tech Lab",
        "SN1 Agentic Ecosystem Align",
        "X-Matrix Core Team"
      ],
      recentUpdates: [
        "Launched 'Secure-Embedding' protocol v1",
        "Integrated multi-app user state relays",
        "Optimized validator scoring for 'Embedding Fidelity'",
        "Reached milestone of Top-Rank status for user-centric AI"
      ]
    }
  },
  { 
    sn: 23, 
    name: "Trishool", 
    category: "AI Safety", 
    description: "AI safety subnet focused on alignment, monitoring, and secure model behavior.",
    details: {
      website: "https://trishool.ai",
      github: "https://github.com/trishool-ai/safety-subnet",
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
    details: {
      website: "https://quasar.ai",
      github: "https://github.com/quasar-ai/quasar-subnet",
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
    details: {
      website: "https://bitstarter.ai",
      github: "https://github.com/bitstarter/mainframe-subnet",
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
    name: "Kinitro", 
    category: "Robotics", 
    description: "Embodied AI agents designed to operate across real-world environments and robotics systems.",
    details: {
      website: "https://kinitro.ai",
      github: "https://github.com/kinitro-ai/kinitro-subnet",
      extendedDescription: "Kinitro is a pioneering robotics subnet on Bittensor. It focuses on training 'Embodied AI'—models that can perceive the physical world and control robotic hardware. By using a decentralized network of simulation environments, Kinitro enables the rapid evolution of autonomous agents capable of navigating real-world complexity.",
      partnerships: [
        "Robotics Simulation Lab",
        "Autonomous Systems Org",
        "SN49 Nepher Collaborative",
        "Open-Hardware Initiative"
      ],
      recentUpdates: [
        "Launched 'Real-Physics' simulation v1",
        "Integrated multi-sensor data fusion benchmarks",
        "Added support for common ROS2 robotic nodes",
        "Optimized agent training for 20% faster convergence"
      ]
    }
  },
  { 
    sn: 27, 
    name: "Compute", 
    category: "Compute", 
    description: "Universal GPU compute orchestration providing raw horsepower for decentralized AI.",
    details: {
      website: "https://compute.bittensor.com",
      github: "https://github.com/compute-subnet/compute",
      extendedDescription: "Compute is the powerhouse of Bittensor. It incentivizes a global network of GPU providers to sell their raw horsepower, ensuring that any developer or subnet can access scalable, decentralized compute for training and inference.",
      partnerships: [
        "GPU Mining Alliance",
        "Compute Scaling Labs",
        "SN12 Compute Horde Sync",
        "Compute Development Group"
      ],
      recentUpdates: [
        "Launched 'GPU-Utility' benchmark suite",
        "Integrated support for H200 clusters",
        "Optimized validator scoring for 'Job Reliability'",
        "Reached Top-Rank status for compute uptime on network"
      ]
    }
  },
  { sn: 28, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 29, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 30, 
    name: "Bettensor", 
    category: "Predictive Systems", 
    description: "Decentralized forecasting marketplace for sports and global outcomes.",
    details: {
      website: "https://bettensor.com",
      github: "https://github.com/bettensor/bettensor-subnet",
      extendedDescription: "Bettensor is the prediction market leader on the network. It incentivizes the creation of high-fidelity forecasting models that can predict outcomes for sports, financial events, and social markers, creating a decentralized source of truth for the future.",
      partnerships: [
        "Global Forecasting Alliance",
        "Sports Data Partners",
        "SN41 Almanac Forecast Sync",
        "Bettensor Core Team"
      ],
      recentUpdates: [
        "Launched 'Global-Predict' arena v1",
        "Integrated real-time outcome resolution loops",
        "Optimized miner scoring for 'Sharpness' metrics",
        "Reached milestone of Top-Rank status for forecast volume"
      ]
    }
  },
  { sn: 31, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 32, 
    name: "ItS-AI", 
    category: "AI Safety", 
    description: "Detection and verification layer for identifying AI-generated content.",
    details: {
      website: "https://its-ai.io",
      github: "https://github.com/its-ai-subnet/its-ai",
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
    name: "Lollia", 
    category: "AI Tools", 
    description: "General intelligence tools and reasoning-based agents for the decentralised ecosystem.",
    details: {
      website: "https://lollia.ai",
      github: "https://github.com/lollia-ai/lollia-subnet",
      extendedDescription: "Lollia focuses on the development of general intelligence tools and reasoning agents. It incentivizes the creation of versatile AI components that can be used across subnets to provide enhanced logic, orchestration, and task fulfillment.",
      partnerships: [
        "General Intelligence Labs",
        "Agent Logic Alliance",
        "SN1 Agentic Ecosystem Align",
        "Lollia Core Team"
      ],
      recentUpdates: [
        "Launched 'Logic-Orchestration' suite v1",
        "Integrated multi-turn reasoning benchmarks",
        "Optimized validator scoring for 'Solution Depth'",
        "Reached milestone of Top-Rank status for agent logic"
      ]
    }
  },
  { 
    sn: 34, 
    name: "BitMind", 
    category: "AI Safety", 
    description: "Detection and classification of AI-generated media and deepfakes.",
    details: {
      website: "https://bitmind.ai",
      github: "https://github.com/bitmind-ai/bitmind-subnet",
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
    details: {
      website: "https://0xmarkets.io",
      github: "https://github.com/0xmarkets/0xmarkets-subnet",
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
  { 
    sn: 36, 
    name: "Eirel", 
    category: "AI Agents / AI Tools", 
    description: "Model deployment and feedback layer for real-world AI usage.",
    details: {
      website: "https://eirel.ai",
      github: "https://github.com/Eirel-Subnet/eirel",
      extendedDescription: "Eirel provides a robust deployment layer for AI models on Bittensor. It focuses on gathering real-world usage feedback to iterate on model weights, ensuring that decentralized models are not just trained in a vacuum but optimized for actual user interactions and task success.",
      partnerships: [
        "User Feedback Consortium",
        "Deployment Optimization Lab",
        "SN1 Agentic Ecosystem",
        "Eirel Research Group"
      ],
      recentUpdates: [
        "Launched 'Real-Time Feedback' API",
        "Integrated multi-model deployment nodes",
        "Optimized weight-update loops based on success metrics",
        "Reached milestone of 50k sessions served"
      ]
    }
  },
  { 
    sn: 37, 
    name: "Aurelius", 
    category: "Data", 
    description: "Adversarial dataset validation improving training data quality.",
    details: {
      website: "https://proximity.tech",
      github: "https://github.com/btclayer2/aurelius",
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
  { sn: 38, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 39, 
    name: "Basilica", 
    category: "AI Training", 
    description: "Part of the decentralized training stack supporting model development.",
    details: {
      website: "https://basilica.ai",
      github: "https://github.com/basilica-ai/basilica-subnet",
      extendedDescription: "Basilica is a specialized training subnet that focuses on high-efficiency model development. It leverages unique incentive mechanisms to reduce the compute-overhead of training while maintaining high accuracy, making decentralized training more sustainable.",
      partnerships: [
        "Efficient Training Labs",
        "Basilica Research Org",
        "SN12 Compute Horde Partner",
        "Open-Training Standards"
      ],
      recentUpdates: [
        "Optimized 'Epoch-Less' training workflows",
        "Launched support for lightweight model variants",
        "Integrated improved validator evaluation kernels",
        "Reached milestone of Top-10 training efficiency on network"
      ]
    }
  },
  { sn: 40, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 41, 
    name: "Almanac", 
    category: "Predictive Systems", 
    description: "AI-driven forecasting platform focused on sports and event outcomes.",
    details: {
      website: "https://almanac.ai",
      github: "https://github.com/Almanac-Subnet/almanac",
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
  { 
    sn: 42, 
    name: "Gopher", 
    category: "AI Training", 
    description: "Focused on advancing model intelligence through decentralized training.",
    details: {
      website: "https://gopher.ai",
      github: "https://github.com/gopher-subnet/gopher",
      extendedDescription: "Gopher is an AI training subnet dedicated to improving the reasoning and general intelligence of decentralized models. It uses large-scale competitive benchmarking to ensure that model weights are evolving toward higher logical and linguistic capabilities.",
      partnerships: [
        "Intelligence Research Lab",
        "Logical Reasoning Consortium",
        "SN5 Hone Logic Sync",
        "Gopher Development Team"
      ],
      recentUpdates: [
        "Launched 'Reasoning Suite V3'",
        "Integrated multi-turn dialogue benchmarks",
        "Optimized validator throughput for faster scoring",
        "Reached Top-5 status for model reasoning on-chain"
      ]
    }
  },
  { sn: 43, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 44, 
    name: "Score", 
    category: "Vision Models", 
    description: "Large-scale vision models trained to understand real-world visual data.",
    details: {
      website: "https://score.ai",
      github: "https://github.com/Score-Subnet/score-subnet",
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
    details: {
      website: "https://talisman.xyz",
      github: "https://github.com/Talisman-AI/talisman-subnet",
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
    details: {
      website: "https://resi.ai",
      github: "https://github.com/Resi-Subnet/resi-subnet",
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
  { sn: 47, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 48, 
    name: "Quantum", 
    category: "Compute", 
    description: "Marketplace for quantum compute circuits and experimental workloads.",
    details: {
      website: "https://quantum.ai",
      github: "https://github.com/quantum-subnet/quantum",
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
    details: {
      website: "https://nepher.ai",
      github: "https://github.com/Nepher-AI/nepher-subnet",
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
    details: {
      website: "https://synthdata.co",
      github: "https://github.com/synth-forecasting/synth-subnet",
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
    details: {
      website: "https://lium.io",
      github: "https://github.com/Lium-Labs/lium-subnet",
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
    details: {
      website: "https://oakresearch.io",
      github: "https://github.com/tensorplex-labs/dojo",
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
    details: {
      website: "https://ef.ai",
      github: "https://github.com/efficient-frontier/ef-subnet",
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
    name: "WebGenieAI", 
    category: "Generative AI", 
    description: "Turns prompts, sketches, and ideas into ready-to-deploy projects.",
    details: {
      website: "https://webgenie.ai",
      github: "https://github.com/WebGenie-AI/webgenie-subnet",
      extendedDescription: "WebGenie is the generative engine for software and web development. It incentivizes models that can turn natural language descriptions or sketches into functional, deployable code and full web components, accelerating the path from idea to product.",
      partnerships: [
        "Software Automation Consortium",
        "Low-Code/No-Code Standards Org",
        "SN1 Agentic Ecosystem Align",
        "WebGenie Labs"
      ],
      recentUpdates: [
        "Launched 'Text-to-Web' benchmark alpha",
        "Integrated cross-framework code generation",
        "Optimized validator scoring for 'Code Correctness'",
        "Reached milestone of 10k+ functional project exports"
      ]
    }
  },
  { 
    sn: 55, 
    name: "Precog", 
    category: "Predictive Systems", 
    description: "Bitcoin forecasting subnet built around market intelligence and predictive signals.",
    details: {
      website: "https://precog.ai",
      github: "https://github.com/Precog-Subnet/precog",
      extendedDescription: "Precog is a specialized forecasting subnet dedicated to Bitcoin price and market signals. It uses competitive machine learning models to capture complex market dynamics and provide highly accurate, actionable signals for BTC traders and liquidity providers.",
      partnerships: [
        "Bitcoin Market Intelligence Lab",
        "Predictive Signal Consortium",
        "SN50 Synth Strategy Sync",
        "Precog Development Team"
      ],
      recentUpdates: [
        "Launched 'BTC-Signal' resolution engine",
        "Integrated institutional-grade order-flow data",
        "Optimized validator scoring for 'Signal Precision'",
        "Reached 92% directional accuracy during testing"
      ]
    }
  },
  { 
    sn: 56, 
    name: "Gradients", 
    category: "AI Training", 
    description: "Open training infrastructure designed to make model training more accessible on Bittensor.",
    details: {
      website: "https://gradients.ai",
      github: "https://github.com/gradients-ai/gradients-subnet",
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
  { sn: 61, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 62, 
    name: "Ridges", 
    category: "AI Agents / AI Tools", 
    description: "Competitive coding agents built to solve real software tasks.",
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
  { sn: 67, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 68, 
    name: "NOVA", 
    category: "DeSci", 
    description: "Decentralized drug discovery subnet using AI to accelerate therapeutic research.",
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
  { sn: 70, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 71, 
    name: "Leadpoet", 
    category: "AI Agents / AI Tools", 
    description: "AI-driven lead generation and marketing intelligence platform.",
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
  { sn: 72, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 73, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 74, 
    name: "Gittensor", 
    category: "Infrastructure", 
    description: "Decentralized Git hosting and incentive layer for open-source development.",
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
  { sn: 76, name: "Byzantium", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced yet." },
  { 
    sn: 77, 
    name: "Liquidity", 
    category: "DeFi / Trading", 
    description: "Liquidity subnet built to incentivize external pool provisioning and liquidity voting for Bittensor assets.",
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
  { sn: 78, name: "Loosh", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough." },
  { sn: 79, name: "MVTRX", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough." },
  { sn: 80, name: "dogelayer", category: "Mining", description: "Mining pool subnet connecting Scrypt miners to Bittensor through merged LTC/DOGE mining." },
  { sn: 81, name: "deprecated", category: "Deprecated", description: "Subnet is no longer active." },
  { 
    sn: 82, 
    name: "Hermes", 
    category: "Data", 
    description: "Decentralized query layer that lets AI agents access blockchain data through structured GraphQL-style queries.",
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
    details: {
      website: "https://tatsuecosystem.io",
      github: "https://github.com/tatsu-ecosystem/chipforge",
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
    details: {
      website: "https://vidaio.io",
      github: "https://github.com/vidaio/vidaio-subnet",
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
  { sn: 86, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 87, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { 
    sn: 88, 
    name: "Investing", 
    category: "DeFi / Trading", 
    description: "Decentralized asset management subnet using human and AI quant strategies.",
    details: {
      website: "https://investing.bittensor.com",
      github: "https://github.com/investing-subnet/investing",
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
    details: {
      website: "https://infinitehash.io",
      github: "https://github.com/infinitehash/infinitehash-subnet",
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
    name: "brain", 
    category: "Predictive Systems", 
    description: "Subnet focused on validating prediction-market outcomes through decentralized verification.",
    details: {
      website: "https://subnet90.com",
      github: "https://github.com/brain-subnet/brain",
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
  { sn: 91, name: "Bitstarter #1", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough." },
  { sn: 92, name: "LUCID", category: "Unknown", description: "Live subnet with a confirmed name, but the current public role is not surfaced cleanly enough." },
  { 
    sn: 93, 
    name: "Bitcast", 
    category: "Creator Economy", 
    description: "Connects creators with brands and rewards content through decentralized incentives.",
    details: {
      website: "https://bitcast.ai",
      github: "https://github.com/bitcast-ai/bitcast-subnet",
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
  { sn: 94, name: "Bitsota", category: "Unknown", description: "Live subnet with a confirmed name, but no clear public role surfaced cleanly enough." },
  { 
    sn: 95, 
    name: "Actual Computer", 
    category: "Compute", 
    description: "Live subnet with a confirmed name and compute focus, but the current public utility details are limited.",
    details: {
      website: "https://actualcomputer.ai",
      github: "https://github.com/actual-computer/actual-computer",
      extendedDescription: "Actual Computer provides foundational, high-performance compute infrastructure for the Bittensor network. It focuses on providing stable and scalable execution environments for decentralized models and applications, ensuring the network's long-term utility.",
      partnerships: [
        "Core Infrastructure Labs",
        "Compute Scaling Partners",
        "SN12 Compute Horde Sync",
        "Actual Computer Research"
      ],
      recentUpdates: [
        "Launched 'Compute-Utility' benchmark v1",
        "Integrated support for specialized hardware nodes",
        "Optimized validator scoring for 'Job Reliability'",
        "Reached milestone of Top-Rank status for compute uptime"
      ]
    }
  },
  { sn: 96, name: "FLock OFF", category: "Unknown", description: "Live subnet with a confirmed name, but the current public role is not surfaced cleanly enough." },
  { 
    sn: 97, 
    name: "distil", 
    category: "AI Training", 
    description: "Model distillation subnet where miners compete to replicate frontier-model behavior.",
    details: {
      website: "https://distil.ai",
      github: "https://github.com/distil-ai/distil-subnet",
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
    details: {
      website: "https://forevermoney.ai",
      github: "https://github.com/forever-money/forever-money-subnet",
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
    details: {
      website: "https://leoma.ai",
      github: "https://github.com/leoma-ai/leoma-subnet",
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
    details: {
      website: "https://platform.ai",
      github: "https://github.com/platform-ai/platform-subnet",
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
  { sn: 101, name: "Subnet 101", category: "Unknown", description: "No clearly confirmed public role available." },
  { 
    sn: 102, 
    name: "ConnitoAI", 
    category: "AI Training", 
    description: "Decentralized model training subnet.",
    details: {
      website: "https://connito.ai",
      github: "https://github.com/connito-ai/connito-subnet",
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
    details: {
      website: "https://djinn.ai",
      github: "https://github.com/djinn-ai/djinn-subnet",
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
  { sn: 104, name: "for sale (burn to uid1)", category: "Unknown", description: "Listed as for sale rather than a normal branded subnet." },
  { 
    sn: 105, 
    name: "Beam", 
    category: "Compute", 
    description: "Infrastructure-focused subnet tied to bandwidth and data-transfer coordination.",
    details: {
      website: "https://beam.ai",
      github: "https://github.com/beam-ai/beam-subnet",
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
    details: {
      website: "https://voidai.com",
      github: "https://github.com/voidai-subnet/voidai",
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
    details: {
      website: "https://theminos.ai",
      github: "https://github.com/theminos/minos-subnet",
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
  { sn: 108, name: "TalkHead", category: "Unknown", description: "No clearly confirmed public role available." },
  { sn: 109, name: "Academia", category: "Unknown", description: "No clearly confirmed public role available." },
  { sn: 110, name: "Rich Kids of TAO", category: "Unknown", description: "No clearly confirmed public role available." },
  { 
    sn: 111, 
    name: "oneoneone", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized AI data network focused on collecting, validating, and serving authentic user-generated content.",
    details: {
      website: "https://oneoneone.io",
      github: "https://github.com/oneoneone-ai/oneoneone-subnet",
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
    details: {
      website: "https://minotaur.ai",
      github: "https://github.com/minotaur-ai/minotaur-subnet",
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
    details: {
      website: "https://tensorusd.com",
      github: "https://github.com/tensorusd/tensorusd-subnet",
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
    details: {
      website: "https://thesoma.ai",
      github: "https://github.com/soma-ai/soma-subnet",
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
  { sn: 115, name: "HashiChain", category: "Unknown", description: "Name is surfaced, but the public role is not clear enough to label harder." },
  { 
    sn: 116, 
    name: "TaoLend", 
    category: "DeFi / Trading", 
    description: "Decentralized lending infrastructure using Bittensor alpha tokens as collateral.",
    details: {
      website: "https://taolend.ai",
      github: "https://github.com/taolend/taolend-subnet",
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
    details: {
      website: "https://brainplay.ai",
      github: "https://github.com/brainplay-ai/brainplay-subnet",
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
  { sn: 118, name: "HODL", category: "DeFi / Trading", description: "Long-term conviction and ETF-style portfolio subnet." },
  { 
    sn: 119, 
    name: "Satori", 
    category: "Predictive Systems", 
    description: "Decentralized time-series forecasting focused on global economic and energy data.",
    details: {
      website: "https://satorilab.ai",
      github: "https://github.com/satorilab/satori-subnet",
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
    details: {
      website: "https://affine.ai",
      github: "https://github.com/affine-subnet/affine",
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
    details: {
      website: "https://sundaebar.ai",
      github: "https://github.com/sundaebar-ai/sundaebar-subnet",
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
    details: {
      website: "https://bitrecs.ai",
      github: "https://github.com/bitrecs-ai/bitrecs-subnet",
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
    details: {
      website: "https://mantis.ai",
      github: "https://github.com/mantis-ai/mantis-subnet",
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
    details: {
      website: "https://swarm-robotics.ai",
      github: "https://github.com/swarm-robotics/swarm-subnet",
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
  { sn: 125, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet name or role available." },
  { 
    sn: 126, 
    name: "Cortex", 
    category: "AI Agents / AI Tools", 
    description: "Modern inference stack focused on decentralized logic and agent-based execution.",
    details: {
      website: "https://cortex-t.ai",
      github: "https://github.com/cortex-t/cortex-subnet",
      extendedDescription: "Cortex provides the modern inference stack for Bittensor. It focuses on decentralized logic and the execution of complex agent-based tasks, ensuring that AI agents can communicate and reason effectively through a secure and scalable infrastructure layer.",
      partnerships: [
        "Inference Stack Labs",
        "Agent Logic Alliance",
        "SN114 SOMA Interop Sync",
        "Cortex Research Org"
      ],
      recentUpdates: [
        "Launched 'Agent-Logic' protocol v1",
        "Integrated secure tool-calling kernels",
        "Optimized miner scoring for 'Reasoning Quality'",
        "Reached milestone of Top-Rank status for agent execution"
      ]
    }
  },
  { 
    sn: 127, 
    name: "Synergy", 
    category: "AI Agents / AI Tools", 
    description: "Inference orchestration layer for cross-subnet task distribution and coordination.",
    details: {
      website: "https://synergy-infra.ai",
      github: "https://github.com/synergy-infra/synergy-subnet",
      extendedDescription: "Synergy acts as the inference orchestration layer for cross-subnet coordination. It incentivizes the distribution of complex tasks across various subnets, ensuring that resources are utilized optimally and that intelligence is integrated seamlessly across the network.",
      partnerships: [
        "Cross-Subnet Orchestration Labs",
        "Network Coordination Alliance",
        "SN120 Affine Infrastructure Sync",
        "Synergy Development Group"
      ],
      recentUpdates: [
        "Launched 'Task-Relay' protocol v1",
        "Integrated multi-subnet job distribution",
        "Optimized validator scoring for 'Coordination Latency'",
        "Reached milestone of Top-Rank status for network integration"
      ]
    }
  },
  { sn: 128, name: "Unverified", category: "Unknown", description: "Recently activated or reserved slot awaiting clear public identification." }
];

export const BittensorSubnets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubnet, setSelectedSubnet] = useState<Subnet | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(SUBNETS_DATA.map(s => s.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const filteredSubnets = useMemo(() => {
    return SUBNETS_DATA.filter(subnet => {
      const matchesSearch = 
        subnet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.sn.toString().includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'All' || subnet.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
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
          {(searchQuery !== '' || selectedCategory !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-orange-600/5 border border-orange-600/20 rounded-2xl text-orange-600 font-mono text-[10px] uppercase tracking-widest hover:bg-orange-600/10 transition-all whitespace-nowrap order-last md:order-first"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}

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
            <div 
              key={subnet.sn}
              onClick={() => setSelectedSubnet(subnet)}
              className="group flex flex-col bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer"
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
                    <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest px-2 py-1 bg-orange-500/5 rounded-md mt-1 inline-block">
                      {subnet.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow mt-2">
                {subnet.description}
              </p>
            </div>
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
                    <span className="text-xs font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest px-3 py-1 bg-orange-500/5 rounded-full mt-1 inline-block border border-orange-500/10">
                      {selectedSubnet.category}
                    </span>
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
