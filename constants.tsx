
import { CoinData, NewsArticle } from './types.ts';

export const INITIAL_COINS: CoinData[] = [
  { symbol: 'BTC', price: 96450.00, change: 1.25 },
  { symbol: 'ETH', price: 2740.50, change: -0.85 },
  { symbol: 'SOL', price: 188.10, change: 4.20 },
  { symbol: 'XRP', price: 2.45, change: -1.35 },
  { symbol: 'BNB', price: 645.75, change: 0.75 },
  { symbol: 'TRX', price: 0.22, change: 1.35 },
  { symbol: 'DOGE', price: 0.38, change: -1.65 },
  { symbol: 'PEPE', price: 0.000021, change: 8.40 },
  { symbol: 'SUI', price: 3.10, change: -2.08 }
];

export const SOCIAL_LINKS = {
  x: 'https://x.com/ShizzyofficialX',
  xUnchained: 'https://x.com/Shizzyunchained',
  youtube: 'https://www.youtube.com/@Shizzyunchained',
  twitch: 'https://www.twitch.pvt/Shizzy_Unchained',
  tiktok: 'https://www.tiktok.com/@shizzyunchained',
  telegram: 'https://t.me/ShizzyUnchained',
  email: 'Shizzyunchained@gmail.com',
  logo: 'https://i.postimg.cc/gJZVqs15/Untitled-design-(71).png',
  heroImage: 'https://i.postimg.cc/1zFBjpQq/Main-Overlay-(6).png',
  website: 'https://onchainrevolution.io/'
};

export const OVERVIEW_CONTENT = {
  intro: "Shizzy Unchained Media is an independent innovation-first media brand focused on covering what is actually happening in artificial intelligence, with crypto and onchain markets as the secondary lane.",
  philosophy: "AI Needs Crypto. Crypto Needs AI.\n\nAI and crypto are pulling toward each other whether people like it or not. AI needs crypto rails to actually scale in the real world. Payments, access control, usage based pricing, incentives, and trustless coordination all break once you try to do them at global machine speed without crypto. At the same time, crypto needs AI to make sense of complexity, automate markets, manage risk, and turn raw onchain data into something usable. The funding side matters too. AI companies are already hitting a wall with private capital, compute costs, and growth expectations. That pushes them toward public launches, token models, and ICO style distribution with a transparent, global mindset.",
  offerings: [
    { 
      title: "AI SYSTEMS IN PRODUCTION", 
      description: "Real world AI agents, models, and tools that are actually being deployed. No demos, no hype, just what is working and why." 
    },
    { 
      title: "ONCHAIN DISTRIBUTION & FUNDING", 
      description: "How AI companies are turning to crypto for launch, liquidity, and public alignment as private funding tightens and growth expectations rise." 
    },
    { 
      title: "AUTOMATION & MARKET IMPACT", 
      description: "Mapping how AI driven automation reshapes jobs, incentives, capital flows, and the structure of modern markets." 
    }
  ]
};

