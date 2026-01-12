
import { VideoItem } from '../App.tsx';

/**
 * YOUTUBE AUTOMATION SERVICE v2.0
 * Fetches the latest videos from @OnChainRevolution via CORS proxy and native XML parsing.
 * This approach is more reliable than third-party JSON conversion APIs.
 */

// Official Channel ID for @OnChainRevolution
const CHANNEL_ID = 'UCNUuKqR-23v_u4B9oIq0_1A'; 
const PROXY_URL = 'https://api.allorigins.win/get?url=';
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const youtubeService = {
  async getLatestVideos(): Promise<{ lives: VideoItem[], shorts: VideoItem[] }> {
    try {
      // Fetch raw XML through a CORS proxy
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(YOUTUBE_RSS_URL)}`);
      
      if (!response.ok) {
        console.warn('YouTube proxy fetch failed. Using fallback data.');
        return { lives: [], shorts: [] };
      }
      
      const json = await response.json();
      const xmlString = json.contents;
      
      if (!xmlString) return { lives: [], shorts: [] };

      // Parse the XML string into a DOM object
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const entries = xmlDoc.getElementsByTagName('entry');

      const allVideos: VideoItem[] = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        
        // Extract Video ID (yt:videoId)
        const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent;
        const title = entry.getElementsByTagName('title')[0]?.textContent || 'Untitled Video';
        const link = entry.getElementsByTagName('link')[0]?.getAttribute('href') || '';

        if (videoId) {
          allVideos.push({
            id: videoId,
            title: title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            url: link,
            // Simple heuristic to identify shorts vs full videos
            type: title.toLowerCase().includes('#shorts') || title.length < 40 ? 'short' : 'live'
          });
        }
      }

      return {
        lives: allVideos.filter(v => v.type === 'live').slice(0, 10),
        shorts: allVideos.filter(v => v.type === 'short').slice(0, 15)
      };
    } catch (error) {
      console.error('YouTube sync error:', error);
      return { lives: [], shorts: [] };
    }
  }
};
