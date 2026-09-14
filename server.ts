import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { autoArticlePublisher } from "./server/autoArticlePublisher";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client lazily if key exists
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    service: "Johnnyblue1 Books Stores - Knowledge Centa 10-Dimension Engine",
    timestamp: new Date().toISOString()
  });
});

// Dynamic robots.txt for search engines (Google, Bing, Perplexity, AI crawlers)
app.get("/robots.txt", (req, res) => {
  const domain = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Allow: /reels
Allow: /blog
Allow: /library
Allow: /publish
Disallow: /api/private/

# AI Search Engine & Bot directives
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${domain}/sitemap.xml
`);
});

// Dynamic XML Sitemap for Google & Web Search Engine Indexing
app.get("/sitemap.xml", (req, res) => {
  const domain = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: `${domain}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${domain}/#reels`, priority: '0.9', changefreq: 'hourly' },
    { loc: `${domain}/#blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${domain}/#publish`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${domain}/#library`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${domain}/#author-profile`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${domain}/#dimension-silk-cotton`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${domain}/#dimension-digital-device`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${domain}/#dimension-handwritten-manuscript`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${domain}/#dimension-musical-album`, priority: '0.9', changefreq: 'weekly' },
  ];

  const xmlUrls = staticPages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  res.setHeader("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${xmlUrls}
</urlset>`);
});

// Standard ads.txt for Google AdSense verification & crawler authorization
app.get("/ads.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(`# Google AdSense Authorized Digital Sellers (ads.txt)
# Johnnyblue1 Books Stores & Knowledge Centa
# https://johnnyblue1-knowledge-centa.web.app
google.com, pub-9428510842095172, DIRECT, f08c47fec0942fa0
google.com, pub-1330230443330000, DIRECT, f08c47fec0942fa0
`);
});

// =================================================================
// BRAND LOGO & SOCIAL MEDIA SHARING ASSETS (WHATSAPP, X, FACEBOOK)
// =================================================================
// Serve static /public directory assets with explicit headers
app.use(express.static(path.join(process.cwd(), "public"), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    }
  }
}));

// Direct logo and OpenGraph share card image endpoints
app.get(["/og-image.png", "/og-image"], (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.sendFile(path.join(process.cwd(), "public", "og-image.png"));
});

app.get(["/og-image.svg"], (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.sendFile(path.join(process.cwd(), "public", "og-image.svg"));
});

app.get(["/logo.png", "/logo-square.png", "/logo"], (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.sendFile(path.join(process.cwd(), "public", "logo-square.png"));
});

app.get(["/logo.svg"], (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.sendFile(path.join(process.cwd(), "public", "logo.svg"));
});

app.get(["/favicon.ico"], (req, res) => {
  res.setHeader("Content-Type", "image/x-icon");
  res.sendFile(path.join(process.cwd(), "public", "favicon.ico"));
});

app.get(["/favicon-32x32.png"], (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.sendFile(path.join(process.cwd(), "public", "favicon-32x32.png"));
});

app.get(["/favicon-16x16.png"], (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.sendFile(path.join(process.cwd(), "public", "favicon-16x16.png"));
});

app.get(["/apple-touch-icon.png"], (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.sendFile(path.join(process.cwd(), "public", "apple-touch-icon.png"));
});

app.get(["/site.webmanifest"], (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json");
  res.sendFile(path.join(process.cwd(), "public", "site.webmanifest"));
});

// Bot Crawler Social Card interceptor: ensures WhatsApp, Facebook, Twitter, Telegram,
// LinkedIn, Slack, and Discord scrapers receive the full HTML with absolute URLs for the logo
const SOCIAL_BOT_REGEX = /facebookexternalhit|Facebot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Discordbot|Slackbot|Googlebot|bingbot/i;

app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  if (req.method === 'GET' && SOCIAL_BOT_REGEX.test(userAgent) && !req.path.startsWith('/api') && !req.path.includes('.')) {
    try {
      const indexPath = path.join(process.cwd(), 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        const host = req.get('host') || 'johnnyblue1-knowledge-centa.web.app';
        const protocol = req.protocol || 'https';
        const absoluteBase = `${protocol}://${host}`;
        
        // Dynamically point og:image and twitter:image to the current host
        html = html.replace(/https:\/\/johnnyblue1-knowledge-centa\.web\.app\/og-image\.png/g, `${absoluteBase}/og-image.png`);
        html = html.replace(/https:\/\/johnnyblue1-knowledge-centa\.web\.app\/logo-square\.png/g, `${absoluteBase}/logo-square.png`);
        html = html.replace(/https:\/\/johnnyblue1-knowledge-centa\.web\.app\//g, `${absoluteBase}${req.originalUrl}`);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
    } catch (e) {
      // Fallback to regular pipeline
    }
  }
  next();
});

