import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../site-header";
import { CreatorFooter } from "../creator-footer";
import { taoHeadsCommunity } from "../lib/community";
import styles from "../creator-pages.module.css";

const title = "About Shizzy Unchained | Bittensor, TAO & the People Building It";
const description = "Meet Shizzy: independent Bittensor creator, podcast host, and the voice behind Unchained TAO Heads. Explore interviews, subnet news, and the community.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", images: ["/shizzy-unchained-logo.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/shizzy-unchained-logo.png"] },
};

const explore = [
  { number: "01", label: "Watch & listen", title: "Meet the people building Bittensor.", text: "Founder interviews, livestreams, and conversations that get into how subnets work and what comes next.", href: "/video", action: "Explore the videos" },
  { number: "02", label: "Read & research", title: "Keep up with the subnets.", text: "Daily news with sources and star ratings, plus deeper looks at the ideas and changes shaping the network.", href: "/subnet-news", action: "Read subnet news" },
  { number: "03", label: "Follow the market", title: "Put the conversation in context.", text: "Explore subnet prices, emissions, liquidity, and market activity alongside the stories behind them.", href: "/", action: "Open the market dashboard" },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.wrap}>
        <div className={styles.pageTrail}>
          <span>Meet Shizzy</span><span aria-hidden="true">/</span>
          <Link href={taoHeadsCommunity.path}>Meet the TAO Heads <span aria-hidden="true">↗</span></Link>
        </div>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Creator. Podcast host. TAO Head.</p>
            <h1 id="about-title">I’m Shizzy.<br />Let’s talk <span>Bittensor.</span></h1>
            <p className={styles.lead}>I talk to the builders, follow the subnets, and share what I’m learning about TAO and decentralized AI.</p>
            <p className={styles.heroDetail}>Shizzy Unchained is where I bring those conversations together—through interviews, livestreams, daily news, and a community that keeps asking questions.</p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/video">Watch the videos <span aria-hidden="true">↗</span></Link>
              <Link className={styles.secondaryButton} href={taoHeadsCommunity.path}>Meet the community <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.socialLine}>
              <span>Follow along</span>
              <a href="https://youtube.com/@shizzyunchained" target="_blank" rel="noopener noreferrer">YouTube <span aria-hidden="true">↗</span></a>
              <a href="https://x.com/ShizzyUnchained" target="_blank" rel="noopener noreferrer">X <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <figure className={styles.portrait}>
            <Image src="/about-shizzy.png" alt="Shizzy Unchained in his black TAO hat" width={2000} height={2000} priority sizes="(max-width: 780px) 90vw, (max-width: 1300px) 40vw, 500px" />
            <figcaption><span>Behind the mic</span><strong>Shizzy Unchained</strong></figcaption>
          </figure>
        </section>
        <section className={styles.editorialSection} aria-labelledby="approach-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Why I do this</p>
            <h2 id="approach-title">Understand what<br />you’re following.</h2>
          </div>
          <div className={styles.prose}>
            <p>You shouldn’t need a technical background to take part in the Bittensor conversation. I want to make it easier to understand what a subnet does, who is building it, and why it matters.</p>
            <p>I bring my questions, research, and personal experience to the table. We talk through the opportunities, the risks, and the things that still need answers. The aim is to give you more context to form your own view.</p>
          </div>
        </section>
        <section className={styles.section} aria-labelledby="explore-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Around the site</p>
            <h2 id="explore-title">Pick a place to start.</h2>
          </div>
          <div className={styles.exploreRows}>
            {explore.map((item) => (
              <Link key={item.number} href={item.href} className={styles.exploreRow}>
                <span className={styles.rowNumber}>{item.number}</span>
                <div><p className={styles.eyebrow}>{item.label}</p><h3>{item.title}</h3><p>{item.text}</p></div>
                <span className={styles.rowAction}>{item.action} <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.communityFeature} aria-labelledby="community-title">
          <div className={styles.featureArt}><Image src={taoHeadsCommunity.logo} alt="Unchained TAO Heads hat logo" width={1254} height={1254} sizes="(max-width: 780px) 260px, 340px" /></div>
          <div className={styles.featureCopy}>
            <p className={styles.eyebrow}>The conversation keeps going</p>
            <h2 id="community-title">Find your<br /><span>TAO Heads.</span></h2>
            <p>Meet the researchers, builders, and curious minds following Bittensor together. Bring a question, share a source, or talk through what you’re watching.</p>
            <Link className={styles.primaryButton} href={taoHeadsCommunity.path}>Explore Unchained TAO Heads <span aria-hidden="true">→</span></Link>
          </div>
        </section>
        <section className={styles.contactSection} aria-labelledby="connect-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>Let’s connect</p><h2 id="connect-title">Keep the<br />conversation going.</h2></div>
          <div className={styles.contactLinks}>
            <Link href="/university"><span><strong>Learn with Shizzy</strong><small>One-on-one sessions through Shiz University.</small></span><span aria-hidden="true">↗</span></Link>
            <a href="mailto:shizzyunchained@gmail.com"><span><strong>Interviews & collaborations</strong><small>Have a project or a conversation in mind? Email me.</small></span><span aria-hidden="true">↗</span></a>
            <a href="https://t.me/ShizzyUnchained" target="_blank" rel="noopener noreferrer"><span><strong>Message Shizzy</strong><small>Reach me directly on Telegram.</small></span><span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <CreatorFooter />
    </div>
  );
}
