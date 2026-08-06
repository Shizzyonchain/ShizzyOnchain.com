import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBriefDate, getSubnetNewsBrief, getSubnetNewsBriefs } from "../../lib/subnet-news";
import { NewsItem } from "../news-item";
import { SubnetNewsHeader } from "../subnet-news-header";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSubnetNewsBriefs().map((brief) => ({ date: brief.date }));
}

export async function generateMetadata({ params }: PageProps<"/subnet-news/[date]">): Promise<Metadata> {
  const { date } = await params;
  const brief = getSubnetNewsBrief(date);
  if (!brief) return {};
  return { title: `${brief.title} | Subnet News`, description: brief.summary };
}

export default async function SubnetNewsBriefPage({ params }: PageProps<"/subnet-news/[date]">) {
  const { date } = await params;
  const brief = getSubnetNewsBrief(date);
  if (!brief) notFound();

  const updatedSubnets = brief.subnets.filter((subnet) => subnet.updates.length > 0);
  const quietSubnets = brief.subnets.filter((subnet) => subnet.updates.length === 0);

  return (
    <main className="news-shell news-report-shell">
      <SubnetNewsHeader />
      <article className="news-report">
        <header className="news-report-hero">
          <Link href="/subnet-news">← All Subnet News</Link>
          <p className="eyebrow">{formatBriefDate(brief.date)} · Published 10:00 AM ET</p>
          <h1>{brief.title}</h1>
          <p>{brief.summary}</p>
          <dl>
            <div><dt>Coverage window</dt><dd>{new Date(brief.coverageStart).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })} – {new Date(brief.coverageEnd).toLocaleString("en-US", { timeZone: "America/New_York", timeStyle: "short" })} ET</dd></div>
            <div><dt>Subnets checked</dt><dd>{brief.subnets.length}</dd></div>
            <div><dt>Subnets with updates</dt><dd>{updatedSubnets.length}</dd></div>
          </dl>
        </header>

        {brief.highlights.length > 0 && (
          <section className="news-report-section" aria-labelledby="top-signals">
            <div className="news-section-head"><span>01</span><div><p className="eyebrow">What matters first</p><h2 id="top-signals">Top signals</h2></div></div>
            <div className="news-report-grid">{brief.highlights.map((item) => <NewsItem key={item.headline} item={item} />)}</div>
          </section>
        )}

        <section className="news-report-section" aria-labelledby="subnet-desk">
          <div className="news-section-head"><span>02</span><div><p className="eyebrow">Organized by SN#</p><h2 id="subnet-desk">Subnet desk</h2></div></div>
          {updatedSubnets.length ? (
            <div className="subnet-news-list">
              {updatedSubnets.map((subnet) => (
                <section key={subnet.netuid} className="subnet-news-group">
                  <header><span>SN{subnet.netuid}</span><h3>{subnet.name}</h3></header>
                  <div>{subnet.updates.map((item) => <NewsItem key={item.headline} item={item} />)}</div>
                </section>
              ))}
            </div>
          ) : <p className="news-empty-copy">No subnet-specific updates met the publication threshold in this coverage window.</p>}
          {quietSubnets.length > 0 && <p className="quiet-subnets"><strong>No material update found:</strong> {quietSubnets.map((subnet) => `SN${subnet.netuid}`).join(", ")}.</p>}
        </section>

        {brief.ecosystem.length > 0 && (
          <section className="news-report-section" aria-labelledby="ecosystem-desk">
            <div className="news-section-head"><span>03</span><div><p className="eyebrow">Beyond one subnet</p><h2 id="ecosystem-desk">Ecosystem desk</h2></div></div>
            <div className="news-report-grid">{brief.ecosystem.map((item) => <NewsItem key={item.headline} item={item} />)}</div>
          </section>
        )}

        <section className="news-report-section coverage-section" aria-labelledby="coverage-notes">
          <div className="news-section-head"><span>04</span><div><p className="eyebrow">Audit trail</p><h2 id="coverage-notes">Coverage notes</h2></div></div>
          <div className="coverage-grid">
            <div><h3>Searched</h3><ul>{brief.coverage.searched.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Public-data gaps</h3>{brief.coverage.gaps.length ? <ul>{brief.coverage.gaps.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No material gaps were identified.</p>}</div>
          </div>
        </section>
      </article>
      <footer className="news-footer"><span>SHIZZYUNCHAINED</span><p>Information only · Not financial advice</p><b>Subnet News</b></footer>
    </main>
  );
}
