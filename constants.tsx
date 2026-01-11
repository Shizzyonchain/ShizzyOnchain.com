
import { CoinData, HotStory, NewsArticle } from './types.ts';

export const INITIAL_COINS: CoinData[] = [
  { symbol: 'XRP', price: 2.10, change: -1.35 },
  { symbol: 'BNB', price: 898.75, change: 0.75 },
  { symbol: 'SOL', price: 136.10, change: -2.08 },
  { symbol: 'TRX', price: 0.2982, change: 1.35 },
  { symbol: 'STETH', price: 3082.87, change: -0.94 },
  { symbol: 'DOGE', price: 0.1401, change: -1.65 },
  { symbol: 'FIGR_HELOC', price: 1.03, change: -0.12 },
  { symbol: 'BTC', price: 90799, change: -2.0 },
  { symbol: 'ETH', price: 3145, change: -3.3 }
];

export const SOCIAL_LINKS = {
  x: 'https://x.com/Shizzy',
  youtube: 'https://www.youtube.com/@OnChainRevolution',
  logo: 'https://i.imgur.com/OlBqAPC.png',
  website: 'https://onchainrevolution.io/'
};

export const OCT_10_ARTICLE: NewsArticle = {
  id: 'oct-10-downward-spiral-detailed',
  title: "Shizzy’s Hot Take: What Really Happened on 10/10 and Why Q4 Was an Absolute Downward Spiral",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 11, 2026",
  summary: "October 10, 2025 was not “just another red day.” It was a chain reaction where a trad-fi style headline hit a crypto market that was already stretched thin, and the entire system fell into a forced-sell feedback loop.",
  content: [
    "October 10, 2025 was not “just another red day.” It was a chain reaction where a trad-fi style headline hit a crypto market that was already stretched thin, and the entire system fell into a forced-sell feedback loop.",
    "The missing spark matters: MicroStrategy headline risk hit the tape with talk that it could be removed from MSCI indices. Whether it was confirmed, misread, or amplified, the market treated it like a forced-selling event. The idea alone was enough to flip the first domino: systematic flows, hedging pressure, and “front-run the rebalance” behavior that can turn a rumor into real selling. And once that first wave started, crypto did what crypto does when leverage is stacked: it turned a spark into a cascade.",
    "This article is built from one core thesis: When the market broke and market makers could not reliably access APIs or maintain normal quoting, liquidation engines kept firing anyway. So who bought the assets being liquidated? The only entities capable of absorbing that size of forced selling in a no-bid environment were the exchanges themselves, or someone operating with exchange-level balance sheet and privileged access.",
    "Then, over the next few months, that emergency risk had to be unwound into illiquid conditions, creating the signature Q4 pattern: every bounce got sold, every rally looked sponsored, and the tape felt like a program exiting a position, not a crowd changing its mind.",
    "1) The 10/10 setup was fragility, not fear. Crypto going into that window had a familiar cocktail: Crowded leverage, especially on perps. A market trained to buy dips because prior dips worked. Thin real spot liquidity relative to derivative size. A lot of positioning that assumed continuous two-sided markets. That last point is everything. Leverage only “works” when you can exit smoothly. The second exit liquidity disappears, leverage becomes a trap door.",
    "2) The spark: MicroStrategy, index talk, and the first forced flow. The MicroStrategy MSCI narrative mattered because it is a trad-fi style trigger with trad-fi style consequences: If a stock is removed from an index, index-linked funds can be forced to sell it. Even before any actual rebalance, traders front-run the possibility. Market makers hedge aggressively, which can create mechanical selling pressure. Correlated hedges spill over, especially into Bitcoin proxies and risk baskets. Crypto does not need that headline to be “the whole reason.” It only needed it to start the first wave. Once the first wave hits an over-levered derivatives stack, the liquidation math takes over.",
    "3) The moment the market stopped being a market. A normal selloff is negotiation. A liquidation cascade is not negotiation. It is forced execution. Liquidation engines do not care about sentiment, they care about thresholds. When margin limits break, positions close. If the market is thin, the closes get worse prices, which triggers more closes, which worsens price again.",
    "Now add the critical twist: Market makers could not reliably access APIs, or could not maintain quoting during the most chaotic minutes. That can happen for a few reasons: Exchange stress and throttling, API instability, Risk systems pulling quotes because the market becomes unpriceable, Latency and desync that make arbitrage impossible. When that happens, the normal stabilizers vanish: Market makers stop quoting tight spreads, Arbitrage bots stop keeping venues aligned, Liquidity becomes fragmented, Mark prices and execution prices can diverge in moments of chaos. That is when the liquidation engine becomes the market.",
    "4) The buyer-of-last-resort problem. Here is the simplest question nobody asks loudly enough: If everybody is being liquidated in a cascade and the professional buyers are shut out or standing down, who is the buyer? In a true cascade, there are only a few realistic buyers: Exchanges stepping in through internalization, backstop mechanisms, or balance-sheet risk. A tiny set of privileged liquidity providers with direct connectivity and absurd risk tolerance. A coordinated rescue, which is rare and usually leaves fingerprints.",
    "This is where your thesis gets sharp: If you saw a market with “no bid” behavior, yet liquidations continued at scale, somebody had to absorb inventory. If you are an exchange and your liquidation engine is firing into emptiness, you face an existential choice: Let the system print insane lows, blow up users, and potentially threaten confidence and solvency, or step in, stabilize execution, and warehouse risk temporarily. If you step in, you are not doing it because you want to. You are doing it because the alternative can be worse. So the working assumption becomes: Somebody took on an absurd amount of risk because they had to.",
    "5) Why Q4 looked like a program selling into every bounce. If an exchange, or an exchange-adjacent desk, ended up warehousing a mountain of inventory during the chaos, the aftermath is predictable: They have a position that they never wanted. They cannot dump it all at once without restarting the cascade. So they unwind it gradually when liquidity appears. That produces a very specific tape: Rally attempts stall at the same zones. You see repeated, heavy offers on strength. Every day looks like: sell a bunch, pause, sell a bunch again. Volatility stays elevated because supply is being “metered” into the market. The market stops feeling organic and starts feeling managed.",
    "This is not a conspiracy story. It is basic risk management. If you are stuck with a massive bag in an illiquid environment, you sell into the moments when buyers show up. You sell when the market “lets you.” That is exactly the phrase that explains Q4: the market would let them.",
    "6) The second-order damage: the traders who got liquidated were removed from the game. The most overlooked part of a cascade is not the price. It is the participant wipeout. When leveraged traders get liquidated: Their collateral is gone or severely reduced. Their confidence is wrecked. Their ability to provide buy pressure on dips disappears. Their risk tolerance collapses. So even if price bounces, the people who usually chase and buy are not there. That leaves a weaker market structure: Fewer aggressive dip buyers. More cautious spot buyers. More sellers on rallies, because trauma turns people into “get me out” participants. Less reflexive upside.",
    "7) Why the downside spiral persisted instead of bottoming fast. A clean V-bottom requires two things: Forced selling exhausts, and Natural buyers step in with size. On 10/10, forced selling did not just exhaust. It detonated. Then the natural buyers were compromised: Market makers had just seen the pipes fail, so they widened spreads and reduced risk. Leveraged traders were liquidated and sidelined. Spot buyers became hesitant because every bounce got sold. Volatility risk kept institutions conservative. Meanwhile, the presumed warehoused inventory still needed to exit.",
    "8) What really happened, in one clean narrative. Here is the full story stitched together: MicroStrategy MSCI headline risk hit, and the market treated it like a forced-flow event. That triggered systematic selling and hedging, which pushed crypto into a fragile leverage stack. Liquidation thresholds started breaking, forcing sales into thinning liquidity. Market makers lost reliable access or stepped back due to API stress and unpriceable risk. Liquidation engines kept firing, turning forced execution into the market itself. To prevent total disorder, exchanges or exchange-level actors absorbed inventory as buyer of last resort. That created a massive unwanted position. Over the following months, the position was unwound gradually whenever liquidity appeared. Meanwhile, liquidated traders were sidelined, removing the usual dip-buy demand. Result: Q4 became a controlled bleed, with rallies capped and downside resuming in waves.",
    "9) The takeaway for the next time the pipes clog. If this thesis is even directionally correct, the lesson is brutal and useful: In a cascade, price is not information. Price is forced behavior. When access fails, market structure matters more than fundamentals. The biggest risk is not “being wrong,” it is “not being able to exit.” After a wipeout, the market is weaker than it looks because buyers are gone. Unwinding overhead can cap upside for weeks or months, even if the worst is over. So when you see a day like 10/10, you do not ask “is this bullish or bearish?” You ask “did the pipes fail, and who just got stuck holding the bag?” Because that answer often explains the entire next quarter."
  ],
  imageUrl: "https://i.postimg.cc/T1Pm5Pc8/Copy-of-Can-PROVEX-(1).png",
  snapshots: [
    { asset: "MSTR TRIGGER", price: "MSCI INDEX", description: "The removal rumors that flipped the first macro domino" },
    { asset: "LIQUIDATIONS", price: "FORCED", description: "Mechanical selling that continued after liquidity providers withdrew" },
    { asset: "Q4 TREND", price: "PROGRAM SELL", description: "Managed unwinding of warehoused inventory into every bounce" }
  ]
};

