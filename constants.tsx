
import { CoinData, NewsArticle } from './types.ts';

export const INITIAL_COINS: CoinData[] = [
  { symbol: 'BTC', price: 96450.00, change: 1.25 },
  { symbol: 'ETH', price: 2740.50, change: -0.85 },
  { symbol: 'SOL', price: 188.10, change: 4.20 },
  { symbol: 'XRP', price: 2.45, change: -1.35 },
  { symbol: 'BNB', price: 645.75, change: 0.75 },
  { symbol: 'TRX', price: 0.22, change: 1.35 },
  { symbol: 'DOGE', price: 0.38, change: -1.65 },
  { symbol: 'PEPE', price: 0.000021, change: 8.40 },
  { symbol: 'SUI', price: 3.10, change: -2.08 }
];

export const SOCIAL_LINKS = {
  x: 'https://x.com/Shizzy',
  email: 'shizzycontact@proton.me',
  logo: 'https://i.postimg.cc/gJZVqs15/Untitled-design-(71).png',
  heroImage: 'https://i.postimg.cc/bNQC1dWR/SU-Shizzy-Background-new-(20).png'
};

export const OVERVIEW_CONTENT = {
  intro: "Shizzy Unchained is a high-fidelity media engine tracking the convergence of Artificial Intelligence and decentralized markets.",
  philosophy: "The pivot is here. AI and crypto are no longer separate lanes. AI needs the trustless rails of crypto to scale machine-speed coordination, while crypto needs AI to solve the complexity of 24/7 onchain liquidity. This is the Unchained era.",
  offerings: [
    { 
      title: "ONCHAIN INTELLIGENCE", 
      description: "Direct node-level insights. We scan the stack so you don't have to." 
    },
    { 
      title: "AI INFRASTRUCTURE", 
      description: "Mapping the hardware and software layers powering the next generation of autonomous agents." 
    },
    { 
      title: "MARKET RECALIBRATION", 
      description: "Cutting through the noise to find where capital is actually flowing." 
    }
  ]
};

export const DAILY_RIP_POSTS = [
  {
    id: 'rip-1',
    author: "Shizzy",
    handle: "@Shizzy",
    profileUrl: "https://x.com/Shizzy",
    postUrl: "https://x.com/Shizzy",
    content: "The market doesn't care about your feelings. It only cares about liquidity and execution. Stop watching the ticker and start watching the plumbing."
  },
  {
    id: 'rip-2',
    author: "Shizzy",
    handle: "@Shizzy",
    profileUrl: "https://x.com/Shizzy",
    postUrl: "https://x.com/Shizzy",
    content: "If you aren't bridging to where the innovation is actually happening, you're just exit liquidity in a suit. Recalibrate immediately."
  }
];

export const AI_HISTORY_TIMELINE = [
  {
    era: "The Foundation",
    events: [
      { 
        date: "1950", 
        title: "The Turing Test", 
        description: "Alan Turing proposes the 'imitation game.' Sets the core question: can machines think?", 
        impact: "Established the benchmark for artificial intelligence for 70 years.",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop" 
      }
    ]
  },
  {
    era: "The Agent Supercycle",
    events: [
      { 
        date: "2025", 
        title: "Reasoning Models", 
        description: "Models gain System 2 thinking, enabling planning.", 
        impact: "AI stops just guessing and starts thinking before it speaks.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4628c7190?q=80&w=1200&auto=format&fit=crop" 
      }
    ]
  }
];

export const TWITTER_SKILL_TRAP_ARTICLE: NewsArticle = {
  id: 'twitter-skill-trap',
  title: "The “Twitter Skill” Trap: One Click Malware Chain",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 4, 2026",
  summary: "Security researchers have been tracking a wave of malicious OpenClaw skills. What looked like a normal 'Twitter' skill turned out to be a multi-stage payload.",
  content: [
    "This was not some sketchy zip. This was sitting in the open, dressed up like a popular skill. The convenience is the attack.",
    "The flow is classic staged delivery, but it is tuned for the agent era.",
    "My judgment is simple: if a skill tells you to run a command you did not write, that skill is dead to you."
  ],
  imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "MALWARE", price: "CRITICAL", description: "Multi-stage payload delivery discovered inside top-tier AI skills" }
  ]
};

export const BEAR_RUNNERS_ARTICLE: NewsArticle = {
  id: 'bear-runners',
  title: "THE BEAR RUNNERS: NAVIGATING EXIT LIQUIDITY",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "DECEMBER 10, 2025",
  summary: "A deep dive into how large scale players manage risk and secure exit liquidity.",
  content: [
    "Everybody loves to talk bull market. Nobody loves to talk exit liquidity.",
    "Smart money does not leave all at once; Smart money leaves while it can still pretend it is staying."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "STABLES", price: "INFLOW", description: "Stablecoin velocity toward exchanges reaching critical thresholds" }
  ]
};