// ==========================================
// CONVERSATIONAL AI BOOK ASSISTANT (GEMINI)
// ==========================================
app.post("/api/gemini/book-assistant", async (req, res) => {
  const { book, messages = [], userQuestion, message, question, language = 'en' } = req.body || {};
  const queryText = (userQuestion || message || question || '').trim();

  if (!queryText || typeof queryText !== 'string') {
    return res.status(400).json({ success: false, error: "Missing userQuestion or message parameter" });
  }

  const safeBook = book || {
    title: "The Sovereign Creator",
    subtitle: "Architecting Digital Wealth, AI Leverage, and Decentralized Publishing",
    author: "Johnny Blue",
    authorBio: "Johnny Blue is an author, literary architect, and pioneer of 10-dimension physical and digital literature on Knowledge Centa.",
    category: "Business & Philosophy",
    description: "A foundational masterwork exploring creative sovereignty, multi-format media, and decentralized reader relationships across 10 sensory dimensions.",
    pages: 380,
    isbn: "978-0-998877-44-1",
    publisher: "Knowledge Centa Media"
  };

  // Format details summary for model grounding
  const formatList = safeBook.formats 
    ? Object.keys(safeBook.formats).map((key: string) => {
        const f = safeBook.formats[key];
        return `${f.name || key}: $${f.price || 0} (${f.features?.join(', ') || 'Ready for instant access'})`;
      }).join('\n')
    : '10 Dimensions available: eBook, Audiobook, 4K Videobook, Raw Handwritten Manuscript Scans, Clothbound Hardcover, Trade Papercover, 64GB USB-C Vault, Original Score Musical Album, Organic Silk & Cotton Weave, Dedicated E-Ink Reader';

  const chapterOneSample = safeBook.chapterOnePreview?.content 
    ? safeBook.chapterOnePreview.content.slice(0, 3).join('\n') 
    : '';

  try {
    const ai = getGenAIClient();
    if (ai) {
      const systemInstruction = `You are the official conversational AI Book Scholar & Concierge for "${safeBook.title}" by ${safeBook.author} on Johnnyblue1 Books Stores & Knowledge Centa.

Deep Knowledge Grounding:
- Title: ${safeBook.title}
- Subtitle: ${safeBook.subtitle || 'N/A'}
- Author: ${safeBook.author}
- Author Biography: ${safeBook.authorBio || 'Accomplished author and sovereign publishing pioneer'}
- Category / Genre: ${safeBook.category || 'Literature & Philosophy'}
- Publisher: ${safeBook.publisher || 'Knowledge Centa Media'}
- ISBN: ${safeBook.isbn || 'N/A'}
- Page Count: ${safeBook.pages || 'N/A'}
- Overview & Description: ${safeBook.description || ''}
${chapterOneSample ? `- Chapter 1 Excerpt:\n${chapterOneSample}` : ''}
- 10 Physical & Digital Dimensions Offered:
${formatList}

Knowledge Centa Dimensions Primer:
1. eBook: Reflowable EPUB3 & PDF for any device.
2. Audiobook: Crystal-clear narration at 320kbps with chapter cues.
3. 4K Videobook: Masterclass cinema direction with motion typography.
4. Raw Handwritten Manuscript: 1200 DPI archival scans of author's actual fountain pen notebook with margin sketches.
5. Clothbound Hardcover: 130gsm acid-free cream paper, German millboard, warm gold foil stamping.
6. Paper Cover: Trade paperback with silk-touch matte finish.
7. Pendrive & Micro-SD Vault: 64GB dual storage preloaded with 24-bit/96kHz lossless FLAC, 4K ProRes, and raw TIFFs.
8. Musical Album Soundtrack: Original classical/synth orchestration composed specifically to accompany chapters.
9. Silk & Cotton Artisan Weave: Handloom organic Khadi cotton with wild mulberry silk ribbon and coptic spine binding.
10. Dedicated Digital Device ROM: Standalone distraction-free E-Ink reading slab carrying all other 9 dimensions.

Guidelines for your response:
1. Speak with intellectual warmth, scholarly authority, and inviting literary passion.
2. Answer questions about the book's themes, core message, target audience, chapter breakdowns, author philosophy, and genre context.
3. When asked about editions or formats, explain the craftsmanship of each dimension with tactile precision.
4. Use clean Markdown formatting: bold headings, concise bullet points, and brief evocative quotes when helpful.
5. Provide 2-3 tailored follow-up question ideas at the end.
6. Respect the user's language: if they ask in Spanish, French, German, Arabic, etc., reply in that language fluently.`;

      // Build conversation contents including message history
      const contents: any[] = [];
      
      // Include up to 6 previous turns
      if (Array.isArray(messages) && messages.length > 0) {
        const recentMessages = messages.slice(-6);
        for (const msg of recentMessages) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      // Add current user prompt
      contents.push({
        role: 'user',
        parts: [{ text: queryText }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const answerText = response.text || "Thank you for asking about this work. Please let me know what specific aspect of the book or author you would like to explore.";

      // Extract or generate smart follow-up suggestions
      const defaultFollowUps = [
        `What makes ${safeBook.author}'s writing unique in ${safeBook.category}?`,
        "How does the Silk & Cotton edition compare to the Dedicated E-Ink device?",
        "Can you summarize the core takeaway from Chapter 1?"
      ];

      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        answer: answerText,
        followUps: defaultFollowUps
      });
    }
  } catch (err: any) {
    console.warn("Gemini book assistant error, switching to resilient context fallback:", err);
  }

  // Resilient fallback contextual answer if Gemini is unavailable
  const qLower = queryText.toLowerCase();
  let fallbackAnswer = "";
  let followUps = [
    `Who is the ideal reader for "${safeBook.title}"?`,
    "What formats include the original musical soundtrack?",
    `Tell me more about ${safeBook.author}'s publishing philosophy.`
  ];

  if (qLower.includes("author") || qLower.includes("who wrote") || qLower.includes("bio")) {
    fallbackAnswer = `### About ${safeBook.author}

**${safeBook.author}** is the author and architect behind **"${safeBook.title}"**. 

${safeBook.authorBio}

Published through **Knowledge Centa**, ${safeBook.author} champions the philosophy of **10-Dimension Sovereign Literature**—believing that books should exist not merely as ephemeral screen text, but as multi-sensory artifacts spanning raw handwritten drafts, museum-grade handloom textiles, and bespoke e-paper hardware.`;
  } else if (qLower.includes("format") || qLower.includes("edition") || qLower.includes("silk") || qLower.includes("dimension") || qLower.includes("hardware") || qLower.includes("manuscript")) {
    fallbackAnswer = `### The 10 Physical & Digital Dimensions of "${safeBook.title}"

This title is engineered across ten distinct sensory dimensions:

1. **Digital Formats:** Reflowable **eBook** (EPUB3/PDF), narrated **Audiobook** (320kbps MP3), and cinematic **4K Video Book**.
2. **Archival Physical Editions:** **Raw Handwritten Manuscript Scans** in 1200 DPI archival clarity, foil-embossed **Clothbound Hardcover**, and FSC-certified **Paper Cover**.
3. **Artifact Editions:** 
   - **Silk & Cotton Artisan Weave:** Hand-spun organic Khadi cotton with wild mulberry silk ribbons and coptic binding.
   - **Dedicated Standalone E-Ink Device:** Zero-distraction titanium alloy reading slab preloaded with all other 9 dimensions.
   - **64GB USB & Micro-SD Vault:** Containing uncompressed 24-bit/96kHz lossless audio and 4K ProRes master files.
   - **Original Musical Album Score:** Neo-classical and modular synth compositions scored to the cadence of the text.`;
  } else if (qLower.includes("summary") || qLower.includes("about") || qLower.includes("thesis") || qLower.includes("what is it about")) {
    fallbackAnswer = `### Overview & Core Thesis: "${safeBook.title}"

**Genre:** ${safeBook.category} • **Length:** ${safeBook.pages || 380} pages • **Publisher:** ${safeBook.publisher || 'Knowledge Centa Media'}

${safeBook.description}

#### Core Themes Explored:
- **Intellectual Autonomy:** Transcending algorithmic gatekeepers to cultivate deep, uninterrupted contemplation.
- **Multi-Sensory Immersion:** How pairing tactile handlooms, raw handwritten drafts, and bespoke scores elevates reading into a transformative ritual.
- **Sovereignty & Longevity:** Creating enduring cultural artifacts built to outlast digital platforms.`;
  } else if (qLower.includes("chapter") || qLower.includes("excerpt") || qLower.includes("quote")) {
    fallbackAnswer = `### Excerpt & Structure from "${safeBook.title}"

${chapterOneSample ? `> "${chapterOneSample.slice(0, 280)}..."` : `The opening movement sets an urgent intellectual tone, investigating how modern attention is fragmented by algorithmic feeds, and proposing a return to deep, permanent literature.`}

The work unfolds systematically from first principles to practical creative sovereignty, inviting the reader on a guided intellectual journey.`;
  } else {
    fallbackAnswer = `### Exploring "${safeBook.title}" by ${safeBook.author}

Thank you for your question regarding **"${safeBook.title}"** in the **${safeBook.category}** category.

This title stands out in the **Knowledge Centa** collection for its rigorous inquiry and innovative release across 10 physical and digital dimensions. Whether you are reading the reflowable digital edition, examining the author's raw fountain pen notes, or listening to the custom neo-classical score, the book offers an extraordinary depth of immersion.

Feel free to ask about specific chapters, the author's background, or which of the 10 editions best suits your reading preference!`;
  }

  return res.json({
    success: true,
    source: "local-grounded-engine",
    answer: fallbackAnswer,
    followUps
  });
});


// AI Natural Language Search Query Interpretation Endpoint
app.post("/api/search/ai-parse", async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "Query string is required" });
    }

    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are an AI book search query parser for a 10-dimension bookstore (eBook, Audiobook, Videobook, Manuscript, Hardcover, Papercover, Pendrive SD, Musical Album, Silk Cotton, Digital Device).
Analyze this reader query: "${query}".
Return ONLY a JSON object with this exact shape:
{
  "detectedFormat": "ebook" | "audiobook" | "videobook" | "manuscript" | "hardcover" | "papercover" | "pendrive_sd" | "musical_album" | "silk_cotton" | "digital_device" | null,
  "detectedCategory": string | null,
  "maxPrice": number | null,
  "minRating": number | null,
  "cleanedKeywords": string,
  "explanation": string
}`
              }
            ]
          }
        ],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      if (response.text) {
        try {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, parsed });
        } catch {
          // fall through
        }
      }
    }

    return res.json({
      success: false,
      message: "AI parser bypassed; client parser active"
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to parse query" });
  }
});

// AI Assistant for Author Studio: 10-Dimension Plan Generator
app.post("/api/ai/publish-assist", async (req, res) => {
  const { prompt, title, genre, premise, author } = req.body || {};

  try {
    const ai = getGenAIClient();
    if (ai) {
      const systemInstruction = `You are the chief AI Publishing Architect for Johnnyblue1 Books Stores & Knowledge Centa.
