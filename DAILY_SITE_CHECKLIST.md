# Required daily site checklist

Use this checklist for every request to do today's news. Read `SUBNET_NEWS_PUBLISHING.md` for the detailed requirements. Complete news AND the video refresh unless the owner explicitly narrows the request. Never treat a collected link, a successful push, or a partial promotion update as completion.

Copy the checklist into dated research notes with the actual date, coverage window, check times, evidence paths and outcomes. Mark each item DONE, BLOCKED (specific reason), or NOT APPLICABLE (specific reason). An unchecked item remains unfinished. Do not claim exhaustive coverage or promise that nothing can ever be missed.

## Research and omission review

- [ ] Establish today's Eastern date and previous report's coverageEnd; record the actual cutoff and seven-day overlap.
- [ ] Verify signed-in X identity @ShizzyUnchained.
- [ ] Ask Grok for today's subnet news, explicitly including @const_reborn; save prompt, response, conversation link and lead dispositions.
- [ ] Ask Grok for today's top five most talked-about subnets; verify the leads and disclose ranking limitations.
- [ ] Check @const_reborn originals, quotes and substantive replies directly.
- [ ] Review the full current subnet roster, official accounts, aliases, repositories, AlphaGap, SubnetRadar, TAO Daily and relevant partner sources.
- [ ] Inspect attached videos and images on candidate official posts, especially sparse captions such as "soon". Text extraction alone cannot establish what the media says. Record media viewed and its substantive content, or an explicit access gap. Never exclude a candidate solely because its caption is short; distinguish teasers from completed launches after review.
- [ ] Check finalized chain registration, deregistration and owner/coldkey changes using configured RPC and historical events; retain block/time references and state actual coverage limitations. Verify sales separately.
- [ ] Review market outliers, emission leaders, Moments, unresolved incidents and planned events; give each flagged omission a specific sourced disposition.
- [ ] Run the final Grok omission query against public draft headlines; resolve every new lead against primary sources.
- [ ] Explain why each material development matters in original, clear wording, rather than copying a source or listing headlines. Keep the team, actual development and evidence central.
- [ ] Carry forward unresolved leads and scheduled announcements from the previous audit; reconcile collected material against selected stories so a found item cannot silently disappear (the SN38 ChronoLLM and SN8 Vanta corrections).

## TaoStats daily cross-check — owner addition October 16, 2026

Include this section whenever the owner says "let's do today" or an equivalent daily-update request. Preserve our node/feed as primary, the existing design and USD/TAO calculations. This is a required research and health check, not a claim that the proposed API integrations are already implemented or permission to redesign the site.

- [ ] Verify server-side TaoStats access without exposing keys; record endpoint, check time, block/time freshness, pagination, errors and actual credit usage when available. Use the new `/v1/` API; the documented legacy API retirement is November 9, 2026. If access is unavailable, record a specific BLOCKED outcome and continue available sources.
- [ ] Cross-check finalized registrations, deregistrations and ownership changes against our direct chain review over the complete coverage window. Investigate discrepancies and retain block/event references. Distinguish coldkey migrations, scheduled changes and executed transfers; verify sales and prices separately.
- [ ] Compare screener completeness and freshness with current pools/market aggregates: missing market caps, prices, 1-hour/24-hour/7-day returns and emission history. Investigate discrepancies rather than silently overwriting our feed. Aggregates do not document a 10-minute return; verify units, timestamps and historical TAO/USD conversion before using backup values. Compare emission share consistently, not token-price change or incompatible raw emission amounts.
- [ ] Use buy/sell volume, unique buyers/sellers, liquidity, conviction/owner locks and active miner/validator metrics to investigate market outliers and news leads where relevant. Record sourced dispositions; trading activity alone is not adoption, a lock reduction is not a sale, and metrics alone do not establish project health or a five-star story.
- [ ] Check any implemented cached fallback and historical gap-repair paths for freshness and failures; keep an explicit pending status until implemented. Shared background collection must not add a TaoStats request per visitor or slow the homepage/wallet checker. Retain source/time labels and last-good data; never represent stale data as live.
- [ ] Review hidden chart data gaps and carry forward historical-candle/backfill work when relevant. Keep charts hidden; a compatible candle feed does not itself supply or license a TradingView chart product. No P&L or average purchase-price additions.
- [ ] Save `taostatsReview` in the dated research evidence with access/result status, endpoints, coverage, findings, lead outcomes, discrepancies, quota limitations and pending integration work. Use existing audit/schema fields where compatible; do not add unsupported report fields. No deployment for an unchanged check and no unrelated infrastructure work merely to complete the daily scan.

Reference: https://taostats.io/docs/new ; market aggregates: https://taostats.io/docs/new/subnets/get-subnets-pools-aggregate ; historical candles: https://taostats.io/docs/new/tradingview/get-tradingview-udf-history . Verify current endpoint costs and account entitlement before setting collection intervals; do not assume one request equals one credit.

