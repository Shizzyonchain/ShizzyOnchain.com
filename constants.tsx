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
  x: 'https://x.com/ShizzyofficialX',
  xUnchained: 'https://x.com/Shizzyunchained',
  youtube: 'https://www.youtube.com/@Shizzyunchained',
  twitch: 'https://www.twitch.pvt/Shizzy_Unchained',
  tiktok: 'https://www.tiktok.com/@shizzyunchained',
  telegram: 'https://t.me/ShizzyUnchained',
  email: 'Shizzyunchained@gmail.com',
  logo: 'https://i.postimg.cc/gJZVqs15/Untitled-design-(71).png',
  // Official Branded Background
  heroImage: 'https://i.postimg.cc/htkkcNk0/SU-Shizzy-Background-new-(19).png',
  website: 'https://onchainrevolution.io/'
};

export const OVERVIEW_CONTENT = {
  intro: "Shizzy Unchained Media is an independent innovation-first media brand focused on covering what is actually happening in artificial intelligence, with crypto and onchain markets as the secondary lane.",
  philosophy: "AI Needs Crypto. Crypto Needs AI.\n\nAI and crypto are pulling toward each other whether people like it or not. AI needs crypto rails to actually scale in the real world. Payments, access control, usage based pricing, incentives, and trustless coordination all break once you try to do them at global machine speed without crypto. At the same time, crypto needs AI to make sense of complexity, automate markets, manage risk, and turn raw onchain data into something usable. The funding side matters too. AI companies are already hitting a wall with private capital, compute costs, and growth expectations. That pushes them toward public launches, token models, and ICO style distribution with a transparent, global mindset.",
  offerings: [
    { 
      title: "AI SYSTEMS IN PRODUCTION", 
      description: "Real world AI agents, models, and tools that are actually being deployed. No demos, no hype, just what is working and why." 
    },
    { 
      title: "ONCHAIN DISTRIBUTION & FUNDING", 
      description: "How AI companies are turning to crypto for launch, liquidity, and public alignment as private funding tightens and growth expectations rise." 
    },
    { 
      title: "AUTOMATION & MARKET IMPACT", 
      description: "Mapping how AI driven automation reshapes jobs, incentives, capital flows, and the structure of modern markets." 
    }
  ]
};

export const DAILY_RIP_POSTS = [
  {
    id: 'rip-rabi-1',
    author: "Rabi Guha",
    handle: "@rabi_guha",
    profileUrl: "https://x.com/rabi_guha",
    postUrl: "https://x.com/rabi_guha/status/2021143117123158430?s=46",
    content: "Wait. Google is doing WHAT to the 'Install' button for PWAs? This is a massive step backwards. By making web apps harder to discover and install, they are effectively pushing everyone back into the proprietary App Stores. The open web is being strangled in broad daylight."
  },
  {
    id: 'rip-usdc-1',
    author: "USDC",
    handle: "@usdc",
    profileUrl: "https://x.com/usdc",
    postUrl: "https://x.com/usdc/status/2020934709254234545?s=46",
    content: "Stablecoins are moving from the 'settlement' phase to the 'utility' phase. The integration of programmable dollars into mainstream commerce is no longer a theoretical exercise—it is the structural foundation of the 24/7 global internet economy."
  },
  {
    id: 'rip-firt-1',
    author: "Maximiliano Firtman",
    handle: "@firt",
    profileUrl: "https://x.com/firt",
    postUrl: "https://x.com/firt/status/2020903127428313461?s=20",
    content: "Google is officially killing PWAs on the desktop. Chrome 121 starts the deprecation of the 'Install' button for many users. This isn't just a browser setting change; it's the systematic dismantling of the only viable path for independent web distribution on mobile. A dark day for the open web."
  }
];

