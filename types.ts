
export interface CoinData {
  symbol: string;
  price: number;
  change: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  timestamp: string;
  summary: string;
  content: string[];
  imageUrl: string;
  snapshots?: {
    asset: string;
    price: string;
    description: string;
  }[];
}

export interface AINewsItem {
  id: string;
  source: string;
  title: string;
  url: string;
  published_at: string;
  excerpt: string;
  image_url: string;
  tags: string[];
}

export interface HotStory {
  id: string;
  title: string;
  date: string;
}

export interface GeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  price_change_percentage_1y_in_currency: number;
}

export interface GeckoCategory {
  id: string;
  name: string;
  market_cap: number;
  volume_24h: number;
  content: string;
}

export interface CategoryState {
  id: string;
  name: string;
  enabled: boolean;
}

export interface LlamaChain {
  name: string;
  tvl?: number;
  volume24h?: number;
  revenue24h?: number;
  revenue7d?: number;
  revenue30d?: number;
  change_1d: number | null;
  change_7d: number | null;
}

export interface LlamaProtocol {
  name: string;
  category: string;
  tvl: number;
  change_1d: number | null;
  change_7d: number | null;
}

export interface LlamaStablecoin {
  name: string;
  symbol: string;
  circulating: number;
  change_1d: number | null;
  change_7d: number | null;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url?: string;
  type: 'live' | 'short';
}

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  liquidity?: {
    usd: number;
  };
  volume?: {
    h24: number;
  };
}

export type View = 'home' | 'overview' | 'ainews' | 'cryptonews' | 'videos' | 'aicoins' | 'cryptocoins' | 'all-shorts' | 'all-stories' | 'research' | 'defi' | 'bubbles' | 'tools' | 'contact' | 'bittensor' | 'send-tip' | 'portfolio' | 'all-comments' | 'bittensor-subnets' | 'shop';
