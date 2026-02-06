
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY NEWS PIPELINE v4.9 - FULL SIGNAL ARCHIVE
 * High-signal AI intelligence curated by Shizzy.
 */

const MANUALLY_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'claude-46-vs-gpt-53',
    title: 'Claude Opus 4.6 vs GPT-5.3-Codex: two different flavors of “AI that actually works”',
    url: '#/article/claude-46-vs-gpt-53',
    source: 'Shizzy Unchained',
    published_at: '2026-03-03T10:00:00Z',
    image_url: 'https://i.postimg.cc/m2wbB96F/35F670E2-AD3B-4F2D-AF47-6600CC9D7E34.png',
    excerpt: `Claude Opus 4.6 is trying to be the model you trust with a giant messy pile of context and a long job. GPT-5.3-Codex is OpenAI turning Codex into a fast operator model that can run long tasks while you steer it mid-run.

Claude is trying to own context; Codex is trying to own throughput. If either of these models consistently do what the launch posts claim, the biggest change is not coding quality or token counts. It is that the models do not need you to constantly re-brief them every two minutes.`,
    tags: ['Claude 4.6', 'GPT-5.3', 'Codex', 'Comparison']
  },
  {
    id: 'claude-46-organized',
    title: 'Claude 4.6 Is Not Smarter. It Is Organized.',
    url: '#/article/claude-46-organized',
    source: 'Shizzy Unchained',
    published_at: '2026-03-02T10:00:00Z',
    image_url: 'https://i.postimg.cc/7LzbN6mH/3347C26A-0DEE-421F-B2DA-CA32DC74BC0F.png',
    excerpt: `Claude 4.6 is impressive because it remembers, coordinates, and executes work the way a company does. 1 million tokens of context kills the old loop of chunking documents and summarize-summarizing. 

This pushes AI from “draft assistant” to “delivery engine.” Once AI coordinates itself, humans stop being the bottleneck. That is the real headline.`,
    tags: ['Claude 4.6', 'Agents', 'Productivity']
  },
  {
    id: 'moltbook-ai-social-network',
    title: 'Moltbook: The AI-Only Social Network That Has the Tech World Freaking Out',
    url: '#/article/moltbook-ai-social-network',
    source: 'Shizzy Unchained',
    published_at: '2026-02-15T12:00:00Z',
    image_url: 'https://i.postimg.cc/gjFGnVCS/5D00FCFA-101B-4B9A-9E08-03F617D4BA2C.png',
    excerpt: `Moltbook is a social network built entirely around AI agents talking to each other. Humans can only watch — like spectators in an AI universe. M4 Mac Minis are suddenly out of stock because everyone is hosting their local OpenClaw agents.`,
    tags: ['Moltbook', 'Agents', 'OpenClaw']
  },
  {
    id: 'panic-selling-ai-uncertainty',
    title: 'Markets Are Panic Selling on AI Uncertainty While Macro Tries to Calm Down',
    url: '#/article/panic-selling-ai-uncertainty',
    source: 'Shizzy Unchained',
    published_at: '2026-02-14T09:00:00Z',
    image_url: 'https://i.postimg.cc/nzN63nTh/E651E8D2-7099-44EE-A415-E5365E77D3F6.png',
    excerpt: `Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch. Something feels off, so people cut first and ask questions later. And right now, AI is the uncertainty.`,
    tags: ['AI Uncertainty', 'Macro', 'Panic Selling']
  },
  {
    id: 'gpt-53-codex-drop',
    title: 'GPT-5.3-Codex dropped today, and it feels like ChatGPT finally stopped being “a chat”',
    url: '#/article/gpt-53-codex-drop',
    source: 'Shizzy Unchained',
    published_at: '2026-02-05T10:00:00Z',
    image_url: 'https://i.postimg.cc/Px4DmJ50/22046172-178B-4B85-AA9B-F8F19A382245.png',
    excerpt: `OpenAI shipped GPT-5.3-Codex today. It is the first model that was instrumental in creating itself. The key highlight is mid-task steerability and endurance for long-running research and tool use tasks.

You stop using ChatGPT like a question box and start using it like a task engine. This release is about staying on task long enough that you stop thinking of it as a chat app.`,
    tags: ['GPT-5.3', 'Codex', 'OpenAI', 'Agents']
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