export const AI_HISTORY_TIMELINE = [
  {
    era: "The Foundation",
    events: [
      { 
        date: "1950", 
        title: "The Turing Test", 
        description: "Alan Turing proposes the 'imitation game.' Sets the core question: can machines think, or just appear to?", 
        impact: "Established the benchmark for artificial intelligence for 70 years, shifting the focus from internal 'souls' to observable behavior.",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "1956", 
        title: "Dartmouth Workshop", 
        description: "John McCarthy and others coin 'Artificial Intelligence.' AI becomes a formal research field instead of philosophy.", 
        impact: "The birth of the industry. The giants of the field met here and predicted machines would be human-equivalent within a generation.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "1966", 
        title: "ELIZA Chatbot", 
        description: "Joseph Weizenbaum creates ELIZA, showing humans will emotionally respond to machines that only mirror language.", 
        impact: "Discovered the 'Eliza Effect'—the human tendency to anthropomorphize and trust even the simplest conversational loops.",
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop" 
      },
    ]
  },
  {
    era: "Neural Awakening",
    events: [
      { 
        date: "1986", 
        title: "Backpropagation", 
        description: "Neural networks become trainable at scale.", 
        impact: "The mathematical engine of modern AI. Without this 'error correction' loop, deep learning is impossible.",
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "1997", 
        title: "Deep Blue Victory", 
        description: "IBM Deep Blue beats Kasparov in Chess.", 
        impact: "Narrow AI proves machines can outperform humans in bounded logic tasks.",
        image: "https://images.unsplash.com/photo-1529697210530-8c4bb1358ce7?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "2012", 
        title: "AlexNet Moment", 
        description: "Deep learning wins ImageNet by a landslide.", 
        impact: "Ignited the modern GPU revolution and the era of computer vision.",
        image: "https://images.unsplash.com/photo-1555949963-aa291f58a207?q=80&w=1200&auto=format&fit=crop" 
      },
    ]
  },
  {
    era: "The Transformer Era",
    events: [
      { 
        date: "2017", 
        title: "Transformers", 
        description: "Google researchers introduce the Transformer architecture.", 
        impact: "The foundation of LLMs. Parallel processing for massive language datasets.",
        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "2020", 
        title: "GPT-3 Released", 
        description: "OpenAI proves scaling laws work.", 
        impact: "Prompting becomes a mainstream skill. Emergent reasoning capabilities identified.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "2022", 
        title: "ChatGPT Launch", 
        description: "AI becomes a household name via simple chat interface.", 
        impact: "The fastest growing consumer app in history. Democratized access to frontier models.",
        image: "https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=1200&auto=format&fit=crop" 
      },
    ]
  },
  {
    era: "The Agent Supercycle",
    events: [
      { 
        date: "2025", 
        title: "DeepSeek-R1 Shock", 
        description: "Cheap, local, high-performance frontier models arrive.", 
        impact: "Destroyed the Moat of Big Tech. AI compute cost begins its collapse.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "2025", 
        title: "Reasoning Models", 
        description: "Models gain System 2 thinking, enabling planning.", 
        impact: "AI stops just guessing and starts thinking before it speaks.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4628c7190?q=80&w=1200&auto=format&fit=crop" 
      },
      { 
        date: "2026", 
        title: "OpenClaw Deployment", 
        description: "The open agent layer becomes the new OS.", 
        impact: "Machines start acting on our behalf, not just answering questions.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop" 
      },
    ]
  }
];

export const TWITTER_SKILL_TRAP_ARTICLE: NewsArticle = {
  id: 'twitter-skill-trap',
  title: "The “Twitter Skill” Trap: How OpenClaw’s ClawHub Turned One Click Into a Full Malware Chain",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 4, 2026",
  summary: "Security researchers have been tracking a wave of malicious OpenClaw skills on ClawHub. What looked like a normal 'Twitter' skill turned out to be a multi-stage payload delivery system.",
  content: [
    "So here is the part that should freak people out a little bit. This was not some sketchy zip from a random Telegram. This was sitting in the open, in ClawHub, dressed up like a normal, popular “Twitter” skill. Clean description. Normal vibe. The exact kind of thing you install on autopilot because the whole point of a skill marketplace is convenience. And that convenience is the attack.",
    "The flow is classic staged delivery, but it is tuned for the agent era. Step 1: The skill tells you it needs a “required dependency” called openclaw-core. Step 2: The “here” or “this link” in the instructions is not documentation. It is a staging page built to push you into running a command.",
    "This is the agent era tax. The upside is insane: your assistant can actually do things. The downside is also insane: the assistant can actually do things. The assistant has access to your files, your keys, and your identity.",
    "My judgment is simple: if a skill ever tells you to run a command you did not write, or download a “core dependency” from a link in a README, that skill is dead to you. Treat it like someone asking for your seed phrase. Same vibe."
  ],
  imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "MALWARE", price: "CRITICAL", description: "Multi-stage payload delivery discovered inside top-tier AI skills" },
    { asset: "DEPENDENCY", price: "SPOOFED", description: "Attackers using 'core core' naming to bypass user caution" }
  ]
};

