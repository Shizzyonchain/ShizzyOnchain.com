import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Shizzy Unchained | Bittensor Creator, Podcast Host & Community Builder",
  description: "Meet Shizzy Unchained, an independent creator, podcast host, interviewer, educator, and community builder covering Bittensor, TAO, decentralized AI, crypto security, portfolio strategy, and content creation.",
};

const socials = [
  ["YouTube", "▶", "https://youtube.com/@shizzyunchained"], ["X", "𝕏", "https://x.com/ShizzyUnchained"],
  ["Telegram Community", "↗", "https://t.me/ShizzyUnchained"], ["Message Shizzy", "✉", "https://t.me/ShizzyUnchained"],
  ["Unchained Insiders", "◆", "https://t.me/+0fW1AeQAUERhZTgx"], ["Email", "@", "mailto:shizzyunchained@gmail.com"],
] as const;
const coverage = [
  ["Bittensor & TAO", "Market updates, ecosystem developments, network economics, TAO analysis, and decentralized intelligence."],
  ["Bittensor Subnets", "Research, founder interviews, subnet updates, alpha-token analysis, inference, mining, validation, and emerging opportunities."],
  ["The Shizzy Unchained Podcast", "Long-form conversations with founders, builders, investors, researchers, and personalities shaping crypto and AI."],
  ["Portfolio Challenges", "Transparent portfolio discussions, the 10 to 100 TAO Challenge, allocation decisions, and lessons learned in real time."],
  ["Crypto Security", "Wallet organization, operational security, seed protection, scam awareness, and protecting digital assets."],
  ["Content Creation", "Podcasting, livestreaming, YouTube, branding, interviewing, social media, and community building."],
];
const subjects = ["Bittensor", "TAO", "Subnets", "Portfolio Strategy", "Crypto Security", "Wallet Organization", "Bitcoin", "Ethereum", "Content Creation", "Podcasting", "Livestreaming", "YouTube Growth", "Social Media", "Interviewing", "Market Research"];

function SocialButtons() {
  return <div className="about-socials" aria-label="Shizzy Unchained social links">{socials.map(([label, icon, href]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} aria-label={label}><span aria-hidden="true">{icon}</span>{label}</a>)}</div>;
}

