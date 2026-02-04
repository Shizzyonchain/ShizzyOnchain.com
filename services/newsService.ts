
import { AINewsItem } from '../types.ts';

const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'MIT AI', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' }
];

// Using a high-availability proxy for CORS bypass
const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_intel_pipeline_v6';
const CACHE_EXPIRY = 300000; // 5 minutes

// CURATED PREMIUM FALLBACKS (Used if live stream is throttled or offline)
const CURATED_INTEL: AINewsItem[] = [
  {
    id: 'curated-agentic-2026',
    source: 'SHIZZY ANALYSIS',
    title: 'The Agentic Era: Why On-Chain Autonomy is the 2026 Meta',
    url: 'https://onchainrevolution.io/',
    published_at: new Date().toISOString(),
    excerpt: 'While retail watches price, institutional capital is shifting toward the agentic layer. We are moving from humans using wallets to software controlling capital.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    tags: ['exclusive', 'agents']
  },
  {
    id: 'curated-gpt-next',
    source: 'INTEL',
    title: 'GPT-Next: Decoding the Reasoning Breakthroughs of 2026',
    url: 'https://openai.com/news/',
    published_at: new Date(Date.now() - 3600000).toISOString(),
    excerpt: 'The leap from chat to logic: How the latest model architectures are solving complex multi-step reasoning without human intervention.',
    image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=1200&auto=format&fit=crop',
    tags: ['ai', 'research']
  }
];

export const newsService = {
  async fetchAllFeeds(): Promise<AINewsItem[]> {
    console.log('[Pipeline] Establishing high-fidelity AI data link...');
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY && data.length > 5) {
        return data;
      }
    }

    try {
      const ts = Date.now();
      const results = await Promise.allSettled(
        RSS_FEEDS.map(feed => this.fetchSingleFeed(feed, ts))
      );
      
      const liveItems = results
        .filter((r): r is PromiseFulfilledResult<AINewsItem[]> => r.status === 'fulfilled')
        .map(r => r.value)
        .flat();

      // Prioritize live news, but keep curated at the top for brand consistency
      const merged = this.processNewsItems([...CURATED_INTEL, ...liveItems]);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: merged,
        timestamp: Date.now()
      }));

      return merged;
    } catch (error) {
      console.error('[Pipeline] Global sync failure, reverting to curated local node.', error);
      return CURATED_INTEL;
    }
  },

  async fetchSingleFeed(feed: { name: string, url: string }, ts: number): Promise<AINewsItem[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const targetUrl = `${feed.url}${feed.url.includes('?') ? '&' : '?'}pipeline_sync=${ts}`;
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
        
        // Robust Link Extraction for both RSS and Atom
        let url = '';
        const linkTag = item.querySelector('link');
        if (linkTag) {
          url = linkTag.getAttribute('href') || linkTag.textContent || '';
        }
        
        // Secondary check for Atom alternate links
        if (!url || !url.startsWith('http')) {
          const links = Array.from(item.querySelectorAll('link'));
          const altLink = links.find(l => l.getAttribute('rel') === 'alternate' || l.getAttribute('href')?.startsWith('http'));
          url = altLink?.getAttribute('href') || url;
        }

        const published_at = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
        const contentStr = item.querySelector('description, summary, content')?.textContent || '';
        
        if (title && url && url.startsWith('http')) {
          newsItems.push({
            id: this.generateStableId(url, title),
            source: feed.name,
            title,
            url,
            published_at: new Date(published_at).toISOString(),
            excerpt: this.cleanExcerpt(contentStr),
            image_url: this.extractImage(item, contentStr),
            tags: ['ai', feed.name.toLowerCase().replace(/\s/g, '')]
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
        if (!item.url || item.url === '#' || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 50);
  },

  generateStableId(url: string, title: string): string {
    return btoa(url.slice(-15) + title.slice(0, 10)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  },

  cleanExcerpt(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let clean = doc.body.textContent || '';
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean.length > 150 ? clean.slice(0, 147) + '...' : clean;
  },

  extractImage(item: Element, content: string): string {
    const mediaTags = ['media\\:content', 'media:content', 'media\\:thumbnail', 'media:thumbnail', 'enclosure'];
    for (const tag of mediaTags) {
      const el = item.querySelector(tag);
      const url = el?.getAttribute('url');
      if (url && (url.includes('jpg') || url.includes('png') || url.includes('webp') || url.includes('jpeg'))) return url;
    }
    
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch?.[1] && !imgMatch[1].includes('pixel')) return imgMatch[1];
    
    const fallbacks = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593349480506-8433a14cc185?q=80&w=800&auto=format&fit=crop'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