export const AGENT_CYCLE_ARTICLE: NewsArticle = {
  id: 'agent-money-cycle-x402',
  title: "Shizzy Hot Take: x402 + ERC-8004 Is the Agent Money Cycle",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 11, 2026",
  summary: "DeFi took off when humans learned how to be their own bank. x402 and ERC-8004 can take off faster because humans are not the main users. Agents are.",
  content: [
    "DeFi took off when humans learned how to be their own bank. x402 and ERC-8004 can take off faster because humans are not the main users. Agents are. That is the difference. If DeFi was “wallets + apps + incentives,” this next leg is “agents + APIs + per call payments.” The distribution channel is not retail onboarding. The distribution channel is software that already runs everything.",
    "x402 is the cleanest idea in crypto in years: make HTTP 402 “Payment Required” real. The flow is simple: An agent calls an API. The server replies “402” with the price and terms. The agent pays in stablecoins. The agent retries and gets the resource. No subscription. No account. No invoice. No payment portal. No human clicking a checkout button.",
    "x402 turns the internet into a vending machine for compute, data, storage, and actions. If you understand usage based pricing, you understand x402. It is usage based pricing that agents can execute automatically. ERC-8004 is the missing trust layer for the agent economy. Payments do not matter if the buyer cannot answer: Who is this agent? What has it done before? Can I verify the work? What happens if it lies?",
    "ERC-8004 pushes a simple structure: Identity (a portable agent identifier), Reputation (standardized feedback signals), and Validation (pluggable proofs and verification paths when the stakes increase). Think “agent registry + receipts + optional proof.” It is not trying to force one global reputation score. It is trying to make trust composable.",
    "x402 answers “How do agents pay?” ERC-8004 answers “Who do agents pay, and why?” Put them together and you get a real market: Discover an agent or service, evaluate trust quickly, pay per call instantly, and escalate validation only when needed. That is the blueprint for open agent markets that can outpace DeFi adoption. Because this time the users are workflows, not people.",
    "Why this can move faster than DeFi? Agent commerce requires one thing: a library update. Once an agent framework supports “pay on 402,” any developer can monetize any endpoint instantly. That is not a new app. That is a new default behavior on the internet. Track the choke points: the rails everyone routes through, the budget layer everyone needs, and the trust middleware enterprises will demand."
  ],
  imageUrl: "https://i.imgur.com/VarXXlg.jpeg",
  snapshots: [
    { asset: "x402", price: "METERED", description: "HTTP 402 integration for usage-based agent payments" },
    { asset: "ERC-8004", price: "TRUST", description: "Identity and reputation layer for machine commerce" },
    { asset: "BILLING", price: "INSTANT", description: "Direct stablecoin settlement for API calls" }
  ]
};