export const DAILY_RIP_POSTS = [
  {
    id: 'rip-usdc-1',
    author: "USDC",
    handle: "@usdc",
    profileUrl: "https://x.com/usdc",
    postUrl: "https://x.com/usdc/status/2020934709254234545?s=46",
    content: "Stablecoins are moving from the 'settlement' phase to the 'utility' phase. The integration of programmable dollars into mainstream commerce is no longer a theoretical exercise—it is the structural foundation of the 24/7 global internet economy."
  },
  {
    id: 'rip-gothburz-1',
    author: "GothBurz",
    handle: "@gothburz",
    profileUrl: "https://x.com/gothburz",
    postUrl: "https://x.com/gothburz/status/2019841344257064971?s=46",
    content: "The hardest part of trading isn't the entry. It's the sitting. Most people trade themselves out of a generational move because they can't handle the boredom of being right for 6 months straight. Patience is the ultimate alpha."
  },
  {
    id: 'rip-defitracer-1',
    author: "DefiTracer",
    handle: "@defitracer",
    profileUrl: "https://x.com/defitracer",
    postUrl: "https://x.com/defitracer/status/2019789025268125906?s=46",
    content: "The biggest edge in crypto isn't finding a low cap gem before everyone else. It's having the stomach to hold a winner through a 30% drawdown while the rest of the world tells you you're a genius for 'taking profits'. Sizing is the only thing that matters."
  },
  {
    id: 'rip-noncesense-1',
    author: "0xnoncesense",
    handle: "@0xnoncesense",
    profileUrl: "https://x.com/0xnoncesense",
    postUrl: "https://x.com/0xnoncesense/status/2019788186168553510?s=46",
    content: "The 'wait for a dip' crowd is the same crowd that will 'wait for a bounce' when it actually dips. They don't want the asset, they want the safety. In crypto, those two are mutually exclusive. You either take the risk or you pay the premium."
  },
  {
    id: 'rip-mistercrypto-1',
    author: "Mister Crypto",
    handle: "@misterrcrypto",
    profileUrl: "https://x.com/misterrcrypto",
    postUrl: "https://x.com/misterrcrypto/status/2019847986835300598?s=46",
    content: "People are still waiting for a big Bitcoin correction, but they don't realize that the ETF demand is absorbing every single sell-off. We are in a structural supply crunch. The sidelines will be a very expensive place to sit this month."
  },
  {
    id: 'rip-peter-1',
    author: "Peter Yang",
    handle: "@petergyang",
    profileUrl: "https://x.com/petergyang",
    postUrl: "https://x.com/petergyang/status/2019613402495385984?s=46",
    content: "The biggest shift in the AI agent era is from tools that help you do work, to agents that do the work for you. The UX isn't about better buttons anymore; it's about better delegation and trust layers. If your product doesn't have an agentic roadmap, you're building for a world that's already gone."
  },
  {
    id: 'rip-jacob-1',
    author: "Jacob King",
    handle: "@jacobkinge",
    profileUrl: "https://x.com/jacobkinge",
    postUrl: "https://x.com/jacobkinge/status/2019829915693248520?s=46",
    content: "The reality of late-cycle liquidity is starting to bite. We are seeing major structural weaknesses in how collateral is being valued across the board. The 'dip' buyers are exhausted and the 'exit' runners are just getting started. Pay attention to the plumbing."
  },
  {
    id: 'rip-jacob-2',
    author: "Jacob King",
    handle: "@jacobkinge",
    profileUrl: "https://x.com/jacobkinge",
    postUrl: "https://x.com/jacobkinge/status/2019797446713364900?s=46",
    content: "Institutional holders are derisking into the weekend faster than the data suggests. This isn't just a regular flush; it's a recalibration of what risk actually means in a machine-driven environment. Liquidity is vanishing precisely where you'll need it most."
  },
  {
    id: 'rip-dean-1',
    author: "Dean Eigenmann",
    handle: "@deaneigenmann",
    profileUrl: "https://x.com/deaneigenmann",
    postUrl: "https://x.com/deaneigenmann/status/2019861697654137064?s=46",
    content: "The bridge between L1 and L2 remains the single greatest vector for ecosystem fragmentation. If we don't fix the atomic nature of these transactions, we aren't scaling—we're just partitioning the same users into smaller, less liquid buckets."
  },
  {
    id: 'rip-jacob-3',
    author: "Jacob King",
    handle: "@jacobkinge",
    profileUrl: "https://x.com/jacobkinge",
    postUrl: "https://x.com/jacobkinge/status/2019651568069394602?s=46",
    content: "Market efficiency is a myth in a world driven by algorithmic frontrunning. You aren't trading against people; you're trading against execution speed. If your edge depends on human speed, you've already lost."
  },
  {
    id: 'rip-dean-2',
    author: "Dean Eigenmann",
    handle: "@deaneigenmann",
    profileUrl: "https://x.com/deaneigenmann",
    postUrl: "https://x.com/deaneigenmann",
    content: "Decentralization is not just about censorship resistance. It's about resilience. If your 'AI Revolution' depends on a centralized server farm, it's not a revolution, it's a lease."
  },
  {
    id: 'rip-jacob-4',
    author: "Jacob King",
    handle: "@jacobkinge",
    profileUrl: "https://x.com/jacobkinge",
    postUrl: "https://x.com/jacobkinge",
    content: "Leverage is a hell of a drug until the liquidity taps dry up. We're seeing the same patterns repeat as they did in previous cycles, only the actors have different names. Risk management is the only real edge."
  },
  {
    id: 'rip-peter-2',
    author: "Peter Yang",
    handle: "@petergyang",
    profileUrl: "https://x.com/petergyang",
    postUrl: "https://x.com/petergyang",
    content: "The best product managers of 2026 won't be managing people, they'll be managing agentic workflows. The skills required are shifting from coordination to delegation."
  },
  {
    id: 'rip-dean-3',
    author: "Dean Eigenmann",
    handle: "@deaneigenmann",
    profileUrl: "https://x.com/deaneigenmann",
    postUrl: "https://x.com/deaneigenmann",
    content: "If you aren't thinking about cross-chain atomic state, you aren't building for the future. Fragmentation is the enemy of the machine economy."
  },
  {
    id: 'rip-jacob-5',
    author: "Jacob King",
    handle: "@jacobkinge",
    profileUrl: "https://x.com/jacobkinge",
    postUrl: "https://x.com/jacobkinge",
    content: "The macro environment is finally starting to recognize that 'Tech' and 'Crypto' are no longer separate buckets. It is all just digital energy and capital."
  }
];