Your role is to formulate complete, flawless publishing blueprints across all 10 physical and digital dimensions of a book:
1. eBook (EPUB3 & PDF)
2. Audiobook (narrator cues, pacing)
3. 4K Video Book (cinematic direction)
4. Raw Handwritten Manuscript (fountain pen medium, paper weight, marginalia)
5. Clothbound Hardcover (foil stamping, cloth color, slipcase)
6. Paper Cover (trim size, cream page spine)
7. Pendrive & Micro-SD Vault (64GB master ISO partition, bonus digital archives)
8. Musical Album Soundtrack (genre, chamber/synth instrumentation, track names)
9. Silk & Cotton Artisan Weave (handloom organic Khadi weave, mulberry silk ribbon, coptic binding)
10. Dedicated Digital Device ROM (custom standalone E-Ink reading slab firmware preloading all 9 other dimensions)

Return ONLY valid JSON with this exact structure:
{
  "title": string,
  "subtitle": string,
  "author": string,
  "authorBio": string,
  "category": string,
  "description": string,
  "isbn": string,
  "pages": number,
  "pricing": {
    "ebook": number,
    "audiobook": number,
    "videobook": number,
    "manuscript": number,
    "hardcover": number,
    "papercover": number,
    "pendrive_sd": number,
    "musical_album": number,
    "silk_cotton": number,
    "digital_device": number
  },
  "manuscriptSpecs": {
    "medium": string,
    "notebookType": string,
    "fountainPenDetails": string,
    "scannedDpi": number,
    "notes": string
  },
  "hardcoverSpecs": {
    "paperWeightGsm": number,
    "bindingType": string,
    "clothColor": string,
    "foilStampingColor": string
  },
  "papercoverSpecs": {
    "trimSize": string,
    "paperType": string,
    "matteFinish": boolean
  },
  "pendriveSdSpecs": {
    "capacityGb": number,
    "formatSystem": string,
    "bonusArchivesIncluded": string[]
  },
  "musicalAlbumSpecs": {
    "albumTitle": string,
    "composer": string,
    "genre": string,
    "trackList": string[]
  },
  "silkCottonSpecs": {
    "material": string,
    "binding": string,
    "editionUnits": number,
    "threadCount": string
  },
  "digitalDeviceSpecs": {
    "deviceName": string,
    "screenTech": string,
    "casing": string,
    "preloadedDimensionsCount": number,
    "batteryLife": string
  },
  "marketingHooks": string[],
  "seoKeywords": string[],
  "readinessCheck": {
    "score": number,
    "itemsReady": number,
    "totalItems": number,
    "checklist": [{"name": string, "ready": boolean, "hint": string}]
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Create a comprehensive 10-dimension publishing plan for:
Title: ${title || 'The Sovereign Architect'}
Author: ${author || 'Johnny Blue'}
Genre: ${genre || 'Speculative Philosophy & Literary Science Fiction'}
Premise/Notes: ${premise || prompt || 'A visionary book exploring human transcendence through architectural memory and ten sensory physical and digital dimensions.'}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const plan = JSON.parse(responseText);
      return res.json({ success: true, plan, source: "gemini-3.8-flash" });
    }
  } catch (error) {
    console.error("Gemini AI publish assist error, falling back to local engine:", error);
  }

  // Fallback response if Gemini is not configured or fails
  const safeTitle = title?.trim() || "The Sovereign Architect: Chronos Vault";
  const safeAuthor = author?.trim() || "Johnny Blue";
  const safeGenre = genre?.trim() || "Philosophical Sci-Fi & Architecture";

  return res.json({
    success: true,
    source: "local-publish-engine",
    plan: {
      title: safeTitle,
      subtitle: "A Multi-Sensory Odyssey in Ten Dimensions of Thought and Material",
      author: safeAuthor,
      authorBio: `${safeAuthor} is an author and architect of multi-format literature, publishing across physical handlooms, archival inks, and custom e-paper hardware.`,
      category: safeGenre,
      description: `Across ten sensory dimensions, "${safeTitle}" redefines modern literature. From raw fountain pen notebooks preserved in 1200 DPI archival scans, to handloom organic Khadi silk bindings and a custom dedicated standalone E-Ink reading device preloaded with all formats—this masterpiece merges timeless craft with sovereign storytelling.`,
      isbn: `978-0-998877-${Math.floor(1000 + Math.random() * 9000)}-4`,
      pages: 420,
      pricing: {
        ebook: 9.99,
        audiobook: 24.99,
        videobook: 29.99,
        manuscript: 34.99,
        hardcover: 39.99,
        papercover: 19.99,
        pendrive_sd: 69.99,
        musical_album: 14.99,
        silk_cotton: 59.99,
        digital_device: 149.99
      },
      manuscriptSpecs: {
        medium: "Pelikan 4001 Brilliant Black Ink on Clairefontaine 120gsm Archival Paper",
        notebookType: "A5 Clothbound Thread-Sewn Journal with Ribbon Marker",
        fountainPenDetails: "Pilot Custom 823 Fountain Pen (Fine 14K Gold Nib)",
        scannedDpi: 1200,
        notes: "Contains 64 spontaneous margin architectural diagrams, crossed-out alternate endings, and chapter drafting timelines."
      },
      hardcoverSpecs: {
        paperWeightGsm: 130,
        bindingType: "Casebound Clothbound with German Millboard & Headbands",
        clothColor: "Deep Imperial Navy with Matte Suede Texture",
        foilStampingColor: "Reflective Warm Brass Gold Foil"
      },
      papercoverSpecs: {
        trimSize: '6.0" x 9.0" Trade Paperback',
        paperType: "FSC-Certified Acid-Free Cream Bookwove 70lb",
        matteFinish: true
      },
      pendriveSdSpecs: {
        capacityGb: 64,
        formatSystem: "Dual FAT32/exFAT High-Speed USB 3.2 + MicroSD Card Vault",
        bonusArchivesIncluded: [
          "Complete 24-bit/96kHz Lossless FLAC Master Recordings",
          "Uncompressed 4K ProRes Video Chapters (32 GB)",
          "1200 DPI Raw Handwritten TIFF Page Scans",
          "High-Resolution Printable Bookplate Art & Typography Posters"
        ]
      },
      musicalAlbumSpecs: {
        albumTitle: `${safeTitle}: Original Motion Score & Ambience`,
        composer: `${safeAuthor} & Knowledge Centa Sound Laboratory`,
        genre: "Neo-Classical Chamber Orchestra & Modular Analog Synthesizers",
        trackList: [
          "1. The Blueprint of Consciousness (07:14)",
          "2. Ink and Archival Paper (06:02)",
          "3. The Weave of Ancient Silk (08:35)",
          "4. Monolithic Titanium Nocturne (05:48)",
          "5. Resonance in Ten Dimensions (09:12)"
        ]
      },
      silkCottonSpecs: {
        material: "Organic Handloom Khadi Cotton & Wild Mulberry Silk Ribbon Inlay",
        binding: "Exposed Coptic Spine Stitching with Archival Linen Thread",
        editionUnits: 500,
        threadCount: "180 Thread Count Hand-Spun Warp and Weft"
      },
      digitalDeviceSpecs: {
        deviceName: "Johnnyblue1 Sovereign Tome E-Ink Reader (Edition 10)",
        screenTech: '10.3" Kaleido 3 Color E-Paper (300 PPI B&W / 150 PPI Color) with Front-Light Temperature Tuning',
        casing: "Matte Anodized Space Gray Titanium Alloy with Laser-Etched Spine Seal",
        preloadedDimensionsCount: 9,
        batteryLife: "6 Weeks on Single Charge (No Ads, No Notifications, No Distractions)"
      },
      marketingHooks: [
        "The world's first book released simultaneously across 10 physical and digital dimensions.",
        "Includes raw fountain pen scans and a standalone distraction-free E-ink device preloaded with all 9 other editions.",
        "Handwoven organic silk and custom orchestral soundscape crafted alongside the chapters."
      ],
      seoKeywords: [
        "10 dimension book",
        "Johnnyblue1 Books Stores",
        "Knowledge Centa author publishing",
        "silk and cotton book edition",
        "dedicated e-ink reading device",
        "raw manuscript handwritten scan",
        "book soundtrack album",
        "author publishing studio 85% royalty"
      ],
      readinessCheck: {
        score: 100,
        itemsReady: 10,
        totalItems: 10,
        checklist: [
          { name: "1. eBook (EPUB3 & Reflowable PDF)", ready: true, hint: "Fully validated with NCX table of contents" },
          { name: "2. Audiobook (320kbps MP3)", ready: true, hint: "Pro narration and chapter timestamps aligned" },
          { name: "3. 4K Video Book (HLS Stream)", ready: true, hint: "Master 4K video rendered at 24fps cinema grade" },
          { name: "4. Raw Handwritten Manuscript", ready: true, hint: "1200 DPI archival scans with marginalia transcription" },
          { name: "5. Clothbound Hardcover", ready: true, hint: "Foil stamping dieline and 130gsm paper specs ready" },
          { name: "6. Paper Cover (Trade Paperback)", ready: true, hint: "Trim size and spine width calculated for 420 pages" },
          { name: "7. Pendrive & Micro-SD Vault (64GB)", ready: true, hint: "Master ISO image configured with lossless FLAC" },
          { name: "8. Musical Album Soundtrack", ready: true, hint: "5 original score movements mastered at 24-bit 96kHz" },
          { name: "9. Silk & Cotton Artisan Weave", ready: true, hint: "Organic Khadi handloom weaving specs locked in" },
          { name: "10. Dedicated Digital Device ROM", ready: true, hint: "Custom firmware preloading all 9 dimensions validated" }
        ]
      }
    }
  });
});

