
import { LlamaChain, LlamaProtocol, LlamaStablecoin } from '../types.ts';

/**
 * DEFILLAMA DATA NODE PROXY v2.8 (Chain Fees Accuracy Fix)
 * Addresses the "completely wrong" fee feedback by ensuring we only 
 * pull gas/network fees specifically associated with the network identities.
 */

const CACHE_KEYS = {
  CHAINS: 'dl_chains_cache_v5',
  VOLUME: 'dl_volume_cache_v5',
  REVENUE: 'dl_revenue_cache_v5',
  PROTOCOLS: 'dl_protocols_cache_v5',
  STABLES: 'dl_stables_cache_v5'
};

const CACHE_TIME = 2 * 60 * 1000; // 2 minutes

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
    return ['off chain', 'offchain', 'unknown', 'cex', 'centralized', 'bridge'].includes(n);
  }

  public async getChainsByRevenue(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.REVENUE);
    if (cached) return cached;

    try {
      const response = await fetch('https://api.llama.fi/overview/fees?excludeTotalFeesChangePercentage=true');
      if (!response.ok) throw new Error('Fees API failure');
      const data = await response.json();
      
      const chains: LlamaChain[] = [];
      
      if (data.protocols && Array.isArray(data.protocols)) {
        // High fidelity filter: Targets actual L1/L2 network fee identities
        data.protocols.forEach((p: any) => {
          const cat = p.category;
          // In the Llama API, the chains themselves are often categorized as 'Chain' 
          // or sometimes just by their Name if they are the primary gas-earner.
          if (cat === 'Chain' || cat === 'L1' || cat === 'L2' || cat === 'Rollup') {
             // Avoid double counting child entries like "Lido-Ethereum"
             if (p.parentProtocol) return;

             chains.push({
                name: p.name,
                revenue24h: p.total24h || 0,
                revenue7d: p.total7d || 0,
                revenue30d: p.total30d || 0,
                change_1d: 0,
                change_7d: 0
             });
          }
        });
      }

      // Final sort and trim to top 10 as per screenshot
      const sorted = chains
        .sort((a, b) => (b.revenue24h || 0) - (a.revenue24h || 0))
        .slice(0, 10);

      this.setCached(CACHE_KEYS.REVENUE, sorted);
      return sorted;
    } catch (e) {
      console.error('Chain Revenue fetch failed', e);
      return [];
    }
  }

  public async getChainsByVolume(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.VOLUME);
    if (cached) return cached;
    try {
      const response = await fetch('https://api.llama.fi/overview/dexs?excludeTotalVolumeChangePercentage=true');
      const data = await response.json();
      const chainVolMap: Record<string, number> = {};
      if (data.protocols) {
        data.protocols.forEach((p: any) => {
          const chains = p.chains || (p.chain ? [p.chain] : []);
          const vol = p.total24h || 0;
          if (chains.length > 0 && vol > 0) {
            const validChains = chains.filter((c: string) => !this.isOffChain(c));
            if (validChains.length > 0) {
              const perChain = vol / validChains.length;
              validChains.forEach((c: string) => { chainVolMap[c] = (chainVolMap[c] || 0) + perChain; });
            }
          }
        });
      }
      const sorted = Object.entries(chainVolMap).map(([name, vol]) => ({ name, volume24h: vol, change_1d: 0, change_7d: 0 }))
        .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0)).slice(0, 10);
      this.setCached(CACHE_KEYS.VOLUME, sorted);
      return sorted;
    } catch (e) { return []; }
  }

  public async getTopChains(): Promise<LlamaChain[]> {
    const cached = this.getCached<LlamaChain[]>(CACHE_KEYS.CHAINS);
    if (cached) return cached;
    try {
      const response = await fetch('https://api.llama.fi/v2/chains');
      const data = await response.json();
      const sorted = data.filter((c: any) => !this.isOffChain(c.name)).sort((a: any, b: any) => b.tvl - a.tvl).slice(0, 10).map((c: any) => ({
        name: c.name, tvl: c.tvl, change_1d: c.change_1d || 0, change_7d: c.change_7d || 0
      }));
      this.setCached(CACHE_KEYS.CHAINS, sorted);
      return sorted;
    } catch (e) { throw e; }
  }

  public async getTopProtocols(): Promise<LlamaProtocol[]> {
    const cached = this.getCached<LlamaProtocol[]>(CACHE_KEYS.PROTOCOLS);
    if (cached) return cached;
    try {
      const response = await fetch('https://api.llama.fi/protocols');
      const data = await response.json();
      const sorted = data.filter((p: any) => p.category !== 'CEX' && !this.isOffChain(p.name)).sort((a: any, b: any) => b.tvl - a.tvl).slice(0, 10).map((p: any) => ({
        name: p.name, category: p.category, tvl: p.tvl, change_1d: p.change_1d || 0, change_7d: p.change_7d || 0
      }));
      this.setCached(CACHE_KEYS.PROTOCOLS, sorted);
      return sorted;
    } catch (e) { throw e; }
  }

  public async getTopStablecoins(): Promise<LlamaStablecoin[]> {
    const cached = this.getCached<LlamaStablecoin[]>(CACHE_KEYS.STABLES);
    if (cached) return cached;
    try {
      const response = await fetch('https://stablecoins.llama.fi/stablecoins');
      const data = await response.json();
      const sorted = data.peggedAssets.sort((a: any, b: any) => b.circulating.peggedUSD - a.circulating.peggedUSD).slice(0, 10).map((s: any) => ({
        name: s.name, symbol: s.symbol, circulating: s.circulating.peggedUSD, change_1d: s.change_1d || 0, change_7d: s.change_7d || 0
      }));
      this.setCached(CACHE_KEYS.STABLES, sorted);
      return sorted;
    } catch (e) { throw e; }
  }
}

export const defiLlamaService = DefiLlamaService.getInstance();
