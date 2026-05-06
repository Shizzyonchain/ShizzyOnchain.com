import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    res.json({ key: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) : 'MISSING' });
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", express.json(), async (req, res) => {
    try {
      const { courseTitle } = req.body;
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeKey) {
        console.error("STRIPE_SECRET_KEY is missing from environment variables.");
        return res.status(500).json({ 
          error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." 
        });
      }

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: courseTitle || 'Unchained Academy Session',
                description: '60-minute intensive Bittensor strategy session.',
              },
              unit_amount: 10000, // $100.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://calendly.com/shizzyunchained?utm_source=stripe&utm_campaign=school&course=${encodeURIComponent(courseTitle)}`,
        cancel_url: `${req.headers.origin}/#/school`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      console.error('Stripe Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/extract-image", express.json(), async (req, res) => {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
