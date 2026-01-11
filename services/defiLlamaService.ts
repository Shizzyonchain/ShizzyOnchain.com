
import { LlamaChain, LlamaProtocol, LlamaStablecoin } from '../types.ts';

/**
 * DEFILLAMA DATA NODE PROXY v2.2
 * Focuses on on-chain activity: Volume, Revenue, and TVL.
 * Explicitly filters out CEX/Centralized and 'Off Chain' data.
 */

const CACHE_KEYS = {
  CHAINS: 'dl_chains_cache',
  VOLUME: 'dl_volume_cache',
  REVENUE: 'dl_revenue_cache',
  PROTOCOLS: 'dl_protocols_cache',
  STABLES: 'dl_stables_cache'
};

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes standard

class DefiLlamaService {
  private static instance: DefiLlamaService;

  private constructor() {}

  public static getInstance(): DefiLlamaService {
    if (!DefiLlamaService.instance) {
      DefiLlamaService.instance = new DefiLlamaService();
    }
    return DefiLlamaService.instance;
  }

  private getCached<T>(key: string): T | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TIME) return null;
    return data;
  }

  private setCached<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  }

  private isOffChain(name: string): boolean {
    if (!name) return true;
    const n = name.toLowerCase();
    return n === 'off chain' || n === 'offchain' || n === 'unknown';
  }

  /**
   * Aggregates volume by chain from the DEXs overview
   */
  public async getChainsByVolume(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.VOLUME);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/overview/dexs?excludeTotalVolumeChangePercentage=true');
      if (!response.ok) throw new Error('DEXs API failure');
      const data = await response.json();
      
      const chainVolMap: Record<string, number> = {};
      
      // Aggregate volume from individual DEX protocols to their respective chains
      if (data.protocols && Array.isArray(data.protocols)) {
        data.protocols.forEach((p: any) => {
          // Skip if protocol is a CEX
          if (p.category === 'CEX' || p.category === 'Centralized Exchange') return;

          const chains = p.chains || [];
          const vol = p.total24h || 0;
          if (chains.length > 0 && vol > 0) {
            const validChains = chains.filter((c: string) => !this.isOffChain(c));
            if (validChains.length > 0) {
              const perChain = vol / validChains.length;
              validChains.forEach((c: string) => {
                chainVolMap[c] = (chainVolMap[c] || 0) + perChain;
              });
            }
          }
        });
      }

      const sorted = Object.entries(chainVolMap)
        .map(([name, vol]) => ({
          name,
          volume24h: vol,
          change_1d: 0,
          change_7d: 0
        }))
        .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
        .slice(0, 10);

      this.setCached(CACHE_KEYS.VOLUME, sorted);
      return sorted;
    } catch (e) {
      console.error('Volume fetch failed', e);
      return [];
    }
  }

  /**
   * Aggregates revenue by chain from the Fees/Revenue overview
   */
  public async getChainsByRevenue(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.REVENUE);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/overview/fees?excludeTotalFeesChangePercentage=true');
      if (!response.ok) throw new Error('Fees API failure');
      const data = await response.json();
      
      const chainRevMap: Record<string, number> = {};
      if (data.protocols && Array.isArray(data.protocols)) {
        data.protocols.forEach((p: any) => {
          // Explicitly skip CEX protocols
          if (p.category === 'CEX' || p.category === 'Centralized Exchange') return;

          const chains = p.chains || [];
          const totalRev = p.total24h || 0;
          if (chains.length > 0 && totalRev > 0) {
            const validChains = chains.filter((c: string) => !this.isOffChain(c));
            if (validChains.length > 0) {
              const perChain = totalRev / validChains.length;
              validChains.forEach((c: string) => {
                chainRevMap[c] = (chainRevMap[c] || 0) + perChain;
              });
            }
          }
        });
      }

      const sorted = Object.entries(chainRevMap)
        .map(([name, rev]) => ({
          name,
          revenue24h: rev,
          change_1d: 0,
          change_7d: 0
        }))
        .sort((a, b) => (b.revenue24h || 0) - (a.revenue24h || 0))
        .slice(0, 10);

      this.setCached(CACHE_KEYS.REVENUE, sorted);
      return sorted;
    } catch (e) {
      console.error('Revenue fetch failed', e);
      return [];
    }
  }

  public async getTopChains(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.CHAINS);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/v2/chains');
      const data = await response.json();
      const sorted: LlamaChain[] = data
        .filter((c: any) => !this.isOffChain(c.name))
        .sort((a: any, b: any) => b.tvl - a.tvl)
        .slice(0, 10)
        .map((c: any) => ({
          name: c.name,
          tvl: c.tvl,
          change_1d: c.change_1d || 0,
          change_7d: c.change_7d || 0
        }));
      
      this.setCached(CACHE_KEYS.CHAINS, sorted);
      return sorted;
    } catch (e) {
      throw e;
    }
  }

  public async getTopProtocols(): Promise<LlamaProtocol[]> {
    const cached = this.getCached<LlamaProtocol[]>(CACHE_KEYS.PROTOCOLS);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/protocols');
      const data = await response.json();
      const sorted: LlamaProtocol[] = data
        .filter((p: any) => p.category !== 'CEX' && p.category !== 'Centralized Exchange' && !this.isOffChain(p.name))
        .sort((a: any, b: any) => b.tvl - a.tvl)
        .slice(0, 10)
        .map((p: any) => ({
          name: p.name,
          category: p.category,
          tvl: p.tvl,
          change_1d: p.change_1d || 0,
          change_7d: p.change_7d || 0
        }));
      
      this.setCached(CACHE_KEYS.PROTOCOLS, sorted);
      return sorted;
    } catch (e) {
      throw e;
    }
  }

  public async getTopStablecoins(): Promise<LlamaStablecoin[]> {
    const cached = this.getCached<LlamaStablecoin[]>(CACHE_KEYS.STABLES);
    if (cached) return cached;

    try {
      const response = await fetch('https://stablecoins.llama.fi/stablecoins');
      const data = await response.json();
      const sorted: LlamaStablecoin[] = data.peggedAssets
        .sort((a: any, b: any) => b.circulating.peggedUSD - a.circulating.peggedUSD)
        .slice(0, 10)
        .map((s: any) => ({
          name: s.name,
          symbol: s.symbol,
          circulating: s.circulating.peggedUSD,
          change_1d: s.change_1d || 0,
          change_7d: s.change_7d || 0
        }));
      
      this.setCached(CACHE_KEYS.STABLES, sorted);
      return sorted;
    } catch (e) {
      throw e;
    }
  }
}

export const defiLlamaService = DefiLlamaService.getInstance();