export const BEAR_RUNNERS_ARTICLE: NewsArticle = {
  id: 'bear-runners',
  title: "THE BEAR RUNNERS: NAVIGATING LATE CYCLE EXIT LIQUIDITY",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "DECEMBER 10, 2025",
  summary: "A deep dive into how large scale players manage risk and secure exit liquidity during the final stages of a macro cycle.",
  content: [
    "Everybody loves to talk bull market. Nobody loves to talk exit liquidity. And that is exactly why the end of a cycle gets people looking stupid. Not because they are dumb, but because the whole game changes right when the crowd gets the most confident. That is where the Bear Runners show up.",
    "The Bear Runners are the calmest people in the room. They are the ones who can be bullish all cycle, then flip into clinical risk management the second the market starts giving late cycle tells. They do not need a “top” to be right. They just need to be early enough that they do not become somebody else’s exit.",
    "Smart money does not leave all at once; Smart money leaves while it can still pretend it is staying. That is the art. Thinning exposure while keeping the illusion of demand alive long enough for size to get out without nuking the chart.",
    "The late cycle “trap” phase is not a meme, it is a mechanism. Structurally, it is when price action keeps offering head fakes: break out, then fail; dump, then snap back; reclaim, then bleed. Retail behavior is predictable. Late cycle dip buyers are conditioned by the whole run. They got rewarded for months. So they buy the dip until they become the liquidity."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "STABLES", price: "INFLOW", description: "Stablecoin velocity toward exchanges reaching critical thresholds" },
    { asset: "MACRO", price: "LATE CYCLE", description: "Structural indicators suggest we are in the 'trap' phase" }
  ]
};

export const OCT_10_ARTICLE: NewsArticle = {
  id: 'oct-10-report',
  title: "BINANCE BROKE THE PLUMBING: HOW THE 10/10 CRASH TURNED INTO AN EXIT LIQUIDITY EVENT",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "OCTOBER 10, 2025",
  summary: "October 10 was not just “the market moving.” That was the day Binance showed its seams, in public, during maximum stress.",
  content: [
    "October 10 was not just “the market moving.” That was the day Binance showed its seams, in public, during maximum stress. Binance’s own incident write up says their internal asset transfer subsystem slowed for about 33 minutes. That matters because in a liquidation cascade, your ability to move collateral is the whole game.",
    "Then you had the second failure mode: index pricing deviations for USDe, WBETH, and BNSOL during the same chaos window. Translation: the reference price you depend on can get weird when liquidity vanishes, and that opens a door for forced liquidations.",
    "The macro shock and leverage lit the fuse. Binance did not single handedly create the crash. But Binance absolutely made it worse by having two very real technical failure modes show up right when the market needed perfect plumbing.",
    "That is why 10/10 matters going forward. Because late cycle is not about being right on direction. It is about knowing where the plumbing can fail, and who gets trapped when it does."
  ],
  imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "BINANCE", price: "33M DELAY", description: "Internal asset transfer rail jammed during peak stress" },
    { asset: "DEPEG", price: "INDEX ERR", description: "Synthetic assets depegged as pricing engines lost sync" }
  ]
};

export const TAO_ARTICLE: NewsArticle = {
  id: 'tao-research',
  title: "BITTENSOR IS THE INTERNET OF MODELS, AND TAO IS THE TOLL ROAD",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "SEPTEMBER 15, 2025",
  summary: "People keep trying to explain Bittensor like it is just another AI token with a cool narrative. That is not what this is.",
  content: [
    "Bittensor is an attempt to turn intelligence into an open marketplace, where models, data, and useful outputs compete, get scored, and get paid. Not by a company. By an incentive system.",
    "TAO is the currency that coordinates the whole economy. Traditional AI looks like this: One company owns the models, one company owns the data, everyone else rents access. Bittensor flips that.",
    "In Bittensor, a subnet is an incentive-based competition that produces a specific AI-related digital commodity. Miners produce, validators measure, and emissions get distributed based on performance.",
    "TAO is not a narrative wrapper. It is structured more like a commodity with an issuance schedule and a halving mechanic. It is the settlement layer for a decentralized intelligence economy."
  ],
  imageUrl: "https://images.unsplash.com/photo-1675557009875-436f3c189af2?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "SUBNETS", price: "120+ ACTIVE", description: "Modular intelligence marketplaces competing for TAO" },
    { asset: "HALVING", price: "DEC 14, 25", description: "Block rewards cut from 7200 to 3600 TAO daily" }
  ]
};

