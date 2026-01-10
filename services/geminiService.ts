
import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle } from "../types.ts";

export const generateAIInsight = async (userPrompt: string): Promise<NewsArticle> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As Shizzy, a world-class on-chain analyst and crypto visionary, generate a detailed "Hot Take" article based on the following topic or prompt: "${userPrompt}". 
    The article should be insightful, slightly provocative, and backed by a narrative of on-chain data.
    Ensure the timestamp is current (e.g., "FEBRUARY 14, 2026").
    The imageUrl should be a high-quality relevant tech/crypto image from Unsplash (e.g., https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          category: { type: Type.STRING, description: "Should be 'AI GENERATED INSIGHT' or similar" },
          author: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          summary: { type: Type.STRING },
          content: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "An array of 3-5 paragraphs of detailed analysis."
          },
          imageUrl: { type: Type.STRING },
          snapshots: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                asset: { type: Type.STRING },
                price: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["asset", "price", "description"]
            }
          }
        },
        required: ["id", "title", "category", "author", "timestamp", "summary", "content", "imageUrl", "snapshots"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI engine");
  
  try {
    return JSON.parse(text) as NewsArticle;
  } catch (e) {
    console.error("Failed to parse AI response", text);
    throw new Error("Invalid response format from AI engine");
  }
};
