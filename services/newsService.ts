
import { AINewsItem } from '../types.ts';

const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'MIT AI', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' }
];

const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_intel_pipeline_v9';
const STALE_THRESHOLD = 180000; // 3 minutes for high-velocity news
const SYNC_TIMEOUT = 4000; // 4 seconds hard timeout per feed

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
  }
];

export const newsService = {
  private_isSyncing: false,

  /**
   * Synchronous accessor for immediate UI initialization.
   * Prevents the "loading" flicker on initial render.
   */
  getCachedNews(): AINewsItem[] {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return CURATED_INTEL;
    try {
      const parsed = JSON.parse(cached);
      return parsed.data || CURATED_INTEL;
    } catch (e) {
      return CURATED_INTEL;
    }
  },

  async fetchAllFeeds(force = false): Promise<AINewsItem[]> {
    const cached = localStorage.getItem(CACHE_KEY);
    const now = Date.now();
    
    let cacheData: AINewsItem[] = [];
    let timestamp = 0;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        cacheData = parsed.data || [];
        timestamp = parsed.timestamp || 0;
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const isStale = now - timestamp > STALE_THRESHOLD;
    const isMissing = cacheData.length < 5;

    // RULE: Return cached data IMMEDIATELY if we have it
    if (!isMissing && !force) {
      if (isStale) {
        this.syncInBackground(); // Fires and forgets
      }
      return cacheData;
    }

    // Only block the UI if we have absolutely no data
    return await this.syncInBackground();
  },

  async syncInBackground(): Promise<AINewsItem[]> {
    if (this.private_isSyncing) {
      return this.getCachedNews();
    }

    this.private_isSyncing = true;
    try {
      const ts = Date.now();
      // Parallel fetch with strict timeouts
      const results = await Promise.allSettled(
        RSS_FEEDS.map(feed => this.fetchSingleFeed(feed, ts))
      );
      
      const liveItems = results
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
      return this.getCachedNews();
    } finally {
      this.private_isSyncing = false;
    }
  },

  async fetchSingleFeed(feed: { name: string, url: string }, ts: number): Promise<AINewsItem[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT);

      const targetUrl = `${feed.url}${feed.url.includes('?') ? '&' : '?'}cb=${ts}`;
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (!response.ok) return [];
      
      const json = await response.json();
      const xmlString = json.contents;
      if (!xmlString) return [];
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const entries = xmlDoc.querySelectorAll('item, entry');
      const newsItems: AINewsItem[] = [];
      
      const feedBaseUrl = new URL(feed.url).origin;

      entries.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        let url = '';
        
        const rssLink = item.querySelector('link');
        if (rssLink) {
          url = rssLink.textContent?.trim() || rssLink.getAttribute('href') || '';
        }

        if (!url || !url.startsWith('http')) {
          const links = Array.from(item.querySelectorAll('link'));
          const alt = links.find(l => l.getAttribute('rel') === 'alternate');
          if (alt) url = alt.getAttribute('href') || '';
        }

        if (!url || !url.startsWith('http')) {
          const guid = item.querySelector('guid');
          if (guid && guid.getAttribute('isPermaLink') !== 'false') {
            url = guid.textContent?.trim() || '';
          }
        }

        if (url && !url.startsWith('http')) {
          try {
            url = new URL(url, feedBaseUrl).toString();
          } catch (e) { url = ''; }
        }

        if (title && url && url.startsWith('http') && url !== feed.url) {
          const published_at = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
          const contentStr = item.querySelector('description, summary, content')?.textContent || '';
          
          newsItems.push({
            id: this.generateStableId(url, title),
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
        if (!item.url || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 40);
  },

  generateStableId(url: string, title: string): string {
    let hash = 0;
    const str = url + title;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  cleanExcerpt(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let clean = doc.body.textContent || '';
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean.length > 140 ? clean.slice(0, 137) + '...' : clean;
  },

  extractImage(item: Element, content: string): string {
    const mediaTags = ['media\\:content', 'media:content', 'enclosure', 'media\\:thumbnail', 'media:thumbnail'];
    for (const tag of mediaTags) {
      const el = item.querySelector(tag);
      const url = el?.getAttribute('url');
      if (url && (url.includes('jpg') || url.includes('png') || url.includes('webp') || url.includes('jpeg'))) return url;
    }
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch?.[1] && !imgMatch[1].includes('pixel')) return imgMatch[1];
    return `https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop`;
  }
};
