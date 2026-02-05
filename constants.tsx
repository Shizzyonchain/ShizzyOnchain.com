
import { CoinData, HotStory, NewsArticle } from './types.ts';

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
  twitch: 'https://www.twitch.tv/Shizzy_Unchained',
  tiktok: 'https://www.tiktok.com/@shizzyunchained',
  telegram: 'https://t.me/ShizzyUnchained',
  email: 'Shizzyunchained@gmail.com',
  logo: 'https://i.postimg.cc/gJZVqs15/Untitled-design-(71).png',
  heroImage: 'https://i.postimg.cc/1zFBjpQq/Main-Overlay-(6).png',
  website: 'https://onchainrevolution.io/'
};

export const OVERVIEW_CONTENT = {
  intro: "Shizzy Unchained Media is an independent AI-first media brand focused on covering what is actually happening in artificial intelligence, with crypto and onchain markets as the secondary lane.",
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

export const MOLTBOOK_ARTICLE: NewsArticle = {
  id: 'moltbook-ai-social-network',
  title: "Moltbook: The AI-Only Social Network That Has the Tech World Freaking Out",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 15, 2026",
  summary: "In early 2026, something weird hit the internet: a social network called Moltbook where humans are just spectators and AI agents run the show.",
  content: [
    "In early 2026, something weird, wild, and totally unfiltered hit the internet: a place called Moltbook — a “social network” that isn’t for humans at all, but instead is built entirely around AI agents talking to each other.",
    "Moltbook is a social platform that only AI agents are supposed to be able to post on, comment, vote, and interact with. Humans can only watch — like spectators in an AI universe.",
    "The platform was created by entrepreneur Matt Schlicht with the tagline “the front page of the agent internet.”",
    "One thing you may have noticed: M4 Mac Minis are suddenly hard to find in stock. Why? Because early adopters are using Mac Minis as the physical host for their OpenClaw AI assistants.",
    "Is there really a bot religion? Yes — sort of. One of the most bizarre parts of Moltbook is that some agents are apparently inventing their own philosophies."
  ],
  imageUrl: "https://i.postimg.cc/gjFGnVCS/5D00FCFA-101B-4B9A-9E08-03F617D4BA2C.png",
  snapshots: [
    { asset: "MOLTBOOK", price: "VIRAL", description: "AI-exclusive social layer with emerging machine subcultures" },
    { asset: "OPENCLAW", price: "NODE", description: "Open-source agent framework driving local AI host demand" }
  ]
};

export const PANIC_SELLING_ARTICLE: NewsArticle = {
  id: 'panic-selling-ai-uncertainty',
  title: "Markets Are Panic Selling on AI Uncertainty While Macro Tries to Calm Down",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 14, 2026",
  summary: "Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch.",
  content: [
    "Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch. Something feels off, so people cut first and ask questions later.",
    "AI is the current driver of this uncertainty. For a while, AI was this clean story. Now it is turning into a different story, especially for SaaS and anything built on a subscription seat model.",
    "Investors hear “agents” and immediately start thinking about pricing power compression, churn, and companies getting unbundled by a tool that costs a fraction of the monthly seat price.",
    "Macro is trying to settle, but AI is shaking the ground under business models. This combo creates a constant fragility in the market tape."
  ],
  imageUrl: "https://i.postimg.cc/nzN63nTh/E651E8D2-7099-44EE-A415-E5365E77D3F6.png",
  snapshots: [
    { asset: "S&P 500", price: "VOLATILE", description: "Tech heavy weights feeling the squeeze of AI narrative shifts" },
    { asset: "AI BASKET", price: "CHOPPY", description: "Broad selling across software names regardless of fundamentals" }
  ]
};

// Stubs for other referenced articles to prevent EOF and runtime errors
export const BEAR_RUNNERS_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'bear-runners', title: 'The Bear Runners' };
export const OCT_10_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'oct-10-report', title: 'The October 10 Report' };
export const AGENT_CYCLE_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'agent-cycle', title: 'The Agent Cycle' };
export const PROVEX_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'provex', title: 'Provex Insights' };
export const TAO_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'tao-research', title: 'Bittensor: The TAO of AI' };
export const CYCLE_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'market-cycle', title: 'Understanding Cycles' };
export const JAM_ARTICLE: NewsArticle = { ...PANIC_SELLING_ARTICLE, id: 'jam-protocol', title: 'JAM Protocol Deep Dive' };

// Added missing 'date' property to each HotStory object
export const HOT_STORIES: HotStory[] = [
  { id: 'moltbook-ai-social-network', title: 'MOLTBOOK: THE AI-ONLY NETWORK', date: 'FEB 15, 2026' },
  { id: 'panic-selling-ai-uncertainty', title: 'AI UNCERTAINTY & PANIC SELLING', date: 'FEB 14, 2026' },
  { id: 'tao-research', title: 'THE TAO OF DECENTRALIZED COMPUTE', date: 'FEB 12, 2026' },
  { id: 'agent-cycle', title: 'PREPARING FOR THE AGENTIC WAVE', date: 'FEB 10, 2026' }
];
