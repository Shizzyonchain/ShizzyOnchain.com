
import { AINewsItem } from '../types.ts';

const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' }
];

const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_intel_pipeline_v5';

// HIGH-QUALITY CURATED INTEL (Always available, instant load)
const CURATED_INTEL: AINewsItem[] = [
  {
    id: 'curated-1',
    source: 'SHIZZY EXCLUSIVE',
    title: 'The Agentic Era: Why 2026 is the Year of On-Chain Autonomy',
    url: '#',
    published_at: new Date().toISOString(),
    excerpt: 'While the world watches price, the real revolution is happening in the agentic layer. We are moving from "users" to "controllers" of autonomous capital.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    tags: ['exclusive', 'agents']
  },
  {
    id: 'curated-2',
    source: 'MARKET ALPHA',
    title: 'Liquidity Rotation: Mapping the Flow from L1s to Agent Protocols',
    url: '#',
    published_at: new Date(Date.now() - 3600000).toISOString(),
    excerpt: 'Analyzing the macro shift as capital exits legacy chains in search of yield within the emerging AI-Agent economy.',
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
    tags: ['alpha', 'macro']
  },
  {
    id: 'curated-3',
    source: 'RESEARCH',
    title: 'The Vertical Scaling Thesis: How Inference Hardware Drives Price',
    url: '#',
    published_at: new Date(Date.now() - 7200000).toISOString(),
    excerpt: 'The hidden correlation between GPU availability and decentralized compute token performance is reaching a tipping point.',
    image_url: 'https://images.unsplash.com/photo-1593349480506-8433a14cc185?q=80&w=1200&auto=format&fit=crop',
    tags: ['research', 'compute']
  }
];

export const newsService = {
  async fetchAllFeeds(): Promise<AINewsItem[]> {
    // Stage 1: Check Local Cache for immediate return
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Return cache immediately if fresh
      if (Date.now() - timestamp < 300000) return data;
    }

    // Stage 2: Return Curated Intel + try to fetch live in background
    // (In a real app, this would be handled via a state manager, here we merge them)
    try {
      const ts = Date.now();
      const liveResults = await Promise.allSettled(
        RSS_FEEDS.map(feed => this.fetchSingleFeed(feed, ts))
      );
      
      const liveItems = liveResults
        .filter((r): r is PromiseFulfilledResult<AINewsItem[]> => r.status === 'fulfilled')
        .map(r => r.value)
        .flat();

      const merged = this.processNewsItems([...CURATED_INTEL, ...liveItems]);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: merged,
        timestamp: Date.now()
      }));

      return merged;
    } catch (error) {
      console.error('[Pipeline] Background sync failed, serving curated.', error);
      return CURATED_INTEL;
    }
  },

  async fetchSingleFeed(feed: { name: string, url: string }, ts: number): Promise<AINewsItem[]> {
    try {
      // Short timeout for fast failures
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const targetUrl = `${feed.url}${feed.url.includes('?') ? '&' : '?'}cb=${ts}`;
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) return [];
      
      const json = await response.json();
      const xmlString = json.contents;
      if (!xmlString) return [];
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const items = xmlDoc.querySelectorAll('item, entry');
      const newsItems: AINewsItem[] = [];
      
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        let url = item.querySelector('link')?.getAttribute('href') || item.querySelector('link')?.textContent || '';
        const published_at = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
        const contentStr = item.querySelector('description, summary, content')?.textContent || '';
        
        if (title && url) {
          newsItems.push({
            id: btoa(url).slice(-12),
            source: feed.name,
            title,
            url,
            published_at: new Date(published_at).toISOString(),
            excerpt: this.cleanExcerpt(contentStr),
            image_url: this.extractImage(item, contentStr),
            tags: ['ai']
          });
        }
      });
      
      return newsItems;
    } catch (error) {
      return [];
    }
  },

  processNewsItems(items: AINewsItem[]): AINewsItem[] {
    const seen = new Set();
    return items
      .filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 40);
  },

  cleanExcerpt(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let clean = doc.body.textContent || '';
    return clean.replace(/\s+/g, ' ').trim().slice(0, 140) + '...';
  },

  extractImage(item: Element, content: string): string {
    const mediaTags = ['media\\:content', 'media:content', 'enclosure'];
    for (const tag of mediaTags) {
      const url = item.querySelector(tag)?.getAttribute('url');
      if (url && (url.includes('jpg') || url.includes('png') || url.includes('webp'))) return url;
    }
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch?.[1]) return imgMatch[1];
    return `https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop`;
  }
};
