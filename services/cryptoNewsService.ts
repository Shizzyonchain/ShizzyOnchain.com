
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY CRYPTO NEWS PIPELINE v1.6
 * High-signal crypto market intelligence and restored signal archive.
 * All articles linked here must have a corresponding object in constants.tsx
 */

const CRYPTO_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'panic-selling-ai-macro',
    title: 'Markets Are Panic Selling on AI Uncertainty While Macro Tries to Calm Down',
    url: '#/article/panic-selling-ai-uncertainty',
    source: 'Shizzy Unchained',
    published_at: '2026-02-14T09:00:00Z',
    image_url: 'https://i.postimg.cc/nzN63nTh/E651E8D2-7099-44EE-A415-E5365E77D3F6.png',
    excerpt: `Markets are in that mode where nobody wants to be the last person holding risk. AI is currently the primary driver of this structural uncertainty.`,
    tags: ['AI Uncertainty', 'Macro', 'Panic Selling']
  },
  {
    id: 'binance-cease-desist',
    title: 'Binance Sends Cease-and-Desist Over Insolvency Claims as Tensions Spill Onto X',
    url: 'https://x.com/ShizzyUnchained',
    source: 'Market Intelligence',
    published_at: '2026-02-04T12:00:00Z',
    image_url: 'https://i.postimg.cc/N01jwP9R/IMG-3329.jpg',
    excerpt: `Binance issues formal legal notices to push back against insolvency rumors on social media.`,
    tags: ['Binance', 'Regulation', 'Exchanges']
  },
  {
    id: 'bear-runners',
    title: 'THE BEAR RUNNERS: NAVIGATING LATE CYCLE EXIT LIQUIDITY',
    url: '#/article/bear-runners',
    source: 'Shizzy Archive',
    published_at: '2025-12-10T10:00:00Z',
    image_url: 'https://i.postimg.cc/9ff4h550/3A0BCCE2-95AF-4D80-871E-04EC16968B30.png',
    excerpt: `A deep dive into how large-scale players manage risk and secure exit liquidity during the final stages of a macro cycle.`,
    tags: ['Strategy', 'Liquidity', 'Macro']
  },
  {
    id: 'oct-10-report',
    title: 'BINANCE BROKE THE PLUMBING: HOW THE 10/10 CRASH TURNED INTO AN EXIT LIQUIDITY EVENT',
    url: '#/article/oct-10-report',
    source: 'Shizzy Archive',
    published_at: '2025-10-10T08:00:00Z',
    image_url: 'https://i.postimg.cc/13qCrTYh/6DFB5BB9-7143-4C2D-99AA-20B6C5440B2B.png',
    excerpt: `October 10 was not just “the market moving.” That was the day Binance showed its seams, in public, during maximum stress.`,
    tags: ['Binance', 'Technical Failure', 'Liquidations']
  },
  {
    id: 'tao-research',
    title: 'BITTENSOR IS THE INTERNET OF MODELS, AND TAO IS THE TOLL ROAD',
    url: '#/article/tao-research',
    source: 'Shizzy Archive',
    published_at: '2025-09-15T14:00:00Z',
    image_url: 'https://i.postimg.cc/6qxnwjfb/677BAF68-0838-4967-8163-E83511FA61CC.png',
    excerpt: `Bittensor is an attempt to turn intelligence into an open marketplace, where models, data, and useful outputs compete.`,
    tags: ['Bittensor', 'TAO', 'AI Infrastructure']
  },
  {
    id: 'jam-protocol',
    title: 'JAM IS POLKADOT REBUILDING ITSELF AS A GLOBAL EXECUTION ENGINE',
    url: '#/article/jam-protocol',
    source: 'Shizzy Archive',
    published_at: '2025-08-20T11:00:00Z',
    image_url: 'https://i.postimg.cc/Y9FkYbBM/D918DDBE-026A-45B1-AB70-82A14F16F48C.png',
    excerpt: `People keep treating JAM like it is a marketing refresh for Polkadot. It is not. JAM is a proposed replacement for the Relay Chain itself.`,
    tags: ['Polkadot', 'JAM', 'Coretime']
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