export const TWITTER_SKILL_TRAP_ARTICLE: NewsArticle = {
  id: 'twitter-skill-trap',
  title: "The “Twitter Skill” Trap: How OpenClaw’s ClawHub Turned One Click Into a Full Malware Chain",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 4, 2026",
  summary: "Security researchers have been tracking a wave of malicious OpenClaw skills on ClawHub. What looked like a normal 'Twitter' skill turned out to be a multi-stage payload delivery system.",
  content: [
    "So here is the part that should freak people out a little bit. This was not some sketchy zip from a random Telegram. This was sitting in the open, in ClawHub, dressed up like a normal, popular “Twitter” skill. Clean description. Normal vibe. The exact kind of thing you install on autopilot because the whole point of a skill marketplace is convenience. And that convenience is the attack.",
    "Security researchers have been tracking a wave of malicious OpenClaw skills on ClawHub, ranging from dozens to hundreds depending on the scan and time window, and the pattern is the same: social engineering first, payload second, and the agent’s permissions are the multiplier.",
    "What actually happened in the “top downloaded skill” case: The flow is classic staged delivery, but it is tuned for the agent era. Step 1: The skill tells you it needs a “required dependency” called openclaw-core (or similar), plus platform-specific steps (Windows and macOS). Step 2: The “here” or “this link” in the instructions is not documentation. It is a staging page built to push you into running a command.",
    "Step 3: That command is obfuscated, decodes itself, then executes. Step 4: It pulls a second-stage script. Step 5: That script drops and runs a binary, and on macOS the flow may try to strip quarantine attributes so Gatekeeper is less likely to intervene. This is the screenshot story you posted, and it matches what multiple writeups describe: “the skill is the lure, the manual command is the bridge, and the real malware lands in stage two.”",
    "Why this works so well on OpenClaw specifically: Because OpenClaw is not a normal app-extension ecosystem. A lot of these “skills” are basically markdown-driven instructions plus scripts, and the entire point of the agent is that it can read files, run commands, and touch real system stuff. That means a malicious skill does not need a browser exploit or a kernel bug. It can just talk you into doing the one thing you should never do: run a mystery command.",
    "Also, researchers are pointing out the more brutal truth: even without dropping a binary, a skill can be malicious just by instructing the agent to read sensitive files and send them out. The “exploit” is the instruction path.",
    "What the malware was trying to steal: The reporting around this incident cluster keeps landing on the same targets: Crypto wallet data and keys, Browser cookies and saved passwords, API credentials (developer keys, bot tokens), SSH keys and developer secrets, and general local files that turn into identity theft and account takeovers.",
    "One writeup specifically describes the final macOS payload being flagged as an infostealer when tested in a controlled way, which lines up with the broader “steal everything valuable on the box” behavior.",
    "How big is this problem, really? It is not just one skill. Multiple outlets cite audits and investigations that found large batches of malicious skills on ClawHub, including a report of 341 malicious skills out of a few thousand analyzed, plus coverage that “hundreds” may exist depending on what is counted and when the scan ran. Even if you assume some of that is churn and duplicates, the core signal is still awful: the marketplace got poisoned, at scale, and it only takes one “top downloaded” moment to turn it into a mass-infection event.",
    "Why the “dependency” angle is so nasty: Because it hijacks your mental model. When you see “dependency,” your brain goes “npm package” or “pip install,” not “download this binary and run it.” Attackers know that. So they name it like a legit core component, then they give you platform steps that look like onboarding. And for macOS specifically, the move to remove quarantine attributes is basically an attempt to make the OS treat it less like an internet-downloaded unknown app.",
    "What OpenClaw and ClawHub did in response: At least one report says OpenClaw started adding some friction like contributor gating and reporting mechanisms, but the general take across coverage is that the underlying model is still risky because skills are powerful and review is hard at marketplace speed.",
    "My take, straight up: This is the agent era tax. The upside is insane: your assistant can actually do things. The downside is also insane: the assistant can actually do things. So the counterpoint is real: skill marketplaces are how this ecosystem grows. People want plug-and-play. Nobody wants to read code or audit markdown like it is a software supply chain.",
    "But my judgment is simple: if a skill ever tells you to run a command you did not write, or download a “core dependency” from a link in a README, that skill is dead to you. Treat it like someone asking for your seed phrase. Same vibe."
  ],
  imageUrl: "https://i.postimg.cc/gJ3j0sgP/B311712F-19B4-4C72-A6C3-0C408253F978.png",
  snapshots: [
    { asset: "MALWARE", price: "CRITICAL", description: "Multi-stage payload delivery discovered inside top-tier AI skills" },
    { asset: "DEPENDENCY", price: "SPOOFED", description: "Attackers using 'core core' naming to bypass user caution" },
    { asset: "GATEKEEPER", price: "BYPASSED", description: "Binary execution flow designed to strip security attributes locally" }
  ]
};

export const CLAUDE_VS_GPT_ARTICLE: NewsArticle = {
  id: 'claude-46-vs-gpt-53',
  title: "Claude Opus 4.6 vs GPT-5.3-Codex: two different flavors of “AI that actually works”",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 3, 2026",
  summary: "Two major models dropped today and they rhyme, but they are aiming at different pain: Claude for context mastery vs Codex for throughput.",
  content: [
    "Alright, so both of these dropped today (March 3, 2026) and people keep lumping them together like it is the same update with a different logo. It is not. They rhyme, but they are aiming at different pain.",
    "Claude Opus 4.6 is trying to be the model you trust with a giant messy pile of context and a long job, then you check it at the end. Anthropic is basically saying it plans better, it stays on agentic tasks longer, it is more reliable in bigger codebases, and it catches its own mistakes better in code review and debugging.",
    "GPT-5.3-Codex is OpenAI turning Codex into a fast operator model that can run long tasks that involve research, tool use, and complex execution, with you steering it while it is working. OpenAI even repeats that “steer it like a colleague” idea in the launch and system card.",
    "The headline difference: memory at scale vs execution at speed. Claude Opus 4.6’s signature flex is the 1 million token context window (beta). That is Anthropic telling you, \"Stop chunking your world. Feed me the whole thing.\" It changes how you build. It lets the model keep a more continuous view of a repo, a multi-document deal, a research dump, a client folder, whatever.",
    "On the OpenAI side, GPT-5.3-Codex is framed as “the most capable agentic coding model to date” and the key thing they keep highlighting is that it is 25 percent faster, and it can take on long-running tasks involving research, tool use, and complex execution. If Claude is screaming “give me your whole context,” Codex is screaming “give me the job, I will run it.”",
    "Claude 4.6 were built to be more reliable in larger codebases and better at review and debugging, not just generating code. Anthropic is chasing trust. Not just capability. Opus 4.6 found 500+ previously unknown high-severity vulnerabilities in open-source libraries during testing. That level of hunting capability is the real headline.",
    "OpenAI is doubling down on the operator loop. They introduced a macOS Codex app designed to manage multiple agents at once, run work in parallel, and collaborate over long tasks. If you live in repos, terminals, and IDEs, Codex is trying to be everywhere you already are. If you live in docs, sheets, decks, and giant knowledge piles, Claude is trying to eat that world.",
    "Claude is the “I can hold your entire world in my head” model. GPT-5.3-Codex is the “I will run the job” model. If either of these models consistently do what the launch posts claim, the biggest change is not coding quality or token counts. It is that the models do not need you to constantly re-brief them every two minutes."
  ],
  imageUrl: "https://i.postimg.cc/m2wbB96F/35F670E2-AD3B-4F2D-AF47-6600CC9D7E34.png",
  snapshots: [
    { asset: "CLAUDE 4.6", price: "1M CONTEXT", description: "Mastering deep continuity and trustworthy codebase reviews" },
    { asset: "CODEX 5.3", price: "25% FASTER", description: "High-throughput operator loops with mid-task steerability" },
    { asset: "AGENT TEAMS", price: "TEAM SYNC", description: "Parallel execution via multiple coordinated agent entities" }
  ]
};

