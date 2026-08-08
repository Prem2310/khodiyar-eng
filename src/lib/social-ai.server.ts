import sharp from "sharp";

// ---------------------------------------------------------------------------
// CONFIG — fill these in once for your business. Everything else is dynamic.
// ---------------------------------------------------------------------------
const BRAND = {
  name: "KHODIYAR ENGINEERING",
  tagline: "Precision Valves. Trusted Flow.",
  address: "Vastral, Ahmedabad, Gujarat",
  phone: "+91 XXXXX XXXXX",
  whatsapp: "+91 XXXXX XXXXX",
  website: "www.khodiyarengineering.com",
  // Path to a transparent-background PNG logo, e.g. ./assets/logo.png
  logoPath: "./assets/logo.png",
};

function apiKey(): string {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return key;
}

function cloudflareCreds(): { accountId: string; apiToken: string } {
  const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"];
  const apiToken = process.env["CLOUDFLARE_API_TOKEN"];
  if (!accountId) throw new Error("Missing CLOUDFLARE_ACCOUNT_ID");
  if (!apiToken) throw new Error("Missing CLOUDFLARE_API_TOKEN");
  return { accountId, apiToken };
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const TEXT_MODEL = "gemini-3.6-flash"; // Gemini text free tier is fine — keep this
// Image generation uses Cloudflare Workers AI — genuinely free, no billing ever
// on the Workers Free plan (10,000 Neurons/day, no card required to sign up).
// Tried so far: Gemini image models both returned "limit: 0" free-tier errors;
// OpenAI has no free tier at all; Pollinations now requires paid Pollen credits
// even on nominally "free" models. Cloudflare's free allocation is the one that
// actually works without a payment method attached.
const CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

export type CopyResult = {
  headline: string; // short, punchy, goes on the poster itself (3-6 words)
  caption: string; // social caption for the post text, not on the image
  hashtags: string[];
  imagePrompt: string; // art direction for the BACKGROUND only, no text
};

// ---------------------------------------------------------------------------
// 1. Generate caption + hashtags + a short on-poster headline + art prompt
// ---------------------------------------------------------------------------
export async function generateCopy(input: {
  occasion: string;
  eventDate?: string | null;
  brief?: string | null;
  platform: string;
}): Promise<CopyResult> {
  const prompt = [
    `You write social media posts for ${BRAND.name}, an industrial valve manufacturer in ${BRAND.address}.`,
    "They make ball, butterfly, gate, globe, check, plug, sanitary dairy and pneumatic valves for chemical, pharma, dairy, food, water treatment, oil & gas and power plants.",
    "",
    `Occasion / topic: ${input.occasion}`,
    input.eventDate ? `Date: ${input.eventDate}` : "",
    input.brief ? `Extra details: ${input.brief}` : "",
    `Target platform: ${input.platform}`,
    "",
    "Return JSON with:",
    "- headline: a SHORT, punchy phrase (3-6 words max) that will be printed on the poster itself, e.g. a festival greeting or a bold value statement. Must read like premium ad copy, not a full sentence.",
    "- caption: a warm, professional post caption (under 60 words, 1-2 tasteful emojis max, ends with a short call to action mentioning enquiries on WhatsApp). If it is a festival, greet warmly and tie it subtly to engineering/precision/flow.",
    "- hashtags: 8 to 12 relevant hashtags without duplicates, each starting with #, mixing festival/topic tags with industrial valve and Ahmedabad manufacturing tags.",
    "- imagePrompt: a rich art-direction prompt for a square poster BACKGROUND only. Describe a premium industrial brand scene: deep navy and metallic steel palette, festival motifs when relevant, subtle stainless steel valve imagery, cinematic photorealistic lighting, clean uncluttered composition with generous empty space in the top 15% and bottom 30% of the frame for a logo and a text banner to be added afterwards. Explicitly instruct: do not render any text, letters, numbers or logos of any kind in the image.",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(
    `${GEMINI_BASE}/${TEXT_MODEL}:generateContent?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              headline: { type: "STRING" },
              caption: { type: "STRING" },
              hashtags: { type: "ARRAY", items: { type: "STRING" } },
              imagePrompt: { type: "STRING" },
            },
            required: ["headline", "caption", "hashtags", "imagePrompt"],
          },
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Copy generation failed (${res.status}): ${await res.text().catch(() => "")}`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("The AI returned an empty response. Please try again.");

  let parsed: CopyResult;
  try {
    parsed = JSON.parse(text) as CopyResult;
  } catch {
    throw new Error("The AI returned an unreadable response. Please try again.");
  }

  return {
    headline: (parsed.headline ?? "").trim(),
    caption: (parsed.caption ?? "").trim(),
    hashtags: (parsed.hashtags ?? [])
      .map((t) => (t.startsWith("#") ? t : `#${t}`).replace(/\s+/g, ""))
      .filter(Boolean)
      .slice(0, 12),
    imagePrompt: (parsed.imagePrompt ?? "").trim(),
  };
}

// ---------------------------------------------------------------------------
// 2. Generate the BACKGROUND art only (no text, no logo — that's step 3)
// ---------------------------------------------------------------------------
export async function generatePosterBackground(imagePrompt: string): Promise<Buffer> {
  const { accountId, apiToken } = cloudflareCreds();
  const fullPrompt = `Square 1:1 poster background, absolutely no text, letters, numbers, logos or watermarks anywhere in the image. ${imagePrompt}`;

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_IMAGE_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        width: 1024,
        height: 1024,
        steps: 6, // flux-1-schnell supports up to 8 steps; 6 is a good quality/speed balance
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Image generation failed (${res.status}): ${await res.text().catch(() => "")}`);
  }

  const json = (await res.json()) as {
    success?: boolean;
    result?: { image?: string };
    errors?: { message?: string }[];
  };

  if (!json.success || !json.result?.image) {
    const msg = json.errors?.[0]?.message ?? "The image model did not return an image.";
    throw new Error(msg);
  }

  return Buffer.from(json.result.image, "base64");
}

// ---------------------------------------------------------------------------
// 3. Composite logo + headline + contact-details banner onto the background.
//    This is what makes the text crisp and always-correct — no AI typography.
// ---------------------------------------------------------------------------
export async function composePoster(
  background: Buffer,
  headline: string
): Promise<Buffer> {
  const SIZE = 1024;

  const base = sharp(background).resize(SIZE, SIZE, { fit: "cover" });

  // Bottom brand banner (semi-transparent navy strip) + top headline strip,
  // both drawn as SVG so text is vector-crisp regardless of resolution.
  const overlaySvg = `
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b1a33" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#0b1a33" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b1a33" stop-opacity="0" />
          <stop offset="100%" stop-color="#081120" stop-opacity="0.95" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="${SIZE}" height="220" fill="url(#topFade)" />
      <rect x="0" y="${SIZE - 300}" width="${SIZE}" height="300" fill="url(#bottomFade)" />

      <!-- Headline near the top -->
      <text x="60" y="130" font-family="Arial, sans-serif" font-size="56" font-weight="700"
            fill="#ffffff" letter-spacing="1">${escapeXml(headline)}</text>

      <!-- Company name -->
      <text x="60" y="${SIZE - 190}" font-family="Arial, sans-serif" font-size="42" font-weight="800"
            fill="#ffffff" letter-spacing="1.5">${escapeXml(BRAND.name)}</text>

      <!-- Tagline -->
      <text x="60" y="${SIZE - 148}" font-family="Arial, sans-serif" font-size="24"
            fill="#c7d2e0">${escapeXml(BRAND.tagline)}</text>

      <!-- Divider -->
      <rect x="60" y="${SIZE - 120}" width="${SIZE - 120}" height="1.5" fill="#3a4a63" />

      <!-- Contact row -->
      <text x="60" y="${SIZE - 84}" font-family="Arial, sans-serif" font-size="22"
            fill="#e8edf5">${escapeXml(BRAND.address)}</text>
      <text x="60" y="${SIZE - 52}" font-family="Arial, sans-serif" font-size="22"
            fill="#e8edf5">📞 ${escapeXml(BRAND.phone)}   💬 WhatsApp: ${escapeXml(BRAND.whatsapp)}</text>
      <text x="60" y="${SIZE - 20}" font-family="Arial, sans-serif" font-size="22"
            fill="#8fb3ff">${escapeXml(BRAND.website)}</text>
    </svg>
  `;

  const composites: sharp.OverlayOptions[] = [
    { input: Buffer.from(overlaySvg), top: 0, left: 0 },
  ];

  // Logo in the top-right corner, if the file exists.
  try {
    const logoBuffer = await sharp(BRAND.logoPath)
      .resize(160, 160, { fit: "inside" })
      .toBuffer();
    composites.push({ input: logoBuffer, top: 32, left: SIZE - 192 });
  } catch {
    // No logo file found at BRAND.logoPath — poster still works without it.
    console.warn(`Logo not found at ${BRAND.logoPath}, skipping logo overlay.`);
  }

  return base.composite(composites).png().toBuffer();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ---------------------------------------------------------------------------
// 4. Convenience: run the whole pipeline end to end.
// ---------------------------------------------------------------------------
export async function generateFullPoster(input: {
  occasion: string;
  eventDate?: string | null;
  brief?: string | null;
  platform: string;
}): Promise<{ copy: CopyResult; poster: Buffer }> {
  const copy = await generateCopy(input);
  const background = await generatePosterBackground(copy.imagePrompt);
  const poster = await composePoster(background, copy.headline);
  return { copy, poster };
}