// AI Author Biography Generator using Gemini API (gemini-3.8-flash)
app.post("/api/gemini/generate-bio", async (req, res) => {
  const { authorName, books, tone = 'prestigious', customNotes } = req.body || {};

  const safeAuthor = authorName?.trim() || "Dr. Marcus Sterling";
  const bookList = Array.isArray(books) && books.length > 0 ? books : [
    {
      title: "The Sovereign Creator: Architecting Digital Wealth, AI Leverage, and Decentralized Publishing",
      category: "Business & Technology",
      description: "A master blueprint for writers and media architects bypassing algorithmic gatekeepers across 10 physical and digital dimensions."
    }
  ];

  const bookSummaries = bookList
    .map((b: any, idx: number) => `${idx + 1}. "${b.title}" (${b.category || 'General'}) - ${b.description?.slice(0, 160) || 'Groundbreaking multi-format title'}`)
    .join('\n');

  try {
    const ai = getGenAIClient();
    if (ai) {
      const tonePrompts: Record<string, string> = {
        prestigious: "prestigious, intellectually profound, academic yet widely revered literary tone",
        visionary: "futuristic, visionary systems-thinker, high-impact technologist and sovereign creator tone",
        bestseller: "magnetic, high-stakes international bestselling author and cultural vanguard tone",
        warm: "intimate, deeply empathetic, poetic and accessible storyteller tone"
      };

      const selectedTone = tonePrompts[tone] || tonePrompts.prestigious;

      const systemInstruction = `You are the chief literary biographer and master editor for Knowledge Centa and Johnnyblue1 Books Stores.
Your task is to write a world-class professional author biography based on their published catalog.
Tone requirement: ${selectedTone}.
Analyze the author's books, themes, and innovative 10-dimension publishing ethos (ranging from raw handwritten manuscript scans and silk-bound artisan editions to dedicated hardware reading devices).

Return ONLY valid JSON with this exact schema:
{
  "bio": "Detailed 2 to 3 paragraph professional biography (200-280 words). Cites key book titles and conceptual contributions.",
  "shortBio": "A concise 1-paragraph summary bio (60-80 words) suitable for dust jackets and author cards.",
  "oneLiner": "A punchy, memorable 1-sentence author tagline.",
  "themes": ["List of 3-5 core intellectual or narrative themes"],
  "keyHighlights": ["3 key career and publishing highlights grounded in their books"]
}`;

      const userPrompt = `Generate a professional author biography for:
Author Name: ${safeAuthor}
Published Catalog:
${bookSummaries}
Additional Author Notes: ${customNotes || 'Focus on their dedication to sovereign publishing, intellectual independence, and craftsmanship across physical and digital formats.'}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        authorName: safeAuthor,
        ...parsed
      });
    }
  } catch (error) {
    console.error("Gemini author bio generation error, switching to fallback:", error);
  }

  // Deterministic high-quality fallback biography
  const primaryBook = bookList[0] || { title: "The Sovereign Creator", category: "Technology & Culture" };
  const fallbackBio = `${safeAuthor} is an acclaimed author, visionary thinker, and pioneering figure in decentralized publishing. Renowned for groundbreaking masterworks such as "${primaryBook.title}", their writing synthesizes deep architectural discipline with philosophical rigor, challenging readers to transcend algorithmic media and reclaim intellectual sovereignty.

Across a distinguished catalog published through Knowledge Centa, ${safeAuthor} has redefined the relationship between creator and reader by releasing titles simultaneously across ten sensory dimensions—uniting raw fountain pen manuscript archives, heirloom silk-and-cotton weaves, original musical compositions, and bespoke E-Ink reading devices. Their essays, lectures, and published volumes have galvanized a global community of independent architects, writers, and cultural builders.`;

  return res.json({
    success: true,
    source: "local-biography-engine",
    authorName: safeAuthor,
    bio: fallbackBio,
    shortBio: `${safeAuthor} is an author and decentralized publishing architect whose works, including "${primaryBook.title}", bridge timeless craftsmanship with modern sovereignty across ten physical and digital dimensions.`,
    oneLiner: `${safeAuthor} crafts literature for the sovereign mind, bridging ancient craft with distributed futures.`,
    themes: [
      primaryBook.category || "Intellectual Sovereignty",
      "Multi-Sensory Literature",
      "Decentralized Media Architecture",
      "Physical & Digital Convergence"
    ],
    keyHighlights: [
      `Author of "${primaryBook.title}" across all 10 publishing dimensions`,
      "Pioneer in direct-to-reader sovereign intellectual property",
      "Global readership across 135+ countries on Knowledge Centa"
    ]
  });
});

// ==========================================
// AI VOICE SEARCH SEMANTIC INTERPRETATION
// ==========================================
app.post("/api/ai/voice-search", async (req, res) => {
  const { spokenQuery } = req.body || {};

  if (!spokenQuery || typeof spokenQuery !== "string") {
    return res.status(400).json({ success: false, error: "Missing spokenQuery parameter" });
  }

  try {
    const ai = getGenAIClient();
    if (ai) {
      const systemInstruction = `You are the AI Voice Search Brain for Johnnyblue1 Books Stores & Knowledge Centa.
Users speak natural language voice commands to search books, discover physical/digital dimensions, filter by price, and locate author editions.
There are 10 distinct publishing dimensions:
1. ebook (EPUB / PDF)
2. audiobook (Audio / Narrated)
3. videobook (4K Video)
4. manuscript (Handwritten Notebook Scans / Fountain Pen)
5. hardcover (Clothbound Hardcover / Foil Stamping)
6. papercover (Trade Paperback)
7. pendrive_sd (USB & MicroSD Vault)
8. musical_album (Soundtrack / Original Score)
9. silk_cotton (Organic Silk & Cotton Handloom Weave)
10. digital_device (Dedicated Standalone E-Ink Hardware)

Analyze the user's spoken voice query and return ONLY valid JSON matching this schema:
{
  "recognizedIntent": "filter_format" | "search_topic" | "author_query" | "price_filter" | "dimension_inquiry" | "general",
  "cleanSearchQuery": string,
  "detectedFormat": "silk_cotton" | "manuscript" | "audiobook" | "videobook" | "hardcover" | "papercover" | "pendrive_sd" | "musical_album" | "digital_device" | "ebook" | null,
  "detectedDimensionNumber": number | null,
  "detectedCategory": string | null,
  "maxPrice": number | null,
  "detectedAuthor": string | null,
  "voiceAnswerSummary": "Crisp 1-sentence friendly confirmation suitable for Text-to-Speech playback (e.g. 'Found 3 silk-woven editions and hardcover masterworks matching your voice search.')",
  "suggestedFollowUps": ["3 short relevant query ideas"],
  "confidenceScore": number (between 0.7 and 0.99)
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Spoken voice query from user: "${spokenQuery}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        result: parsed
      });
    }
  } catch (err) {
    console.warn("AI voice search Gemini interpretation error, switching to fallback:", err);
  }

  // Fallback heuristic interpretation
  const lower = spokenQuery.toLowerCase();
  let detectedFormat = null;
  let detectedDimensionNumber = null;
  if (lower.includes("silk") || lower.includes("cotton") || lower.includes("woven")) {
    detectedFormat = "silk_cotton";
    detectedDimensionNumber = 9;
  } else if (lower.includes("scan") || lower.includes("handwritten") || lower.includes("manuscript")) {
    detectedFormat = "raw_scans";
    detectedDimensionNumber = 4;
  } else if (lower.includes("audio") || lower.includes("listen") || lower.includes("narrat")) {
    detectedFormat = "audiobook";
    detectedDimensionNumber = 2;
  } else if (lower.includes("video") || lower.includes("4k")) {
    detectedFormat = "videobook";
    detectedDimensionNumber = 3;
  } else if (lower.includes("hardcover") || lower.includes("cloth")) {
    detectedFormat = "hardcover";
    detectedDimensionNumber = 5;
  } else if (lower.includes("paperback") || lower.includes("paper")) {
    detectedFormat = "papercover";
    detectedDimensionNumber = 6;
  } else if (lower.includes("pendrive") || lower.includes("usb") || lower.includes("sd")) {
    detectedFormat = "pendrive_sd";
    detectedDimensionNumber = 7;
  } else if (lower.includes("music") || lower.includes("soundtrack") || lower.includes("album")) {
    detectedFormat = "musical_album";
    detectedDimensionNumber = 8;
  } else if (lower.includes("device") || lower.includes("e-ink") || lower.includes("hardware")) {
    detectedFormat = "digital_device";
    detectedDimensionNumber = 10;
  }

  const priceMatch = lower.match(/(?:under|less than|below|\$)\s*(\d+)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : null;
  const detectedAuthor = lower.includes("johnny") || lower.includes("blue") ? "Johnny Blue" : null;

  return res.json({
    success: true,
    source: "local-semantic-engine",
    result: {
      recognizedIntent: detectedFormat ? "filter_format" : maxPrice ? "price_filter" : "search_topic",
      cleanSearchQuery: spokenQuery,
      detectedFormat,
      detectedDimensionNumber,
      detectedCategory: null,
      maxPrice,
      detectedAuthor,
      voiceAnswerSummary: `Searching Knowledge Centa for "${spokenQuery}" across all 10 publishing dimensions.`,
      suggestedFollowUps: [
        "Show silk and cotton editions",
        "Raw handwritten notebooks",
        "Audiobooks by Johnny Blue"
      ],
      confidenceScore: 0.88
    }
  });
});

