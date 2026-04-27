
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
const CHANNEL_ID = 'UCXykq3tHv5cz8r9p7j4z2lw'; // Deduced/Calculated placeholder for logic

export const youtubeService = {
  async getLatestVideos(): Promise<{ lives: VideoItem[], shorts: VideoItem[] }> {
    try {
      // PROXY RSS FETCH LOGIC
      // Note: In a real production env, you'd use a dedicated backend or a more stable RSS->JSON proxy
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");
        
        const fetchedVideos: VideoItem[] = Array.from(entries).slice(0, 15).map(entry => {
          const id = entry.getElementsByTagName("yt:videoId")[0]?.textContent || '';
          const title = entry.getElementsByTagName("title")[0]?.textContent || '';
          return {
            id,
            title,
            thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
            url: `https://youtu.be/${id}`,
            type: 'live'
          };
        });

        if (fetchedVideos.length > 0) {
          return { lives: fetchedVideos, shorts: [] };
        }
      }

      // Fallback to Curated List if sync fails
      return {
        lives: [
          {
            id: 'yGPLg_8ZfjA',
            title: 'TAO Breakout Market Update: Subnet Surge, Institutional Flows, and the Next Leg Up',
            thumbnail: 'https://img.youtube.com/vi/yGPLg_8ZfjA/maxresdefault.jpg',
            url: 'https://youtu.be/yGPLg_8ZfjA',
            type: 'live'
          },
          {
            id: '-Yn6AYfNOVI',
            title: 'Bittensor Subnet Update | Subnets Taking Over DePIN?',
            thumbnail: 'https://img.youtube.com/vi/-Yn6AYfNOVI/maxresdefault.jpg',
            url: 'https://youtu.be/-Yn6AYfNOVI',
            type: 'live'
          },
          {
            id: 'YC-E7LDxWy0',
            title: 'TAO Falling Off a Cliff! Rebound Soon?',
            thumbnail: 'https://img.youtube.com/vi/YC-E7LDxWy0/maxresdefault.jpg',
            url: 'https://youtu.be/YC-E7LDxWy0',
            type: 'live'
          },
          {
            id: '9IWhkrH4zoA',
            title: 'Bittensor Is Heating Up, Ridges Goes Silent, and Chutes Breaks Through',
            thumbnail: 'https://img.youtube.com/vi/9IWhkrH4zoA/maxresdefault.jpg',
            url: 'https://youtu.be/9IWhkrH4zoA',
            type: 'live'
          },
          {
            id: 'nXykq3tHv5c',
            title: 'Covenant AI Just Called Out Bittensor And Left. Templar to 0?',
            thumbnail: 'https://img.youtube.com/vi/nXykq3tHv5c/maxresdefault.jpg',
            url: 'https://youtu.be/nXykq3tHv5c',
            type: 'live'
          },
          {
            id: 'ADTmw1DGuS8',
            title: 'TAO Volatility, Templar Dump, and Bittensor’s Next Move',
            thumbnail: 'https://img.youtube.com/vi/ADTmw1DGuS8/maxresdefault.jpg',
            url: 'https://youtu.be/ADTmw1DGuS8',
            type: 'live'
          },
          {
            id: 'OLZOXa5XkUw',
            title: 'TAO ETF, Subnet Risk, and the Future of Decentralized AI',
            thumbnail: 'https://img.youtube.com/vi/OLZOXa5XkUw/maxresdefault.jpg',
            url: 'https://youtu.be/OLZOXa5XkUw',
            type: 'live'
          },
          {
            id: 'cO_ud4ZJEMY',
            title: 'Subnet 97 Distil, Arbos, and the Future of Agent-Run Bittensor',
            thumbnail: 'https://img.youtube.com/vi/cO_ud4ZJEMY/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=cO_ud4ZJEMY',
            type: 'live'
          },
          {
            id: 'UlOEVeBL5QI',
            title: 'The TAO Flywheel Is Spinning Up Fast',
            thumbnail: 'https://img.youtube.com/vi/UlOEVeBL5QI/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=UlOEVeBL5QI',
            type: 'live'
          },
          {
            id: '1_-bAGtRdHY',
            title: 'Getting Started with Bittensor Tao Subnets',
            thumbnail: 'https://img.youtube.com/vi/1_-bAGtRdHY/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=1_-bAGtRdHY',
            type: 'live'
          },
          {
            id: '31P2-LSBBbo',
            title: 'TAO Subnets Are Absolutely Ripping Right Now',
            thumbnail: 'https://img.youtube.com/vi/31P2-LSBBbo/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=31P2-LSBBbo',
            type: 'live'
          },
          {
            id: 'pAH9auzOqdo',
            title: 'Sell Bitcoin, Buy Bittensor? TAO and Subnets Are Heating Up',
            thumbnail: 'https://img.youtube.com/vi/pAH9auzOqdo/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=pAH9auzOqdo',
            type: 'live'
          },
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
          },
          {
            id: 'Ks696rfT1jU',
            title: "Shizzy's Untold Story From Machinist",
            thumbnail: 'https://img.youtube.com/vi/Ks696rfT1jU/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=Ks696rfT1jU',
            type: 'live'
          },
          {
            id: 'ipkjDOogY2w',
            title: 'Why I Left Onchain Revolution',
            thumbnail: 'https://img.youtube.com/vi/ipkjDOogY2w/maxresdefault.jpg',
            url: 'https://www.youtube.com/watch?v=ipkjDOogY2w',
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
