import test from "node:test";
import assert from "node:assert/strict";
import { newsSourceIssue } from "../app/lib/news-source-links.mjs";
import { checkOwnedNewsLinks } from "../scripts/check-news-links.mjs";
import { subnetTimeline } from "../app/lib/subnet-timeline.ts";
const broken = { label: "Original chain API", url: "https://shizzyunchained.com/api/backend/v1/subnets/11/prices?start=2026-08-10T14%3A00%3A00Z%26end=2026-08-11T14%3A10%3A00Z" };
const unavailable = { ...broken, availability: "unavailable", unavailableReason: "404; original response not recovered", checkedAt: "2026-10-22T12:00:00Z" };
test("publishing blocks unserved relay paths and malformed parameter separators", () => {
 assert.match(newsSourceIssue(broken), /query separators/);
 assert.match(newsSourceIssue({ ...broken, url: broken.url.split("?")[0] }), /does not serve/);
 assert.equal(newsSourceIssue({ url: "https://shizzyunchained.com/api/backend/v1/subnets/11/candles?interval=1h&limit=30" }), null);
 assert.match(newsSourceIssue({ ...broken, availability: "unavailable" }), /needs a reason/);
 assert.equal(newsSourceIssue(unavailable), null);
 assert.match(newsSourceIssue({ url: "javascript:alert(1)" }), /http/);
});
test("unavailable evidence survives subnet history without becoming a replacement source", () => {
 const report = { date: "2026-08-11", ecosystem: [], subnets: [{ netuid: 11, name: "Historical name", updates: [{ headline: "Original observation", summary: "Evidence unavailable", status: "developing", sources: [unavailable] }] }] };
 assert.deepEqual(subnetTimeline([report], 11)[0].sources, [unavailable]);
});
test("publication checks each unique owned URL, fails on 404 and skips unavailable provenance", async () => {
 let calls = 0;
 const ok = { url: "https://shizzyunchained.com/subnet-news/2026-08-10" };
 const report = { highlights: [{ sources: [unavailable, ok, ok, { url: "https://x.com/example/status/123" }] }] };
 const result = await checkOwnedNewsLinks(report, async () => { calls++; return new Response("ok"); });
 assert.equal(calls, 1); assert.equal(result.unavailable, 1); assert.equal(result.externalManualReview, 1);
 await assert.rejects(checkOwnedNewsLinks(report, async () => new Response("missing", { status: 404 })), /returns 404/);
 await assert.rejects(checkOwnedNewsLinks({ sources: [broken] }, async () => { throw new Error("must not fetch invalid route"); }), /query separators/);
});
