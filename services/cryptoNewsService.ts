
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY CRYPTO NEWS PIPELINE v1.6
 * High-signal crypto market intelligence and restored signal archive.
 */

const CRYPTO_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'gvjPJpxAjNs',
    title: 'The Signal: AI Agents & Global Liquidity',
    url: 'https://youtube.com/watch?v=gvjPJpxAjNs',
    source: 'Shizzy Unchained',
    published_at: '2026-03-04T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/gvjPJpxAjNs/maxresdefault.jpg',
    excerpt: `A deep dive into the intersection of autonomous AI agents and global liquidity flows. How agentic workflows are reshaping market dynamics.`,
    tags: ['AI Agents', 'Liquidity', 'Macro']
  },
  {
    id: 'OnPTglAFzO0',
    title: 'Bittensor Subnets: The Decentralized Intelligence Layer',
    url: 'https://youtu.be/OnPTglAFzO0',
    source: 'Shizzy Unchained',
    published_at: '2026-03-03T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/OnPTglAFzO0/maxresdefault.jpg',
    excerpt: `Exploring the Bittensor ecosystem and how subnets are creating a decentralized marketplace for machine intelligence.`,
    tags: ['Bittensor', 'TAO', 'Infrastructure']
  },
  {
    id: '7AsrjwSB1Zs',
    title: 'Crypto Infrastructure: The Middleware for AI',
    url: 'https://youtu.be/7AsrjwSB1Zs',
    source: 'Shizzy Unchained',
    published_at: '2026-03-02T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/7AsrjwSB1Zs/maxresdefault.jpg',
    excerpt: `Why AI needs crypto rails for verification, incentive alignment, and decentralized compute scaling.`,
    tags: ['Infrastructure', 'Middleware', 'AI']
  },
  {
    id: 'xuDjHk7dMTY',
    title: 'Early Trends: Identifying the Next Wave',
    url: 'https://youtu.be/xuDjHk7dMTY',
    source: 'Shizzy Unchained',
    published_at: '2026-03-01T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/xuDjHk7dMTY/maxresdefault.jpg',
    excerpt: `Identifying the next wave of innovation in the AI and crypto space. Early signals from the frontier.`,
    tags: ['Trends', 'Innovation', 'Early Signal']
  }
];

export const cryptoNewsService = {
  getLatestItems(): { items: AINewsItem[], lastUpdate: number } {
    return { 
      items: CRYPTO_CURATED_SIGNALS, 
      lastUpdate: Date.now()
    };
  }
};
