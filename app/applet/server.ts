import "dotenv/config";
import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  if (process.env.VERCEL && req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

// Dummy wallet data
app.get("/api/tao-price", async (req, res) => {
  try {
    const response = await fetch('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=TAO-USDT');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TAO price" });
  }
});

app.post("/api/wallets", async (req, res) => {
  res.json([]);
});

if (process.env.NODE_ENV !== "production") {
  import("vite").then(async ({ createServer: createViteServer }) => {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