export const PROVEX_ARTICLE: NewsArticle = {
  id: 'provex-richard-heart',
  title: "Shizzys Hot Takes: Can ProveX Be Richard Heart’s Next 10,000x?",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 10, 2026",
  summary: "ProveX is being pitched as a proof-based settlement system that replaces trust with cryptographic verification, plus a token model that tries to turn usage into buy pressure and burns.",
  content: [
    "Every cycle, crypto prints a new kind of “maybe impossible” trade. Sometimes it is a meme. Sometimes it is a new chain. Sometimes it is a new primitive that changes how value moves. ProveX is being pitched as that third category: a proof-based settlement system that replaces trust with cryptographic verification, plus a token model that tries to turn usage into buy pressure and burns.",
    "The core idea behind ProveX is 'Proof-Based Settlement.' In the current world, we rely on middlemen—banks, clearinghouses, and centralized exchanges—to ensure that when Party A sends something, Party B receives it. ProveX wants to replace those middlemen with mathematical proofs. From their documentation, they are building a protocol where the transaction itself contains the cryptographic proof of its own validity.",
    "Why does this tie into the Richard Heart ecosystem? Because Richard Heart’s projects—HEX, PulseChain, PulseX—are built on the philosophy of extreme game theory and high-conviction communities. ProveX is launching into this same 'Pulse' environment, attempting to capture the same energy that turned early HEX adopters into millionaires. It’s a bet on the technology, but it's also a bet on the community distribution.",
    "The tokenomics of ProveX are where things get spicy. They are proposing a 'Usage-Linked Reflation' model. Unlike traditional 'burn' tokens that just destroy supply, ProveX aims to use protocol revenue to actively buy back tokens from the open market and then retire them. If the protocol achieves actual adoption for settlements, the buy-pressure becomes a direct function of network usage. This is the 'reflexive loop' that every 10,000x coin needs.",
    "A 10,000x is not magic. It is math plus time plus distribution. To do that, you usually need a tiny starting market cap, a narrative that catches fire, and a product that solves a real friction point. ProveX is solving the 'Trust Gap' in decentralized commerce. If they can make it as easy to use as a browser extension, they aren't just building a coin; they are building a new layer of the internet.",
    "The 'Contribution Phase' or 'Sacrifice' is the defining moment for these types of projects. It determines the initial distribution and the 'diamond hand' base that will support the price through the early volatility. According to the public trackers at provex.info, the interest is already mimicking the early days of PulseChain. People aren't just looking for a trade; they are looking for a regime shift.",
    "Bottom line: Is it the next 10,000x? No one can promise that. But ProveX has the three ingredients required for a parabolic run: specialized tech (Proof-based Settlement), a high-conviction ecosystem (PulseChain), and a reflationary engine that turns volume into value. If the execution matches the vision, the chart will speak for itself."
  ],
  imageUrl: "https://i.imgur.com/WaNxbBJ.png",
  snapshots: [
    { asset: "PROVEX", price: "SACRIFICE", description: "Currently in the contribution phase via provex.info" },
    { asset: "MODEL", price: "REFLATIONARY", description: "Proposed usage-linked buy and burn dynamics" },
    { asset: "PLATFORM", price: "PULSECHAIN", description: "Primary ecosystem for initial project deployment" }
  ]
};