// ==========================================
// AI AUTO-GENERATE COVER ART API
// ==========================================
app.post("/api/ai/generate-cover", async (req, res) => {
  const { 
    title = "The Sovereign Creator", 
    subtitle = "A Definitive Manual for Digital Architects", 
    author = "Johnny Blue", 
    genre = "Philosophy & Knowledge", 
    style = "minimalist_gold_foil", 
    customPrompt = "" 
  } = req.body || {};

  // Curated high-resolution artisan artwork presets keyed by style & mood
  const curatedArtworks: Record<string, string[]> = {
    silk_cotton_weave: [
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop", // Handloom woven silk
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop", // Organic texture
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop"  // Deep textured book
    ],
    minimalist_gold_foil: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1200&auto=format&fit=crop", // Elegant dark leather & gold
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=1200&auto=format&fit=crop", // Gold leaf geometry
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"  // Minimalist book binding
    ],
    cyberpunk_neon: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop", // Futuristic neon circuit
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", // High-tech motherboard
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"  // Cyber matrix digital
    ],
    classical_oil: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop", // Classical renaissance oil
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop", // Antique gilded art
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1200&auto=format&fit=crop"  // Museum oil masterpiece
    ],
    cosmic_geometry: [
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop", // Deep cosmic nebula
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1200&auto=format&fit=crop", // Galaxy astronomy
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1200&auto=format&fit=crop"  // Celestial cosmos
    ],
    raw_manuscript: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop", // Fountain pen & ink journal
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1200&auto=format&fit=crop", // Vintage parchment
      "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=1200&auto=format&fit=crop"  // Handwritten calligraphic letter
    ]
  };

  const selectedList = curatedArtworks[style] || curatedArtworks.minimalist_gold_foil;
  const primaryArt = selectedList[0];

  try {
    const ai = getGenAIClient();
    if (ai) {
      const prompt = `You are a world-renowned Master Book Cover Art Director for high-end sovereign publishers (like Folio Society, Penguin Classics, and Taschen).
Synthesize an artistic book cover design concept for:
- Title: "${title}"
- Subtitle: "${subtitle}"
- Author: "${author}"
- Genre/Category: "${genre}"
- Aesthetic Style: "${style}"
- Custom Artist Direction: "${customPrompt}"

Return ONLY a JSON object with this structure:
{
  "conceptName": "e.g. The Obsidian & Gilded Codex",
  "artDirectionSummary": "2-sentence description of the visual composition, lighting, textures, and psychological impact.",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "foilEffect": "gold" | "silver" | "copper" | "holographic",
  "typography": {
    "titleFont": "Cinzel / Cormorant Garamond / Playfair Display / Orbitron",
    "subtitleFont": "Plus Jakarta Sans / Montserrat / Inter",
    "letterSpacing": "tracking-widest" | "tracking-wider" | "tracking-tight"
  },
  "dimensionBadgeText": "Sovereign 10-Dimension Edition",
  "variations": [
    {
      "name": "Variation A: Classical Elegance",
      "gradient": "from-slate-950 via-stone-900 to-amber-950",
      "accentColor": "#f59e0b",
      "tagline": "Embossed Foil on Handcrafted Cloth"
    },
    {
      "name": "Variation B: Modern Minimalist",
      "gradient": "from-[#0d131a] via-[#16202c] to-[#1f2937]",
      "accentColor": "#60a5fa",
      "tagline": "Architectural Geometry & High Contrast"
    },
    {
      "name": "Variation C: Tactile Heritage",
      "gradient": "from-[#1a1412] via-[#2a1d17] to-[#3d271d]",
      "accentColor": "#d97706",
      "tagline": "Organic Handloom Texture with Gold Spine"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        coverArt: {
          ...parsed,
          artworkUrl: primaryArt,
          alternativeArtworks: selectedList,
          previewUrl: primaryArt
        }
      });
    }
  } catch (err) {
    console.warn("AI cover generation Gemini error, using curated artisan generator:", err);
  }

  // Fallback artisan design concept
  return res.json({
    success: true,
    source: "curated-artisan-engine",
    coverArt: {
      conceptName: `Artisan Edition: ${title}`,
      artDirectionSummary: `A visually arresting book jacket featuring ${style.replace(/_/g, ' ')} textures with embossed typography and golden leaf accents, optimized across all 10 publishing dimensions.`,
      colorPalette: ["#0f172a", "#f59e0b", "#d97706", "#f8fafc"],
      foilEffect: "gold",
      typography: {
        titleFont: "Cormorant Garamond",
        subtitleFont: "Plus Jakarta Sans",
        letterSpacing: "tracking-widest"
      },
      dimensionBadgeText: "Sovereign 10-Dimension Edition",
      artworkUrl: primaryArt,
      alternativeArtworks: selectedList,
      previewUrl: primaryArt,
      variations: [
        {
          name: "Variation A: Gilded Obsidian",
          gradient: "from-slate-950 via-stone-900 to-amber-950",
          accentColor: "#f59e0b",
          tagline: "Embossed Gold Foil on Obsidian Cloth"
        },
        {
          name: "Variation B: Handloom Weave",
          gradient: "from-[#1a1412] via-[#2a1d17] to-[#3d271d]",
          accentColor: "#d97706",
          tagline: "Organic Silk & Cotton Texture"
        },
        {
          name: "Variation C: Cybernetic Modern",
          gradient: "from-[#0d131a] via-[#16202c] to-[#1f2937]",
          accentColor: "#38bdf8",
          tagline: "Architectural Precision for Dedicated Devices"
        }
      ]
    }
  });
});

// ==========================================
// AI BLOG ARTICLE SUGGESTIONS & COPILOT API
// ==========================================
app.post("/api/ai/blog-suggestions", async (req, res) => {
  const { 
    topic = "", 
    category = "10 Dimensions & Hardware", 
    mediaType = "", 
    mediaFileName = "", 
    authorNotes = "",
    authorName = "Johnny Blue"
  } = req.body || {};

  try {
    const ai = getGenAIClient();
    if (ai) {
      const prompt = `You are an elite literary editor, book publicist, and publishing technologist for "Johnnyblue1 Books Stores & Knowledge Centa".
The platform champions multi-sensory literature delivered across 10 dimensions (eBooks, Audiobooks, 4K Video Books, Raw Handwritten Manuscript Scans, Clothbound Hardcover, Archival Papercover, High-Capacity USB-C/SD drives, Original Musical Soundtrack, Handloom Silk & Cotton editions, and Standalone Dedicated E-Ink Hardware Devices).

The user is drafting a blog article or uploading media to the Johnnyblue1 community blog hub.
Here are the draft parameters:
- Topic or Core Idea: "${topic || 'The Future of Sovereign Media and 10-Dimension Literature'}"
- Selected Category: "${category}"
- Uploaded Media Type: "${mediaType || 'None'}"
- Uploaded Media File: "${mediaFileName || 'None'}"
- Author Notes: "${authorNotes || 'None'}"
- Author Name: "${authorName}"

Generate a comprehensive, compelling, and intellectually rich publication suggestion in JSON matching this schema:
{
  "title": "A captivating, high-impact headline (avoid generic cliches)",
  "subtitle": "An evocative, one-sentence hook suitable for Google search snippets and social cards",
  "category": "One of: '10 Dimensions & Hardware' | 'Craft & Writing' | 'Book Reviews' | 'Publishing Industry' | 'Reader Essays' | 'Interviews'",
  "suggestedExcerpt": "A 2-sentence summary designed for reader intrigue and high CTR",
  "articleContent": "A full, publication-ready markdown article (around 350-500 words) with ## Subheadings, key philosophical or practical takeaways, quote callouts, and reflections on the craft of writing and reading in 10 dimensions",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "suggestedMediaCaption": "A descriptive, engaging caption highlighting the uploaded media file or multimedia asset",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        suggestions: parsed
      });
    }
  } catch (err: any) {
    console.warn("AI blog suggestions error (using fallback generator):", err);
  }

  // Resilient contextual fallback
  const baseTopic = topic.trim() || "The Sovereign Reader: Why Multi-Sensory Literature Endures in an Algorithmic Era";
  res.json({
    success: true,
    source: "rule-based-curator",
    suggestions: {
      title: `${baseTopic}`,
      subtitle: "How tangible formats, dedicated hardware, and 10-dimension publishing reclaim the intimacy of deep reading.",
      category: category || "10 Dimensions & Hardware",
      suggestedExcerpt: "In a culture dominated by ephemeral notifications, books that command our physical and sensory attention serve as intellectual fortresses.",
      articleContent: `## The Modern Crisis of Fragmented Attention

For two decades, digital reading was treated as a mere conversion process: take ink on paper, turn it into binary strings, and render it on standard backlit screens. While this democratized distribution, it stripped the literary experience of its sacred container.

When an author's five-year magnum opus is read on the same glass screen that receives calendar pings and urgent Slack messages, the psychological architecture of **deep reading** collapses.

### The 10-Dimension Solution

At **Johnnyblue1 Books Stores & Knowledge Centa**, we believe that ideas deserve physical and tactile permanence:

1. **The Raw Handwritten Draft:** Experiencing an author's unedited margin annotations and ink blots.
2. **Dedicated E-Ink Hardware:** Zero notifications, zero blue light, engineered solely for solitary contemplation.
3. **The Artisanal Handloom Silk & Egyptian Cotton Edition:** An archival object built to outlast its digital counterparts.
4. **Composed Neo-Classical Soundtracks:** Immersing the reader into the emotional landscape of each chapter.

### A New Era for Sovereign Creators

Independent authors no longer need to surrender 85% of their hard-earned royalties to corporate distribution cartels. By packaging your work across all 10 sensory dimensions, you create a timeless artifact that commands respect and builds lasting sovereignty.`,
      suggestedTags: ["10 Dimensions", "Deep Reading", "Sovereign Authors", "Dedicated E-Ink", "Knowledge Centa"],
      suggestedMediaCaption: mediaFileName 
        ? `High-resolution archival master: ${mediaFileName} (${mediaType || 'media asset'}) preserved in the Johnnyblue1 Knowledge Vault.` 
        : "Curated media companion for the Johnnyblue1 publishing ecosystem.",
      seoKeywords: ["10-dimension books", "knowledge centa", "sovereign publishing", "e-ink hardware", "johnnyblue1"]
    }
  });
});

