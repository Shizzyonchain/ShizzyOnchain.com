import type { Metadata } from "next";
import Link from "next/link";
import { formatBriefDate, getSubnetNewsBriefs } from "../lib/subnet-news";
import { NewsItem } from "./news-item";
import { SubnetNewsHeader } from "./subnet-news-header";

export const metadata: Metadata = {
  title: "Subnet News | Shizzy Unchained",
  description: "The daily Bittensor subnet intelligence brief, sourced across X, GitHub, official channels, and ecosystem data.",
};

export default function SubnetNewsPage() {
  const briefs = getSubnetNewsBriefs();
  const [latest, ...archive] = briefs;

  return (
    <main className="news-shell">
      <SubnetNewsHeader />
      <section className="news-hero">
        <div>
          <p className="eyebrow">Daily Bittensor intelligence</p>
          <h1>Subnet<br /><span>News.</span></h1>
        </div>
        <div className="news-hero-copy">
          <strong>Everything that moved. Nothing buried.</strong>
          <p>Every active SN, major X conversation, release, registration, tokenomics change, partnership, security event, and small signal worth watching.</p>
          <span>Published daily</span>
        </div>
      </section>

      {latest ? (
        <>
          <section className="news-latest" aria-labelledby="latest-subnet-news">
            <div className="news-latest-head">
              <div>
                <p className="eyebrow">Latest report · {formatBriefDate(latest.date)}</p>
                <h2 id="latest-subnet-news">{latest.title}</h2>
                <p>{latest.summary}</p>
              </div>
              <Link href={`/subnet-news/${latest.date}`}>Read the full report <span aria-hidden="true">→</span></Link>
            </div>
            {latest.highlights.length > 0 && (
              <div className="news-highlight-grid">
                {latest.highlights.slice(0, 3).map((item) => <NewsItem key={item.headline} item={item} />)}
              </div>
            )}
          </section>

          <section className="news-archive" aria-labelledby="subnet-news-archive">
            <div><p className="eyebrow">Daily archive</p><h2 id="subnet-news-archive">Previous reports</h2></div>
            {archive.length ? (
              <div className="news-archive-list">
                {archive.map((brief) => (
                  <Link href={`/subnet-news/${brief.date}`} key={brief.date}>
                    <time dateTime={brief.date}>{formatBriefDate(brief.date)}</time>
                    <strong>{brief.title}</strong>
                    <span>Read →</span>
                  </Link>
                ))}
              </div>
            ) : <p className="news-empty-copy">The archive will build here one report at a time.</p>}
          </section>
        </>
      ) : (
        <section className="news-coming" aria-labelledby="first-report">
          <span>01</span>
          <div>
            <p className="eyebrow">First edition incoming</p>
            <h2 id="first-report">The next Subnet News report publishes daily.</h2>
            <p>The daily scan is being connected to this page. Once the first report lands, this area becomes the latest briefing and the archive starts automatically.</p>
          </div>
        </section>
      )}

      <footer className="news-footer">
        <span>SHIZZYUNCHAINED</span>
        <p>Primary sources linked · Verified news separated from developing information and rumors</p>
        <b>Published daily</b>
      </footer>
    </main>
  );
}
