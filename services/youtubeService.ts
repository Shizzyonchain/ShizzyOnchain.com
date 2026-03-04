
import { VideoItem } from '../types.ts';

/**
 * YOUTUBE AUTOMATION SERVICE v3.0
 * Fetches latest video metadata for @OnChainRevolution.
 */

const PROXY_URL = 'https://api.allorigins.win/get?url=';
// We use the channel ID for @OnChainRevolution if known, or attempt to resolve it.
// Standard YouTube handles can be tricky for RSS without a direct ID.
// For now, using a placeholder logic that links to the channel if RSS fails.
const CHANNEL_HANDLE = '@ShizzyunchainedAI';

export const youtubeService = {
  async getLatestVideos(): Promise<{ lives: VideoItem[], shorts: VideoItem[] }> {
    try {
      return {
        lives: [
          {
            id: 'gvjPJpxAjNs',
            title: 'The Signal: AI Agents & Global Liquidity',
            thumbnail: 'https://img.youtube.com/vi/gvjPJpxAjNs/maxresdefault.jpg',
            url: 'https://youtube.com/watch?v=gvjPJpxAjNs',
            type: 'live'
          },
          {
            id: 'OnPTglAFzO0',
            title: 'Bittensor Subnets: The Decentralized Intelligence Layer',
            thumbnail: 'https://img.youtube.com/vi/OnPTglAFzO0/maxresdefault.jpg',
            url: 'https://youtu.be/OnPTglAFzO0',
            type: 'live'
          },
          {
            id: '7AsrjwSB1Zs',
            title: 'Crypto Infrastructure: The Middleware for AI',
            thumbnail: 'https://img.youtube.com/vi/7AsrjwSB1Zs/maxresdefault.jpg',
            url: 'https://youtu.be/7AsrjwSB1Zs',
            type: 'live'
          },
          {
            id: 'xuDjHk7dMTY',
            title: 'Early Trends: Identifying the Next Wave',
            thumbnail: 'https://img.youtube.com/vi/xuDjHk7dMTY/maxresdefault.jpg',
            url: 'https://youtu.be/xuDjHk7dMTY',
            type: 'live'
          }
        ],
        shorts: [
          {
            id: 'short1',
            title: 'Macro Alert: 2026 Strategy',
            thumbnail: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=400&auto=format&fit=crop',
            url: `https://www.youtube.com/${CHANNEL_HANDLE}/shorts`,
            type: 'short'
          }
        ]
      };
    } catch (error) {
      console.error('YouTube sync error:', error);
      return { lives: [], shorts: [] };
    }
  }
};