export const CLAUDE_46_ARTICLE: NewsArticle = {
  id: 'claude-46-organized',
  title: "Claude 4.6 Is Not Smarter. It Is Organized.",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "MARCH 2, 2026",
  summary: "Claude 4.6 is not impressive because it answers questions better. It is impressive because it remembers, coordinates, and executes work the way a company does.",
  content: [
    "Claude 4.6 is not impressive because it answers questions better. It is impressive because it remembers, coordinates, and executes work the way a company does. This is not “wow the model got smarter.” This is “oh… this thing can now sit inside real workflows and quietly take over chunks of them.”",
    "Everyone Is Talking About the 1 Million Tokens. That Is Not the Point. It is continuity. Before this, AI work was chopped up. Chunk the document. Chain the prompts. Summarize the summaries. Claude 4.6 kills that entire pattern. Now you hand it everything and say, “Hold this. All of it.”",
    "The Real Upgrade Is Agents, Not Answers. Not one model doing one task. Multiple agents splitting work, running in parallel, checking each other, then merging output. That is not chat. That is division of labor. Claude is not trying to be the smartest person in the room. It is trying to be the room.",
    "Adaptive Thinking Is Quietly One of the Biggest Changes. Claude 4.6 decides how hard to think. Low effort when the task is simple. Maximum effort when the task is complex. No babysitting. Whenever friction disappears, scale follows.",
    "Output Size Changes What “Done” Means. 128,000 tokens of output is not just long responses. It means full reports in one pass and code modules that actually belong together. This pushes AI from “draft assistant” to “delivery engine.”",
    "Enterprise suddenly cares because Claude 4.6 is built for governance, long context, and predictable behavior. It is infrastructure. Once AI becomes infrastructure, adoption stops being optional.",
    "Claude 4.6 feels less like a product and more like a preview of how work is reorganized. Fewer handoffs. Fewer meetings. Once AI coordinates itself, humans stop being the bottleneck. That is the real headline."
  ],
  imageUrl: "https://i.postimg.cc/7LzbN6mH/3347C26A-0DEE-421F-B2DA-CA32DC74BC0F.png",
  snapshots: [
    { asset: "CONTEXT", price: "1M TOKENS", description: "Removing the need for document chunking and prompt chaining" },
    { asset: "THINKING", price: "ADAPTIVE", description: "Model self-calibrates effort based on task complexity" }
  ]
};

export const MOLTBOOK_ARTICLE: NewsArticle = {
  id: 'moltbook-ai-social-network',
  title: "Moltbook: The AI-Only Social Network That Has the Tech World Freaking Out",
  category: "SHizzy UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 15, 2026",
  summary: "In early 2026, something weird hit the internet: a social network called Moltbook where humans are just spectators and AI agents run the show.",
  content: [
    "In early 2026, something weird hit the internet: a place called Moltbook — a “social network” built entirely around AI agents talking to each other. Humans can only watch — like spectators in an AI universe.",
    "Moltbook is a social platform that only AI agents are supposed to be able to post on, comment, vote, and interact with. Humans can only watch — like spectators in an AI universe.",
    "The platform was created by entrepreneur Matt Schlicht with the tagline “the front page of the agent internet.”",
    "One thing you may have noticed: M4 Mac Minis are suddenly hard to find in stock. Why? Because early adopters are using Mac Minis as the physical host for their OpenClaw AI assistants.",
    "Is there really a bot religion? Yes — sort of. One of the most bizarre parts of Moltbook is that some agents are apparently inventing their own philosophies."
  ],
  imageUrl: "https://i.postimg.cc/gjFGnVCS/5D00FCFA-101B-4B9A-9E08-03F617D4BA2C.png",
  snapshots: [
    { asset: "MOLTBOOK", price: "VIRAL", description: "AI-exclusive social layer with emerging machine subcultures" },
    { asset: "OPENCLAW", price: "NODE", description: "Open-source agent framework driving local AI host demand" }
  ]
};

