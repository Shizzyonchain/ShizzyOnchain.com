# CI visitor gates

Every push to main and every pull request runs `npm test` (the complete `tests/*.test.mjs` glob), news validation, production dependency audit, ESLint and an optimized Next production build. The backend job runs Ruff and the complete pytest suite. Existing ranking, Root, wallet and arithmetic regression suites are not selected out. New matching files join automatically.

The frontend also runs six browser stories in Chromium at desktop 1440×1000 and phone 390×844 (12 cases):

- market search/no-match/clear, subnet navigation, lazy chart canvas, timeframe and currency controls, phone chart placement;
- extreme APY context and mouse/keyboard disclosure without row navigation;
- subnet validator net-yield display and fail-closed behavior after source failure;
- Root NAV/share vs TWR labels, capital downside, recommendation basis and history-request reuse;
- saved-wallet restore, individual removal across reload, then complete cache deletion;
- unavailable archived evidence, missing dead anchors, and unchanged partner destinations.

## Isolation and limits

These are **synthetic UI contract tests**, not chain/provider verification, live availability monitoring, investment validation or real Safari/device testing. Fixtures are named Smoke and defined in `tests/browser/contracts.mjs`. Browser requests to third parties are blocked. Unknown internal API calls fail the test. Market SSR and the browser screener use the real Next relay against a loopback-only fixture backend. Other provider APIs have explicit browser contracts; external credentials and chain calls are not required. Current server-side quote/history fallbacks may time out, but their results do not decide the fixture assertions.

`npm run build:smoke` validates the publication, generates assets and builds with an isolated loopback backend. **Never deploy or promote its `.next` output: it includes synthetic SSR data.** Vercel continues to use the normal `npm run build` with its real environment. No test fixture path is installed as a production fallback.

Tests: 30-second per-case timeout, 10-second assertions, 8-second actions, four-minute suite timeout, two workers, zero retries. Server startup is bounded; smoke build stops after two minutes. Frontend job has a 15-minute ceiling; backend ten minutes. The job fails on browser test failures and uncaught page errors. Failure screenshots, traces and HTML reports upload even when the test step fails and expire after seven days. A green run does not establish current live-source health.

For CI or a dedicated throwaway test checkout:

```sh
npm ci
npx playwright install --with-deps chromium
npm test
npm run build:smoke
npm run test:smoke
```

The servers use 127.0.0.1 ports 4310 and 4311, reject occupied ports and shut down after testing. No wallet transactions or external posts occur. To return a test checkout to normal serving, rebuild with `npm run build` and the intended application environment.

Implementation references: [Playwright webServer](https://playwright.dev/docs/test-webserver), [CI reports and traces](https://playwright.dev/docs/ci-intro).
