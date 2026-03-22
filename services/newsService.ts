
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY UNCHAINED NEWS PIPELINE v5.0
 * High-signal AI intelligence curated by Shizzy.
 */

const MANUALLY_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'UlOEVeBL5QI',
    title: 'THE TAO FLYWHEEL IS SPINNING UP FAST',
    url: 'https://www.youtube.com/watch?v=UlOEVeBL5QI',
    source: 'Shizzy Unchained',
    published_at: '2026-03-22T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/UlOEVeBL5QI/maxresdefault.jpg',
    excerpt: `The TAO flywheel is spinning up fast.`,
    tags: ['Bittensor', 'TAO', 'Flywheel']
  },
  {
    id: '1_-bAGtRdHY',
    title: 'GETTING STARTED WITH BITTENSOR TAO SUBNETS',
    url: 'https://www.youtube.com/watch?v=1_-bAGtRdHY',
    source: 'Shizzy Unchained',
    published_at: '2026-03-16T12:00:00Z',
    image_url: 'https://img.youtube.com/vi/1_-bAGtRdHY/maxresdefault.jpg',
    excerpt: `A complete beginner's guide to understanding Bittensor, TAO, and how subnets work in the decentralized AI ecosystem.`,
    tags: ['Beginner', 'Bittensor', 'TAO']
  },
  {
    id: '31P2-LSBBbo',
    title: 'TAO SUBNETS ARE ABSOLUTELY RIPPING RIGHT NOW',
    url: 'https://www.youtube.com/watch?v=31P2-LSBBbo',
    source: 'Shizzy Unchained',
    published_at: '2026-03-14T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/31P2-LSBBbo/maxresdefault.jpg',
    excerpt: `TAO subnets are seeing massive growth and adoption. Here is what you need to know about the current market dynamics.`,
    tags: ['Bittensor', 'TAO', 'Subnets']
  },
  {
    id: 'pAH9auzOqdo',
    title: 'SELL BITCOIN, BUY BITTENSOR? TAO AND SUBNETS ARE HEATING UP',
    url: 'https://www.youtube.com/watch?v=pAH9auzOqdo',
    source: 'Shizzy Unchained',
    published_at: '2026-03-13T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/pAH9auzOqdo/maxresdefault.jpg',
    excerpt: `Is it time to rotate from Bitcoin to Bittensor? Analyzing the heating up of TAO and its subnets.`,
    tags: ['Bitcoin', 'Bittensor', 'TAO']
  },
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
  },
  {
    id: 'Ks696rfT1jU',
    title: "SHIZZY'S UNTOLD STORY FROM MACHINIST",
    url: 'https://www.youtube.com/watch?v=Ks696rfT1jU',
    source: 'Shizzy Unchained',
    published_at: '2026-03-16T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/Ks696rfT1jU/maxresdefault.jpg',
    excerpt: `The untold story of Shizzy's journey from a machinist to the forefront of the decentralized AI revolution.`,
    tags: ['Story', 'Journey', 'AI']
  },
  {
    id: 'ipkjDOogY2w',
    title: 'WHY I LEFT ONCHAIN REVOLUTION',
    url: 'https://www.youtube.com/watch?v=ipkjDOogY2w',
    source: 'Shizzy Unchained',
    published_at: '2026-03-15T10:00:00Z',
    image_url: 'https://img.youtube.com/vi/ipkjDOogY2w/maxresdefault.jpg',
    excerpt: `A candid discussion on the reasons behind leaving Onchain Revolution and the vision for the future.`,
    tags: ['Update', 'Vision', 'Future']
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