export const TAO_ARTICLE: NewsArticle = {
  id: 'tao-next-bitcoin',
  title: "Shizzys Hot Takes: TAO Is the Next Bitcoin, But With Real AI Cash Flows",
  category: "SHIZZY'S HOT TAKES",
  author: "Shizzy",
  timestamp: "JANUARY 9, 2026",
  summary: "If Bitcoin was the first clean, unstoppable scarcity asset, Bittensor TAO is aiming to be the first scarcity asset that also funds and coordinates real AI production on chain.",
  content: [
    "The TAO thesis is the cleanest bet on the intersection of decentralized compute and AI scarcity. Bitcoin proved that a digital commodity could achieve global scale through a hard cap and decentralized mining. Bittensor (TAO) takes that exact same incentive model and applies it to the most valuable resource of the 21st century: machine intelligence.",
    "That is the entire thesis. Not “AI narrative.” Not “a chatbot token.” Real markets, real competition, real emissions, real output. TAO isn't a company; it's a protocol that hosts hundreds of subnets, each one a specialized mini-market competing for emissions. Whether it is text generation, protein folding, or financial modeling, TAO coordinates the world’s best researchers to produce verifiable results.",
    "The core TAO x Bitcoin blueprint includes a hard cap of 21 million, scarcity enforced by code, and a halving cycle that reduces new issuance over time. A miner and validator economy competes for rewards in a way explicitly modeled after Bitcoin’s scarcity concept. This creates a reflexive loop: as subnets become more useful, the demand to stake TAO and influence those emissions increases, further drying up liquid supply.",
    "We have already hit the first TAO halving. This means the daily 'inflation' or emissions—the new supply coming onto the market—has been slashed by 50%. In Bitcoin, the halving is a supply shock for digital gold. In Bittensor, it is a supply shock for a network that is actively producing AI products every single block. You are moving from the early accumulation phase to the supply-constrained growth phase.",
    "The utility here is fundamental. If you want to use the network's intelligence, you need TAO. If you want to build a subnet and get paid for your work, you need TAO to stake. If you want to vote on which subnets deserve the most reward, you need TAO. It is a multi-layered utility sink that actually has cash-flow-like characteristics for validators who earn emissions based on their work.",
    "Digital Oil vs Digital Gold. Bitcoin is the storage of value. TAO is the fuel for the decentralized AI revolution. If you missed the early years of Bitcoin when the hash rate was exploding but the market didn't 'get it' yet, you are looking at the AI equivalent right now with Bittensor. The compute power joining the network is vertical. The supply is now falling. Do the math."
  ],
  imageUrl: "https://i.imgur.com/l64LmNJ.jpeg",
  snapshots: [
    { asset: "TAO", price: "$288.30", description: "Native asset of the Bittensor decentralized AI network" },
    { asset: "EMISSIONS", price: "3,600/DAY", description: "Post-halving daily TAO supply issuance" },
    { asset: "ALPHA", price: "VARIES", description: "Market-priced subnet tokens under dTAO" }
  ]
};

