import Link from "next/link";
import { conferencePath, conferenceSummary, conferenceTitle } from "../lib/exploit-conference";

export function ConferenceCard() {
  return (
    <section className="news-latest conference-feature" aria-labelledby="conference-feature-title">
      <div className="news-latest-head">
        <div>
          <p className="eyebrow">Conference news · September 30, 2026</p>
          <h2 id="conference-feature-title">{conferenceTitle}</h2>
          <p>{conferenceSummary}</p>
        </div>
        <Link href={conferencePath}>Catch up on the conference <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
