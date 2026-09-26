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

- September 26 omission correction: SN38 was present in research but dropped during selection. Before publication, save a full-roster market snapshot in the dated audit's `marketReview` (source, observedAt, rows containing netuid/change24hPct/change7dPct). The validator now requires a sourced, specific `covered` or `excluded` decision for every absolute 24h move of at least 15%, seven-day move of at least 75%, or missing return. A generic no-update note is insufficient. Price is a discovery trigger, not proof of a catalyst or an automatic five-star rating. Read primary project sources and explain the business alongside a timestamped currency-labelled market observation when relevant.
- Review the preceding seven days of collected announcements for still-upcoming events, unresolved incidents and previously omitted material stories. Date late-found announcements explicitly. Before signing off, compare market outliers, emission leaders and material Moments with the published stories; resolve each omission with a specific rationale. Keep this comparison separate from simply counting accounts scanned.

- Keep every story directly relevant to TAO, Bittensor or a verified Bittensor subnet. StonkFun and other broader crypto platforms qualify only when the specific new development directly involves TAO or a subnet. Exclude unrelated token pairs, platform-wide revenue, burns and holder totals merely because the platform also supports TAO. This reflects the owner's September 21, 2026 correction; preserve prior editions unless separately asked to revise them.
- For editions after September 13, 2026, put the subnet number before its name whenever a subnet is mentioned in reader-facing news copy: for example, `SN80 OpenRoboto`, `SN92 MicroTensor`, and `SN23 Trishool`. Apply this to headlines, report summaries, story text, rating explanations, and source labels where applicable, including references to other subnets within a story. Use the verified current subnet number; do not guess one for a non-subnet organization or an uncertain identity. Keep official titles quoted verbatim and source URLs unchanged. This is a forward-only convention: do not revise September 13 or older editions for naming alone.
- Maintain a per-subnet source audit in `content/subnet-news/audits/YYYY-MM-DD.json`: current identity, X access/search status, dated briefs reviewed, repositories scanned, errors, and published item count. A roster entry alone is not evidence that its X account was searched.
- Begin each window at the previous report's `coverageEnd`. If publishing after the usual 10 AM run, extend to the actual research cutoff and state that timestamp so later posts are not silently omitted or counted twice.
- Search X by current project account, name, aliases and SN number. Grok may discover leads when accessible, but follow its links to original posts and verify author/date. Never publish an unsupported Grok claim as verified.
- Search recent Bittensor and TAO mentions from infrastructure providers, exchanges, bridges and other partner accounts outside the subnet roster. Check both sides of partnership announcements before publication.
- Starting September 4, 2026, assign every item a 1–5 star rating and a concise rationale. Rank the published feed by stars, with 5-star stories first. Use price action when it materially confirms market attention, record the observation time, and do not let price alone determine the rating.
- Use the public project feed, dated Discord briefs and GitHub as additional discovery sources. If signed-in X or Grok is blocked, record the exact gap; do not claim exhaustive X coverage. X-only stories available solely through a secondary feed stay developing.
- Check both YouTube Videos and Live tabs on every combined news/video update. Match the actual video ID, title and duration before editing the site, and verify the selected embed afterward.
- Do not restore the Shiz Cat TAO replay (`X1N2TGCSKhk`), removed from the site at the owner's request on September 16, 2026. The promoted stream's `listed` flag controls its library entry separately from the banner's `enabled` flag; set `listed: true` for the next approved stream when replacing this entry.
- The VUNE / TAO.app appearance (`lTRFZFVt7yI`) was postponed at the owner's request on September 16, 2026. Keep its banner, video listing and news promotion removed until a new date is confirmed; do not restore the old September 16 schedule merely because it remains on YouTube. A postponed stream must have both `enabled` and `listed` set to false.
- The SN91 Cascade episode (`BAMp6OssHks`) was removed by its uploader, confirmed on its YouTube watch page on September 17, 2026. Keep its banner and video listing disabled. Do not restore this removed URL during routine refreshes; add a replacement only when the owner supplies or approves one, with its title, availability, status and duration verified.
- Review the previous edition for missed material announcements and corrections; label any late-found story with its actual event date.
- Review the dated SubnetRadar Moments chain-event feed for material lock reductions, conviction changes, coldkey swaps, subnet registrations or removals, and ownership-related changes. Retain event links, block references and UTC timestamps in the audit; distinguish ranking changes from completed ownership transfers and lock reductions from token sales. Deduplicate events already covered in prior editions.

- Use direct source links, with primary sources preferred.
- Treat Discord briefs and AlphaGap summaries as discovery. A message in a subnet channel is not automatically from its team: verify the speaker before attributing a claim, especially allegations. Resolve conflicting launch claims against dated primary releases and documented activation gates.
- Label members-only YouTube uploads and route playback through YouTube membership access. Label scheduled streams as upcoming, verify their scheduled timestamp and time zone, and keep a public episode as the default player.
- Refresh `app/lib/channel-promotions.ts` with the next verified livestream and latest members video. The shared entries feed the video library and promotions. Set the stream's `enabled` flag to false when canceled; update `startsAt`, `expiresAt`, `schedule` and `meta` together when rescheduled. The banner changes from “Set reminder” to “Watch on YouTube” at the scheduled start, without claiming the broadcast is live, and disappears at `expiresAt`. Its dismissal lasts for the browser session and is scoped to that video. Keep dated reports before September 7, 2026 free of these promotions.
- Never present a rumor as verified.
- Do not invent coverage. Record rate limits, inaccessible X content, deleted posts, private communities, and other gaps in `coverage.gaps`.
- Avoid duplicate stories across highlights, subnet updates, and ecosystem updates unless the summary adds distinct context.
- Keep the report informational and avoid personalized financial advice.
