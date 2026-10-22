import { createServer } from "node:http";
import { markets, stamp } from "./contracts.mjs";
const server = createServer((request, response) => {
  const path = new URL(request.url, "http://127.0.0.1").pathname;
  const value = path === "/healthz" ? { fixture: true } : path === "/v1/screener" ? { data: markets, cached_at: stamp } : null;
  response.writeHead(value ? 200 : 501, { "Content-Type": "application/json" });
  response.end(JSON.stringify(value || { error: `Unexpected smoke backend path: ${path}` }));
});
server.listen(4311, "127.0.0.1");
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => server.close(() => process.exit(0)));
