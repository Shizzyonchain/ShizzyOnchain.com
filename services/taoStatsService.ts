
import { TaoSubnet } from '../types.ts';

const BASE_URL = 'https://api.taostats.io';

export const taoStatsService = {
  async getSubnets(): Promise<TaoSubnet[]> {
    // In browser environments, process.env is not directly accessible without a bundler.
    // If TAOSTATS_API_KEY is missing, we gracefully fallback to mock data.
    const apiKey = typeof process !== 'undefined' ? process.env.TAOSTATS_API_KEY : undefined;
    if (!apiKey) {
      console.warn('TAOSTATS_API_KEY is not defined.');
      return this.getFallbackData();
    }

    try {
      const response = await fetch(`${BASE_URL}/subnets`, {
        headers: {
          'Authorization': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Taostats API error: ${response.status}`);
      }

      const json = await response.json();
      
      // Map API response to our common TaoSubnet interface
      // Note: Mapping logic based on Taostats API documentation structure
      const data = Array.isArray(json.data) ? json.data : (json.subnets || []);
      
      return data.map((s: any) => ({
        netuid: s.netuid,
        name: s.name || `Subnet ${s.netuid}`,
        symbol: s.symbol || 'TAO',
        emission: s.emission || 0,
        price_usd: s.price_usd || s.price || 0,
        market_cap: s.market_cap || (s.price_usd ? s.price_usd * (s.stake || 0) : 0),
        stake: s.stake || 0,
        daily_rewards: s.daily_rewards || 0
      }));
    } catch (error) {
      console.error('Failed to fetch Tao subnets:', error);
      // If the API fails due to key/proxy issues, return fallback to maintain UI
      return this.getFallbackData();
    }
  },

  getFallbackData(): TaoSubnet[] {
    // High-signal stubs if API is unreachable
    return [
      { netuid: 1, name: 'Opentensor Foundation', symbol: 'TAO', emission: 0.18, price_usd: 420.50, market_cap: 1200000000, stake: 2800000 },
      { netuid: 18, name: 'Cortex.t', symbol: 'CRTX', emission: 0.08, price_usd: 12.40, market_cap: 85000000, stake: 450000 },
      { netuid: 32, name: 'Roleplay', symbol: 'ROLE', emission: 0.04, price_usd: 1.20, market_cap: 12000000, stake: 120000 }
    ];
  }
};
