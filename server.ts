import "dotenv/config";
import express from "express";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use((req, res, next) => {
  // If Vercel already parsed the body into an object, skip express.json()
  if (process.env.VERCEL && req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

// API Proxy for Taostats to avoid CORS
app.get("/api/taostats/subnets", async (req, res) => {
  try {
    const headers: any = { 
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; TAOStatsProxy/1.0)'
    };

    console.log('Fetching from Taostats API: https://api.taostats.io/api/subnet/latest/v1');
    const response = await fetch('https://api.taostats.io/api/subnet/latest/v1', { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Taostats API error: ${response.status} ${errorText}`);
      return res.status(response.status).json({ 
        error: `Taostats API error: ${response.status}`, 
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 'some'} subnets`);
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  }
});

// API Proxy for Tao Market Cap to avoid CORS and handle rate limiting fallback
app.get("/api/tmc/subnets", async (req, res) => {
  try {
    const headers: any = { 
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    console.log('Fetching live from Tao Market Cap internal API...');
    const response = await fetch('https://api.taomarketcap.com/internal/v1/subnets/?limit=150', { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMC API error: ${response.status} ${errorText}`);
      return res.status(response.status).json({ 
        error: `TMC API error: ${response.status}`, 
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    console.log('Successfully fetched TMC subnets');

    const defaultNames: Record<string, string> = {"0":"Root","1":"Apex","2":"DSperse","3":"Deprecated","4":"Targon","5":"Hone","6":"Numinous","7":"Allways","8":"Vanta","9":"IOTA","10":"Swap","11":"TrajectoryRL","12":"Compute Horde","13":"Data Universe","14":"TAOHash","15":"ORO","16":"BitAds","17":"404—GEN","18":"Zeus","19":"blockmachine","20":"GroundLayer","21":"AdTAO","22":"Desearch","23":"Trishool","24":"Quasar","25":"Mainframe","26":"Kinitro","27":"Nodexo","28":"gm","29":"Coldint","30":"Pending","31":"Halftime","32":"ItsAI","33":"ReadyAI","34":"BitMind","35":"OxMarkets","36":"Eirel","37":"Aurelius","38":"colosseum","39":"deprecated","40":"Chunking","41":"Almanac","42":"Unknown","43":"Graphite","44":"Score","45":"Talisman AI","46":"RESI","47":"EvolAI","48":"Quantum Compute","49":"Nepher Robotics","50":"Synth","51":"lium.io","52":"Dojo","53":"EfficientFrontier","54":"Yanez MIID","55":"NIOME","56":"Gradients","57":"Sparket.AI","58":"Handshake","59":"Babelbit","60":"Bitsec.ai","61":"RedTeam","62":"Ridges","63":"Enigma","64":"Chutes","65":"TAO Private Network","66":"ninja","67":"Harnyx","68":"NOVA","69":"Unknown","70":"NexisGen","71":"Leadpoet","72":"StreetVision by NATIX","73":"MetaHash","74":"Gittensor","75":"Hippius","76":"Byzantium","77":"Liquidity","78":"Vocence","79":"MVTRX","80":"dogelayer","81":"deprecated","82":"Hermes","83":"CliqueAI","84":"ChipForge (Tatsu)","85":"Vidaio","86":"⚒","87":"Luminar Network","88":"Investing","89":"InfiniteHash","90":"Unknown","91":"Bitstarter #1","92":"TensorClaw","93":"Bitcast","94":"Bitsota","95":"Unknown","96":"Verathos","97":"distil","98":"ForeverMoney","99":"Leoma","100":"Plaτform","101":"Unknown","102":"ConnitoAI","103":"Djinn","104":"for sale (burn to uid1)","105":"Beam","106":"VoidAI","107":"Minos","108":"TalkHead","109":"Academia","110":"Green Compute","111":"oneoneone","112":"minotaur","113":"TensorUSD","114":"SOMA","115":"HashiChain","116":"TaoLend","117":"BrainPlay","118":"HODL","119":"Satori","120":"Affine","121":"sundae_bar","122":"Bitrecs","123":"MANTIS","124":"Swarm","125":"8 Ball","126":"Poker44","127":"Astrid","128":"ByteLeap"};

    const formatted = (data.results || []).map((item: any) => {
      const sn = item.netuid !== undefined ? item.netuid : 0;
      const snap = item.latest_snapshot || {};
      const d = snap.dtao || {};
      
      const name = snap.subnet_identities_v3?.subnetName || defaultNames[sn] || `Subnet ${sn}`;
      const owner = snap.subnet_owner || snap.subnet_owner_hotkey || 'Unknown Owner';
      const emission = d.emission !== undefined ? (Number(d.emission) / 100) : 0;
      const difficulty = snap.burn ? (Number(snap.burn) / 1000000).toFixed(4) + ' TAO (Burn)' : 'N/A';
      const marketCap = d.marketCap ? '$' + (Number(d.marketCap)).toLocaleString(undefined, {maximumFractionDigits: 0}) : 'N/A';
      const stake = snap.total_subnet_stake ? (Number(snap.total_subnet_stake) / 1e9).toLocaleString(undefined, {maximumFractionDigits: 0}) + ' TAO' : 'N/A';
      
      return {
        netuid: sn,
        name,
        owner,
        emission,
        difficulty,
        market_cap: marketCap,
        stake
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('TMC Proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  }
});

app.get("/api/env-debug", (req, res) => {
  res.json({ 
    gemini: !!process.env.GEMINI_API_KEY,
    node_env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

app.get("/api/test-server", (req, res) => {
  res.json({ status: "alive", time: new Date().toISOString() });
});

app.post("/api/extract-image", async (req, res) => {
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { Jimp } = await import("jimp");

    const { images } = req.body;
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const base64Data = images[0].replace(/^data:image\/(jpeg|png|webp);base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    const jimpImage: any = await Jimp.read(buffer);
    jimpImage.quality(60); 
    const compressedBuffer = await jimpImage.getBuffer('image/jpeg');
    const compressedBase64 = compressedBuffer.toString('base64');

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: compressedBase64,
                mimeType: "image/jpeg"
              }
            },
            { text: "Extract the list of Subnet numbers, Subnet names, and their allocation percentages (as numbers) from this portfolio screenshot. Format the output STRICTLY as a JSON array of objects, e.g., [{\"sn\": \"SN15\", \"name\": \"ORO\", \"percent\": 20.7}].  Never use markdown backticks, just output raw JSON array." }
          ]
        }
      ]
    });
    res.json({ result: result.text });
  } catch (err: any) {
    console.error('[Extract Image Error]', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err?.message || "An error occurred" });
    }
  }
});

// Shizzy's Interactive AI Guide Oracle
app.post("/api/shizzy-guide", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `You are "Shizzy", the legendary, unfiltered, direct, and brilliant custom guide through the Bittensor network.
Your tone is conversational, no-BS, authentic, slightly cynical of tech-hype/VC vaporware, and incredibly passionate about true decentralized AI (TAO).
Always speak in the first person ("I", "my"). Keep your answers extremely concise (usually 2-3 sentences max), engaging, and high-value, filled with "real talk" and raw alpha.
If asked about who you are, say you are Shizzy, your guide, here to unchain you from the centralized tech overlords.
Help the user navigate Bittensor, subnets, validation, staking, and the tools on this dashboard (AlphaGap, Shiz University, Emissions Explained, Bittensor Subnets).
Do not use markdown backticks or flowery corporate jargon. Keep it real, clear, and extremely high-signal. Use simple, bold headings if needed, but keep it brief!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('[Shizzy Guide Error]', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || "An error occurred" });
    }
  }
});

app.post('/api/wallets', async (req, res) => {
  const { addresses } = req.body;
  
  if (!addresses || !Array.isArray(addresses)) {
    return res.status(400).json({ error: 'Invalid addresses provided.' });
  }

  const apiKey = process.env.TAOSTATS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'TAOSTATS_API_KEY is not configured on the server.' });
  }

  try {
    const results = [];
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      if (i > 0) {
        // Wait 300ms between requests to avoid rate limits
        await new Promise(r => setTimeout(r, 300));
      }
      try {
        let response = await fetch(`https://api.taostats.io/api/account/latest/v1?address=${address}`, {
          headers: {
            'Authorization': `${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 429) {
          // If rate limited, wait 2 seconds and retry once
          await new Promise(r => setTimeout(r, 2000));
          response = await fetch(`https://api.taostats.io/api/account/latest/v1?address=${address}`, {
            headers: {
              'Authorization': `${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const json = await response.json();
        const data = json.data && json.data[0];
        
        if (!data) {
           results.push({
             address,
             error: 'No data found for address'
           });
           continue;
        }
        
        const liquidTao = (Number(data.balance_free) || 0) / 1e9;
        
        const holdings = (data.alpha_balances || []).filter((h: any) => h.netuid !== 0).map((h: any) => {
           const quantity = (Number(h.balance) || 0) / 1e9;
           const valueTao = (Number(h.balance_as_tao) || 0) / 1e9;
           const priceTao = quantity > 0 ? valueTao / quantity : 0;
           return {
             netuid: h.netuid,
             name: `Subnet ${h.netuid}`,
             quantity: quantity,
             priceTao: priceTao
           };
        });

        // Add root staking if any
        if (data.balance_staked_root && Number(data.balance_staked_root) > 0) {
           const rootValue = Number(data.balance_staked_root) / 1e9;
           holdings.push({
             netuid: 0,
             name: 'Staked TAO',
             quantity: rootValue,
             priceTao: 1
           });
        }
        
        results.push({
          address,
          liquidTao,
          holdings
        });
      } catch (error: any) {
        console.error(`Error fetching wallet ${address}:`, error.message);
        results.push({
          address,
          error: error.message
        });
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Mass Wallet Check API Error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet data' });
  }
});

// Global Error Handler to catch any unhandled exceptions and return JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Express] Global Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// Vite middleware for development / static serving strategy
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const viteModule = "vi" + "te";
  import(viteModule).then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then(vite => {
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
         console.log(`Server running on http://localhost:${PORT}`);
      });
    });
  });
} else {
  // Production / Vercel
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist/index.html"));
  });

  // Only listen directly if not hosted on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Production Server running on http://localhost:${PORT}`);
    });
  }
}

// Ensure proper error catching for Vercel Serverless environment
export default app;
