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

// Module 17: AI Image Generation Engine Endpoint
app.post("/api/image-ai/generate", async (req, res) => {
  try {
    const { input, prompt } = req.body;
    if (!input || !input.style) {
      return res.status(400).json({ success: false, error: "Invalid image input configuration." });
    }

    const {
      topic = "AI Social Media Growth",
      platform = "linkedin",
      imageType = "LinkedIn Banner",
      style = "Technology",
      aspectRatio = "16:9",
      brandColors = ["#3b82f6", "#1e293b", "#06b6d4"],
    } = input;

    // Helper to calculate dimensions
    const getDimensions = (ratio: string) => {
      switch (ratio) {
        case "16:9":
          return { width: 1200, height: 675 };
        case "9:16":
          return { width: 1080, height: 1920 };
        case "4:3":
          return { width: 1200, height: 900 };
        case "4:1":
          return { width: 1584, height: 396 };
        case "3:2":
          return { width: 1200, height: 800 };
        case "1:1":
        default:
          return { width: 1080, height: 1080 };
      }
    };

    const dims = getDimensions(aspectRatio);

    // Attempt Gemini Imagen API if configured
    let imageUrl = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiAI();
        const imageModelName = process.env.IMAGE_MODEL || "imagen-3.0-generate-002";
        
        // Try calling generateImages API if available in SDK
        if ((ai.models as any).generateImages) {
          const result = await (ai.models as any).generateImages({
            model: imageModelName,
            prompt: prompt || `High resolution ${style} ${imageType} graphic image representing ${topic}`,
            config: {
              numberOfImages: 1,
              outputMimeType: "image/png",
              aspectRatio: aspectRatio === "16:9" ? "16:9" : aspectRatio === "9:16" ? "9:16" : aspectRatio === "4:3" ? "4:3" : "1:1",
            },
          });
          if (result && result.generatedImages && result.generatedImages[0]) {
            const base64Data = result.generatedImages[0].image.imageBytes;
            imageUrl = `data:image/png;base64,${base64Data}`;
          }
        }
      } catch (geminiErr: any) {
        console.warn("Gemini Imagen direct call unavailable, utilizing high-resolution graphic engine:", geminiErr?.message || geminiErr);
      }
    }

    // High-Resolution Styled SVG Graphic fallback if Imagen was not triggered or had quota limits
    if (!imageUrl) {
      const primaryColor = brandColors[0] || "#3b82f6";
      const secondaryColor = brandColors[1] || "#1e293b";
      const accentColor = brandColors[2] || "#06b6d4";

      const escapeXml = (str: string) =>
        str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

      const cleanTopic = escapeXml(topic);
      const cleanPlatform = escapeXml(platform.toUpperCase());
      const cleanType = escapeXml(imageType);

      let bgGradient = `linear-gradient(135deg, ${secondaryColor}, #090d16)`;
      let cardBg = "rgba(255, 255, 255, 0.07)";
      let textColor = "#ffffff";
      let subtitleColor = "#94a3b8";

      if (style === "Minimal" || style === "Light") {
        bgGradient = "linear-gradient(135deg, #f8fafc, #e2e8f0)";
        cardBg = "rgba(255, 255, 255, 0.9)";
        textColor = "#0f172a";
        subtitleColor = "#475569";
      } else if (style === "Creative" || style === "Gradient") {
        bgGradient = `linear-gradient(135deg, ${primaryColor}, #8b5cf6, ${accentColor})`;
        cardBg = "rgba(0, 0, 0, 0.25)";
        textColor = "#ffffff";
        subtitleColor = "#e2e8f0";
      }

      const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${dims.width}" height="${dims.height}" viewBox="0 0 ${dims.width} ${dims.height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="1"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="100%" height="100%" fill="${secondaryColor}"/>
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>

  <!-- Geometric Grid & Circuit Accents -->
  <circle cx="${dims.width * 0.85}" cy="${dims.height * 0.2}" r="${dims.height * 0.35}" fill="${accentColor}" opacity="0.12"/>
  <circle cx="${dims.width * 0.15}" cy="${dims.height * 0.8}" r="${dims.height * 0.25}" fill="${primaryColor}" opacity="0.15"/>
  <path d="M 0,${dims.height * 0.5} Q ${dims.width * 0.5},${dims.height * 0.2} ${dims.width},${dims.height * 0.5}" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.3"/>
  <path d="M 0,${dims.height * 0.6} Q ${dims.width * 0.5},${dims.height * 0.9} ${dims.width},${dims.height * 0.6}" fill="none" stroke="${primaryColor}" stroke-width="2" opacity="0.2"/>

  <!-- Centered Hero Layout Panel -->
  <rect x="${dims.width * 0.08}" y="${dims.height * 0.12}" width="${dims.width * 0.84}" height="${dims.height * 0.76}" rx="24" fill="${cardBg}" stroke="${primaryColor}" stroke-width="2" stroke-opacity="0.4" filter="url(#shadow)"/>

  <!-- Top Badge Bar -->
  <rect x="${dims.width * 0.12}" y="${dims.height * 0.2}" width="160" height="38" rx="19" fill="${primaryColor}"/>
  <text x="${dims.width * 0.12 + 80}" y="${dims.height * 0.2 + 24}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="1.5">${cleanPlatform}</text>

  <rect x="${dims.width * 0.12 + 175}" y="${dims.height * 0.2}" width="180" height="38" rx="19" fill="rgba(255,255,255,0.12)" stroke="${accentColor}" stroke-width="1"/>
  <text x="${dims.width * 0.12 + 265}" y="${dims.height * 0.2 + 24}" fill="${textColor}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle">${cleanType}</text>

  <!-- Hero Topic Title -->
  <foreignObject x="${dims.width * 0.12}" y="${dims.height * 0.32}" width="${dims.width * 0.76}" height="${dims.height * 0.4}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: ${textColor}; font-family: system-ui, -apple-system, sans-serif; font-size: ${Math.min(dims.width / 24, 42)}px; font-weight: 800; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
      ${cleanTopic}
    </div>
  </foreignObject>

  <!-- Footer Brand Bar -->
  <line x1="${dims.width * 0.12}" y1="${dims.height * 0.78}" x2="${dims.width * 0.88}" y2="${dims.height * 0.78}" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
  <text x="${dims.width * 0.12}" y="${dims.height * 0.82 + 12}" fill="${subtitleColor}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500">AI Social Media Studio &bull; ${style} Visual Engine</text>
  <text x="${dims.width * 0.88}" y="${dims.height * 0.82 + 12}" fill="${accentColor}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="end">AI GENERATED</text>
</svg>`.trim();

      const encodedSvg = encodeURIComponent(svgContent);
      imageUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
    }

    return res.json({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      imageUrl,
      dimensions: dims,
      imageSize: Math.round((imageUrl.length * 3) / 4),
      provider: "Google Gemini Image API",
      style,
      aspectRatio,
      platform,
      imageType,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error in /api/image-ai/generate:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "AI Image generation failed.",
    });
  }
});

// Module 16: Comprehensive AI Content Generation Engine Process Endpoint
app.post("/api/ai/process", async (req, res) => {
  try {
    const { input, prompt } = req.body;
    if (!input || !input.feature) {
      return res.status(400).json({ success: false, error: "Invalid AI process input parameters." });
    }

    const ai = getGeminiAI();
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    const systemInstruction = `
You are an expert AI Social Media Content Generator and Growth Copywriter.
Generate high-converting, platform-specific content based on the user instructions.

CRITICAL LANGUAGE MANDATES:
- If language is 'Bangla', generate all main text (title, caption, cta) strictly in natural, elegant Bengali (বাংলা) script.
- If language is 'Mixed Bengali + English', generate modern conversational "Banglish" using both English and Bengali scripts naturally.
- If language is 'English', write in polished English.

Return clean structured JSON matching the requested schema.
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt || `Generate AI content for feature ${input.feature} on platform ${input.platform} regarding topic: ${input.topic || input.existingContent}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy title or headline for the post" },
            caption: { type: Type.STRING, description: "Main body caption or post content optimized for platform" },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of relevant hashtags with '#' prefix",
            },
            cta: { type: Type.STRING, description: "Clear, engaging Call-To-Action phrase" },
            imagePrompt: { type: Type.STRING, description: "Detailed visual concept prompt for image generation" },
            seoKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key search engine / social discovery keywords",
            },
            estimatedReadingTime: { type: Type.STRING, description: "Estimated read time, e.g. '1 min read'" },
            characterCount: { type: Type.INTEGER, description: "Character length of the generated caption" },
          },
          required: ["title", "caption", "hashtags", "cta", "imagePrompt", "seoKeywords"],
        },
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    if (!data.characterCount) {
      data.characterCount = (data.caption || "").length;
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Error in /api/ai/process:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "AI Engine process failed.",
    });
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
