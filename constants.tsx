
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
  telegram: 'https://t.me/+0fW1AeQAUERhZTgx',
  contactTelegram: 'https://t.me/ShizzyUnchained',
  email: 'Shizzyunchained@gmail.com',
  logo: 'https://i.postimg.cc/LsK32BC0/Overlay-main-(1).png',
  heroImage: 'https://i.postimg.cc/Y9fN4MJk/SU-Shizzy-Background-new-(25).png',
  innovationFirstLogo: 'https://i.postimg.cc/85zXp9mX/Innovation-First-Logo.png',
  nordVpn: 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzyunchained',
  ledger: 'https://shop.ledger.com/?r=49c0bef9b376',
  calendly: 'https://calendly.com/shizzyunchained'
};

export const OVERVIEW_CONTENT = {
  hero: {
    headline: "Decentralized AI | is already here | Do not miss what comes next",
    subheadline: 'Tracking Bittensor subnets, autonomous agents, and the startups building decentralized intelligence.',
    primaryCTA: 'Join Unchained Insiders',
    secondaryCTA: ''
  },
  latestSignal: {
    title: '',
    cards: [
      {
        title: 'BITTENSOR SUBNET UPDATE | SUBNETS TAKING OVER DEPIN?',
        category: 'BITTENSOR',
        link: 'https://www.youtube.com/embed/-Yn6AYfNOVI'
      },
      {
        title: 'TAO FALLING OFF A CLIFF! REBOUND SOON?',
        category: 'BITTENSOR',
        link: 'https://www.youtube.com/embed/YC-E7LDxWy0'
      },
      {
        title: 'BITTENSOR IS HEATING UP, RIDGES GOES SILENT, AND CHUTES BREAKS THROUGH',
        category: 'BITTENSOR',
        link: 'https://www.youtube.com/embed/9IWhkrH4zoA'
      }
    ]
  },
  coverage: {
    title: 'What I Cover',
    items: [
      {
        label: 'Tao Subnets',
        description: 'Real-time tracking of all 128 Bittensor subnets. Emissions, stake, and market dynamics in USD.'
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
      { platform: 'Telegram', description: 'Direct signal and community discussion.', url: SOCIAL_LINKS.telegram }
    ]
  },
  footer: {
    cta: 'Stay ahead of the curve.',
    disclaimer: 'Not financial advice. Just research and personal takes on the space.'
  }
};

export const TICKER_SIGNALS = [
  "SN1 ACCESS GRANTED",
  "LIQUIDITY ROTATION DETECTED",
  "UPLINK STABLE",
  "NEW SUBNET EMISSION SPIKE: SN15",
  "VALI-SET UPDATE PENDING",
  "TAO FLOWS POSITIVE",
  "INSIDER SIGNAL: SN19 DEPLOYED",
  "NETWORK STATUS: NOMINAL"
];

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
