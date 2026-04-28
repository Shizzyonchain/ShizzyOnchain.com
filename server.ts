import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";

async function startServer() {
  const app = express();
  const PORT = 3000;

  let stripeClient: Stripe | null = null;
  function getStripe(): Stripe {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error('STRIPE_SECRET_KEY environment variable is required');
      }
      stripeClient = new Stripe(key, { apiVersion: "2024-04-10" });
    }
    return stripeClient;
  }

  app.post("/api/create-checkout-session", express.json(), async (req, res) => {
    try {
      const stripe = getStripe();
      const { items } = req.body; // array of { id, name, price, quantity, image }

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // price in cents
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: `${req.headers.origin}/shop?success=true`,
        cancel_url: `${req.headers.origin}/shop?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Printful API Integration
  app.get("/api/shop/products", async (req, res) => {
    try {
      const apiKey = process.env.PRINTFUL_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'PRINTFUL_API_KEY is missing in environment variables. Please add it in Settings.' });
      }

      // 1. Get the list of products
      const listResponse = await fetch('https://api.printful.com/store/products', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      if (!listResponse.ok) {
        const errorText = await listResponse.text();
        console.error('Printful API error:', errorText);
        return res.status(listResponse.status).json({ error: `Printful API returned ${listResponse.status}: ${errorText}` });
      }

      const listData = await listResponse.json();
      const products = listData.result || [];

      if (products.length === 0) {
        return res.json([]);
      }

      // 2. Fetch detailed info (including prices) for each product
      const detailedProducts = await Promise.all(
        products.slice(0, 15).map(async (p: any) => {
          try {
            const detailRes = await fetch(`https://api.printful.com/store/products/${p.id}`, {
              headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            const detailData = await detailRes.json();
            const productData = detailData.result;
            
            if (!productData) return null;

            const syncProduct = productData.sync_product;
            const variants = productData.sync_variants || [];
            
            // Use the retail price of the first variant as the display price
            // If no variants, fallback to a sensible default or the first one found
            const firstVariant = variants.length > 0 ? variants[0] : null;
            const price = firstVariant ? parseFloat(firstVariant.retail_price) : 35.00;

            // Find the best image
            let imageUrl = p.thumbnail_url || syncProduct?.thumbnail_url;
            if (!imageUrl && firstVariant && firstVariant.files) {
              const previewFile = firstVariant.files.find((f: any) => f.type === 'preview');
              if (previewFile) imageUrl = previewFile.url;
            }

            return {
              id: String(p.id),
              name: p.name || syncProduct?.name || 'Unnamed Product',
              price: price,
              image: imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
              category: p.name?.toLowerCase().includes('hat') ? 'Hat' : 'T-Shirt',
              description: 'Official Shizzy Unchained Apparel.'
            };
          } catch (e) {
            console.error(`Failed to fetch details for product ${p.id}:`, e);
            return null;
          }
        })
      );

      res.json(detailedProducts.filter(p => p !== null));
    } catch (e: any) {
      console.error('Unexpected server error fetching products:', e);
      res.status(500).json({ error: e.message });
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
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.get("/api/env-debug", (req, res) => {
    res.json({ key: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) : 'MISSING' });
  });

  app.post("/api/extract-image", express.json(), async (req, res) => {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await fetch('https://i.postimg.cc/t4hy7vTN/PORT.png');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
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
