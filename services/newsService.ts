
import { AINewsItem } from '../types.ts';

const RSS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'MIT News', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' },
  { name: 'The Register', url: 'https://www.theregister.com/software/ai_ml/headlines.atom' },
  { name: 'Hacker News', url: 'https://hnrss.org/newest?q=artificial%20intelligence' },
  { name: 'Google News', url: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en' },
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' }
];

const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_intel_pipeline_v10';
const STALE_THRESHOLD = 300000; // 5 minutes
const SYNC_TIMEOUT = 5000; // 5 seconds per feed

const FALLBACK_NEWS: AINewsItem[] = [
  {
    id: 'curated-agentic-2026',
    source: 'SHIZZY ANALYSIS',
    title: 'The Agentic Era: Why On-Chain Autonomy is the 2026 Meta',
    url: 'https://onchainrevolution.io/',
    published_at: new Date().toISOString(),
    excerpt: 'While retail watches price, institutional capital is shifting toward the agentic layer. We are moving from humans using wallets to software controlling capital.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    tags: ['exclusive']
  }
];

export const newsService = {
  private_isSyncing: false,

  /**
   * Synchronous accessor for the homepage. 
   * Provides immediate data from localStorage to eliminate loading flashes.
   */
  getCachedNews(): AINewsItem[] {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return FALLBACK_NEWS;
    try {
      const parsed = JSON.parse(cached);
      return (parsed.data && parsed.data.length > 0) ? parsed.data : FALLBACK_NEWS;
    } catch (e) {
      return FALLBACK_NEWS;
    }
  },

  /**
   * Main fetch entry point. 
   * Returns cache immediately if fresh, otherwise triggers background sync.
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
    const isMissing = cacheData.length < 5;

    // RULE: If we have data and it's not missing, return it immediately.
    // Sync in background if stale.
    if (!isMissing && !force) {
      if (isStale) {
        this.syncInBackground();
      }
      return cacheData;
    }

    // Only block if we have no data at all
    return await this.syncInBackground();
  },

  async syncInBackground(): Promise<AINewsItem[]> {
    if (this.private_isSyncing) {
      return this.getCachedNews();
    }

    this.private_isSyncing = true;
    try {
      const ts = Date.now();
      // Parallel fetch with strict timeouts and per-feed isolation
      const results = await Promise.allSettled(
        RSS_FEEDS.map(feed => this.fetchSingleFeed(feed, ts))
      );
      
      const liveItems = results
        .filter((r): r is PromiseFulfilledResult<AINewsItem[]> => r.status === 'fulfilled')
        .map(r => r.value)
        .flat();

      const merged = this.processNewsItems([...liveItems]);
      
      const finalData = merged.length > 0 ? merged : this.getCachedNews();

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: finalData,
        timestamp: Date.now()
      }));

      return finalData;
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

      const targetUrl = `${feed.url}${feed.url.includes('?') ? '&' : '?'}cache_bust=${ts}`;
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
        
        // 1. LINK EXTRACTION (RSS 2.0 vs ATOM)
        const rssLink = item.querySelector('link');
        if (rssLink) {
          // RSS items usually have link as text content. Atom has it as href.
          url = rssLink.textContent?.trim() || rssLink.getAttribute('href') || '';
        }

        // 2. ATOM ALTERNATE LINK FALLBACK
        if (!url || !url.startsWith('http')) {
          const links = Array.from(item.querySelectorAll('link'));
          const alt = links.find(l => l.getAttribute('rel') === 'alternate');
          if (alt) {
            url = alt.getAttribute('href') || '';
          }
        }

        // 3. GUID PERMALINK FALLBACK
        if (!url || !url.startsWith('http')) {
          const guid = item.querySelector('guid');
          if (guid) {
            const isPerma = guid.getAttribute('isPermaLink') !== 'false';
            const guidText = guid.textContent?.trim() || '';
            if (isPerma && guidText.startsWith('http')) {
              url = guidText;
            }
          }
        }

        // 4. CANONICALIZE & ABSOLUTIZE
        if (url && !url.startsWith('http')) {
          try {
            url = new URL(url, feedBaseUrl).toString();
          } catch (e) {
            url = ''; 
          }
        }

        // 5. STRIP TRACKING (ONLY AFTER VALIDATION)
        if (url.startsWith('http')) {
          try {
            const urlObj = new URL(url);
            urlObj.searchParams.delete('utm_source');
            urlObj.searchParams.delete('utm_medium');
            urlObj.searchParams.delete('utm_campaign');
            urlObj.searchParams.delete('utm_content');
            url = urlObj.toString();
          } catch (e) {}
        }

        // 6. FINAL VALIDATION
        const isValid = url && 
                        url.startsWith('http') && 
                        url !== feed.url && 
                        !url.includes('rss.xml');

        if (title && isValid) {
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
    const all = [...FALLBACK_NEWS, ...items];
    return all
      .filter(item => {
        if (!item.url || item.url === '#' || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 30); // Instant Homepage only does one fast query: "latest 30 items"
  },

  generateStableId(url: string, title: string): string {
    let hash = 0;
    const str = url.split('?')[0]; // Use base URL for stability
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
    
    // Fallback: Use curated AI imagery for a premium look
    const placeholders = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593349480506-8433a14cc185?q=80&w=800&auto=format&fit=crop'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
};