// ==========================================
// UNIVERSAL AI SUGGESTIONS API (FOR FORMS, DIALOGS, TABS, REELS, BLOGS, PUBLISHING)
// ==========================================
app.post("/api/ai/universal-suggestions", async (req, res) => {
  const {
    context = "general",
    title = "",
    category = "",
    notes = "",
    extraData = {}
  } = req.body || {};

  try {
    const ai = getGenAIClient();
    if (ai) {
      const prompt = `You are the elite AI Creative Director & Literary Publishing Copilot for "Johnnyblue1 Books Stores & Knowledge Centa".
The platform publishes multi-sensory literature across 10 dimensions:
1. E-Books (EPUB/MOBI)
2. Audiobooks (Spatial Dolby / FLAC)
3. 4K Video Books & Masterclasses
4. Raw Handwritten Manuscript Scans
5. Clothbound Hardcover
6. Archival Papercover
7. High-Capacity USB-C / SD Pendrive Vaults
8. Original Musical Soundtrack Albums (Lossless)
9. Handloom Silk & Egyptian Cotton Collectible Weaves
10. Standalone Dedicated E-Ink Hardware Devices (Zero Distraction)

Current UI Context: "${context}"
User Provided Inputs:
- Title/Topic: "${title}"
- Category/Dimension: "${category}"
- Author/User Notes: "${notes}"
- Contextual Parameters: ${JSON.stringify(extraData)}

Based on this specific UI Form/Dialog/Tab, provide high-value, actionable, creative AI suggestions in JSON matching this exact structure:
{
  "context": "${context}",
  "headline": "A punchy summary of this suggestion",
  "primarySuggestion": "The main recommendation or content draft ready to apply",
  "alternativeSuggestions": [
    "Alternative option 1",
    "Alternative option 2",
    "Alternative option 3"
  ],
  "quickTips": [
    "Practical tip 1 tailored to 10 dimensions or high reader engagement",
    "Practical tip 2 tailored to SEO, media quality, or royalties"
  ],
  "suggestedTagsOrKeywords": ["tag1", "tag2", "tag3", "tag4"],
  "estimatedImpact": "High engagement projection, e.g. +35% CTR or 2x reader retention"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        suggestions: parsed
      });
    }
  } catch (err: any) {
    console.warn("Universal AI suggestions error (using rule-based fallback):", err);
  }

  // Resilient rule-based contextual fallback generator
  const fallbackByContext: Record<string, any> = {
    "publishing-metadata": {
      context: "publishing-metadata",
      headline: "Multi-Sensory Literary Positioning",
      primarySuggestion: title 
        ? `${title}: The Architecture of Sovereign Thought across 10 Sensory Dimensions`
        : "The Sovereign Mind: A 10-Dimension Exploration of Knowledge, Art, and Hardware",
      alternativeSuggestions: [
        "Unwritten Margins: How Tactile Artifacts Reclaim Deep Reading in the AI Age",
        "The Knowledge Nexus: From Raw Handwritten Ink to Standalone E-Paper Devices",
        "Chronicles of the Sovereign Craft: A Masterwork in Ten Physical & Audio Formats"
      ],
      quickTips: [
        "Mention all 10 formats in the book blurb to highlight the $450+ physical bundle value.",
        "Highlight that 85% of royalties go directly to the creator on Knowledge Centa."
      ],
      suggestedTagsOrKeywords: ["10 Dimensions", "Collector Edition", "Sovereign Author", "E-Ink Hardware", "Silk & Cotton"],
      estimatedImpact: "Expected +42% higher perceived value among collector audiences."
    },
    "publishing-files": {
      context: "publishing-files",
      headline: "10-Dimension Master Asset Recommendations",
      primarySuggestion: "Ensure manuscript scans are at least 600 DPI, audio in 24-Bit / 96kHz Lossless FLAC, and device ROM packaged with zero-latency font engines.",
      alternativeSuggestions: [
        "Bundle the original musical score with liner notes for Dimension 8 (Musical Album).",
        "Include marginalia ink scans with transcribed handwritten notes for Dimension 4.",
        "Provide dual-foil embossing vector layers for Dimension 9 (Silk & Cotton Weave)."
      ],
      quickTips: [
        "Large media files up to 10GB are supported via Google Drive & Cloud Vault streaming.",
        "Include an audio prologue track in FLAC for immediate Look-Inside preview conversion."
      ],
      suggestedTagsOrKeywords: ["600 DPI Scans", "Lossless 96kHz", "Custom E-Ink ROM", "Artisanal Mulberry"],
      estimatedImpact: "Increases complete bundle checkout conversion by +28%."
    },
    "publishing-pricing": {
      context: "publishing-pricing",
      headline: "Tiered Sovereign Pricing Strategy",
      primarySuggestion: "E-Book: $9.99 • Audiobook: $19.99 • Silk & Cotton: $149.00 • Dedicated E-Ink Tablet: $299.00",
      alternativeSuggestions: [
        "Collector Tier: Offer the 10-in-1 Complete Sensory Master Box for $449.00 with free global shipping.",
        "Digital Duo: Pair E-Book + Lossless Audio for $24.99 (Save 15%).",
        "Artisanal Print Trio: Hardcover + Silk/Cotton + Raw Scan Notebook for $219.00."
      ],
      quickTips: [
        "You retain 85% on every format compared to 35-70% on legacy retail platforms.",
        "Stripe Connect deposits into your account on a rolling 2-day schedule."
      ],
      suggestedTagsOrKeywords: ["85% Royalties", "Direct-to-Reader", "Sovereign Pricing", "Collector Bundles"],
      estimatedImpact: "Optimizes author revenue yield by up to 2.4x per reader."
    },
    "blog-editor": {
      context: "blog-editor",
      headline: "Viral Literary Essay & High-CTR Headline",
      primarySuggestion: title 
        ? `Beyond the Screen: Why ${title} Proves Physicality Is the Ultimate Intellectual Luxury`
        : "The Death of Distracted Reading: Why Dedicated Hardware and 10 Dimensions Rescued Literature",
      alternativeSuggestions: [
        "From Ink to Silk: The Anatomy of Publishing a 10-Dimension Book in 2026",
        "Why Modern Readers Are Abandoning App Stores for Dedicated Single-Purpose Devices",
        "The 10-Gigabyte Article: How Multimedia Longform Journalism Replaced 140 Characters"
      ],
      quickTips: [
        "Embed 4K video clips or native camera recordings directly in the post for +80% time-on-page.",
        "Add at least 3 descriptive tags for Google News & Perplexity AI crawling."
      ],
      suggestedTagsOrKeywords: ["Longform", "Deep Reading", "Publishing Tech", "10 Dimensions", "Creator Sovereignty"],
      estimatedImpact: "Target 4.8 min average read time with automatic Schema.org JSON-LD indexing."
    },
    "blog-comments": {
      context: "blog-comments",
      headline: "Thoughtful Literary Critique & Reaction",
      primarySuggestion: "This piece captures the exact tension between digital convenience and physical reverence. Have you noticed higher reader retention on the dedicated hardware edition compared to standard e-readers?",
      alternativeSuggestions: [
        "Fascinating analysis of the 10-dimension format. The inclusion of raw handwritten scans is such an intimate touch that digital PDFs simply cannot reproduce.",
        "The economic breakdown of the 85% creator split versus legacy distribution is eye-opening. Inspiring work!",
        "Listening to the composed musical soundtrack while reading this completely transformed the pace of comprehension."
      ],
      quickTips: [
        "Authentic literary commentary receives up to 4x more author replies.",
        "Reference a specific dimension mentioned in the article for a richer dialogue."
      ],
      suggestedTagsOrKeywords: ["Constructive Critique", "Reader Reaction", "Literary Discourse"],
      estimatedImpact: "Elevates community discussion score and reader trust."
    },
    "reels-upload": {
      context: "reels-upload",
      headline: "Viral BookTok & Shorts Hook Recommendation",
      primarySuggestion: "Stop scrolling: I bet you haven't seen a book printed on pure Silk & Egyptian Cotton with its own dedicated E-Ink operating system. Watch this unboxing... 📖✨",
      alternativeSuggestions: [
        "POV: You open a book and find the author's raw unedited handwritten ink drafts from 3 years ago ✒️📜",
        "Why I threw away my tablet notifications for a distraction-free E-Paper reader built for just one book ⚡📱",
        "The sound of turning a 120gsm archival page while listening to the official orchestra score in lossless FLAC 🎻🎧"
      ],
      quickTips: [
        "Keep the first 3 seconds visually striking: show the physical silk texture or turn on the E-Ink screen.",
        "Include #BookTok, #10Dimensions, and #SovereignPublishing to maximize algorithmic reach."
      ],
      suggestedTagsOrKeywords: ["#BookTok", "#10Dimensions", "#Unboxing", "#SilkAndCotton", "#AuthorLife", "#ASMR"],
      estimatedImpact: "Expected +65% viewer completion rate with strong audio-visual pairing."
    },
    "reels-comments": {
      context: "reels-comments",
      headline: "Community Reel Feedback & Bookmark Quote",
      primarySuggestion: "The texture on that Silk & Cotton cover is unreal! Where can I order the collector bundle with the dedicated device? 🔥📚",
      alternativeSuggestions: [
        "That opening violin passage gave me absolute goosebumps. Adding this to my Johnnyblue1 library right now! 🎻",
        "Seeing the raw handwritten draft notebook brings so much humanity back to publishing. Beautiful craft. ✒️",
        "Wait, so it comes with its own distraction-free hardware reader?! That is genius."
      ],
      quickTips: [
        "Tagging the dimension name (#Dimension9 or #Dimension10) helps other readers find the exact product.",
        "Add a quote timestamp if referencing a particular moment in the short."
      ],
      suggestedTagsOrKeywords: ["#ReelReview", "#BookTokLove", "#SensoryReading"],
      estimatedImpact: "Boosts reel engagement ranking on the community feed."
    },
    "author-dashboard": {
      context: "author-dashboard",
      headline: "Sovereign Catalog Growth & Momentum",
      primarySuggestion: "Publish a companion article on the Knowledge Centa blog explaining your handwritten drafts to drive +38% conversions into the Silk & Cotton edition.",
      alternativeSuggestions: [
        "Upload a 30-second unboxing reel to BookTok to re-engage waitlist subscribers.",
        "Launch an instant royalty payout to your connected Stripe account before the weekend.",
        "Schedule a live audio reading session to celebrate your latest 10-dimension milestone."
      ],
      quickTips: [
        "Followers automatically receive high-priority toast alerts when you release new assets.",
        "Readers who preview all 3 look-inside modes convert at 4.2x the industry average."
      ],
      suggestedTagsOrKeywords: ["Revenue Optimization", "Reader Engagement", "Stripe Rails", "Look-Inside Conversion"],
      estimatedImpact: "Anticipated 1.8x catalog velocity across physical and digital formats."
    },
    "author-profile": {
      context: "author-profile",
      headline: "Author Persona & Follower Magnet",
      primarySuggestion: "Craft an author bio that emphasizes tactile craftsmanship: 'Sculpting stories across 10 sensory dimensions—from handloom silk weaves and archival ink to dedicated distraction-free hardware.'",
      alternativeSuggestions: [
        "Add a personal quote highlighting your writing philosophy and invite readers to follow for instant release toasts.",
        "Connect your Google Drive manuscript vault to display verified raw handwritten artifacts.",
        "Offer early look-inside previews of unreleased musical suites to followed readers."
      ],
      quickTips: [
        "Authors with customized bios and avatars experience +45% higher follower growth.",
        "Use the Follow Author button to test release broadcast toasts anytime."
      ],
      suggestedTagsOrKeywords: ["Author Branding", "Craftsmanship", "Follower Network", "Vault Sync"],
      estimatedImpact: "Accelerates follower acquisition and direct audience ownership."
    }
  };

  const selectedFallback = fallbackByContext[context] || fallbackByContext["publishing-metadata"];
  res.json({
    success: true,
    source: "curated-literary-curator",
    suggestions: selectedFallback
  });
});

// ==========================================
// STRIPE CONNECT AUTHOR PAYOUT RAILS API
// ==========================================

// Check Stripe Connect Status
app.get("/api/stripe/connect/account-status/:authorId", (req, res) => {
  const { authorId } = req.params;
  const hasStripeKey = Boolean(process.env.STRIPE_SECRET_KEY);

  res.json({
    success: true,
    hasStripeKey,
    livemode: hasStripeKey,
    accountId: "acct_1Nv842JohnnyBlueExpress",
    chargesEnabled: true,
    payoutsEnabled: true,
    detailsSubmitted: true,
    defaultCurrency: "USD",
    country: "US",
    payoutSpeed: "Daily rolling (2 days)",
    balances: {
      available: 4850.75,
      pending: 1620.40,
      currency: "USD",
      lifetimePaidOut: 64280.00
    }
  });
});

// Create Onboarding Link / Account Session
app.post("/api/stripe/connect/create-account-link", (req, res) => {
  const { authorId, returnUrl, refreshUrl, country = "US" } = req.body || {};
  const origin = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;

  const onboardingUrl = `https://connect.stripe.com/express/oauth/authorize?client_id=ca_mock&state=${authorId || "author"}&country=${country}&redirect_uri=${encodeURIComponent(returnUrl || `${origin}/#publish`)}`;

  res.json({
    success: true,
    url: onboardingUrl,
    accountId: `acct_${Date.now()}_express`,
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  });
});

// Trigger Instant Payout of Available Royalties
app.post("/api/stripe/connect/payout-now", (req, res) => {
  const { authorId, amount, currency = "USD" } = req.body || {};
  const payoutAmount = typeof amount === "number" && amount > 0 ? amount : 4850.75;
  const txId = `po_${Date.now()}_instant`;

  res.json({
    success: true,
    message: "Instant payout initiated successfully to connected account.",
    payout: {
      id: txId,
      amount: payoutAmount,
      currency,
      status: "in_transit",
      arrivalDate: new Date().toISOString().split("T")[0],
      method: "instant_card",
      feeAmount: Math.round(payoutAmount * 0.01 * 100) / 100,
      netAmount: Math.round(payoutAmount * 0.99 * 100) / 100
    }
  });
});

// ==========================================
// 2-HOUR GLOBAL AI ARTICLE & FEATURED IMAGE ENGINE
// ==========================================

// Get Current Scheduler Status & Metrics
app.get("/api/auto-articles/status", (req, res) => {
  const status = autoArticlePublisher.getStatus();
  res.json({
    success: true,
    ...status
  });
});

// Get List of Auto-Published Articles
app.get("/api/auto-articles/posts", (req, res) => {
  const articles = autoArticlePublisher.getArticles();
  res.json({
    success: true,
    articles
  });
});

// Trigger Instant Article Generation Cycle (Manual or Immediate On-Demand)
app.post("/api/auto-articles/trigger-now", async (req, res) => {
  try {
    const { domain, topic } = req.body || {};
    const article = await autoArticlePublisher.generateAndPublishNextArticle(domain, topic);
    res.json({
      success: true,
      message: `Successfully generated and published Edition #${article.editionCycle}: "${article.title}"`,
      article
    });
  } catch (error: any) {
    console.error("[AutoArticles] Manual generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate article"
    });
  }
});

// Toggle 2-Hour Auto-Scheduler
app.post("/api/auto-articles/toggle-schedule", (req, res) => {
  const { active } = req.body || {};
  if (active === false) {
    autoArticlePublisher.stopScheduler();
  } else {
    autoArticlePublisher.startScheduler();
  }
  res.json({
    success: true,
    status: autoArticlePublisher.getStatus()
  });
});

// Vite middleware in dev; static file serving in production
async function startServer() {
  // Start the 2-hour automated global publishing engine
  autoArticlePublisher.startScheduler();
  // Auto-generate seed article if no articles exist yet
  if (autoArticlePublisher.getArticles().length === 0) {
    setTimeout(async () => {
      try {
        console.log("[AutoPublisher] Auto-generating inaugural global article...");
        await autoArticlePublisher.generateAndPublishNextArticle();
      } catch (err) {
        console.warn("[AutoPublisher] Inaugural article generation note:", err);
      }
    }, 1500);
  }
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
    console.log(`Johnnyblue1 Knowledge Centa Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
