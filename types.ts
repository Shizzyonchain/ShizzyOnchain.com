
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

export interface HotStory {
  id: string;
  title: string;
  timeAgo: string;
}