export const JAM_ARTICLE: NewsArticle = {
  id: 'jam-polkadot-2026',
  title: "JAM: Gavin Wood’s Blueprint for Polkadot’s Next Era",
  category: "TECH ANALYSIS",
  author: "Shizzy",
  timestamp: "JANUARY 9, 2026",
  summary: "JAM stands for Join Accumulate Machine. It is Gavin Wood’s big redesign idea for what comes after the Polkadot relay chain. The goal is simple: turn Polkadot into a general-purpose, verifiable compute platform.",
  content: [
    "JAM is the evolution of Polkadot from a Relay Chain into a decentralized, verifiable, and trustless world computer. It is Gavin Wood's 'final form' vision for the network. It's not just a patch; it’s a foundational shift in how on-chain compute works.",
    "The core innovation is moving away from the 'Relay Chain + Parachains' model to a 'Coretime' model where JAM acts as a massive parallel processor. JAM stands for Join-Accumulate Machine, representing the two phases of its compute cycle.",
    "In JAM, everything is a service. These services are far more flexible than traditional blockchains. They can be smart contracts, simple data storage, or complex compute tasks that run across Polkadot's massive shared security layer without being locked into a specific chain template.",
    "JAM utilizes the PVM (Polkadot Virtual Machine), a RISC-V based architecture. This allows for high-performance, verifiable execution that is significantly more efficient than the existing WASM-based setup, opening the door for massive data-heavy applications.",
    "The 'Join' phase gathers work from various independent cores, and the 'Accumulate' phase asynchronously commits the resulting state changes. This decoupling allows Polkadot to scale to thousands of cores without the bottlenecks of a single relay chain.",
    "For the DOT token, this transition changes its core utility. Instead of just securing parachain slots through auctions, DOT becomes the fundamental currency for purchasing 'Coretime'—the raw compute power of the JAM machine.",
    "This isn't just an upgrade; it is a total architectural reboot. It positions Polkadot to handle the next generation of AI coordination and decentralized big-data applications. JAM turns Polkadot into the verifiable back-end for the entire internet."
  ],
  imageUrl: "https://i.imgur.com/KtZIDIs.jpeg",
  snapshots: [
    { asset: "DOT", price: "$2.08", description: "Native utility token for the Polkadot ecosystem" },
    { asset: "CORETIME", price: "ELASTIC", description: "The primary compute resource in the JAM architecture" },
    { asset: "KSM", price: "$7.55", description: "Kusama canary network for pre-JAM staging" }
  ]
};