export default function AboutPage() {
  return <main className="about-page">
    <header className="about-header">
      <Link className="about-brand" href="/" aria-label="Shizzy Unchained home"><Image src="/shizzy-unchained-logo.svg" alt="Shizzy Unchained" width={285} height={80} /></Link>
      <nav aria-label="Primary navigation"><Link href="/">Market</Link><Link href="/subnet-news">Subnet News</Link><Link href="/video">Videos</Link><a href="https://shizzyunchained.printful.me/" target="_blank" rel="noreferrer">Shop</a><Link href="/university">Shiz University</Link><Link href="/wallet-tracker">Wallet tracker</Link><Link className="active" href="/about">About</Link></nav>
      <details className="about-mobile-menu"><summary aria-label="Open navigation menu"><span /><span /><span /></summary><div><Link href="/">Market</Link><Link href="/subnet-news">Subnet News</Link><Link href="/bubbles">Bubbles</Link><Link href="/video">Videos</Link><a href="https://shizzyunchained.printful.me/" target="_blank" rel="noreferrer">Shop</a><Link href="/university">Shiz University</Link><Link href="/wallet-tracker">Wallet tracker</Link><Link href="/partners">Partners</Link><Link className="active" href="/about">About</Link></div></details>
      <a className="about-contact-mini" href="mailto:shizzyunchained@gmail.com">Contact Shizzy</a>
    </header>

    <section className="about-hero about-wrap">
      <div className="about-hero-copy"><p className="eyebrow">About Shizzy Unchained</p><h1>The man behind <span>Shizzy Unchained</span></h1><p>Shizzy Unchained is an independent content creator, podcast host, interviewer, and community builder focused on Bittensor, decentralized artificial intelligence, cryptocurrency, content creation, and digital security.</p><p>He is known for breaking complicated topics down into clear, honest conversations that people at every experience level can understand.</p></div>
      <div className="about-portrait"><Image src="/about-shizzy.png" alt="Shizzy Unchained wearing a TAO cap and Shizzy Unchained shirt" width={1600} height={1600} loading="lazy" sizes="(max-width: 900px) 92vw, 44vw" /></div>
    </section>
    <div className="about-wrap about-social-row"><SocialButtons /></div>

    <section className="about-story about-wrap about-split"><div><p className="eyebrow">Who is Shizzy?</p><h2>Finding the story before the crowd</h2></div><div className="about-prose"><p>Shizzy Unchained built his platform around one simple idea:</p><p className="about-lead">People should not need a technical background to understand where cryptocurrency and artificial intelligence are heading.</p><p>Through podcasts, livestreams, interviews, market discussions, portfolio challenges, and direct conversations with builders, Shizzy explores the people, technology, opportunities, and risks shaping the future of decentralized intelligence.</p><p>Bittensor sits at the center of much of his work.</p><p>Shizzy regularly covers TAO, Bittensor subnets, alpha tokens, decentralized inference, miners, validators, subnet founders, token economics, portfolio construction, AI, and crypto security.</p><p>His content is not built around repeating headlines. It is built around asking direct questions, investigating the story, challenging weak narratives, and helping his audience understand what actually matters.</p></div></section>

    <section className="about-coverage about-wrap"><p className="eyebrow">What Shizzy covers</p><h2>Follow the signal</h2><div className="about-card-grid">{coverage.map(([title, text], i) => <article key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="about-approach"><div className="about-wrap about-split"><div><p className="eyebrow">No scripted narratives</p><h2>Honest conversations.<br /><span>Real experience.</span></h2></div><div className="about-prose"><p>Shizzy’s approach is independent and built around real-world experience.</p><p>He does not pretend every investment succeeds.</p><p>He does not pretend every project deserves attention.</p><p className="about-lead">The goal is to help people think for themselves.</p><p>That means asking uncomfortable questions, recognizing mistakes, highlighting innovation, calling out hype, and continuing to learn as the ecosystem evolves.</p></div></div></section>

    <section className="about-community about-wrap about-split"><div><p className="eyebrow">The community</p><h2>Welcome to Shizzy Unchained</h2></div><div className="about-prose"><p className="about-lead">Shizzy Unchained is more than a YouTube channel.</p><p>It is a growing community of investors, builders, miners, validators, creators, and people who believe decentralized artificial intelligence will become one of the most important technological movements of the next decade.</p><p>Whether someone owns their first TAO, actively researches Bittensor subnets, builds inside the ecosystem, or simply wants to understand what comes next, everyone is welcome.</p></div></section>

    <section className="about-insiders about-wrap"><p className="eyebrow">Unchained Insiders</p><h2>Go deeper than the public feed</h2><p>Unchained Insiders is the private Telegram community for members who want deeper Bittensor discussions, research, portfolio conversations, early observations, exclusive updates, and direct access to a community following the ecosystem every day.</p><a className="about-cta" href="https://t.me/+0fW1AeQAUERhZTgx" target="_blank" rel="noreferrer">Join Unchained Insiders <span>↗</span></a></section>

    <section className="about-university about-wrap"><div><p className="eyebrow">Shiz University</p><h2>Learn directly with Shizzy</h2><p>Shiz University is a private one-on-one learning experience built around what you actually want to master.</p><Link className="about-cta" href="/?view=university">Explore Shiz University <span>→</span></Link></div><ul>{subjects.map(subject => <li key={subject}>{subject}</li>)}</ul></section>

    <section className="about-connect about-wrap"><p className="eyebrow">Connect with Shizzy</p><h2>Stay unchained</h2><p>Follow the latest Bittensor research, livestreams, interviews, portfolio updates, videos, educational content, and community discussions across every Shizzy Unchained platform.</p><SocialButtons /><a className="about-cta" href="mailto:shizzyunchained@gmail.com">Contact Shizzy <span>→</span></a></section>

    <footer className="about-footer about-wrap"><Image src="/shizzy-unchained-logo.svg" alt="" width={190} height={54} /><p>Nothing on Shizzy Unchained is financial, legal, tax, or life advice. Everything shared is for education, commentary, entertainment, and personal perspective. Always conduct your own research before making financial or investment decisions.</p></footer>
  </main>;
}
