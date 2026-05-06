import "dotenv/config";
import express from "express";
import path from "path";
import Stripe from "stripe";

const app = express();
const PORT = process.env.PORT || 3000;

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
    stripe: !!(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY),
    node_env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

app.get("/api/test-server", (req, res) => {
  res.json({ status: "alive", time: new Date().toISOString() });
});

// Stripe Checkout Session (Manual Calendar Flow)
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { courseTitle, name, email, preferredTime, stripePriceId } = req.body;
    const stripeKey = (process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY)?.trim();
    
    if (!stripeKey) {
      console.error("[Stripe Error] Missing STRIPE_SECRET_KEY in environment variables. Could also be wrong environment variable name.");
      return res.status(500).json({ 
        error: "Stripe configuration error. Missing STRIPE_SECRET_KEY. Please add the live secret key (sk_live_...) to the project secrets." 
      });
    }

    if (stripeKey.startsWith('pk_')) {
      console.error("[Stripe Error] Wrong key mode: STRIPE_SECRET_KEY appears to be a publishable key (pk_...). It must be a secret key (sk_...).");
      return res.status(500).json({ error: "Invalid Stripe key mode configured. You are using a 'pk_...' key but need a 'sk_...' key." });
    }

    if (stripeKey.startsWith('sk_test_')) {
      console.warn("[Stripe Warning] You are using a test key (sk_test_...). Ensure you do not mix Test keys with Live price IDs.");
    } else if (stripeKey.startsWith('sk_live_')) {
      console.warn("[Stripe Warning] You are using a live key (sk_live_...). Ensure you do not mix Live keys with Test price IDs.");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16' as any,
    });
    
    const host = req.get('host') || 'localhost:3000';
    const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const origin = `${protocol}://${host}`;

    if (!origin || !origin.startsWith('http')) {
      console.error("[Stripe Error] Invalid origin resolved for success_url or cancel_url:", origin);
      return res.status(500).json({ error: "Invalid origin resolved. Missing success_url or cancel_url capabilities." });
    }

    if (!req.method || req.method !== 'POST') {
      console.error("[Stripe Error] Wrong HTTP method. Only POST is allowed.");
      return res.status(405).json({ error: "Wrong HTTP method. Only POST is allowed." });
    }

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
    console.error('[Stripe API Error] Message:', err.message);
    console.error('[Stripe API Error] Type:', err.type);
    console.error('[Stripe API Error] Code:', err.code);
    
    if (err.message && err.message.includes("No such price")) {
       console.error("[Stripe Error] Invalid Price ID detected.");
    }
    
    return res.status(500).json({ 
      error: err.message || "An error occurred during Stripe session creation."
    });
  }
});

app.post("/api/extract-image", async (req, res) => {
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const Jimp = (await import("jimp")).default;

    const { images } = req.body;
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const base64Data = images[0].replace(/^data:image\/(jpeg|png|webp);base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    const jimpImage = await Jimp.read(buffer);
    jimpImage.quality(60); 
    const compressedBuffer = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);
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
    console.error(err);
    res.status(500).json({ error: err.message });
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
  import("vite").then(({ createServer: createViteServer }) => {
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

export default app;
