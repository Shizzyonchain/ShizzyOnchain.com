import Link from "next/link";
import { conferencePath, conferenceSummary, conferenceTitle } from "../lib/exploit-conference";
import { dayTwoPath, dayTwoSummary, dayTwoTitle } from "../lib/exploit-conference-day-two";

export function ConferenceCard() {
  return (
    <>
    <section className="news-latest conference-feature" aria-labelledby="conference-feature-title">
      <div className="news-latest-head">
        <div>
          <p className="eyebrow">Conference news · September 30, 2026</p>
          <h2 id="conference-feature-title">{conferenceTitle} · Day 1</h2>
          <p>{conferenceSummary}</p>
        </div>
        <Link href={conferencePath}>Catch up on Day 1 <span aria-hidden="true">→</span></Link>
      </div>
    </section>
    <section className="news-latest conference-feature" aria-labelledby="conference-day-two-title">
      <div className="news-latest-head">
        <div>
          <p className="eyebrow">Conference news · October 1, 2026</p>
          <h2 id="conference-day-two-title">{dayTwoTitle}</h2>
          <p>{dayTwoSummary}</p>
        </div>
        <Link href={dayTwoPath}>Catch up on Day 2 <span aria-hidden="true">→</span></Link>
      </div>
    </section>
    </>
  );
}
