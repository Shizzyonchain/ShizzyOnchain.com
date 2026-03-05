
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY UNCHAINED NEWS PIPELINE v5.0
 * High-signal AI intelligence curated by Shizzy.
 */

const MANUALLY_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'gvjPJpxAjNs',
    title: 'BITTENSOR TAO MARKET UPDATE',
    url: 'https://youtube.com/watch?v=gvjPJpxAjNs',
    source: 'Shizzy Unchained',
    published_at: '2026-03-04T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/gvjPJpxAjNs/maxresdefault.jpg',
    excerpt: `A deep dive into the intersection of autonomous AI agents and global liquidity flows. How agentic workflows are reshaping market dynamics.`,
    tags: ['AI Agents', 'Liquidity', 'Macro']
  },
  {
    id: 'OnPTglAFzO0',
    title: 'BITTENSOR TAO MARKET UPDATE',
    url: 'https://youtu.be/OnPTglAFzO0',
    source: 'Shizzy Unchained',
    published_at: '2026-03-03T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/OnPTglAFzO0/maxresdefault.jpg',
    excerpt: `Exploring the Bittensor ecosystem and how subnets are creating a decentralized marketplace for machine intelligence.`,
    tags: ['Bittensor', 'TAO', 'Infrastructure']
  },
  {
    id: '7AsrjwSB1Zs',
    title: 'CRYPTO INFRASTRUCTURE FOR AI',
    url: 'https://youtu.be/7AsrjwSB1Zs',
    source: 'Shizzy Unchained',
    published_at: '2026-03-02T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/7AsrjwSB1Zs/maxresdefault.jpg',
    excerpt: `Why AI needs crypto rails for verification, incentive alignment, and decentralized compute scaling.`,
    tags: ['Infrastructure', 'Middleware', 'AI']
  },
  {
    id: 'xuDjHk7dMTY',
    title: 'EARLY TRENDS: THE NEXT WAVE',
    url: 'https://youtu.be/xuDjHk7dMTY',
    source: 'Shizzy Unchained',
    published_at: '2026-03-01T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/xuDjHk7dMTY/maxresdefault.jpg',
    excerpt: `Identifying the next wave of innovation in the AI and crypto space. Early signals from the frontier.`,
    tags: ['Trends', 'Innovation', 'Early Signal']
  }
];

export const newsService = {
  getLatestSnapshotItems(): { items: AINewsItem[], lastUpdate: number, isConfigured: boolean } {
    return { 
      items: MANUALLY_CURATED_SIGNALS, 
      lastUpdate: Date.now(),
      isConfigured: true
    };
  },

  async sync(): Promise<void> {
    return Promise.resolve();
  }
};
