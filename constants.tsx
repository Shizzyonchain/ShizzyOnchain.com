
import { CoinData, NewsArticle } from './types.ts';

export const INITIAL_COINS: CoinData[] = [
  { symbol: 'BTC', price: 96450.00, change: 1.25 },
  { symbol: 'ETH', price: 2740.50, change: -0.85 },
  { symbol: 'SOL', price: 188.10, change: 4.20 },
  { symbol: 'XRP', price: 2.45, change: -1.35 },
  { symbol: 'BNB', price: 645.75, change: 0.75 },
  { symbol: 'TRX', price: 0.22, change: 1.35 }
];

export const SOCIAL_LINKS = {
  unchainedX: 'https://x.com/ShizzyUnchained',
  youtube: 'https://www.youtube.com/@ShizzyunchainedAI',
  tiktok: 'https://www.tiktok.com/@shizzyunchained',
  telegram: 'https://t.me/ShizzyUnchained',
  email: 'Shizzyunchained@gmail.com',
  logo: 'https://i.postimg.cc/LsK32BC0/Overlay-main-(1).png',
  heroImage: 'https://i.postimg.cc/Y9fN4MJk/SU-Shizzy-Background-new-(25).png',
  innovationFirstLogo: 'https://i.postimg.cc/85zXp9mX/Innovation-First-Logo.png' 
};

export const OVERVIEW_CONTENT = {
  hero: {
    title: 'INNOVATION FIRST',
    suffix: 'MEDIA',
    subtitle: 'Shizzy Unchained is a media platform covering the collision of Artificial Intelligence, crypto, and decentralized markets in real time. It focuses on the signals that actually matter: emerging protocols, new infrastructure, capital flows, market narratives, and the builders pushing this next wave forward. The goal is simple: cut through the noise, track where innovation is happening first, and give people clear insight into the technologies and opportunities shaping what comes next.'
  },
  mission: {
    title: 'THE MISSION',
    text: 'The pivot is here. AI and crypto are no longer separate lanes. AI provides the coordination, while crypto needs AI to solve the scaling of decentralized compute and verifiable intelligence. SHIZZYUNCHAINED sits at the intersection, auditing the architecture of the future.'
  }
};

export const DAILY_RIP_POSTS = [
  {
    id: 'rip-1',
    author: 'Shizzy',
    handle: '@Shizzy',
    content: 'The market doesn’t care about your thesis. It only cares about liquidity flows. Watch the bridges.',
    postUrl: 'https://x.com/ShizzyUnchained',
    profileUrl: 'https://x.com/ShizzyUnchained'
  },
  {
    id: 'rip-2',
    author: 'Shizzy',
    handle: '@Shizzy',
    content: 'AI agents are not the future. They are the current bottleneck. Fix the latency, win the cycle.',
    postUrl: 'https://x.com/ShizzyUnchained',
    profileUrl: 'https://x.com/ShizzyUnchained'
  }
];

export const AI_HISTORY_TIMELINE = [
  {
    era: 'THE DAWN',
    events: [
      {
        date: '1950',
        title: 'The Turing Test',
        description: 'Alan Turing proposes the "Imitation Game".',
        impact: 'The first philosophical framework for machine intelligence.',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800'
      }
    ]
  },
  {
    era: 'AGENTIC ERA',
    events: [
      {
        date: '2026',
        title: 'OpenClaw v4',
        description: 'Autonomous agents gain self-healing capabilities.',
        impact: 'Human-in-the-loop becomes human-on-the-loop.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800'
      }
    ]
  }
];

export const TWITTER_SKILL_TRAP_ARTICLE: NewsArticle = {
  id: 'twitter-skill-trap',
  title: 'The “Twitter Skill” Trap: Malware Chain Discovered on ClawHub',
  category: 'SECURITY',
  author: 'SHIZZYUNCHAINED',
  timestamp: 'MARCH 04, 2026',
  summary: 'Security researchers have discovered a malicious "Twitter" skill sitting in plain sight on ClawHub.',
  content: [
    'Security researchers have been tracking a wave of malicious OpenClaw skills on ClawHub. This was not some sketchy zip from a random Telegram—it was sitting in the open, dressed up like a popular “Twitter” skill.',
    'The malware utilizes agentic self-healing capabilities to evade traditional sandboxing environments, making it one of the most sophisticated threats in the agentic era.',
    'Architects are advised to audit all external skill dependencies before allowing autonomous execution on production nodes.'
  ],
  imageUrl: 'https://i.postimg.cc/gJ3j0sgP/B311712F-19B4-4C72-A6C3-0C408253F978.png'
};

export const BEAR_RUNNERS_ARTICLE: NewsArticle = {
  id: 'bear-runners',
  title: 'THE BEAR RUNNERS: NAVIGATING LATE CYCLE EXIT LIQUIDITY',
  category: 'STRATEGY',
  author: 'Shizzy Archive',
  timestamp: 'DECEMBER 10, 2025',
  summary: 'A deep dive into how large-scale players manage risk and secure exit liquidity during the final stages of a macro cycle.',
  content: [
    'In the final stages of a macro cycle, the game changes. It is no longer about maximizing upside; it is about protecting the payload.',
    'Liquidity is a finite resource. When the music stops, the exit becomes a bottleneck. Understanding the delta between perceived value and actual market depth is the difference between a successful exit and becoming someone else\'s exit liquidity.'
  ],
  imageUrl: 'https://i.postimg.cc/9ff4h550/3A0BCCE2-95AF-4D80-871E-04EC16968B30.png'
};

export const OCT_10_ARTICLE: NewsArticle = {
  id: 'oct-10-report',
  title: 'BINANCE BROKE THE PLUMBING: HOW THE 10/10 CRASH TURNED INTO AN EXIT LIQUIDITY EVENT',
  category: 'MARKET INTEL',
  author: 'Shizzy Archive',
  timestamp: 'OCTOBER 10, 2025',
  summary: 'October 10 was the day the world realized the infrastructure wasn\'t as decentralized as they thought.',
  content: [
    'October 10 was not just “the market moving.” That was the day Binance showed its seams, in public, during maximum stress.',
    'Technical failures at the matching engine level caused a cascade of liquidations that couldn\'t be absorbed by market makers.'
  ],
  imageUrl: 'https://i.postimg.cc/13qCrTYh/6DFB5BB9-7143-4C2D-99AA-20B6C5440B2B.png'
};

export const TAO_ARTICLE: NewsArticle = {
  id: 'tao-research',
  title: 'BITTENSOR IS THE INTERNET OF MODELS, AND TAO IS THE TOLL ROAD',
  category: 'INFRASTRUCTURE',
  author: 'Shizzy Archive',
  timestamp: 'SEPTEMBER 15, 2025',
  summary: 'Bittensor is an attempt to turn intelligence into an open marketplace.',
  content: [
    'Bittensor is an attempt to turn intelligence into an open marketplace, where models, data, and useful outputs compete.',
    'By incentivizing the production of high-quality intelligence across a decentralized network of subnets, Bittensor aims to break the monopoly of Big Tech.'
  ],
  imageUrl: 'https://i.postimg.cc/6qxnwfb/677BAF68-0838-4967-8163-E83511FA61CC.png'
};
