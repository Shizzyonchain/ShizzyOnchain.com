
import { VideoItem } from '../types.ts';

/**
 * YOUTUBE AUTOMATION SERVICE v2.1
 * Fetches latest video metadata through neutral RSS parsing.
 */

const PROXY_URL = 'https://api.allorigins.win/get?url=';

export const youtubeService = {
  async getLatestVideos(channelId?: string): Promise<{ lives: VideoItem[], shorts: VideoItem[] }> {
    if (!channelId) {
      // Return empty if no ID provided to avoid fetching incorrect content
      return { lives: [], shorts: [] };
    }

    try {
      const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(YOUTUBE_RSS_URL)}`);
      
      if (!response.ok) {
        console.warn('YouTube proxy fetch failed.');
        return { lives: [], shorts: [] };
      }
      
      const json = await response.json();
      const xmlString = json.contents;
      
      if (!xmlString) return { lives: [], shorts: [] };

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const entries = xmlDoc.getElementsByTagName('entry');

      const allVideos: VideoItem[] = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent;
        const title = entry.getElementsByTagName('title')[0]?.textContent || 'Untitled Video';
        const link = entry.getElementsByTagName('link')[0]?.getAttribute('href') || '';

        if (videoId) {
          allVideos.push({
            id: videoId,
            title: title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            url: link,
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