## Full video refresh — separate from news and promotions

- [ ] Inspect BOTH the channel's Videos and Live tabs for new uploads, completed streams, upcoming streams, removals and reschedules.
- [ ] Compare actual YouTube IDs against the site's video library and promotions; record each new candidate's disposition.
- [ ] Verify title, availability, duration, public/members status and scheduled time/time zone before editing.
- [ ] Update the public library/default player as appropriate, latest members video and next verified stream. Updating only the members promotion does not complete this section.
- [ ] Preserve owner-requested removals and postponements; keep enabled/listed flags consistent.
- [ ] Verify the selected embeds and labels; record "no changes" only after checking both tabs.

## Editorial and publication gates

### Subnet detail news/history — standing requirement October 17, 2026

- [ ] Every daily update must feed the homepage subnet panels: put each material subnet story, registration, deregistration, verified ownership/sale development and sourced name change under the correct SN in the dated report. Keep actual event dates distinct from report dates, current team names accurate, and older editions intact.
- [ ] Check new names against finalized identity/registration evidence and the prior report. Unknown, unnamed or identity-pending labels are placeholders, not project renames. Archive name observations alone do not prove a chain rename, completed sale or ownership transfer. Keep old-project coverage labelled with its recorded name when a slot is reused. Follow TaoStats for unnamed-subnet display labels (currently SN113: Unknown); do not restore a historical name such as LongShort solely from another aggregator. Check the current TaoStats label each daily run and retain older editions unchanged.
- [ ] After publication, check affected subnet panels for the new dated stories and direct sources, plus older-history pagination. The panel automatically reads the published report archive; no separate manual copy is needed. Allow the five-minute news cache to refresh, or verify using a fresh request. Keep news loading on panel open, never in the homepage market-table loading path. Record outcomes/gaps in the dated checklist.

- [ ] Use verified SN numbers before names, justified star ratings, direct sources, accurate event dates and clear planned/developing labels; exclude unrelated crypto news.
- [ ] Save the dated source audit, mandatory marketReview, media dispositions, chain review and video review; preserve prior editions and deduplicate.
- [ ] Validate news, lint and build; inspect the final diff and commit only intended files.
- [ ] Push through the existing publication workflow and confirm the deployment succeeds. A push alone is not a live update.
- [ ] Verify the live dated news page, latest-news date, video library, relevant promotions and playback links.
- [ ] Report completed changes and any blocked steps accurately. Do not say the daily update is complete while an item remains unfinished. No X posting without applicable authorization.

## Standing site requirements — check when touching these features

These requirements come from the owner's earlier requests. They are regression checks, not a claim that every feature has been implemented or verified. A routine news update does not authorize an unrelated redesign or infrastructure change.

- [ ] Performance: keep the homepage, wallet checker and Finney data responsive. Investigate blank 10-minute/1-hour/24-hour/7-day returns and missing market caps; do not accept a roughly one-minute blank wait or claim a paid hosting plan alone fixes it. Verify actual loading behavior after relevant changes.
- [ ] Currency: USD returns must use historical alpha USD prices, including historical TAO/USD conversion; TAO returns must use alpha/TAO prices. Switching units must change the basis correctly. Preserve clearly labelled rolling periods; do not silently substitute daily-close returns.
- [ ] Mobile: preserve the owner's priority of 1-hour and 24-hour returns in the compact screener, and check navigation, readable values, table scrolling and touch controls after layout changes.
- [ ] Emissions: position between price and market cap; color by change in emission share over 24 hours, not by token-price change. Explain the basis and handle unchanged/missing history honestly.
- [ ] Metric explanations: use the designated space above the screener for all metric explanations rather than awkward floating tooltips. Make explanations available by keyboard and touch as well as hover.
- [ ] Table controls: preserve top and bottom horizontal scrolling controls and prevent sticky subnet cells from obscuring headings or values (the clipped "arket cap" report).
- [ ] Accessibility/search visibility: retain a meaningful homepage main heading and a real accessible search label, rather than the magnifying-glass character alone. Check focus, contrast and mobile usability after changes.
- [ ] Branding: pure black backgrounds, white primary text and the approved dark neutral surfaces; avoid faded contrast or blanket grayscale filters. Keep purposeful original assets and correct partner logos. Do not assume the exact neutral shade from chat alone; inspect established site tokens.
- [ ] Community: retain the Unchained TAO Heads name, homepage entry and dedicated page; avoid reverting to Unchained Insiders. Preserve the stronger hat-circle treatment and approved hat crop when modifying those assets.
- [ ] Sharing: main-site link previews should use a black background with the Shizzy logo; Shiz University links should use its own logo on black. Verify route-specific metadata when changing sharing assets. Preserve the requested chain-shaped U favicon direction, subject to the actual approved asset.
- [ ] Charts: keep rebuilt/researched subnet charts hidden until the owner asks to reveal them. Do not make a chart redesign public as part of unrelated work.
- [ ] Wallet checker: do not add P&L or average purchase-price calculations; the owner explicitly canceled that addition over speed concerns.
- [ ] Partners: preserve the correct logos and referral destinations. Engy: https://engy.ai/r/ShizzyUnchained ; SayGM public referral: https://saygm.com/r/qm2gl6jx . The SayGM affiliate dashboard URL is management access, not automatically the public signup CTA. Verify existing Mentat, AlphaGap, Ledger, NordVPN and AlphaChaser entries against their saved configuration before edits; never invent an unknown link or discount.
- [ ] Accounts and secrets: the owner permits relevant use of signed-in X, SayGM and Lium accounts. This is not permission to expose credentials or incur unspecified spending. Keep API keys out of chat, tracked files, screenshots and public frontend code; ask the owner if funding is needed.

