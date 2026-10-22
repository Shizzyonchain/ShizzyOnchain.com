import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", testMatch: "visitor.spec.ts", fullyParallel: true, workers: 2,
  timeout: 30000, globalTimeout: 240000, expect: { timeout: 10000 }, retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4310", actionTimeout: 8000, navigationTimeout: 20000, trace: "retain-on-failure", screenshot: "only-on-failure", serviceWorkers: "block" },
  projects: [
    { name: "desktop-chromium", use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } } },
    { name: "phone-chromium", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: "node tests/browser/backend-fixture.mjs", url: "http://127.0.0.1:4311/healthz", timeout: 10000, reuseExistingServer: false },
    { command: "npm run start -- -H 127.0.0.1 -p 4310", url: "http://127.0.0.1:4310/partners", timeout: 30000, reuseExistingServer: false, env: { BACKEND_API_URL: "http://127.0.0.1:4311", BACKEND_API_KEY: "smoke-only", TAOSTATS_API_KEY: "" } },
  ],
});
