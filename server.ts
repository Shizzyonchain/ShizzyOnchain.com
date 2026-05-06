import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.get("/api/env-debug", (req, res) => {
    res.json({ 
      gemini: !!process.env.GEMINI_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      node_env: process.env.NODE_ENV
    });
  });

  app.get("/api/test-server", (req, res) => {
    res.json({ status: "alive", time: new Date().toISOString() });
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { courseTitle } = req.body;
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      
      console.log(`[Stripe] Request received for: ${courseTitle}`);

      if (!stripeKey) {
        console.error("[Stripe] CRITICAL: STRIPE_SECRET_KEY is MISSING from environment.");
        return res.status(403).json({ 
          error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your project secrets." 
        });
      }

      console.log(`[Stripe] Initializing with key length: ${stripeKey.length}`);
      // Initialize Stripe with the latest API version if possible, or just default
      const stripe = new Stripe(stripeKey, {
        // @ts-ignore
        apiVersion: '2023-10-16', // Standard stable version
      });
      
      const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
      console.log(`[Stripe] Origin detected: ${origin}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Unchained Academy: ${courseTitle || 'Intensive Session'}`,
                description: '60-minute high-signal Bittensor strategy session.',
              },
              unit_amount: 10000, // $100.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://calendly.com/shizzyunchained?utm_source=stripe&utm_campaign=school&course=${encodeURIComponent(courseTitle)}`,
        cancel_url: `${origin}/#/school`,
      });

      console.log(`[Stripe] Session successfully created: ${session.id}`);
      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      console.error('[Stripe] ERROR during session creation:', err);
      // Return a 500 with the error message as JSON
      res.status(500).json({ 
        error: err.message || "An error occurred with the payment system.",
        type: err.type,
        code: err.code
      });
    }
  });

  app.post("/api/extract-image", async (req, res) => {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await fetch('https://i.postimg.cc/t4hy7vTN/PORT.png');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: buffer.toString("base64"),
                  mimeType: "image/png"
                }
              },
              { text: "Extract the list of Subnet numbers, Subnet names, and their allocation percentages (as numbers) from this portfolio screenshot. Format the output STRICTLY as a JSON array of objects, e.g., [{\"sn\": \"SN15\", \"name\": \"ORO\", \"percent\": 20.7}].  Never use markdown backticks, just output raw JSON array." }
            ]
          }
        ]
      });
      res.json({ result: result.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  // Global Error Handler to catch any unhandled exceptions and return JSON
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Express] Global Error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message 
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
