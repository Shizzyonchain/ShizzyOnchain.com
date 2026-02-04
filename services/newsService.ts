
import { AINewsItem } from '../types.ts';

const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'MIT News', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' }
];

// Using a slightly more reliable proxy service
const PROXY_URL = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'shizzy_ai_news_cache_v2';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const newsService = {
  async fetchAllFeeds(): Promise<AINewsItem[]> {
    console.log('Starting AI News Ingest...');
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY && data.length > 0) {
        console.log('Loading news from cache');
        return data;
      }
    }

    try {
      const results = await Promise.all(RSS_FEEDS.map(feed => this.fetchSingleFeed(feed)));
      let allNews = results.flat();
      
      if (allNews.length === 0) {
        console.warn('No news found from feeds, using emergency fallback');
        allNews = [this.getFallbackItem()];
      }

      const processed = this.processNewsItems(allNews);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: processed,
        timestamp: Date.now()
      }));

      return processed;
    } catch (error) {
      console.error('Critical news ingest error:', error);
      return [this.getFallbackItem()];
    }
  },

  async fetchSingleFeed(feed: { name: string, url: string }): Promise<AINewsItem[]> {
    try {
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(feed.url)}`);
      if (!response.ok) return [];
      
      const json = await response.json();
      const xmlString = json.contents;
      if (!xmlString) return [];
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Handle Parser Errors
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        console.error(`XML Parser Error for ${feed.name}`);
        return [];
      }

      const items = xmlDoc.querySelectorAll('item, entry');
      const newsItems: AINewsItem[] = [];
      
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        
        // Link logic for both RSS and Atom
        let url = '';
        const linkTag = item.querySelector('link');
        if (linkTag) {
          url = linkTag.getAttribute('href') || linkTag.textContent || '';
        }

        const published_at = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
        const excerpt = this.cleanExcerpt(item.querySelector('description, summary, content')?.textContent || '');
        const image_url = this.extractImage(item);
        
        if (title && url && url.startsWith('http')) {
          newsItems.push({
            id: this.generateId(url, title),
            source: feed.name,
            title,
            url,
            published_at: new Date(published_at).toISOString(),
            excerpt,
            image_url,
            tags: ['ai', feed.name.toLowerCase().replace(' ', '')]
          });
        }
      });
      
      return newsItems;
    } catch (error) {
      console.error(`Feed fetch failed: ${feed.name}`, error);
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
    return btoa(url.slice(-20) + title.slice(0, 10)).slice(0, 16);
  },

  cleanExcerpt(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let clean = doc.body.textContent || '';
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean.slice(0, 150) + (clean.length > 150 ? '...' : '');
  },

  extractImage(item: Element): string {
    // Check media:content or media:thumbnail (with namespace handling)
    const mediaTags = ['media:content', 'media\\:content', 'media:thumbnail', 'media\\:thumbnail', 'enclosure'];
    for (const tag of mediaTags) {
      const el = item.querySelector(tag);
      const url = el?.getAttribute('url');
      if (url && (url.includes('jpg') || url.includes('png') || url.includes('webp') || url.includes('jpeg'))) {
        return url;
      }
    }
    
    // Look for <img> tags in content/description
    const content = item.querySelector('description, summary, content')?.textContent || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
    
    // Random AI generic thumbnails for variety
    const fallbacks = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593349480506-8433a14cc185?q=80&w=800&auto=format&fit=crop'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  },

  getFallbackItem(): AINewsItem {
    return {
      id: 'fallback-1',
      source: 'System',
      title: 'AI Intelligence Node: Synchronizing Global Feeds...',
      url: 'https://shizzyunchained.com',
      published_at: new Date().toISOString(),
      excerpt: 'Our intelligence pipeline is currently gathering the latest onchain and AI data. Please check back in 60 seconds or refresh the feed.',
      image_url: 'https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=800&auto=format&fit=crop',
      tags: ['system', 'sync']
    };
  }
};
