
import { AINewsItem } from '../types.ts';

// Using the robust feed list suggested by the user
const RSS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/tag/artificial-intelligence/feed/' },
  { name: 'MIT News', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' },
  { name: 'The Register', url: 'https://www.theregister.com/software/ai_ml/headlines.atom' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
  { name: 'Hacker News', url: 'https://hnrss.org/newest?q=artificial%20intelligence' },
  { name: 'Google News AI', url: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en' },
  { name: 'Google News Labs', url: 'https://news.google.com/rss/search?q=OpenAI+OR+Anthropic+OR+DeepMind&hl=en-US&gl=US&ceid=US:en' }
];

const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_news_pipeline_clean_v1'; // Force new cache
const STALE_THRESHOLD = 300000; // 5 minutes
const SYNC_TIMEOUT = 5000; // 5 seconds per feed

export const newsService = {
  private_isSyncing: false,

  /**
   * Synchronous accessor for immediate UI initialization.
   * Returns empty array if no cache, ensuring no "wrong" links are ever hardcoded.
   */
  getCachedNews(): AINewsItem[] {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed.data) ? parsed.data : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Main fetch logic. Never returns hardcoded internal links.
   */
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
    const isMissing = cacheData.length === 0;

    if (!isMissing && !force) {
      if (isStale) {
        this.syncInBackground();
      }
      return cacheData;
    }

    return await this.syncInBackground();
  },

  async syncInBackground(): Promise<AINewsItem[]> {
    if (this.private_isSyncing) return this.getCachedNews();

    this.private_isSyncing = true;
    try {
      const ts = Date.now();
      const results = await Promise.allSettled(
        RSS_FEEDS.map(feed => this.fetchSingleFeed(feed, ts))
      );
      
      const liveItems = results
        .filter((r): r is PromiseFulfilledResult<AINewsItem[]> => r.status === 'fulfilled')
        .map(r => r.value)
        .flat();

      const processed = this.processNewsItems(liveItems);
      
      if (processed.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: processed,
          timestamp: Date.now()
        }));
      }

      return processed;
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
      const items = xmlDoc.querySelectorAll('item, entry');
      const newsItems: AINewsItem[] = [];
      
      const feedBaseUrl = new URL(feed.url).origin;

      items.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        let url = '';
        
        // 1. RSS 2.0 <link> extraction
        const rssLink = item.querySelector('link');
        if (rssLink) {
          url = rssLink.textContent?.trim() || rssLink.getAttribute('href') || '';
        }

        // 2. Atom <link rel="alternate"> extraction
        if (!url || !url.startsWith('http')) {
          const links = Array.from(item.querySelectorAll('link'));
          const alt = links.find(l => l.getAttribute('rel') === 'alternate');
          if (alt) url = alt.getAttribute('href') || '';
        }

        // 3. GUID Permalink extraction
        if (!url || !url.startsWith('http')) {
          const guid = item.querySelector('guid');
          if (guid && guid.getAttribute('isPermaLink') !== 'false') {
            url = guid.textContent?.trim() || '';
          }
        }

        // Canonicalize relative URLs
        if (url && !url.startsWith('http')) {
          try {
            url = new URL(url, feedBaseUrl).toString();
          } catch (e) { url = ''; }
        }

        // Clean tracking parameters
        if (url.startsWith('http')) {
          try {
            const u = new URL(url);
            ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'].forEach(p => u.searchParams.delete(p));
            url = u.toString();
          } catch (e) {}
        }

        // Strict validation: Must be an external link, not a feed itself
        const isSelf = url === feed.url || url.includes('rss.xml') || url.includes('feed/');
        if (title && url.startsWith('http') && !isSelf) {
          const published_at = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
          const contentStr = item.querySelector('description, summary, content')?.textContent || '';
          
          newsItems.push({
            id: this.generateStableId(url),
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
        if (!item.url || seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      })
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 40);
  },

  generateStableId(url: string): string {
    let hash = 0;
    const str = url.split('?')[0];
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
    
    // Default placeholders for AI news
    const placeholders = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593349480506-8433a14cc185?q=80&w=800&auto=format&fit=crop'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
};
