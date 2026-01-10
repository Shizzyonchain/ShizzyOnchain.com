
import { LlamaChain, LlamaProtocol, LlamaStablecoin } from '../types.ts';

/**
 * DEFILLAMA DATA NODE PROXY v1.0
 * Handles fetching, sorting, and caching of fundamental on-chain metrics.
 */

const CACHE_KEYS = {
  CHAINS: 'dl_chains_cache',
  PROTOCOLS: 'dl_protocols_cache',
  STABLES: 'dl_stables_cache'
};

const CACHE_TIME = {
  STANDARD: 5 * 60 * 1000, // 5 minutes for chains/protocols
  STABLES: 10 * 60 * 1000   // 10 minutes for stables
};

class DefiLlamaService {
  private static instance: DefiLlamaService;

  private constructor() {}

  public static getInstance(): DefiLlamaService {
    if (!DefiLlamaService.instance) {
      DefiLlamaService.instance = new DefiLlamaService();
    }
    return DefiLlamaService.instance;
  }

  private getCached<T>(key: string, expiry: number): T | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > expiry) return null;
    return data;
  }

  private setCached<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  }

  public async getTopChains(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.CHAINS, CACHE_TIME.STANDARD);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/v2/chains');
      const data = await response.json();
      const sorted: LlamaChain[] = data
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
      console.error('Failed to fetch chains from DeFiLlama', e);
      throw e;
    }
  }

  public async getTopProtocols(): Promise<LlamaProtocol[]> {
    const cached = this.getCached<LlamaProtocol[]>(CACHE_KEYS.PROTOCOLS, CACHE_TIME.STANDARD);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/protocols');
      const data = await response.json();
      const sorted: LlamaProtocol[] = data
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
      console.error('Failed to fetch protocols from DeFiLlama', e);
      throw e;
    }
  }

  public async getTopStablecoins(): Promise<LlamaStablecoin[]> {
    const cached = this.getCached<LlamaStablecoin[]>(CACHE_KEYS.STABLES, CACHE_TIME.STABLES);
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
      console.error('Failed to fetch stables from DeFiLlama', e);
      throw e;
    }
  }
}

export const defiLlamaService = DefiLlamaService.getInstance();
