import "dotenv/config";
import express from "express";
import path from "path";
import { ApiPromise, WsProvider } from '@polkadot/api';

const app = express();

import { GoogleGenAI } from '@google/genai';

app.post('/api/gemini/generateContent', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { model, contents, config } = req.body;
    const response = await ai.models.generateContent({ model, contents, config });
    res.json({ text: response.text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;

app.use((req, res, next) => {
  if (process.env.VERCEL && req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

let api: ApiPromise | null = null;
let initPromise: Promise<void> | null = null;
const subnetPrices = new Map<number, number>();

const INIT_TYPES = {
  DelegateInfo: {
    delegate_ss58: 'AccountId',
    take: 'Compact<u16>',
    nominators: 'Vec<(AccountId, Vec<(Compact<u16>, Compact<u64>)>)>',
    owner_ss58: 'AccountId',
    registrations: 'Vec<Compact<u16>>',
    validator_permits: 'Vec<Compact<u16>>',
    return_per_1000: 'Compact<u64>',
    total_daily_return: 'Compact<u64>'
  }
};

async function initPolkadot() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  api = await ApiPromise.create({ 
    provider: wsProvider,
    types: INIT_TYPES
  });
  console.log("Connected to Polkadot");
  await updatePrices();
  setInterval(updatePrices, 60000); // every minute
  })();
  return initPromise;
}

async function updatePrices() {
  if (!api) return;
  try {
    const netuids = Array.from({length: 128}, (_, i) => i);
    const [taoReserves, alphaReserves] = await Promise.all([
      api.query.subtensorModule.subnetTAO.multi(netuids),
      api.query.subtensorModule.subnetAlphaIn.multi(netuids)
    ]);
    
    for (let i = 0; i < netuids.length; i++) {
      const tao = Number(taoReserves[i].toString());
      const alpha = Number(alphaReserves[i].toString());
      if (tao > 0 && alpha > 0) {
        subnetPrices.set(i, tao / alpha);
      } else {
        subnetPrices.set(i, 0);
      }
    }
    // Subnet 0 is TAO directly
    subnetPrices.set(0, 1);
    console.log("Prices updated.");
  } catch (err) {
    console.error("Failed to update prices:", err);
  }
}


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
  try {
    if (!api) {
      console.log("Waiting for blockchain connection...");
      await initPolkadot();
    }

    const { addresses } = req.body;
    if (!addresses || !Array.isArray(addresses)) {
      return res.status(400).json({ error: "addresses must be an array" });
    }

    const results = [];
    for (const address of addresses) {
      try {
        const { data: balance } = (await api.query.system.account(address)) as any;
        const freeTao = Number(balance.free.toString()) / 1e9;

        const rawRes = await api.rpc.state.call('DelegateInfoRuntimeApi_get_delegated', api.registry.createType('AccountId', address).toHex());
        const decoded = api.registry.createType('Vec<(DelegateInfo, (Compact<u16>, Compact<u64>))>', rawRes).toJSON() as any[];

        const holdings = [];
        let stakedValueTao = 0;

        // Subnet 0 mapping
        let subnet0Qty = 0;

        for (const delegate of decoded) {
          const tuple = delegate[1];
          const netuid = tuple[0];
          const qty = Number(tuple[1]) / 1e9;
          
          if (qty > 0) {
            if (netuid === 0) {
              subnet0Qty += qty;
            } else {
              const price = subnetPrices.get(netuid) || 0;
              stakedValueTao += qty * price;
              holdings.push({
                netuid,
                name: `Subnet ${netuid}`,
                quantity: qty,
                priceTao: price
              });
            }
          }
        }

        if (subnet0Qty > 0) {
          stakedValueTao += subnet0Qty;
          holdings.push({
            netuid: 0,
            name: "Staked TAO",
            quantity: subnet0Qty,
            priceTao: 1
          });
        }

        results.push({
          address,
          liquidTao: freeTao,
          holdings
        });
      } catch (err) {
        console.error("Error fetching", address, err);
        results.push({
          address,
          error: "Failed to fetch data from blockchain"
        });
      }
    }

    res.json(results);
  } catch (error: any) {
    console.error("Error in wallet check:", error);
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  import("vite").then(async ({ createServer: createViteServer }) => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Only init polkadot when starting dev server
    initPolkadot();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // In production (Vercel) we don't start the listener, just export the app
  // Wait, if it's Vercel, it might import this file as an API route!
  // But Vercel's standard format requires exporting the Express app
  // Actually, Vercel needs standard listener or exported handler.
  // We'll export it for Vercel, but also listen if run directly.
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  if (true) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default app;
