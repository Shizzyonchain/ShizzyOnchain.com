
import { AINewsItem } from '../types.ts';

const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'MIT News', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' }
];

const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_ai_news_cache_v4';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minute check-in cycle

const AI_THEMED_FALLBACKS = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593349480506-8433a14cc185?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1684369175133-339243455799?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop'
];

export const newsService = {
  async fetchAllFeeds(): Promise<AINewsItem[]> {
    console.log('[Pipeline] Initiating 5-minute data sync...');
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY && data.length > 3) {
        console.log('[Pipeline] Serving cached intelligence');
        return data;
      }
    }

    try {
      const ts = Date.now();
      const results = await Promise.all(RSS_FEEDS.map(feed => this.fetchSingleFeed(feed, ts)));
      const allNews = results.flat();
      
      let processed = this.processNewsItems(allNews);
      
      // Inject curated fallbacks if feed is dry
      if (processed.length < 3) {
        console.warn('[Pipeline] Signal low. Injecting emergency intel.');
        processed = [...processed, ...this.getStaticIntel()].slice(0, 30);
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: processed,
        timestamp: Date.now()
      }));

      return processed;
    } catch (error) {
      console.error('[Pipeline] Global failure:', error);
      return this.getStaticIntel();
    }
  },

  async fetchSingleFeed(feed: { name: string, url: string }, ts: number): Promise<AINewsItem[]> {
    try {
      const targetUrl = `${feed.url}${feed.url.includes('?') ? '&' : '?'}cachebust=${ts}`;
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
      
      if (!response.ok) return [];
      
      const json = await response.json();
      const xmlString = json.contents;
      if (!xmlString) return [];
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) return [];

      const items = xmlDoc.querySelectorAll('item, entry');
      const newsItems: AINewsItem[] = [];
      
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        let url = '';
        const linkTag = item.querySelector('link');
        if (linkTag) {
          url = linkTag.getAttribute('href') || linkTag.textContent || '';
        }
        if (!url) {
          const altLink = Array.from(item.querySelectorAll('link')).find(l => l.getAttribute('rel') === 'alternate');
          if (altLink) url = altLink.getAttribute('href') || '';
        }

        const published_at = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
        const contentStr = item.querySelector('description, summary, content')?.textContent || '';
        const excerpt = this.cleanExcerpt(contentStr);
        const image_url = this.extractImage(item, contentStr);
        
        if (title && url && url.startsWith('http')) {
          newsItems.push({
            id: this.generateId(url, title),
            source: feed.name,
            title,
            url,
            published_at: new Date(published_at).toISOString(),
            excerpt,
            image_url,
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
      .slice(0, 200);
  },

  generateId(url: string, title: string): string {
    const seed = url.slice(-10) + title.slice(0, 10);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  cleanExcerpt(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let clean = doc.body.textContent || '';
    clean = clean.replace(/\s+/g, ' ').trim();
    if (clean.length > 140) clean = clean.slice(0, 140) + '...';
    return clean;
  },

  extractImage(item: Element, content: string): string {
    // 1. Direct Media Tags
    const mediaTags = ['media\\:content', 'media:content', 'media\\:thumbnail', 'media:thumbnail', 'enclosure'];
    for (const tag of mediaTags) {
      const el = item.querySelector(tag);
      const url = el?.getAttribute('url');
      if (url && (url.includes('jpg') || url.includes('png') || url.includes('webp') || url.includes('jpeg'))) {
        return url;
      }
    }
    
    // 2. Regex search in content (Description/Summary)
    // Looking for larger images, ignoring tracking pixels
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1] && !imgMatch[1].includes('analytics') && !imgMatch[1].includes('pixel')) {
      return imgMatch[1];
    }
    
    // 3. Fallback to high-quality AI collection
    const hash = Array.from(item.querySelector('title')?.textContent || '').reduce((a, b) => a + b.charCodeAt(0), 0);
    return AI_THEMED_FALLBACKS[hash % AI_THEMED_FALLBACKS.length];
  },

  getStaticIntel(): AINewsItem[] {
    return [
      {
        id: 'static-1',
        source: 'OpenAI',
        title: 'GPT-Next: Scaling Intelligence Beyond Text',
        url: 'https://openai.com/news/',
        published_at: new Date().toISOString(),
        excerpt: 'Advanced reasoning models are now being integrated into real-world autonomous agents.',
        image_url: AI_THEMED_FALLBACKS[0],
        tags: ['ai']
      }
    ];
  }
};