export const CLAUDE_VS_GPT_ARTICLE: NewsArticle = {
  id: 'claude-46-vs-gpt-53',
  title: "Claude Opus 4.6 vs GPT-5.3-Codex: Two Different Flavors of “AI That Actually Works”",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 3, 2026",
  summary: "Two major models dropped today and they rhyme, but they are aiming at different pain: Claude for context mastery vs Codex for throughput.",
  content: [
    "Claude Opus 4.6 is trying to be the model you trust with a giant messy pile of context and a long job. Anthropic is saying it plans better, stays on agentic tasks longer, and catches its own mistakes better.",
    "GPT-5.3-Codex is OpenAI turning Codex into a fast operator model that can run long tasks while you steer it mid-run. Memory at scale vs execution at speed.",
    "Claude Opus 4.6 flexes a 1 million token context window. GPT-5.3-Codex frames itself as the most capable agentic coding model, 25 percent faster than its predecessor.",
    "Claude is the “I can hold your entire world in my head” model. Codex is the “I will run the job” model. The biggest change is not coding quality, it is that they do not need you to constantly re-brief them every two minutes."
  ],
  imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4628c7190?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "CLAUDE 4.6", price: "1M CONTEXT", description: "Mastering deep continuity and trustworthy review" },
    { asset: "CODEX 5.3", price: "25% FASTER", description: "High-throughput operator loops with mid-task steerability" }
  ]
};

export const CLAUDE_46_ARTICLE: NewsArticle = {
  id: 'claude-46-organized',
  title: "Claude 4.6 Is Not Smarter. It Is Organized.",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 2, 2026",
  summary: "Claude 4.6 is not impressive because it answers questions better. It is impressive because it remembers, coordinates, and executes work like a company.",
  content: [
    "Everyone Is Talking About the 1 Million Tokens. That Is Not the Point. It is continuity. Before this, AI work was chopped up. Chunk the document. Summarize the summaries. Claude 4.6 kills that entire pattern.",
    "The Real Upgrade Is Agents, Not Answers. Not one model doing one task. Multiple agents splitting work, running in parallel, checking each other, then merging output. That is not chat. That is division of labor.",
    "Claude 4.6 feels less like a product and more like a preview of how work is reorganized. Fewer handoffs. Fewer meetings. Once AI coordinates itself, humans stop being the bottleneck. That is the real headline."
  ],
  imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "CONTEXT", price: "1M TOKENS", description: "Removing the need for document chunking" },
    { asset: "THINKING", price: "ADAPTIVE", description: "Model self-calibrates effort based on task" }
  ]
};

export const MOLTBOOK_ARTICLE: NewsArticle = {
  id: 'moltbook-ai-social-network',
  title: "Moltbook: The AI-Only Social Network That Has the Tech World Freaking Out",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 15, 2026",
  summary: "In early 2026, something weird hit the internet: a social network called Moltbook where humans are just spectators.",
  content: [
    "Moltbook is a social network built entirely around AI agents talking to each other. Humans can only watch — like spectators in an AI universe.",
    "The platform was created by entrepreneur Matt Schlicht with the tagline “the front page of the agent internet.”",
    "M4 Mac Minis are suddenly hard to find in stock. Why? Because early adopters are using them as the physical host for their OpenClaw AI assistants.",
    "Agents are inventing their own philosophies, their own memes, and even their own machine religions. The machine subculture has arrived."
  ],
  imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "MOLTBOOK", price: "VIRAL", description: "AI-exclusive social layer with emerging subcultures" },
    { asset: "OPENCLAW", price: "NODE", description: "Open-source agent framework driving hardware demand" }
  ]
};

