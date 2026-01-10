
import { GeckoCoin, GeckoCategory } from '../types.ts';

/**
 * HARDENED DATA NODE PROXY v4.1 (SWR Optimized)
 * Provides instant data from cache while refreshing in the background.
 */

const CATEGORY_CACHE_KEY = 'cg_category_stats_cache';
const MARKET_CACHE_PREFIX = 'cg_market_cache_';

// Cache timing: We consider data "fresh" for 5 mins, but "usable" for 24 hours (SWR)
const FRESH_THRESHOLD = 5 * 60 * 1000; 

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CATEGORY_MAP: Record<string, string> = {
  'ai-agents': 'ai-agents',
  'artificial-intelligence': 'artificial-intelligence',
  'layer-2': 'layer-2',
  'x402-ecosystem': 'x402-ecosystem'
};

class CoinGeckoProxy {
  private static instance: CoinGeckoProxy;
  private lastRequestTime: number = 0;
  private minRequestGap: number = 2000; 
  private activeRequests: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): CoinGeckoProxy {
    if (!CoinGeckoProxy.instance) {
      CoinGeckoProxy.instance = new CoinGeckoProxy();
    }
    return CoinGeckoProxy.instance;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.minRequestGap) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestGap - timeSinceLast));
    }
    this.lastRequestTime = Date.now();
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    if (this.activeRequests.has(url)) return null;
    this.activeRequests.add(url);

    try {
      for (let i = 0; i < retries; i++) {
        try {
          await this.throttle();
          const response = await fetch(url);
          
          if (response.status === 429) {
            const wait = (i + 1) * 5000;
            await new Promise(resolve => setTimeout(resolve, wait));
            continue;
          }

          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json();
        } catch (e) {
          if (i === retries - 1) throw e;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } finally {
      this.activeRequests.delete(url);
    }
  }

  /**
   * SWR: Get Category Stats
   */
  public async getCategoriesStats(onUpdate?: (data: GeckoCategory[]) => void): Promise<GeckoCategory[]> {
    const cached = localStorage.getItem(CATEGORY_CACHE_KEY);
    let initialData: GeckoCategory[] = [];
    let isStale = true;

    if (cached) {
      const { data, timestamp }: CacheEntry<GeckoCategory[]> = JSON.parse(cached);
      initialData = data;
      isStale = (Date.now() - timestamp) > FRESH_THRESHOLD;
    }

    if (isStale || initialData.length === 0) {
      this.fetchWithRetry('https://api.coingecko.com/api/v3/coins/categories')
        .then(data => {
          if (Array.isArray(data)) {
            localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
            if (onUpdate) onUpdate(data);
          }
        })
        .catch(console.error);
    }

    return initialData;
  }

  /**
   * SWR: Get Market Data for specific category
   */
  public async getCategoryMarkets(
    categoryId: string, 
    onUpdate?: (data: GeckoCoin[]) => void
  ): Promise<GeckoCoin[]> {
    const slug = CATEGORY_MAP[categoryId] || categoryId;
    const cacheKey = `${MARKET_CACHE_PREFIX}${slug}`;
    const cached = localStorage.getItem(cacheKey);
    
    let initialData: GeckoCoin[] = [];
    let isStale = true;

    if (cached) {
      const { data, timestamp }: CacheEntry<GeckoCoin[]> = JSON.parse(cached);
      initialData = data;
      isStale = (Date.now() - timestamp) > FRESH_THRESHOLD;
      
      if (!isStale) {
        return initialData;
      }
    }

    const params = new URLSearchParams({
      vs_currency: 'usd',
      category: slug,
      order: 'market_cap_desc',
      per_page: '20',
      page: '1',
      sparkline: 'false',
      price_change_percentage: '1h,24h,7d'
    });

    const refreshPromise = this.fetchWithRetry(`https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`)
      .then(data => {
        if (Array.isArray(data)) {
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
          if (onUpdate) onUpdate(data);
          return data;
        }
        return initialData;
      });

    if (initialData.length === 0) {
      return await refreshPromise;
    }

    return initialData;
  }
}

export const coinGeckoProxy = CoinGeckoProxy.getInstance();
