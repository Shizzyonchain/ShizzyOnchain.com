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

- Use direct source links, with primary sources preferred.
- Never present a rumor as verified.
- Do not invent coverage. Record rate limits, inaccessible X content, deleted posts, private communities, and other gaps in `coverage.gaps`.
- Avoid duplicate stories across highlights, subnet updates, and ecosystem updates unless the summary adds distinct context.
- Keep the report informational and avoid personalized financial advice.