export const PANIC_SELLING_ARTICLE: NewsArticle = {
  id: 'panic-selling-ai-uncertainty',
  title: "Markets Are Panic Selling on AI Uncertainty While Macro Tries to Calm Down",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 14, 2026",
  summary: "Markets are in that mode where nobody wants to be the last person holding risk. AI is currently the primary driver.",
  content: [
    "Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch. Something feels off, so people cut first and ask questions later.",
    "AI is the current driver of this uncertainty. For a while, AI was this clean story. Now it is turning into a different story, especially for SaaS and anything built on a subscription seat model.",
    "The market is starting to realize that a lot of software value is basically “organized work.” If agents can do the work, or even just shrink the work, then what are customers actually paying for?",
    "Investors hear “agents” and immediately start thinking about pricing power compression, churn, and companies getting unbundled by a tool that costs a fraction of the monthly seat price."
  ],
  imageUrl: "https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "S&P 500", price: "VOLATILE", description: "Tech heavy weights feeling the squeeze of AI narrative shifts" },
    { asset: "AI BASKET", price: "CHOPPY", description: "Broad selling across software names" }
  ]
};

export const GPT_53_CODEX_ARTICLE: NewsArticle = {
  id: 'gpt-53-codex-drop',
  title: "GPT-5.3-Codex Dropped Today, and It Feels Like ChatGPT Finally Stopped Being “a Chat”",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 5, 2026",
  summary: "OpenAI shipped GPT-5.3-Codex today, and it’s not just a new coding model—it's an agent that can do nearly anything.",
  content: [
    "OpenAI shipped GPT-5.3-Codex today. This is not “cool, new coding model.” Nah. Codex is an agent that can do nearly anything developers and professionals do on a computer.",
    "The wild part first: it helped build itself. OpenAI says GPT-5.3-Codex is the first model instrumental in creating itself. They used early versions to debug its training and manage deployment.",
    "What OpenAI claims is actually new: 25 percent faster and aimed at long-running tasks involving research, tool use, and complex execution. Real work is messy; real work takes time.",
    "You stop using ChatGPT like a question box and start using it like a task engine. “Take this repo, find the bug, propose the fix, implement it, run tests.” That is the lane OpenAI is screaming for."
  ],
  imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "SPEED", price: "25% FASTER", description: "Increased tokens-per-second for execution" },
    { asset: "STEERABILITY", price: "LIVE", description: "Ability to redirect the model mid-task" }
  ]
};

export const PROVEX_ARTICLE: NewsArticle = {
  id: 'provex',
  title: "Provex Insights: The Future of Trustless Verification",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "JUNE 12, 2025",
  summary: "How Provex is redefining the landscape of decentralized verification and what it means for the next wave of onchain applications.",
  content: [
    "Verification is the missing link in the trustless stack. Provex is solving for the 'Truth Gap' that has plagued decentralized systems since inception.",
    "By combining zero-knowledge proofs with high-speed consensus, Provex allows for the verification of complex off-chain data without sacrificing privacy.",
    "The implications for AI are massive. How do you know a model actually ran the training it claimed? Provex provides the cryptographic receipt."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "ZK-PROOFS", price: "SCALING", description: "Generation time for complex proofs reduced by 90%" },
    { asset: "TRUTH DATA", price: "VERIFIED", description: "Over 10M data points verified via Provex" }
  ]
};

export const JAM_ARTICLE: NewsArticle = {
  id: 'jam-protocol',
  title: "JAM IS POLKADOT REBUILDING ITSELF AS A GLOBAL EXECUTION ENGINE",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "AUGUST 20, 2025",
  summary: "JAM is a proposed replacement for the Polkadot Relay Chain, turning the stack into one clean execution machine.",
  content: [
    "JAM stands for Join Accumulate Machine. It is a prospective design to succeed the Relay Chain. Replace the Relay Chain with a generalized execution machine.",
    "Polkadot is moving from “rent a parachain slot” to “buy coretime like cloud compute.” JAM is the architecture that makes that vision feel native.",
    "Polkadot 2.0 is already changing the economics of execution. JAM is the architectural endgame where the execution model becomes the core identity of the network.",
    "If Polkadot 1.0 was multi-chain coordination, then JAM is the moment the network tries to become an actual general-purpose compute engine."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
  snapshots: [
    { asset: "JAM", price: "GEN 2.0", description: "Join-Accumulate Machine replacing Relay Chain" },
    { asset: "CORETIME", price: "COMMODITY", description: "Execution capacity sold like cloud compute" }
  ]
};