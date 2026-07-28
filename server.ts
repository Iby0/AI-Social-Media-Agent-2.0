import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client lazily or gracefully handle missing key
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AI Social Media Agent Backend", timestamp: new Date().toISOString() });
});

// AI Social Media Post Generator Endpoint
app.post("/api/ai/generate", async (req, res) => {
  try {
    const {
      topic,
      tone = "Professional",
      audience = "General Tech Community",
      callToAction = "Engage in comments",
      platforms = ["facebook", "instagram", "linkedin", "github"],
      includeHashtags = true,
      customInstructions = "",
    } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Topic is required to generate content." });
    }

    const ai = getGeminiAI();

    const prompt = `
You are an expert AI Social Media Copywriter and Growth Marketer.
Generate optimized social media post content for the following platforms: ${platforms.join(", ")}.

Topic/Topic Outline: "${topic}"
Desired Tone of Voice: ${tone}
Target Audience: ${audience}
Call to Action: ${callToAction}
Custom Instructions: ${customInstructions || "None"}

Generate platform-specific versions tailored to each platform's culture and formatting constraints:
- Facebook: Engaging storytelling, line breaks, clear CTA, 2-4 relevant hashtags.
- Instagram: Visual-first caption, emoji-rich, compelling hooks, line spacing, 8-15 high-converting hashtags.
- LinkedIn: Professional insights, bulleted key takeaways, industry perspective, strong opening line, 3-5 professional hashtags.
- GitHub: Markdown formatted (supports code blocks/releases/announcements), technical depth, repository link references, concise technical tags.

Also generate a cohesive AI Image Generation Prompt that matches the theme of this post.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Return only clean structured JSON matching the requested schema without markdown codeblocks wrappers if possible.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A punchy internal campaign or post title" },
            captions: {
              type: Type.OBJECT,
              properties: {
                facebook: { type: Type.STRING, description: "Facebook caption content" },
                instagram: { type: Type.STRING, description: "Instagram caption content" },
                linkedin: { type: Type.STRING, description: "LinkedIn caption content" },
                github: { type: Type.STRING, description: "GitHub markdown announcement content" },
              },
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of recommended hashtags without spaces",
            },
            suggestedImagePrompt: {
              type: Type.STRING,
              description: "Detailed graphic/photo prompt for generating matching social visual",
            },
            summaryKeyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 quick key points summarizing the post value",
            },
          },
          required: ["title", "captions", "hashtags", "suggestedImagePrompt"],
        },
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Error in /api/ai/generate:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to generate AI social media post content.",
    });
  }
});

// AI Image Prompt / Visual Concept Generator
app.post("/api/ai/image-prompt", async (req, res) => {
  try {
    const { postContent, style = "Modern Vibrant 3D Render" } = req.body;
    if (!postContent) {
      return res.status(400).json({ error: "postContent is required" });
    }

    const ai = getGeminiAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Based on this social media post text, create a detailed, high-quality prompt suitable for AI image generation tools (Midjourney, DALL-E, Imagen).
Post Content: "${postContent}"
Art Style: ${style}

Output JSON with 'imagePrompt', 'colorPalette', and 'conceptDescription'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            imagePrompt: { type: Type.STRING },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            conceptDescription: { type: Type.STRING },
          },
          required: ["imagePrompt", "colorPalette", "conceptDescription"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error("Error in /api/ai/image-prompt:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to generate image prompt." });
  }
});

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
    console.log(`[AI Social Media Agent] Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
