
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
  telegram: 'https://t.me/+0fW1AeQAUERhZTgx',
  email: 'Shizzyunchained@gmail.com',
  logo: 'https://i.postimg.cc/LsK32BC0/Overlay-main-(1).png',
  heroImage: 'https://i.postimg.cc/Y9fN4MJk/SU-Shizzy-Background-new-(25).png',
  innovationFirstLogo: 'https://i.postimg.cc/85zXp9mX/Innovation-First-Logo.png' 
};

export const OVERVIEW_CONTENT = {
  hero: {
    headline: "Decentralized AI is already happening. Most people will ignore the opportunity until it is far out of reach.",
    subheadline: 'Tracking Bittensor subnets, autonomous agents, and the startups building decentralized intelligence.',
    primaryCTA: 'Join Unchained Insiders',
    secondaryCTA: ''
  },
  latestSignal: {
    title: 'Latest Videos',
    cards: [
      {
        title: 'The Signal: AI Agents & Global Liquidity',
        category: 'AI AGENTS',
        link: 'https://www.youtube.com/embed/gvjPJpxAjNs'
      },
      {
        title: 'Bittensor Subnets: The Decentralized Intelligence Layer',
        category: 'BITTENSOR',
        link: 'https://www.youtube.com/embed/OnPTglAFzO0'
      },
      {
        title: 'The Bittensor Opportunity: Why Most People Are Missing It',
        category: 'BITTENSOR',
        link: 'https://www.youtube.com/embed/ipkjDOogY2w'
      }
    ]
  },
  coverage: {
    title: 'What I Cover',
    items: [
      {
        label: 'Bittensor',
        description: 'Deep dives into subnets, validation, and the future of open intelligence.'
      },
      {
        label: 'AI Startups',
        description: 'Early looks at the teams merging LLMs with decentralized incentive structures.'
      },
      {
        label: 'Infrastructure',
        description: 'The hardware and protocol layers powering the next wave of compute.'
      }
    ]
  },
  credibility: {
    title: 'Why Listen',
    points: [
      '5 years on the ground in crypto and AI.',
      'Early coverage on infrastructure before it hits the mainstream.',
      'Zero hype. Just technical signal and market reality.'
    ]
  },
  community: {
    title: 'Community',
    links: [
      { platform: 'YouTube', description: 'Deep dives and video breakdowns.', url: SOCIAL_LINKS.youtube },
      { platform: 'X / Twitter', description: 'Real-time updates and quick takes.', url: SOCIAL_LINKS.unchainedX },
      { platform: 'Telegram', description: 'Direct signal and community discussion.', url: SOCIAL_LINKS.telegram },
      { platform: 'TikTok', description: 'Short-form insights for fast scanning.', url: SOCIAL_LINKS.tiktok }
    ]
  },
  footer: {
    cta: 'Stay ahead of the curve.',
    disclaimer: 'Not financial advice. Just research and personal takes on the space.'
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
