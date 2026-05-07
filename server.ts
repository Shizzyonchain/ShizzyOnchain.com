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