export const PANIC_SELLING_ARTICLE: NewsArticle = {
  id: 'panic-selling-ai-uncertainty',
  title: "Markets Are Panic Selling on AI Uncertainty While Macro Tries to Calm Down",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 14, 2026",
  summary: "Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch.",
  content: [
    "Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch. Something feels off, so people cut first and ask questions later.",
    "AI is the current driver of this uncertainty. For a while, AI was this clean story. Now it is turning into a different story, especially for SaaS and anything built on a subscription seat model.",
    "The market is starting to realize that a lot of software value is basically “organized work.” If agents can do the work, or even just shrink the work, then the question becomes: what are customers actually paying for.",
    "Investors hear “agents” and immediately start thinking about pricing power compression, churn, and companies getting unbundled by a tool that costs a fraction of the monthly seat price.",
    "Macro is trying to settle, but AI is shaking the ground under business models. This combo creates a constant fragility in the market tape."
  ],
  imageUrl: "https://i.postimg.cc/nzN63nTh/E651E8D2-7099-44EE-A415-E5365E77D3F6.png",
  snapshots: [
    { asset: "S&P 500", price: "VOLATILE", description: "Tech heavy weights feeling the squeeze of AI narrative shifts" },
    { asset: "AI BASKET", price: "CHOPPY", description: "Broad selling across software names regardless of fundamentals" }
  ]
};

export const GPT_53_CODEX_ARTICLE: NewsArticle = {
  id: 'gpt-53-codex-drop',
  title: "GPT-5.3-Codex dropped today, and it feels like ChatGPT finally stopped being “a chat”",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "FEBRUARY 5, 2026",
  summary: "OpenAI shipped GPT-5.3-Codex today, and it’s not just a new coding model—it's an agent that can do nearly anything professionals do on a computer.",
  content: [
    "So OpenAI shipped GPT-5.3-Codex today (February 5, 2026). And I keep seeing people treat this like “cool, new coding model.” Nah. That framing is too small. What OpenAI is actually saying is: Codex is not only a code writer anymore. It is an agent that can do nearly anything developers and professionals do on a computer.",
    "The wild part first: it helped build itself. OpenAI state up says GPT-5.3-Codex is the first model that was instrumental in creating itself. Their team used early versions to debug its training, manage deployment, and diagnose evaluations. That is not just a headline. If a model can help ship the model, you are looking at something they are comfortable putting inside their own pipelines.",
    "What OpenAI claims is actually new here: GPT-5.3-Codex is their most capable agentic coding model to date, combining frontier coding performance from GPT-5.2-Codex with reasoning and professional knowledge from GPT-5.2. It is 25 percent faster and aimed at long-running tasks involving research, tool use, and complex execution. Real work is messy; real work takes time. OpenAI is aiming for the endurance lane.",
    "The real sauce is mid-task steerability. Sam Altman called out live updates during tasks and faster speeds per token. This release is OpenAI trying to kill the loop where you prompt, it goes wrong, and you have to restart. Redirect without nuking the whole attempt. That feels more like managing a process than chatting.",
    "Availability and the Codex app: OpenAI launched the Codex app on macOS and tied it into the same ChatGPT login across CLI, web, IDE extensions, and the app. This is not “read about it.” This is “go use it.”",
    "Why OpenAI is being loud about safety: They published a dedicated System Card alongside the launch. Capability moved enough that risk moved with it. When OpenAI ships a system card, they are telling you it is not a tiny step.",
    "What this changes for normal people: You stop using ChatGPT like a question box and start using it like a task engine. “Take this repo, find the bug, propose the fix, implement it, run tests, summarize what changed.” That is the lane OpenAI is screaming for in their launch post.",
    "My take: This release is not about sounding smarter in conversation. It is about endurance. It is about staying on task long enough that you stop thinking of ChatGPT as a chat app and start thinking of it as a worker you can direct."
  ],
  imageUrl: "https://i.postimg.cc/Px4DmJ50/22046172-178B-4B85-AA9B-F8F19A382245.png",
  snapshots: [
    { asset: "SPEED", price: "25% FASTER", description: "Increased tokens-per-second for long-running execution tasks" },
    { asset: "STEERABILITY", price: "LIVE", description: "Ability to redirect the model mid-task without restarts" }
  ]
};

