import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
// Build artifacts contain synthetic SSR data and must never be promoted/deployed.
const fixture = spawn(process.execPath, ["tests/browser/backend-fixture.mjs"], { stdio: "inherit" });
try {
  let ready = false;
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try { const result = await fetch("http://127.0.0.1:4311/healthz", { signal: AbortSignal.timeout(500) }); ready = (await result.json()).fixture === true; } catch { /* bounded startup */ }
    if (ready) break;
    await setTimeout(100);
  }
  if (!ready) throw new Error("Smoke fixture failed to start within six seconds");
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build"], { stdio: "inherit", env: { ...process.env, BACKEND_API_URL: "http://127.0.0.1:4311", BACKEND_API_KEY: "smoke-only", TAOSTATS_API_KEY: "" } });
  const code = await new Promise((resolve, reject) => {
    const timer = globalThis.setTimeout(() => { child.kill(); reject(new Error("Smoke build exceeded two minutes")); }, 120000);
    child.on("error", error => { clearTimeout(timer); reject(error); });
    child.on("exit", result => { clearTimeout(timer); resolve(result); });
  });
  if (code !== 0) throw new Error(`Smoke build failed (${code})`);
} finally { fixture.kill(); }
