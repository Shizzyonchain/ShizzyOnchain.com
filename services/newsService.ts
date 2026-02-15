
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY UNCHAINED NEWS PIPELINE v5.0
 * High-signal AI intelligence curated by Shizzy.
 */

const MANUALLY_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'twitter-skill-trap',
    title: 'The “Twitter Skill” Trap: Malware Chain Discovered on ClawHub',
    url: '#/article/twitter-skill-trap',
    source: 'Shizzy Unchained',
    published_at: '2026-03-04T10:00:00Z',
    image_url: 'https://i.postimg.cc/gJ3j0sgP/B311712F-19B4-4C72-A6C3-0C408253F978.png',
    excerpt: `Security researchers have been tracking a wave of malicious OpenClaw skills on ClawHub. This was not some sketchy zip from a random Telegram—it was sitting in the open, dressed up like a popular “Twitter” skill.`,
    tags: ['Security', 'OpenClaw', 'Malware', 'AI Safety']
  },
  {
    id: 'claude-46-vs-gpt-53',
    title: 'Claude Opus 4.6 vs GPT-5.3-Codex: A Battle of Autonomous Context',
    url: '#/article/claude-46-vs-gpt-53',
    source: 'Shizzy Unchained',
    published_at: '2026-03-03T10:00:00Z',
    image_url: 'https://i.postimg.cc/m2wbB96F/35F670E2-AD3B-4F2D-AF47-6600CC9D7E34.png',
    excerpt: `Claude Opus 4.6 is trying to be the model you trust with a giant messy pile of context. GPT-5.3-Codex is OpenAI turning Codex into a fast operator model that can run long tasks while you steer it mid-run.`,
    tags: ['Claude 4.6', 'GPT-5.3', 'Codex', 'Comparison']
  },
  {
    id: 'claude-46-organized',
    title: 'Claude 4.6: The Shift from Draft Assistant to Delivery Engine',
    url: '#/article/claude-46-organized',
    source: 'Shizzy Unchained',
    published_at: '2026-03-02T10:00:00Z',
    image_url: 'https://i.postimg.cc/7LzbN6mH/3347C26A-0DEE-421F-B2DA-CA32DC74BC0F.png',
    excerpt: `Claude 4.6 is impressive because it remembers, coordinates, and executes work the way a company does. 1 million tokens of context kills the old loop of chunking documents.`,
    tags: ['Claude 4.6', 'Agents', 'Productivity']
  }
];

export const newsService = {
  getLatestSnapshotItems(): { items: AINewsItem[], lastUpdate: number, isConfigured: boolean } {
    return { 
      items: MANUALLY_CURATED_SIGNALS, 
      lastUpdate: Date.now(),
      isConfigured: true
    };
  },

  async sync(): Promise<void> {
    return Promise.resolve();
  }
};
