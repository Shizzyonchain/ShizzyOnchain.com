import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
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

  // Stripe Checkout Session (Manual Calendar Flow)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { courseTitle, name, email, preferredTime, stripePriceId } = req.body;
      const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
      
      if (!stripeKey) {
        console.error("[Stripe] CRITICAL: STRIPE_SECRET_KEY is missing or empty.");
        return res.status(403).json({ 
          error: "Stripe is not configured. Please ensure STRIPE_SECRET_KEY is added to Project Secrets." 
        });
      }

      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16' as any,
      });
      
      const host = req.get('host');
      const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol;
      const origin = `${protocol}://${host}`;

      console.log(`[Stripe] Creating session for: ${courseTitle}, Client: ${email}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email || undefined,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Unchained Academy: ${courseTitle || 'Strategy Session'}`,
                description: '60-minute intensive Bittensor strategy session with Shizzy Unchained.',
              },
              unit_amount: 10000, // $100.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // Pass metadata so it appears in the Stripe dashboard for the seller
        metadata: {
          clientName: name,
          clientEmail: email,
          requestedCourse: courseTitle,
          preferredTime: preferredTime,
        },
        success_url: `${origin}/#/school?success=true`,
        cancel_url: `${origin}/#/school`,
      });

      console.log(`[Stripe] Session Success: ${session.id}`);
      return res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      console.error('[Stripe] ERROR:', err);
      return res.status(500).json({ 
        error: err.message || "An error occurred during Stripe session creation.",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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
