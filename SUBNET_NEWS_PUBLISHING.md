# Subnet News publishing

Subnet News is a repository-backed daily publication. Each report is a validated JSON file in `content/subnet-news/YYYY-MM-DD.json`. The website builds the latest report, dated archive pages, source links, verification labels, and coverage gaps from those files.

## Daily 10 AM workflow

1. Research the public Bittensor ecosystem for the coverage window, prioritizing X searches by every active SN number and subnet name.
2. Cross-check claims against primary sources and label each item `verified`, `developing`, or `rumor`.
3. Create a report from `scripts/subnet-news-template.json`. Include every active subnet in `subnets`; use an empty `updates` array when no material update is found.
4. Run `npm run publish:subnet-news -- <report-file.json>`.
5. Run `npm run validate:subnet-news`, `npm run lint`, and `npm run build`.
6. Commit only the new dated report and push it to `main`. The existing Vercel Git integration publishes it automatically.
7. Confirm `/subnet-news` shows the new date and `/subnet-news/YYYY-MM-DD` loads successfully.

This workflow uses the repository's existing authenticated Git access. It does not require a public ingestion endpoint, a GitHub personal access token in Vercel, or a publishing secret. Invalid reports fail validation before deployment.

## Editorial requirements

- Maintain a per-subnet source audit in `content/subnet-news/audits/YYYY-MM-DD.json`: current identity, X access/search status, dated briefs reviewed, repositories scanned, errors, and published item count. A roster entry alone is not evidence that its X account was searched.
- Begin each window at the previous report's `coverageEnd`. If publishing after the usual 10 AM run, extend to the actual research cutoff and state that timestamp so later posts are not silently omitted or counted twice.
- Search X by current project account, name, aliases and SN number. Grok may discover leads when accessible, but follow its links to original posts and verify author/date. Never publish an unsupported Grok claim as verified.
- Search recent Bittensor and TAO mentions from infrastructure providers, exchanges, bridges and other partner accounts outside the subnet roster. Check both sides of partnership announcements before publication.
- Starting September 4, 2026, assign every item a 1–5 star rating and a concise rationale. Rank the published feed by stars, with 5-star stories first. Use price action when it materially confirms market attention, record the observation time, and do not let price alone determine the rating.
- Use the public project feed, dated Discord briefs and GitHub as additional discovery sources. If signed-in X or Grok is blocked, record the exact gap; do not claim exhaustive X coverage. X-only stories available solely through a secondary feed stay developing.
- Check both YouTube Videos and Live tabs on every combined news/video update. Match the actual video ID, title and duration before editing the site, and verify the selected embed afterward.
- Review the previous edition for missed material announcements and corrections; label any late-found story with its actual event date.

- Use direct source links, with primary sources preferred.
- Never present a rumor as verified.
- Do not invent coverage. Record rate limits, inaccessible X content, deleted posts, private communities, and other gaps in `coverage.gaps`.
- Avoid duplicate stories across highlights, subnet updates, and ecosystem updates unless the summary adds distinct context.
- Keep the report informational and avoid personalized financial advice.