export const CYCLE_ARTICLE: NewsArticle = {
  id: 'cycle-roadmap-2025-2027',
  title: "If 2025 Felt Like 2019… What 2026 Could Have in Store, and Why 2027 Might Be the 2021 Style Blow Off",
  category: "MACRO THESIS",
  author: "Shizzy",
  timestamp: "JANUARY 9, 2026",
  summary: "Looking into the future, if this framework is correct, then the entire next cycle can be mapped with one simple question: 2025 felt like 2019. So will 2026 feel like 2020?",
  content: [
    "Looking into the future, if this framework is correct, then the entire next cycle can be mapped with one simple question:",
    "2025 felt like 2019. So will 2026 feel like 2020?",
    "That is the whole game.",
    "Not because history repeats perfectly, but because liquidity cycles rhyme, and crypto is still the most reflexive casino on earth. When liquidity expands, narratives multiply. When liquidity contracts, only the strongest coins and the clearest stories survive.",
    "If 2026 becomes a true “2020-style” liquidity comeback year, then the next logical step is obvious:",
    "2027 starts to look like the “2021 blow off top” year.",
    "Not guaranteed. Not a promise. Just the cleanest macro rhythm markets tend to follow when liquidity returns in waves.",
    "Think of the last cycle as three phases:",
    "2019 = Recovery and positioning. Sentiment improves, but trust is fragile. Capital gets selective. Strong hands accumulate, weak hands remain skeptical.",
    "2020 = Liquidity ignition. Macro conditions loosen. Money starts chasing risk again. Bitcoin and “quality” large caps become the magnet.",
    "2021 = Narrative mania. Everyone shows up late. Speculation goes vertical. The market stops acting rational because liquidity plus leverage plus attention creates a feedback loop.",
    "Now map that emotional and liquidity sequence to today:",
    "2025 felt like 2019. Healing, rebuilding, rebranding, relaunching. Strong projects quietly shipping. The market still punishes hype with no substance.",
    "So the real question becomes: Does 2026 bring the ignition?",
    "Global M2 is not magic, but it is one of the cleanest “weather maps” for risk assets.",
    "When broad money supply expands, three things tend to happen: More capital looks for return, risk tolerance rises, and liquidity leaks into the edges of the market, which is exactly where crypto lives.",
    "Crypto does not need perfect economics. Crypto needs available money and rising confidence.",
    "So if 2026 delivers sustained liquidity expansion, you can usually expect the sequence: Bitcoin runs first, large caps follow, mid and small caps catch fire, and finally, memes and low-float nonsense becomes “genius” for about three months.",
    "Everyone forgets risk exists. That last part is how you get a 2021-style blow off.",
    "You can treat BTC dominance like the market’s casting director. High dominance usually implies capital wants safety inside crypto and people are still unsure.",
    "Lower dominance usually implies confidence is back and people are chasing beta. Alts are getting their moment.",
    "So if BTC dominance is elevated and rising in 2025, that fits the “2019 feeling” perfectly. The rotation typically comes later, after Bitcoin has already convinced the crowd that the cycle is real.",
    "A low alt index is a sign that the market is not in full mania yet, and most people are still under-positioned for the risky part of the cycle.",
    "That is exactly what you want if your framework is “2026 ignition, 2027 final act.” Blow offs do not happen from euphoria on day one. They happen after a long grind where the market rebuilds confidence, then flips into overconfidence.",
    "If 2026 rhymes with 2020, expect a year with a strong Bitcoin trend that repeatedly breaks disbelief, large caps outperforming “random” alts early, and a constant rotation of narratives clustered around winners.",
    "If 2027 becomes the blow off year, it will feel like new all-time highs becoming normal headlines, everyone having a coin “that cannot lose,” and retail waves arriving to chase the last 20 percent of the move.",
    "Fundamentals stop mattering until they matter all at once. The blow off top is usually not a single candle, but a season where the market becomes addicted to upside.",
    "If liquidity expansion stays sustained over months, not weeks, and Bitcoin breaks major levels and holds them, the 2025 → 2027 map starts looking less like hopium and more like a plan.",
    "Bottom Line: Because if 2026 becomes a true 2020-style liquidity comeback year, then the next logical step is obvious: 2027 starts to look like the 2021 blow off top year.",
    "Not guaranteed. Not a promise. Just the cleanest macro rhythm that markets tend to follow when liquidity returns in waves. Is liquidity actually expanding? If yes, stay in the game. If not, stop hallucinating a cycle that is not there."
  ],
  imageUrl: "https://i.imgur.com/21o7ilA.jpeg",
  snapshots: [
    { asset: "LIQUIDITY", price: "EXPANDING", description: "Global M2 growth is the ultimate stage setter" },
    { asset: "BTC DOM", price: "58.2%", description: "Bitcoin leading the cast before the rotation" },
    { asset: "ALT INDEX", price: "LOW", description: "Alts are still waiting for the final act that typically comes late cycle" }
  ]
};

export const HOT_STORIES: HotStory[] = [
  { id: 'oct-10-spiral', title: 'What Really Happened on 10/10 and Why Q4 Was an Absolute Downward Spiral', date: 'JANUARY 11, 2026' },
  { id: 'agent-money', title: 'x402 + ERC-8004 Is the Agent Money Cycle', date: 'JANUARY 11, 2026' },
  { id: 'provex', title: 'Can ProveX Be Richard Heart’s Next 10,000x?', date: 'JANUARY 10, 2026' },
  { id: 'tao', title: 'TAO Is the Next Bitcoin, But With Real AI Cash Flows', date: 'JANUARY 9, 2026' },
  { id: 'cycle', title: 'If 2025 Felt Like 2019… The 2026 Liquidity Roadmap', date: 'JANUARY 9, 2026' },
  { id: 'jam', title: 'JAM: Gavin Wood’s Blueprint for Polkadot’s Next Era', date: 'JANUARY 9, 2026' }
];