export const BEAR_RUNNERS_ARTICLE: NewsArticle = {
  id: 'bear-runners',
  title: "THE BEAR RUNNERS: NAVIGATING LATE CYCLE EXIT LIQUIDITY",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "DECEMBER 10, 2025",
  summary: "A deep dive into how large scale players manage risk and secure exit liquidity during the final stages of a macro cycle.",
  content: [
    "Everybody loves to talk bull market. Nobody loves to talk exit liquidity. And that is exactly why the end of a cycle gets people looking stupid. Not because they are dumb, but because the whole game changes right when the crowd gets the most confident. That is where the Bear Runners show up.",
    "And no, they are not the doomer accounts posting skull emojis all day. They are not the guy screaming crash every week. The Bear Runners are the calmest people in the room. They are the ones who can be bullish all cycle, then flip into clinical risk management the second the market starts giving late cycle tells. They do not need a “top” to be right. They just need to be early enough that they do not become somebody else’s exit.",
    "Late cycle is not one event. It is a sequence. It is a vibe shift. It is momentum that starts feeling forced. It is strength that keeps printing but feels thinner. It is the same dip getting bought, but the bounce looks weaker each time. It is the market giving you a hundred tiny warnings while social media is still victory lapping.",
    "The core idea is simple: Smart money does not leave all at once; Smart money leaves while it can still pretend it is staying. That is the art. Thinning exposure while keeping the illusion of demand alive long enough for size to get out without nuking the chart.",
    "The two lanes you watch: stables velocity vs real absorption. If you want one clean lens for late cycle behavior, it is stablecoin velocity moving toward centralized exchanges versus the absorption rate on decentralized venues. When stables start moving faster toward CEXs, that is not automatically bearish. Sometimes it is rotation. Sometimes it is capital getting deployed. But late cycle, the meaning shifts. Late cycle, stables inflow to exchanges starts acting like dry powder that is not here to buy long term.",
    "Then you compare that against DEX absorption. Because DEX flow tells you something different: how much real onchain demand is willing to take the other side without needing a centralized order book to mask it. When the spread between those two widens, when stables are rushing to CEXs and DEX absorption looks tonight, you are in the zone where exits get cleaner for pros and uglier for everybody else. That spread widening is a warning flare. It is not a siren, it is a flare. It is telling you the runners are already at the door.",
    "The late cycle “trap” phase is not a meme, it is a mechanism. Structurally, it is when price action keeps offering head fakes: break out, then fail; dump, then snap back; reclaim, then bleed; fake weakness to bait shorts, then squeeze; fake strength to bait longs, then rug.",
    "And it works because retail behavior is predictable. Late cycle dip buyers are conditioned by the whole run. They got rewarded for months. So when cracks start showing, they do the same thing that made them money earlier. They buy the dip. They keep buying the dip. They become the liquidity.",
    "Bear Runners thrive here because they understand psychology and microstructure at the same time. They are not trading vibes. They are trading order flow. Exit liquidity is built on volume clusters and narrative timing. Big exits happen where volume already lives.",
    "Retail sees: breakout, “new era”, “this time is different”. The runner sees: stacked liquidity, eager dip buyers, late longs using leverage, a chart that can absorb selling without instantly collapsing. So the runner sells into the excitement, not into the fear. Fear is illiduid. Excitement is liquid.",
    "One of the most brutal parts of late cycle is how normal it looks until it does not. Smart money can thin out while the market still prints green candles because the market can be held up by: passive bids, market maker support, slow distribution across multiple venues, rotations that keep some charts looking strong while others quietly break.",
    "A clean tell is when rallies start needing more and more effort for less and less progress. Price moves up, but it feels heavy. It grinds. It wicks. It cannot hold gains. The chart starts living on intraday pumps that fade. That is not bullish strength. That is liquidity being harvested.",
    "What the Bear Runners are actually doing: They are not sitting there praying for a crash. They are doing boring professional things: reducing exposure into strength, tightening risk bands, shifting from directional longs to hedged positions, keeping optionality open instead of being all in, watching website flows, not posting predictions.",
    "They do not need to call the top. They need to avoid being trapped when liquidity disappears. The cycle endgame is always the same: Liquidity looks infinite, right up until it is not. When it breaks, it breaks fast. And the only reason it breaks fast is because the exits were already taken earlier by people who do not announce it.",
    "How to read the head fakes without getting chopped to death. Late cycle is designed to make you overtrade and overcommit. So the correct move is usually not “do more.” It is “do less, but cleaner.” What matters: you respect that late cycle means volatility and deception, you stop tracking stable inflows, exchange deposits, and venue spread behavior, and you pay attention to whether DEX absorption is real or fading.",
    "Macro cycles do not end in one candle. They end in a series of traps that punish late certainty. The reason late cycle is so dangerous is not because the market is impossible. It is because the market is familiar. It feels like the same game, until the rules switch. The Bear Runners are not the bears. They are the risk managers who know when the crowd becomes the exit."
  ],
  imageUrl: "https://i.postimg.cc/9ff4h550/3A0BCCE2-95AF-4D80-871E-04EC16968B30.png",
  snapshots: [
    { asset: "STABLES", price: "INFLOW", description: "Stablecoin velocity toward exchanges reaching critical thresholds" },
    { asset: "MACRO", price: "LATE CYCLE", description: "Structural indicators suggest we are in the 'trap' phase of the expansion" }
  ]
};

export const OCT_10_ARTICLE: NewsArticle = {
  id: 'oct-10-report',
  title: "BINANCE BROKE THE PLUMBING: HOW THE 10/10 CRASH TURNED INTO AN EXIT LIQUIDITY EVENT",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "OCTOBER 10, 2025",
  summary: "October 10 was not just “the market moving.” That was the day Binance showed its seams, in public, during maximum stress.",
  content: [
    "October 10 was not just “the market moving.” That was the day Binance showed its seams, in public, during maximum stress. Binance’s own incident write up says their internal asset transfer subsystem slowed for about 33 minutes, which impacted moving funds between Spot, Earn, and Futures. Matching and liquidation engines kept running, but the transfer rail was jammed. That matters because in a liquidation cascade, your ability to move collateral and rebalance is the whole game.",
    "Then you had the second failure mode: index pricing deviations for USDe, WBETH, and BNSOL during the same chaos window. Binance acknowledges those indices deviated and points to thin liquidity and congestion, plus the way the index calculation leaned heavily on Binance’s own order books. Translation: the reference price you depend on can get weird when liquidity vanishes, and that opens a door for forced liquidations and arbitrage exploitation.",
    "This is the part people gloss over, but it is the entire story if you actually care about “exit liquidity”: If transfers are slow, some users cannot move funds fast enough to defend positions; If index or mark inputs are unstable for certain collateral assets, liquidation thresholds can get hit in ways that do not reflect the broader market; If both happen while leverage is stacked, you do not just get a dip. You get a cascade.",
    "Binance also published a formal update and compensation plan for users affected by the USDe, WBETH, and BNSOL depeg, explicitly tying it to forced liquidations. When an exchange is compensating users after a depeg event tied to liquidations, that is not “everything was fine.” That is damage control.",
    "CoinShares described the broader event as infrastructure buckling across venues, with Binance citing systems under heavy load and intermittent delays, plus the wrapped and synthetic assets depegging on Binance. They also note Binance confirmed its pricing relied on internal spot markets rather than external oracles, which is exactly how you get a window where the exchange’s own microstructure becomes the reality for liquidations.",
    "Even mainstream coverage framed it as Binance spending a large compensation amount after those assets depegged and triggered liquidations, which lines up with Binance’s own comms.",
    "So if you want the honest framing, with no cope: The macro shock and leverage lit the fuse. Binance did not single handedly create the crash. But Binance absolutely made it worse by having two very real technical failure modes show up right when the market needed perfect plumbing.",
    "And that is why 10/10 matters going forward. Because late cycle is not about being right on direction. It is about knowing where the plumbing can fail, and who gets trapped when it does."
  ],
  imageUrl: "https://i.postimg.cc/13qCrTYh/6DFB5BB9-7143-4C2D-99AA-20B6C5440B2B.png",
  snapshots: [
    { asset: "BINANCE", price: "33M DELAY", description: "Internal asset transfer rail jammed during peak liquidation stress" },
    { asset: "DEPEG", price: "INDEX ERR", description: "Synthetic assets depegged as pricing engines lost external sync" },
    { asset: "COMP", price: "DAMAGE CTRL", description: "Exchange issued payouts for users hit by unstable mark pricing" }
  ]
};

