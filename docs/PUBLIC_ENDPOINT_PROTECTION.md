# Public endpoint safeguards

Reviewed October 22, 2026 for audit F08.

## Application limits

The server-only `request-protection.ts` module adds fixed one-minute request windows:

| Group | Requests/minute | Paths |
| --- | ---: | --- |
| Wallet creation | 8 | POST `/api/backend/v1/wallets/jobs` |
| Wallet activity | 120 | `/api/wallet-activity` (both lists and all pages share the group within an instance) |
| Research | 240 | Alpha/TAO charts, TAO history, root/subnet recommendations, root history, relay candle/activity/job-status reads |

These are **per warm application instance**, not a distributed quota or a guarantee of a maximum sitewide bill. Function replicas/regions/restarts can admit more traffic. Clients behind a shared public IP share a bucket. Vercel's trusted client-IP helper is used only on Vercel; other hosts share a local bucket rather than trusting arbitrary forwarded headers. Keys are HMACs with a random instance salt, expire after a minute, and are never logged. The map holds at most 4,096 active buckets; reaching capacity does not evict existing buckets to reset their allowances.

The homepage market snapshot and lightweight status/price paths are not throttled by this change. Existing CDN, history and recommendation caches and background preparation remain in place. No new browser scripts, database calls, provider calls, cookie, login or CAPTCHA is required for the guards.

Wallet submissions are read with a streaming 16 KiB cap, validate basic shape and the existing 100-address default before forwarding, and admit at most eight concurrent upstream submissions per instance. Backend checksum validation and its existing queue bound remain authoritative. Job responses are never coalesced or shared across visitors, including visitors behind the same IP.

Wallet history shares simultaneous reads for the same validated address/kind/page, caches successful normalized responses for five minutes, briefly shares failed responses for five seconds, and admits at most 16 distinct concurrent loads. Its cache is capped at 128 responses. Existing Next/CDN caching also applies; refresh/expiry is not a universal deletion guarantee. Pagination is validated before admitting cache keys, so arbitrary extra query parameters cannot generate new cache entries. Every caller receives an independent response body. Exceptions release concurrency slots.

Application throttles return JSON `429`, `Retry-After`, and `Cache-Control: no-store`. Busy concurrency responses return `503` and a five-second retry header. Backend `429` retry instructions are preserved; TaoStats quota failures return a clear one-minute retry message. Normal UI retry buttons remain usable. Throttle logs contain only group/status, at most once per minute per group per instance. Provider failure logs do not contain wallet addresses or raw URLs.

## Platform state and remaining rollout

The signed-in Vercel Firewall dashboard showed system mitigations active, no custom rules, no system bypasses, and roughly 4,500 DDoS-denied requests in its preceding-day view. This is evidence of platform protection, not proof that every abusive request is stopped.

The connected firewall configuration API returned `404 Seawall Config not found` for the confirmed project/team, including mutation attempts. No successful API firewall change is claimed.

A narrow **Log** draft named `F08 wallet submission observation` was prepared through the dashboard for exactly `/api/backend/v1/wallets/jobs`. It is staged, not published, and blocks nothing. The Vercel Firewall skill requires the owner to publish and review matching traffic before moving to preview enforcement and then production enforcement. Do not mark distributed edge throttling complete until that rollout is verified.

Suggested next observation/enforcement candidates: wallet POST bursts and wallet-activity GET bursts; start with generous observed thresholds (40 and 600 per IP per minute respectively), then tune against legitimate shared-IP traffic. Never enable global challenges, disable system mitigations, or bypass API protections to make a test pass. Keep market refreshes, crons and internal preparation outside those narrow rules.

## Verification and operations

Unit tests cover client/group isolation, window recovery, bounded maps, concurrent deduplication, independent response bodies, cache isolation, admission saturation, failure sharing and slot release. Browser gates cover readable `429` handling and successful manual retry on desktop and phone, alongside all existing chart/validator/root/wallet flows.

Review aggregate `public request throttled`, `wallet activity provider quota reached` and relay error logs when tuning. These are diagnostic signals, **not a configured notification channel**. External quota/cost/error alert delivery remains part of the operations follow-up (F16); do not claim alerts are delivered without a verified destination and test.

Rollback: revert the F08 application commit to remove the guards/coalescing; existing upstream caches and backend validation remain. Leave DDoS system mitigations active. Any firewall draft or published rule must be separately reviewed in Vercel; Git rollback does not change platform rules.
