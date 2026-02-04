
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY NEWS PIPELINE v4.1 - SOCIAL INTELLIGENCE MODE
 * Curated AI signals linking directly to high-impact X posts.
 */

const MANUALLY_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'sig-1',
    title: 'xAI Announces Grok-1.5: Context Window Expansion and Logical Reasoning Peak',
    url: 'https://x.com/xai/status/1773534571060011400',
    source: 'xAI (@xai)',
    published_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Grok-1.5 is now capable of processing long contexts and reasoning through substantially more complex problems.',
    tags: ['xAI', 'Grok']
  },
  {
    id: 'sig-2',
    title: 'SpaceX Starship: AI-Enabled Flight Data Analysis and Real-Time Trajectory Correction',
    url: 'https://x.com/SpaceX/status/1768255953048535443',
    source: 'SpaceX (@SpaceX)',
    published_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Starship flight telemetry is being processed by edge AI to optimize propellant management during re-entry.',
    tags: ['SpaceX', 'Starship']
  },
  {
    id: 'sig-3',
    title: 'X Semantic Search: The Platform Transition to Intent-Based Discovery',
    url: 'https://x.com/X/status/1717616644253130935',
    source: 'X (@X)',
    published_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1611605698335-8b1569810f6f?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Search on X is evolving. Users can now find content based on the meaning of their query, not just keywords.',
    tags: ['X', 'AI Search']
  },
  {
    id: 'sig-4',
    title: 'OpenAI Sora: Redefining Video Generation with Physical World Simulation',
    url: 'https://x.com/OpenAI/status/1758533583270408542',
    source: 'OpenAI (@OpenAI)',
    published_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Sora can generate videos up to a minute long while maintaining visual quality and adherence to user prompts.',
    tags: ['Sora', 'VideoAI']
  },
  {
    id: 'sig-5',
    title: 'Elon Musk on the Future of AGI and Distributed Compute Sovereignty',
    url: 'https://x.com/elonmusk',
    source: 'Elon Musk (@elonmusk)',
    published_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=800&auto=format&fit=crop',
    excerpt: 'Discussions on the scale of compute required to achieve AGI and the role of xAI in the ecosystem.',
    tags: ['Elon', 'AGI']
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