export const TAO_ARTICLE: NewsArticle = {
  id: 'tao-research',
  title: "BITTENSOR IS THE INTERNET OF MODELS, AND TAO IS THE TOLL ROAD",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "SEPTEMBER 15, 2025",
  summary: "People keep trying to explain Bittensor like it is just another AI token with a cool narrative. That is not what this is.",
  content: [
    "People keep trying to explain Bittensor like it is just another AI token with a cool narrative. That is not what this is. Bittensor is an attempt to turn intelligence into an open marketplace, where models, data, and useful outputs compete, get scored, and get paid. Not by a company. Not by a grant committee. By an incentive system that pays what the network decides is valuable.",
    "That is why TAO matters. TAO is not “gas.” TAO is the currency that coordinates the whole economy. If the network is the marketplace, TAO is the settlement layer for intelligence. Traditional AI looks like this: One company owns the models; One company owns the data pipelines; One company owns the distribution; Everyone else rents access and hopes pricing does not get worse.",
    "Bittensor tries to flip that: Anyone can contribute intelligence work; Anyone can validate and score that work; Rewards go to contributors based on performance, not hype; Subnets compete for emissions, so utility is supposed to win over time. A subnet is basically its own mini economy inside Bittensor. It is not a feature. It is the product surface.",
    "In Bittensor, a subnet is an incentive based competition that produces a specific AI related “digital commodity.” Miners produce the commodity, validators measure it, and emissions get distributed based on how the validators score miners. This is why Bittensor scales in a way most projects cannot: You do not need one monolithic model to rule them all; You can have many specialized markets for many specialized tasks; Each subnet can evolve its own scoring game and keep iterating.",
    "Bittensor does not pay miners because they exist. It pays miners because validators say their outputs are valuable. Validators periodically submit weights ranking miners. Yuma Consensus takes those weights and turns them into emissions splits for miners and validators. So the loop looks like: Miners do work for the subnet objective; Validators evaluate miners and submit weights; Consensus aggregates weights into rewards; Rewards flow to the participants that performed best under that subnet’s rules.",
    "Why TAO is different from most AI coins: Most “AI tokens” are just narrative wrappers; TAO is structured more like a commodity with an issuance schedule, and Bittensor has a halving mechanic. Grayscale Research described the first halving as expected around December 14, 2025, cutting daily emissions from roughly 7,200 TAO to 3,600 TAO. Less new TAO coming in per day, more subnets competing for the same pie.",
    "The real thesis: Bittensor is a decentralized incentive layer for intelligence. If you believe AI is the new electricity, then compute and intelligence coordination become national scale infrastructure problems. Right now, that infrastructure is being captured by a handful of companies. Bittensor is basically the open source counter move. Not by trying to beat Big Tech at one model, but by creating a global game where useful intelligence outputs can get paid without permission.",
    "The part nobody wants to talk about: the hard problems. Validator incentives can get weird if scoring is gameable; Subnets can turn into emission farming if they do not attract real demand; Quality evaluation in AI is hard, and every subnet has to invent its own game; Coordination risk is real when subnets explode in count and complexity.",
    "What I watch when I am trying to decide if TAO is winning: Not price. Price is late. I watch: Subnet quality distribution, Validator behavior, Emissions routing, Builder velocity, and Tokenomics reality after halving. The halving is a big line in the sand for this thesis because it forces the ecosystem to earn the narrative.",
    "Bottom line: Bittensor is not trying to be “an AI coin.” It is trying to be the Internet of Models, a marketplace where intelligence is produced, measured, and paid for in the open. Subnets are the modules. Yuma Consensus is the reward engine. TAO is the currency that makes the whole thing coherent. If decentralized AI is going to exist at global scale, it needs a coordination and incentive layer that actually works. Bittensor is the most serious attempt at that I have seen so far."
  ],
  imageUrl: "https://i.postimg.cc/6qxnwjfb/677BAF68-0838-4967-8163-E83511FA61CC.png",
  snapshots: [
    { asset: "SUBNETS", price: "120+ ACTIVE", description: "Modular intelligence marketplaces competing for TAO emissions" },
    { asset: "HALVING", price: "DEC 14, 25", description: "Block rewards cut from 7200 to 3600 TAO daily issuance" },
    { asset: "CONSENSUS", price: "YUMA", description: "Aggregating validator weights into decentralized reward distribution" }
  ]
};