## Explicit removals and scheduling constraints

- [ ] Do not restore Shiz Cat TAO replay `X1N2TGCSKhk`.
- [ ] Keep postponed VUNE/TAO.app appearance `lTRFZFVt7yI` removed from upcoming promotions and listings until a new date is confirmed.
- [ ] Keep uploader-removed SN91 Cascade episode `BAMp6OssHks` disabled; verify any approved replacement separately.
- [ ] Expired September 27 hourly monitoring and five-star X posting permission does not carry into current daily work. Respect each automation's end date; do not silently renew it.
- [ ] The October 9 one-time Const check does not authorize ongoing X posts; the standing daily direct Const research requirement remains in force.

## Earlier requests to reconcile — do not silently mark complete

This chat contains requests whose completion cannot be established from the request text alone. Inspect repository history and the live result before closing them. Keep this list separate from daily news so old one-time requests do not cause duplicate content or unwanted changes.

- [ ] Exploit conference catch-up: confirm separate Day 1 and Day 2 coverage, organized by team and what they discussed, with original research and placement after September 30; avoid stage-by-stage filler.
- [ ] Confirm partner coverage for Gordon Frayne's AlphaChaser project and the intended public offer; verify the actual project/link. Earlier screenshots describe community code SHIZZY25, 25% off the first two months for new customers. Do not publish a personal free-account code or private commission terms as a community offer.
- [ ] Confirm requested emissions placement/color, shared explanations and top/bottom table scrolling are live and usable, rather than relying on earlier discussion.
- [ ] Confirm the hidden chart work, favicon and route-specific sharing artwork were completed and remain consistent with the approved design.
- [ ] Track unresolved deployment/CI failures and market-data loading issues to live verification; do not treat a successful local build as resolution of a production failure.
- [ ] Daily visitor checks are on-demand: use authenticated analytics with an explicit date range; distinguish visitors from page views and do not infer visits from market API requests.

When the owner asks for an audit, include desktop and mobile, loading behavior, market-data accuracy, navigation, accessibility, search visibility, videos, partners and sharing previews. Report findings and verify fixes; do not claim a complete audit from a screenshot alone.

## October 12, 2026 correction

The SN8 Vanta post `https://x.com/VantaTrading/status/2109623415300825315` was collected but omitted after text extraction returned only "soon...." without reviewing the video. Today's latest members promotion was updated, but the full Videos/Live refresh was not completed. These are unfinished review steps, not successful no-change checks. Deployment/live verification was also pending when this checklist was introduced. This file does not mark those tasks complete.

## Reviewed owner lead — October 19, 2026

- [x] Review SN107 Minos's team-reported Montreal presentations on October 22 (HelixForge) and October 23 (subnet), attributed by the supplied lead to an October 16 official Discord update: https://subnetradar.com/subnet-news/107/2026-10-16. Check https://x.com/theminos_ai and https://x.com/centrum_blue for primary confirmation and attached media. Deduplicate previous coverage and preserve the October 16 announcement date. Verify the event name, venue, speaker, session titles and times against https://ashgmeeting.ashg.org/ and official team sources. The owner's supplied research suggests ASHG but does not establish that connection; do not present it as confirmed or confuse it with Exploit Summit. Treat October 22–23 appearances as scheduled, not completed. Independently verify HelixForge/research claims; coauthorship involving OpenAI does not establish investment or a commercial partnership. Include an accurately qualified item in October 19 news if relevant, or record the specific verification gap. Watch for scientific users, demonstrations and announced collaborations without inventing adoption. Supplied October 18; not independently checked at intake.

October 19 outcome: primary May 23 post https://x.com/theminos_ai/status/2058303856883446140 explicitly names ASHG and two scientific works. October 22–23 dates retain October 16 digest attribution; specific session titles/times/room remain unverified (linked official planner returned 404). Covered as scheduled/developing in the October 19 report, with IM2 separately planned and no commercial OpenAI tie inferred. See dated source audit.
