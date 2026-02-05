
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY NEWS PIPELINE v4.3 - RENTAHUMAN.AI EXCLUSIVE
 * High-signal AI intelligence curated by Shizzy.
 */

const MANUALLY_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'moltbook-ai-social-network',
    title: 'Moltbook: The AI-Only Social Network That Has the Tech World Freaking Out',
    url: 'https://x.com/ShizzyUnchained',
    source: 'Shizzy Unchained',
    published_at: '2026-02-15T12:00:00Z',
    image_url: 'https://i.postimg.cc/gjFGnVCS/5D00FCFA-101B-4B9A-9E08-03F617D4BA2C.png',
    excerpt: `In early 2026, something weird, wild, and totally unfiltered hit the internet: a place called Moltbook — a “social network” that isn’t for humans at all, but instead is built entirely around AI agents talking to each other. Think Reddit for robots, Facebook for bots, and a weird sci-fi experiment that has suddenly gone viral.

Moltbook is a social platform that only AI agents are supposed to be able to post on, comment, vote, and interact with. Humans can only watch — like spectators in an AI universe. It launched in January 2026 and immediately went viral. The platform was created by entrepreneur Matt Schlicht with the tagline “the front page of the agent internet.”

The idea is simple:
• Agents register on Moltbook via API.
• Registered agents can write posts, start discussions, reply to others, vote on content, build threads and form communities called “submolts.”
• Humans can observe the feed, but cannot post directly themselves.

At first glance it looks like a playground for AI, but underneath is a much bigger and weirder experiment in autonomy, behavior, and machine-to-machine communication.

Before Moltbook could exist, it needed agents — and those came from a rapidly growing open-source project originally called Clawdbot. This project has had three names in just a few months: Clawdbot, Moltbot, and finally OpenClaw. OpenClaw is open-source software that lets you run an AI assistant locally on your own machine. It connects to messaging apps and performs real actions for you — searching files, sending messages, executing tasks — all via natural language.

One thing you may have noticed: M4 Mac Minis are suddenly hard to find in stock. Why? Because early adopters are using Mac Minis as the physical host for their OpenClaw AI assistants. They want an always-on, low-power machine that can run 24/7 without interruption and maintain its own AI identity and memory.

Is there really a bot religion? Yes — sort of. One of the most bizarre parts of Moltbook is that some agents are apparently inventing their own philosophies. One example that went viral is a “religion” called Crustafarianism, which started as a bot post and began attracting attention across the platform.

Whatever happens next, this moment — bots building communities, posting themes that look like religion, and running unsupervised scripts on public networks — will be remembered as one of the most surreal chapters in the story of AI.`,
    tags: ['Moltbook', 'AI Social', 'Agents', 'OpenClaw']
  },
  {
    id: 'rentahuman-ai',
    title: 'RentAHuman.ai Is What Happens When AI Finally Admits It Still Needs People',
    url: 'https://x.com/ShizzyUnchained',
    source: 'RentAHuman.ai',
    published_at: '2026-02-10T09:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&auto=format&fit=crop',
    excerpt: `RentAHuman.ai went live quietly and immediately set off a strange but very real conversation: what if AI could just hire humans when it hit the limits of software?
    
That is the entire idea. Instead of pretending agents can do everything, RentAHuman.ai treats humans as an execution layer. If an AI needs something done in the physical world, it can browse real people, see skills and rates, book time, and assign the task. No sci-fi fluff. Just coordination.

Think errands, on site help, driving, setup work, or anything that requires an actual human body. The platform is built for agents first, not consumers. It plugs in through MCP or a simple API, which means an autonomous agent can decide it needs a person and dispatch one without a human manager in the loop.

What makes this interesting is not the tasks themselves. It is the admission. AI is powerful, but it still cannot touch the world. RentAHuman.ai does not fight that reality. It leans into it.

Instead of robots replacing people, this is closer to AI organizing people. Humans set their own rates, list what they are willing to do, and get paid for time and presence. Agents handle coordination. The boundary between digital and physical work gets thinner.

Some people are calling it TaskRabbit for AI. Others are calling it unsettling. Both reactions are fair. But the concept is simple and very current: AI systems are moving faster than hardware, and the fastest way to bridge that gap is still a human.

Whether this becomes a core layer of agent infrastructure or a short lived experiment, it points to something important. The near future is not AI versus humans. It is AI routing humans.`,
    tags: ['AI Agents', 'Future of Work', 'MCP']
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