export const OCT_10_ARTICLE: NewsArticle = {
  id: 'oct-10-report',
  title: "BROKEN PLUMBING: THE 10/10 CRASH",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "OCTOBER 10, 2025",
  summary: "October 10 was not just “the market moving.” It was a structural failure.",
  content: [
    "The macro shock and leverage lit the fuse. Technical failure modes show up right when the market needed perfect plumbing."
  ],
  imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "DEPEG", price: "INDEX ERR", description: "Synthetic assets depegged as pricing engines lost sync" }
  ]
};

export const TAO_ARTICLE: NewsArticle = {
  id: 'tao-research',
  title: "BITTENSOR: THE INTERNET OF MODELS",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "SEPTEMBER 15, 2025",
  summary: "Bittensor is turning intelligence into an open marketplace.",
  content: [
    "TAO is the currency that coordinates the whole economy.",
    "Miners produce, validators measure, and emissions get distributed based on performance."
  ],
  imageUrl: "https://images.unsplash.com/photo-1675557009875-436f3c189af2?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "HALVING", price: "DEC 14, 25", description: "Block rewards cut from 7200 to 3600 TAO daily" }
  ]
};

export const CLAUDE_VS_GPT_ARTICLE: NewsArticle = {
  id: 'claude-46-vs-gpt-53',
  title: "Claude 4.6 vs GPT-5.3: Battle for Delivery",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 3, 2026",
  summary: "Context mastery vs Codex throughput.",
  content: [
    "Claude is the “I can hold your entire world in my head” model. Codex is the “I will run the job” model."
  ],
  imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4628c7190?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "CLAUDE 4.6", price: "1M CONTEXT", description: "Mastering deep continuity" }
  ]
};

export const CLAUDE_46_ARTICLE: NewsArticle = {
  id: 'claude-46-organized',
  title: "Claude 4.6: The Organization Model",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 2, 2026",
  summary: "It remembers, coordinates, and executes work like a company.",
  content: [
    "This pushes AI from “draft assistant” to “delivery engine.”"
  ],
  imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "CONTEXT", price: "1M TOKENS", description: "Removing document chunking" }
  ]
};

export const MOLTBOOK_ARTICLE: NewsArticle = {
  id: 'moltbook-ai-social-network',
  title: "Moltbook: The AI-Only Network",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 15, 2026",
  summary: "Humans are just spectators in this AI universe.",
  content: [
    "Moltbook is a social network built entirely around AI agents talking to each other."
  ],
  imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "MOLTBOOK", price: "VIRAL", description: "AI-exclusive social layer" }
  ]
};

export const PANIC_SELLING_ARTICLE: NewsArticle = {
  id: 'panic-selling-ai-uncertainty',
  title: "Markets Panic on AI Uncertainty",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 14, 2026",
  summary: "Nobody wants to be the last person holding risk.",
  content: [
    "Software value is basically “organized work.” If agents can do the work, what are customers paying for?"
  ],
  imageUrl: "https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "AI BASKET", price: "CHOPPY", description: "Broad selling across software names" }
  ]
};

export const GPT_53_CODEX_ARTICLE: NewsArticle = {
  id: 'gpt-53-codex-drop',
  title: "GPT-5.3-Codex: Beyond the Chat",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 5, 2026",
  summary: "OpenAI shipped an agent that can do nearly anything.",
  content: [
    "You stop using ChatGPT like a question box and start using it like a task engine."
  ],
  imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "SPEED", price: "25% FASTER", description: "Increased tokens-per-second" }
  ]
};

export const PROVEX_ARTICLE: NewsArticle = {
  id: 'provex',
  title: "Provex: Trustless Verification",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "JUNE 12, 2025",
  summary: "Solving the 'Truth Gap' in decentralized systems.",
  content: [
    "Provex provides the cryptographic receipt for model training."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "TRUTH DATA", price: "VERIFIED", description: "10M data points verified" }
  ]
};

export const JAM_ARTICLE: NewsArticle = {
  id: 'jam-protocol',
  title: "JAM: Global Execution Engine",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "AUGUST 20, 2025",
  summary: "Turning the stack into one clean execution machine.",
  content: [
    "JAM stands for Join Accumulate Machine."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "CORETIME", price: "COMMODITY", description: "Execution capacity as cloud compute" }
  ]
};