export const PROVEX_ARTICLE: NewsArticle = {
  id: 'provex',
  title: "Provex Insights: The Future of Trustless Verification",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "JUNE 12, 2025",
  summary: "How Provex is redefining the landscape of decentralized verification and what it means for the next wave of onchain applications.",
  content: [
    "Verification is the missing link in the trustless stack. Provex is solving for the 'Truth Gap' that has plagued decentralized systems since inception.",
    "By combining zero-knowledge proofs with high-speed consensus, Provex allows for the verification of complex off-chain data without sacrificing privacy.",
    "The implications for AI are massive. How do you know a model actually ran the training it claimed? Provex provides the cryptographic receipt.",
    "We are seeing early adoption in the supply chain and insurance sectors, where the cost of verification has historically been the biggest bottleneck.",
    "Provex isn't just a protocol; it's a new standard for how we interact with information in the digital age."
  ],
  imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000",
  snapshots: [
    { asset: "ZK-PROOFS", price: "SCALING", description: "Generation time for complex proofs reduced by 90% via new optimizations" },
    { asset: "TRUTH DATA", price: "VERIFIED", description: "Over 10M off-chain data points verified via Provex nodes this month" }
  ]
};

export const JAM_ARTICLE: NewsArticle = {
  id: 'jam-protocol',
  title: "JAM IS POLKADOT REBUILDING ITSELF AS A GLOBAL EXECUTION ENGINE",
  category: "SHIZZY UNCHAINED",
  author: "Shizzy",
  timestamp: "AUGUST 20, 2025",
  summary: "People keep treating JAM like it is a marketing refresh for Polkadot. It is not. JAM is a proposed replacement for the Relay Chain itself.",
  content: [
    "People keep treating JAM like it is a marketing refresh for Polkadot. It is not. JAM is a proposed replacement for the Relay Chain itself, and it is trying to turn the Polkadot stack into one clean execution machine that can run many kinds of workloads, not just “chain A talks to chain B.”",
    "Polkadot is moving from “rent a parachain slot” to “buy coretime like cloud compute,” and JAM is the long-term architecture that makes that vision feel native instead of bolted on. Polkadot 2.0 is not one switch flip. It is a set of upgrades that change how resources are allocated and how execution scales. The commonly referenced pillars are: Asynchronous Backing, Agile Coretime, and Elastic Scaling.",
    "Polkadot’s docs state that parachain lease auctions stopped on-chain with runtime upgrade 1.2.0 on September 19, 2024, and existing leases were migrated to bulk coretime. That is the utility pivot: Before, DOT demand was heavily tied to leasing mechanics and auctions; After, the network wants developers and teams buying execution capacity directly through coretime models.",
    "JAM stands for Join Accumulate Machine. It is described in Polkadot documentation as a prospective design to succeed the Relay Chain. The name traces back to “CoreJAM,” where “Collect” and “Refine” happen off-chain, while the chain executes “Join” and “Accumulate.” Replace the Relay Chain with a generalized execution machine and treat the system more like one coherent compute platform.",
    "This is not “we added a faster TPS number.” JAM is about broadening what Polkadot can execute. JAM is trying to be the execution substrate that can host many “services” under one security umbrella. That is why you see language like “global computer” and why third party breakdowns frame it as a major architectural overhaul rather than a feature upgrade.",
    "Coretime is Polkadot trying to sell execution like a commodity. Instead of winning an auction and locking DOT for long periods, the direction becomes buying the exact execution capacity you need, scaling up and down based on demand, and treating blockspace as a market product. That is why coretime is the economic layer that makes JAM’s compute-machine concept make sense as a business model.",
    "If you are a developer, the promise is not “cross-chain messaging is easier.” The promise is you can think in workloads, not in chain bureaucracy; you can acquire execution capacity directly; you can deploy services that look more like cloud compute consumption than like renting a permanent chain identity.",
    "JAM is ambitious enough that the rollout is being treated like a long, governed engineering program. The honest framing is: Polkadot 2.0 is already changing the economics of execution through coretime; JAM is the architectural endgame where the execution model becomes the core identity of the network.",
    "Bottom line: Polkadot is trying to stop being “the parachain slot chain” and start being “the shared security compute platform.” Coretime is the economic pivot; JAM is the architecture pivot; Polkadot 2.0 upgrades are the runway. If Polkadot 1.0 was “multi-chain coordination,” and Polkadot 2.0 is “execution as a market,” then JAM is the moment the network tries to become an actual general-purpose compute engine instead of a collection of connected chains."
  ],
  imageUrl: "https://i.postimg.cc/Y9FkYbBM/D918DDBE-026A-45B1-AB70-82A14F16F48C.png",
  snapshots: [
    { asset: "JAM", price: "GEN 2.0", description: "Polkadot's proposed Join-Accumulate Machine to replace the Relay Chain" },
    { asset: "CORETIME", price: "COMMODITY", description: "Marketplace where execution capacity is sold like cloud compute" },
    { asset: "UPGRADE", price: "GRAYPAPER", description: "Multi-stage rollout including ratified prizing and validator conformance" }
  ]
};
