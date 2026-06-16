
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
    const fallbackLives: VideoItem[] = [
      {
        id: 'vXSlbxzwPJw',
        title: 'Subnet Summer Just Got Real',
        thumbnail: 'https://img.youtube.com/vi/vXSlbxzwPJw/maxresdefault.jpg',
        url: 'https://youtu.be/vXSlbxzwPJw?si=fBRO6UY-7e0Ntdjq',
        type: 'live' as const
      },
      {
        id: 'TuNmIi5NEI4',
        title: "He Mined Bitcoin in 2009. Now He’s Betting on TAO",
        thumbnail: 'https://img.youtube.com/vi/TuNmIi5NEI4/maxresdefault.jpg',
        url: 'https://youtu.be/TuNmIi5NEI4?si=PvZUxNfPn0OIEnY-',
        type: 'live' as const
      },
      {
        id: 'zWPPQVkn9n0',
        title: 'Week 5 10 TAO to 100 TAO Challenge',
        thumbnail: 'https://img.youtube.com/vi/zWPPQVkn9n0/maxresdefault.jpg',
        url: 'https://youtu.be/zWPPQVkn9n0?si=Nv_7tli-64Y6mI29',
        type: 'live' as const
      },
      {
        id: 'ZiVtio59Z7s',
        title: 'Bittensor Snapback! Will It Continue?',
        thumbnail: 'https://img.youtube.com/vi/ZiVtio59Z7s/maxresdefault.jpg',
        url: 'https://youtu.be/ZiVtio59Z7s?si=W-AvzJFhiQNiF8YG',
        type: 'live' as const
      },
      {
        id: '_DAintx1Zfs',
        title: 'Live with Mark Jeffrey',
        thumbnail: 'https://img.youtube.com/vi/_DAintx1Zfs/maxresdefault.jpg',
        url: 'https://www.youtube.com/live/_DAintx1Zfs?si=yBaECExcJbWj64Vv',
        type: 'live' as const
      },
      {
        id: 'jfDjKoDDwtQ',
        title: 'It Gets Worse? Week 4 Of The 10 TAO To 100 TAO Challenge',
        thumbnail: 'https://img.youtube.com/vi/jfDjKoDDwtQ/maxresdefault.jpg',
        url: 'https://youtu.be/jfDjKoDDwtQ',
        type: 'live' as const
      },
      {
        id: 'qxr-Q9d9Elw',
        title: 'BITTENSOR’S SPECIAL K LIVE SN26 PERTURB, SN78 VOCENCE, AND THE FUTURE OF AI SUBNETS',
        thumbnail: 'https://img.youtube.com/vi/qxr-Q9d9Elw/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=qxr-Q9d9Elw',
        type: 'live' as const
      },
      {
        id: 'DK1_nZdHVw8',
        title: 'BITTENSOR PROOF OF TALK TOMORROW + CONVICTION IS LIVE',
        thumbnail: 'https://img.youtube.com/vi/DK1_nZdHVw8/maxresdefault.jpg',
        url: 'https://youtu.be/DK1_nZdHVw8',
        type: 'live' as const
      },
      {
        id: 'T19_j-bER4c',
        title: 'Down Bad? Week 3 Of The 10 TAO To 100 TAO Challenge',
        thumbnail: 'https://img.youtube.com/vi/T19_j-bER4c/maxresdefault.jpg',
        url: 'https://youtu.be/T19_j-bER4c',
        type: 'live' as const
      },
      {
        id: 'RMQW4J-fjCQ',
        title: 'Stake and Chill: Bittensor Subnet Update',
        thumbnail: 'https://img.youtube.com/vi/RMQW4J-fjCQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=RMQW4J-fjCQ',
        type: 'live' as const
      },
      {
        id: '4VOSqr9zmaM',
        title: 'Can Bittensor Get Its Own Stablecoin? LIVE with TensorUSD',
        thumbnail: 'https://img.youtube.com/vi/4VOSqr9zmaM/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=4VOSqr9zmaM',
        type: 'live' as const
      },
      {
        id: 'IRJGpP48DyU',
        title: 'Find The Next Bittensor Subnet Runner',
        thumbnail: 'https://img.youtube.com/vi/IRJGpP48DyU/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=IRJGpP48DyU',
        type: 'live' as const
      },
      {
        id: 'B9mhAENkNck',
        title: 'BITTENSOR SNAPS BACK',
        thumbnail: 'https://img.youtube.com/vi/B9mhAENkNck/maxresdefault.jpg',
        url: 'https://youtu.be/B9mhAENkNck',
        type: 'live' as const
      },
      {
        id: 'v5JquAosYpw',
        title: 'Road to 100 TAO : Week 2',
        thumbnail: 'https://img.youtube.com/vi/v5JquAosYpw/maxresdefault.jpg',
        url: 'https://youtu.be/v5JquAosYpw',
        type: 'live' as const
      },
      {
        id: '2G87OabLc5c',
        title: 'Road to 100 TAO : Week 1',
        thumbnail: 'https://img.youtube.com/vi/2G87OabLc5c/maxresdefault.jpg',
        url: 'https://youtu.be/2G87OabLc5c',
        type: 'live' as const
      },
      {
        id: '7GcxI-XRceY',
        title: 'Bittensor Subnet Blood Bath! How Low Do We Go?',
        thumbnail: 'https://img.youtube.com/vi/7GcxI-XRceY/maxresdefault.jpg',
        url: 'https://youtu.be/7GcxI-XRceY',
        type: 'live' as const
      },
      {
        id: 'zrROnurtwEo',
        title: 'Bittensor Is Still Bleeding. No Bottom Yet?',
        thumbnail: 'https://img.youtube.com/vi/zrROnurtwEo/maxresdefault.jpg',
        url: 'https://youtu.be/zrROnurtwEo',
        type: 'live' as const
      },
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
        title: 'Bittensor Subnet 118 Ditto AI Revealed',
        thumbnail: 'https://img.youtube.com/vi/aQP8Wn6oKBU/maxresdefault.jpg',
        url: 'https://youtu.be/aQP8Wn6oKBU',
        type: 'live' as const
      },
      {
        id: 'xtB5vUkIThQ',
        title: 'Calm Before The Bittensor Storm',
        thumbnail: 'https://img.youtube.com/vi/xtB5vUkIThQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=xtB5vUkIThQ',
        type: 'live' as const
      },
      {
        id: 'gcmz15fpMHI',
        title: 'Building the BEST Bittensor Subnet Portfolio',
        thumbnail: 'https://img.youtube.com/vi/gcmz15fpMHI/maxresdefault.jpg',
        url: 'https://youtu.be/gcmz15fpMHI',
        type: 'live' as const
      }
    ];

    try {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(feedUrl)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from proxy');
      }

      const data = await response.json();
      if (!data || !data.contents) {
        throw new Error('Proxy returned empty content');
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
      const entries = xmlDoc.getElementsByTagName('entry');
      
      if (entries.length === 0) {
        throw new Error('No entries found in RSS XML');
      }

      const parsedVideos: VideoItem[] = [];
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        
        // Attempt to find video ID via yt:videoId or split standard id tag
        let videoId = '';
        const ytIdNodes = entry.getElementsByTagName('yt:videoId');
        if (ytIdNodes.length > 0 && ytIdNodes[0].textContent) {
          videoId = ytIdNodes[0].textContent.trim();
        } else {
          const idNodes = entry.getElementsByTagName('id');
          if (idNodes.length > 0 && idNodes[0].textContent) {
            const rawId = idNodes[0].textContent.trim();
            if (rawId.includes('yt:video:')) {
              videoId = rawId.split('yt:video:')[1];
            }
          }
        }

        // Try extracting title
        let title = '';
        const titleNodes = entry.getElementsByTagName('title');
        if (titleNodes.length > 0 && titleNodes[0].textContent) {
          title = titleNodes[0].textContent.trim();
        }

        if (videoId && title) {
          parsedVideos.push({
            id: videoId,
            title: title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            type: 'live' as const
          });
        }
      }

      if (parsedVideos.length > 0) {
        // Merge the dynamic real-time videos with fallback array to ensure backup coverage, avoiding duplicates
        const existingIds = new Set(parsedVideos.map(v => v.id));
        const mergedVideos = [...parsedVideos];
        
        for (const fb of fallbackLives) {
          if (!existingIds.has(fb.id)) {
            mergedVideos.push(fb);
            existingIds.add(fb.id);
          }
        }

        // Keep it strictly to the newest/most relevant videos
        return {
          lives: mergedVideos.slice(0, 15),
          shorts: []
        };
      }
    } catch (error) {
      console.warn('Real-time RSS fetch failed, falling back to curated newest video dataset:', error);
    }

    return {
      lives: fallbackLives,
      shorts: []
    };
  }
};
