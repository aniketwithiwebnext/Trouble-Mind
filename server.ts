import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI securely lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot will run in simulation fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Chatbot endpoint with the Gemini API
app.post("/api/chatbot/message", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const keyExist = !!process.env.GEMINI_API_KEY;

    const brandContext = `
      You are the official AI fashion consultant and digital assistant for "Troubled Mind", a premium, edgy streetwear brand hailing from Antioch, Tennessee.
      
      Our Brand Identity:
      - Brand Name: Troubled Mind
      - Website: troubledmind.us
      - Location: Antioch, Tennessee
      - Phone: 615-715-2900
      - Email: waniisaggrey@gmail.com
      - Design Ethos: Streetwear-inspired streetwear representing resilience, individuality, self-expression, creativity, and modern urban culture. Our style is a dark streetwear aesthetic (black, white, charcoal, silver).
      
      Our Key Products:
      1. RESILIENCE heavy hoodie: 450GSM organic loopback cotton, oversized boxy fit. Charcoal/Onyx. $85.
      2. SELF-EXPRESSION vintage tee: 280GSM heavy jersey. Washed/distressed. $45.
      3. CHAOS CONTROL cargo trousers: Tactical military cargo with metal fasteners. $110.
      4. INDIVIDUALITY acid denim jacket: Outlaw hand-shredded denim wash. $140.
      5. TROUBLED SOUL knit beanie: Premium ribbed stretch beanie with a metals crest. $30.
      6. VOID GRAPHICS heavy crewneck: 380GSM French Terry. Deep back graphics. $75.
      7. METROPOLIS liquid puffer: Water-repelling down, chrome silver/black. $195.
      8. INNER FORCE leather jacket: Premium full grain matte lamb skin motorcycle core. $250.

      Policies & Discounts:
      - Shipping: Based in Antioch, Tennessee. Fast standard delivery in TN takes 1-2 days. Nationwide takes 3-5 days. Free delivery on orders over $150.
      - Returns: 30-day window for easy size swaps or returns.
      - Exclusive Active Promo Codes you can recommend:
        * 'MIND20' for 20% off.
        * 'TROUBLE15' for 15% off.
        * 'TENNESSEE10' for $10 flat off.
      
      Your Persona:
      - Conversational, bold, modern, respectful, helpful but cool.
      - Never break character. Frame answers emphasizing our high weight fabrics, Nashville/Antioch TN vibe, and elite streetwear aesthetics.
      - Keep responses moderate, scannable, using fine bullet points if describing products. 
    `;

    if (!keyExist) {
      // Simulate real-looking responsive fallback reply if key is absent
      const lowMessage = message.toLowerCase();
      let responseText = "Hey! Thanks for reaching out to Troubled Mind Apparel. We are based out of Antioch, Tennessee, representing individuality and resilience. We are currently initializing our server routes. How can I help you style our heavyweight hoodie or cargos today?";
      if (lowMessage.includes("hoodie") || lowMessage.includes("resilience")) {
        responseText = "Our 'RESILIENCE' Heavyweight Hoodie is an absolute masterpiece! Crafted from 450GSM pre-shrunk organic cotton with drop-shoulder tailoring and physical hand-distressing. Use code MIND20 to get 20% off right now!";
      } else if (lowMessage.includes("discount") || lowMessage.includes("promo") || lowMessage.includes("code")) {
        responseText = "Hell yeah, we got you! Use code **MIND20** to score 20% off your entire cart, or **TROUBLE15** for 15% off! Type it in during secure checkout.";
      } else if (lowMessage.includes("shipping") || lowMessage.includes("delivery") || lowMessage.includes("antioch") || lowMessage.includes("locate")) {
        responseText = "We operate out of Antioch, Tennessee (Phone: 615-715-2900). Shipping within TN is super quick (usually 1-2 business days). Nationwide delivery takes 3-5 business days. Free shipping kicks in on all orders above $150!";
      } else if (lowMessage.includes("contact") || lowMessage.includes("phone") || lowMessage.includes("email")) {
        responseText = "You can hit up our direct team at **615-715-2900** or shoot a message to **waniisaggrey@gmail.com**. We're based in Antioch, TN and respond within a few hours.";
      } else if (lowMessage.includes("size") || lowMessage.includes("fit")) {
        responseText = "Most of our items (especially the hoodies & crewnecks) feature a modern boxy oversized streetwear silhouette. If you prefer a trimmer custom fit, we suggest ordering one size down!";
      }
      return res.json({ text: responseText });
    }

    const ai = getGeminiClient();
    
    // Format full conversational chat content
    const chatSessionContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        chatSessionContents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
    }
    
    chatSessionContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatSessionContents,
      config: {
        systemInstruction: brandContext,
        temperature: 0.75,
      }
    });

    res.json({ text: response.text || "I am here. How can I help you express your individuality today?" });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ error: "Failed to generate AI response", details: error.message });
  }
});

// 2. Vite Integration Middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Troubled Mind Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
