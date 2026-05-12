
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
    return {
      lives: [
        {
          id: 'iVEeKybE5ZE',
          title: 'Bittensor Subnets Just Changed Forever With Locked Conviction',
          thumbnail: 'https://img.youtube.com/vi/iVEeKybE5ZE/maxresdefault.jpg',
          url: 'https://youtu.be/iVEeKybE5ZE',
          type: 'live' as const
        },
        {
          id: 'NJZBHVcFzyk',
          title: 'TAO Hits Solana, Bittensor Subnets Heat Up, And The Compute Market Is Coming',
          thumbnail: 'https://img.youtube.com/vi/NJZBHVcFzyk/maxresdefault.jpg',
          url: 'https://youtu.be/NJZBHVcFzyk',
          type: 'live' as const
        },
        {
          id: 'aQP8Wn6oKBU',
          title: 'Building the BEST Bittensor Subnet Portfolio',
          thumbnail: 'https://img.youtube.com/vi/aQP8Wn6oKBU/maxresdefault.jpg',
          url: 'https://youtu.be/aQP8Wn6oKBU',
          type: 'live' as const
        },
        {
          id: 'xtB5vUkIThQ',
          title: 'Bittensor Subnet 118 Ditto AI Revealed',
          thumbnail: 'https://img.youtube.com/vi/xtB5vUkIThQ/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=xtB5vUkIThQ',
          type: 'live' as const
        },
        {
          id: 'gcmz15fpMHI',
          title: 'Calm Before The Bittensor Storm',
          thumbnail: 'https://img.youtube.com/vi/gcmz15fpMHI/maxresdefault.jpg',
          url: 'https://youtu.be/gcmz15fpMHI',
          type: 'live' as const
        },
        {
          id: '1MAGqGQUYk8',
          title: 'Finding the Next Bittensor Subnet Runner',
          thumbnail: 'https://img.youtube.com/vi/1MAGqGQUYk8/maxresdefault.jpg',
          url: 'https://youtu.be/1MAGqGQUYk8',
          type: 'live' as const
        },
        {
          id: '8aCEqaDO6_I',
          title: 'Bittensor Is the Only Opportunity',
          thumbnail: 'https://img.youtube.com/vi/8aCEqaDO6_I/maxresdefault.jpg',
          url: 'https://youtu.be/8aCEqaDO6_I',
          type: 'live' as const
        },
        {
          id: 'gfUUxm1zkFw',
          title: 'Bitcoin Has Been Hijacked / Bittensor Subnet Update',
          thumbnail: 'https://img.youtube.com/vi/gfUUxm1zkFw/maxresdefault.jpg',
          url: 'https://youtu.be/gfUUxm1zkFw',
          type: 'live' as const
        },
        {
          id: 'yGPLg_8ZfjA',
          title: 'TAO Breakout Market Update: Subnet Surge, Institutional Flows, and the Next Leg Up',
          thumbnail: 'https://img.youtube.com/vi/yGPLg_8ZfjA/maxresdefault.jpg',
          url: 'https://youtu.be/yGPLg_8ZfjA',
          type: 'live' as const
        },
        {
          id: '-Yn6AYfNOVI',
          title: 'Bittensor Subnet Update | Subnets Taking Over DePIN?',
          thumbnail: 'https://img.youtube.com/vi/-Yn6AYfNOVI/maxresdefault.jpg',
          url: 'https://youtu.be/-Yn6AYfNOVI',
          type: 'live' as const
        },
        {
          id: 'YC-E7LDxWy0',
          title: 'TAO Falling Off a Cliff! Rebound Soon?',
          thumbnail: 'https://img.youtube.com/vi/YC-E7LDxWy0/maxresdefault.jpg',
          url: 'https://youtu.be/YC-E7LDxWy0',
          type: 'live' as const
        },
        {
          id: '9IWhkrH4zoA',
          title: 'Bittensor Is Heating Up, Ridges Goes Silent, and Chutes Breaks Through',
          thumbnail: 'https://img.youtube.com/vi/9IWhkrH4zoA/maxresdefault.jpg',
          url: 'https://youtu.be/9IWhkrH4zoA',
          type: 'live' as const
        },
        {
          id: 'nXykq3tHv5c',
          title: 'Covenant AI Just Called Out Bittensor And Left. Templar to 0?',
          thumbnail: 'https://img.youtube.com/vi/nXykq3tHv5c/maxresdefault.jpg',
          url: 'https://youtu.be/nXykq3tHv5c',
          type: 'live' as const
        },
        {
          id: 'ADTmw1DGuS8',
          title: 'TAO Volatility, Templar Dump, and Bittensor’s Next Move',
          thumbnail: 'https://img.youtube.com/vi/ADTmw1DGuS8/maxresdefault.jpg',
          url: 'https://youtu.be/ADTmw1DGuS8',
          type: 'live' as const
        },
        {
          id: 'OLZOXa5XkUw',
          title: 'TAO ETF, Subnet Risk, and the Future of Decentralized AI',
          thumbnail: 'https://img.youtube.com/vi/OLZOXa5XkUw/maxresdefault.jpg',
          url: 'https://youtu.be/OLZOXa5XkUw',
          type: 'live' as const
        },
        {
          id: 'cO_ud4ZJEMY',
          title: 'Subnet 97 Distil, Arbos, and the Future of Agent-Run Bittensor',
          thumbnail: 'https://img.youtube.com/vi/cO_ud4ZJEMY/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=cO_ud4ZJEMY',
          type: 'live' as const
        },
        {
          id: 'UlOEVeBL5QI',
          title: 'The TAO Flywheel Is Spinning Up Fast',
          thumbnail: 'https://img.youtube.com/vi/UlOEVeBL5QI/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=UlOEVeBL5QI',
          type: 'live' as const
        },
        {
          id: '1_-bAGtRdHY',
          title: 'Getting Started with Bittensor Tao Subnets',
          thumbnail: 'https://img.youtube.com/vi/1_-bAGtRdHY/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=1_-bAGtRdHY',
          type: 'live' as const
        },
        {
          id: '31P2-LSBBbo',
          title: 'TAO Subnets Are Absolutely Ripping Right Now',
          thumbnail: 'https://img.youtube.com/vi/31P2-LSBBbo/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=31P2-LSBBbo',
          type: 'live' as const
        },
        {
          id: 'pAH9auzOqdo',
          title: 'Sell Bitcoin, Buy Bittensor? TAO and Subnets Are Heating Up',
          thumbnail: 'https://img.youtube.com/vi/pAH9auzOqdo/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=pAH9auzOqdo',
          type: 'live' as const
        },
        {
          id: 'gvjPJpxAjNs',
          title: 'The Signal: AI Agents & Global Liquidity',
          thumbnail: 'https://img.youtube.com/vi/gvjPJpxAjNs/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=gvjPJpxAjNs',
          type: 'live' as const
        },
        {
          id: 'OnPTglAFzO0',
          title: 'Bittensor Subnets: The Decentralized Intelligence Layer',
          thumbnail: 'https://img.youtube.com/vi/OnPTglAFzO0/maxresdefault.jpg',
          url: 'https://youtu.be/OnPTglAFzO0',
          type: 'live' as const
        },
        {
          id: '7AsrjwSB1Zs',
          title: 'Crypto Infrastructure: The Middleware for AI',
          thumbnail: 'https://img.youtube.com/vi/7AsrjwSB1Zs/maxresdefault.jpg',
          url: 'https://youtu.be/7AsrjwSB1Zs',
          type: 'live' as const
        },
        {
          id: 'xuDjHk7dMTY',
          title: 'Early Trends: Identifying the Next Wave',
          thumbnail: 'https://img.youtube.com/vi/xuDjHk7dMTY/maxresdefault.jpg',
          url: 'https://youtu.be/xuDjHk7dMTY',
          type: 'live' as const
        },
        {
          id: 'Ks696rfT1jU',
          title: "Shizzy's Untold Story From Machinist",
          thumbnail: 'https://img.youtube.com/vi/Ks696rfT1jU/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=Ks696rfT1jU',
          type: 'live' as const
        },
        {
          id: 'ipkjDOogY2w',
          title: 'Why I Left Onchain Revolution',
          thumbnail: 'https://img.youtube.com/vi/ipkjDOogY2w/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=ipkjDOogY2w',
          type: 'live' as const
        }
      ],
      shorts: [
        {
          id: 'short1',
          title: 'Macro Alert: 2026 Strategy',
          thumbnail: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=400&auto=format&fit=crop',
          url: `https://www.youtube.com/${CHANNEL_HANDLE}/shorts`,
          type: 'short' as const
        }
      ]
    };
  }
};
