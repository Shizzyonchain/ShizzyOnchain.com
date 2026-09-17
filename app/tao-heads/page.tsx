import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../site-header";
import { CreatorFooter } from "../creator-footer";
import { taoHeadsCommunity } from "../lib/community";
import { youtubeMembershipUrl } from "../lib/channel-promotions";
import styles from "../creator-pages.module.css";

const title = "Unchained TAO Heads | Shizzy’s Bittensor Community";
const description = "Join Unchained TAO Heads on Telegram. Talk Bittensor, compare subnet research, follow TAO, and connect with the Shizzy Unchained community.";
const shareImage = { url: "/tao-heads-banner.png", width: 2172, height: 724, alt: "Unchained TAO Heads" };

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: taoHeadsCommunity.path },
  openGraph: { title, description, type: "website", url: taoHeadsCommunity.path, siteName: "ShizzyUnchained", images: [shareImage] },
  twitter: { card: "summary_large_image", title, description, images: [shareImage] },
};

const topics = [
  { number: "01", title: "Subnet research", text: "Share announcements, compare notes, and dig into what different subnets are actually building. Bring the source so others can take a closer look." },
  { number: "02", title: "TAO & the market", text: "Talk through TAO flows, price action, emissions, and portfolio ideas. Put the numbers alongside the news and hear another perspective." },
  { number: "03", title: "People & ideas", text: "Connect with others exploring Bittensor, discuss founder interviews, and ask the questions you want to hear builders answer." },
];

function JoinTelegram({ children = "Join us on Telegram" }: { children?: React.ReactNode }) {
  return <a className={styles.primaryButton} href={taoHeadsCommunity.url} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span></a>;
}

export default function TaoHeadsPage() {
  return (
    <div className={`${styles.page} ${styles.communityPage}`}>
      <SiteHeader />
      <main className={styles.wrap}>
        <div className={styles.pageTrail}><Link href="/about">Meet Shizzy</Link><span aria-hidden="true">/</span><span>Unchained TAO Heads</span></div>
        <section className={`${styles.hero} ${styles.communityHero}`} aria-labelledby="tao-heads-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The Shizzy Unchained community</p>
            <h1 id="tao-heads-title">Unchained<br /><span>TAO Heads.</span></h1>
            <p className={styles.lead}>A home for people who can’t stop talking Bittensor.</p>
            <p className={styles.heroDetail}>Compare research, ask questions, and follow TAO and the subnets with people who are just as curious as you are.</p>
            <div className={styles.actions}><JoinTelegram /><Link className={styles.textLink} href="#inside">Take a look inside <span aria-hidden="true">↓</span></Link></div>
            <p className={styles.communityNote}><span aria-hidden="true" /> On Telegram · Researchers, builders & curious minds</p>
          </div>
          <div className={styles.communityHeroArt}><Image src={taoHeadsCommunity.logo} alt="Black TAO hat with electric blue Unchained TAO Heads lettering" width={1254} height={1254} priority sizes="(max-width: 780px) 85vw, (max-width: 1300px) 40vw, 500px" /></div>
        </section>
        <div className={styles.topicStrip} aria-label="Community topics"><span>Bittensor</span><span>TAO</span><span>Subnets</span><span>Decentralized AI</span></div>
        <section id="inside" className={styles.section} aria-labelledby="inside-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>Inside the community</p><h2 id="inside-title">Bring your research.<br /><span>Find your people.</span></h2><p>Whether you’re learning the basics or already following every subnet update, there’s a conversation for you.</p></div>
          <div className={styles.topicGrid}>{topics.map((topic) => <article key={topic.number}><span className={styles.rowNumber}>{topic.number}</span><h3>{topic.title}</h3><p>{topic.text}</p></article>)}</div>
        </section>
        <section className={styles.startSection} aria-labelledby="start-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>Your first conversation</p><h2 id="start-title">Pull up a seat.</h2></div>
          <ol className={styles.steps}>
            <li><span>01</span><div><h3>Open the group</h3><p>Use the invite to find Unchained TAO Heads in Telegram.</p></div></li>
            <li><span>02</span><div><h3>Say hello</h3><p>Let people know what brought you to Bittensor.</p></div></li>
            <li><span>03</span><div><h3>Bring a question</h3><p>A subnet, an interview, a source—start with what interests you.</p></div></li>
          </ol>
        </section>
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>Before you jump in</p><h2 id="faq-title">A few quick answers.</h2></div>
          <div className={styles.faqList}>
            <details><summary>Do I need to be a Bittensor expert?</summary><p>No. You’re welcome whether you’re getting to know TAO or already researching subnets. Ask questions and share what you’re learning.</p></details>
            <details><summary>Is this the former Unchained Insiders group?</summary><p>Yes. Unchained TAO Heads is the new name for the same Telegram community. If you’re already in the group, you’re already a TAO Head.</p></details>
            <details><summary>How does this relate to YouTube memberships?</summary><p>TAO Heads is the Telegram community. YouTube memberships are a separate way to support the channel and watch members-only videos. You can <a href={youtubeMembershipUrl} target="_blank" rel="noopener noreferrer">explore YouTube memberships here</a>.</p></details>
          </div>
        </section>
        <section className={styles.joinSection} aria-labelledby="join-title">
          <Image src={taoHeadsCommunity.icon} alt="" width={1254} height={1254} sizes="110px" />
          <div><p className={styles.eyebrow}>Unchained TAO Heads</p><h2 id="join-title">See you in the chat.</h2><p>The next conversation starts with you.</p></div>
          <JoinTelegram>Join the TAO Heads</JoinTelegram>
        </section>
        <div className={styles.continueLinks}><span>Keep exploring</span><Link href="/subnet-news">Subnet news <span aria-hidden="true">↗</span></Link><Link href="/video">Interviews & videos <span aria-hidden="true">↗</span></Link><Link href="/about">About Shizzy <span aria-hidden="true">↗</span></Link></div>
      </main>
      <CreatorFooter />
    </div>
  );
}
