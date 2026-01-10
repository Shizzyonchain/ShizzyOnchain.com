
import { GeckoCoin, GeckoCategory } from '../types.ts';

/**
 * HARDENED DATA NODE PROXY v4.4 (SWR Optimized)
 * Mimics a backend proxy logic for market bubbles with specific filtering and pagination.
 */

const CATEGORY_CACHE_KEY = 'cg_category_stats_cache';
const MARKET_CACHE_PREFIX = 'cg_market_cache_';
const BUBBLES_CACHE_KEY = 'cg_bubbles_market_cache';

const FRESH_THRESHOLD = 60 * 1000; // 60 seconds as requested

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

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
    const cacheKey = `fetch_${url}`;
    if (this.activeRequests.has(cacheKey)) return null;
    this.activeRequests.add(cacheKey);

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
          this.lastRequestTime = Date.now();
          return await response.json();
        } catch (e) {
          if (i === retries - 1) throw e;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } finally {
      this.activeRequests.delete(cacheKey);
    }
  }

  public async getBubbleMarkets(params: {
    limit: number;
    page?: number;
    category?: string;
    onUpdate?: (data: GeckoCoin[]) => void;
  }): Promise<GeckoCoin[]> {
    const { limit, page = 1, category, onUpdate } = params;
    const cacheKey = `${BUBBLES_CACHE_KEY}_${limit}_p${page}_${category || 'all'}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp }: CacheEntry<GeckoCoin[]> = JSON.parse(cached);
      if (Date.now() - timestamp < FRESH_THRESHOLD) {
        return data;
      }
      if (onUpdate) {
        this.executeMarketFetch(limit, page, category, cacheKey, onUpdate);
        return data;
      }
    }

    return this.executeMarketFetch(limit, page, category, cacheKey, onUpdate);
  }

  private async executeMarketFetch(
    limit: number, 
    page: number,
    category: string | undefined, 
    cacheKey: string, 
    onUpdate?: (data: GeckoCoin[]) => void
  ): Promise<GeckoCoin[]> {
    const queryParams = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit.toString(),
      page: page.toString(),
      sparkline: 'false',
      price_change_percentage: '1h,24h,7d,30d,1y'
    });

    if (category) {
      queryParams.append('category', category);
    }

    const data = await this.fetchWithRetry(`https://api.coingecko.com/api/v3/coins/markets?${queryParams.toString()}`);
    
    if (Array.isArray(data)) {
      const mappedData: GeckoCoin[] = data.map((c: any) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        image: c.image,
        current_price: c.current_price,
        market_cap: c.market_cap,
        market_cap_rank: c.market_cap_rank,
        total_volume: c.total_volume,
        price_change_percentage_1h_in_currency: c.price_change_percentage_1h_in_currency,
        price_change_percentage_24h_in_currency: c.price_change_percentage_24h_in_currency,
        price_change_percentage_7d_in_currency: c.price_change_percentage_7d_in_currency,
        price_change_percentage_30d_in_currency: c.price_change_percentage_30d_in_currency,
        price_change_percentage_1y_in_currency: c.price_change_percentage_1y_in_currency,
      }));
      
      localStorage.setItem(cacheKey, JSON.stringify({ data: mappedData, timestamp: Date.now() }));
      if (onUpdate) onUpdate(mappedData);
      return mappedData;
    }
    
    return [];
  }

  public async getCategoriesStats(onUpdate?: (data: GeckoCategory[]) => void): Promise<GeckoCategory[]> {
    const cached = localStorage.getItem(CATEGORY_CACHE_KEY);
    if (cached) {
      const { data, timestamp }: CacheEntry<GeckoCategory[]> = JSON.parse(cached);
      if (Date.now() - timestamp < FRESH_THRESHOLD * 60) return data;
    }

    const data = await this.fetchWithRetry('https://api.coingecko.com/api/v3/coins/categories');
    if (Array.isArray(data)) {
      localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      if (onUpdate) onUpdate(data);
      return data;
    }
    return [];
  }

  public async getTopMarkets(onUpdate?: (data: GeckoCoin[]) => void): Promise<GeckoCoin[]> {
    return this.getBubbleMarkets({ limit: 100, onUpdate });
  }

  public async getCategoryMarkets(category: string, onUpdate?: (data: GeckoCoin[]) => void): Promise<GeckoCoin[]> {
    return this.getBubbleMarkets({ limit: 100, category, onUpdate });
  }
}

export const coinGeckoProxy = CoinGeckoProxy.getInstance();
