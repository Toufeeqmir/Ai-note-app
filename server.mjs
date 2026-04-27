import { createServer } from "node:http";
import dns from "node:dns";
import { readFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const publicIndexPath = path.join(distDir, "index.html");

// ✅ Changed to OpenRouter
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODEL = "google/gemma-3-4b-it:free";
const TRANSCRIPT_API_URL = "https://api.supadata.ai/v1/youtube/transcript";

function getUpstreamErrorMessage(statusCode, payload, fallback) {
  if (statusCode === 429) {
    return "Rate limit reached for the current AI provider/model. Please wait a bit and try again, or switch to a different model/provider.";
  }

  return payload?.error?.message || fallback;
}

function extractVideoId(url) {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtu\.be\/)([^&\n?#]+)/
  );

  return videoIdMatch?.[1] || null;
}

async function fetchTranscriptText(url, videoId) {
  const transcriptApiKey = process.env.SUPADATA_API_KEY?.trim();

  if (!transcriptApiKey) {
    throw new Error("Missing SUPADATA_API_KEY environment variable.");
  }

  const response = await fetch(
    `${TRANSCRIPT_API_URL}?videoId=${encodeURIComponent(videoId)}&text=true`,
    {
      headers: {
        "x-api-key": transcriptApiKey,
      },
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getUpstreamErrorMessage(
        response.status,
        payload,
        `Supadata transcript request failed with status ${response.status}.`
      )
    );
  }

  const transcript =
    typeof payload?.content === "string" ? payload.content.trim() : "";

  if (!transcript) {
    throw new Error("No transcript found for this video.");
  }

  return transcript;
}

loadEnvFile(path.join(__dirname, ".env"));
dns.setDefaultResultOrder("ipv4first");

const PORT = Number(process.env.PORT || 3001);

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && req.url === "/api/ai") {
      return handleAiRequest(req, res);
    }

    if (req.method === "POST" && req.url === "/api/youtube") {
      return handleYoutubeRequest(req, res);
    }

    if (req.method === "GET") {
      return serveStaticFile(req, res);
    }

    return sendJson(res, 404, { error: { message: "Not found" } });
  } catch (error) {
    console.error("Server error:", error);
    return sendJson(res, 500, {
      error: { message: "Internal server error" },
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ✅ Updated to use OpenRouter
async function handleAiRequest(req, res) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    return sendJson(res, 500, {
      error: {
        message: "Missing OPENROUTER_API_KEY in .env.",
      },
    });
  }

  const body = await readJsonBody(req);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return sendJson(res, 400, {
      error: { message: "Prompt is required." },
    });
  }

  let response;

  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Notes App",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (error) {
    return sendJson(res, 502, {
      error: {
        message: `Failed to reach OpenRouter: ${error.message}`,
      },
    });
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return sendJson(res, response.status, {
      error: {
        message: getUpstreamErrorMessage(
          response.status,
          payload,
          `Request failed with status ${response.status}.`
        ),
      },
      details: payload,
    });
  }

  return sendJson(res, 200, {
    text: payload?.choices?.[0]?.message?.content || "",
  });
}

async function handleYoutubeRequest(req, res) {
  try {
    const body = await readJsonBody(req);
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return sendJson(res, 400, {
        error: { message: "YouTube URL is required." },
      });
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return sendJson(res, 400, {
        error: { message: "Invalid YouTube URL." },
      });
    }
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return sendJson(res, 500, {
        error: { message: "Missing OPENROUTER_API_KEY in .env." },
      });
    }

    let transcript;

    try {
      transcript = await fetchTranscriptText(url, videoId);
    } catch (error) {
      return sendJson(res, 502, {
        error: {
          message: `Failed to fetch YouTube transcript: ${error.message}`,
        },
      });
    }

    if (!transcript) {
      return sendJson(res, 400, {
        error: { message: "No transcript found for this video." },
      });
    }

    const prompt = `You are a helpful assistant. Analyze this YouTube video transcript and provide:
1. What this video is about (2-3 sentences)
2. Main topics covered (bullet points)
3. Detailed summary
4. Key takeaways

Transcript:
${transcript.substring(0, 8000)}`;

    let response;

    try {
      response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Notes App",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
    } catch (error) {
      return sendJson(res, 502, {
        error: {
          message: `Failed to reach OpenRouter: ${error.message}`,
        },
      });
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return sendJson(res, response.status, {
        error: {
          message: getUpstreamErrorMessage(
            response.status,
            payload,
            "AI request failed."
          ),
        },
        details: payload,
      });
    }

    return sendJson(res, 200, {
      text: payload?.choices?.[0]?.message?.content || "",
      videoId,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: { message: error.message || "Failed to fetch transcript." },
    });
  }
}




async function serveStaticFile(req, res) {
  const requestedPath = req.url === "/" ? "/index.html" : req.url || "/index.html";
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(distDir, safePath);

  try {
    const fileInfo = await stat(filePath);
    if (fileInfo.isDirectory()) {
      return serveFile(publicIndexPath, res);
    }
    return serveFile(filePath, res);
  } catch {
    return serveFile(publicIndexPath, res);
  }
}

async function serveFile(filePath, res) {
  try {
    const contents = await readFile(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(contents);
  } catch {
    sendJson(res, 404, { error: { message: "File not found" } });
  }
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8").trim();
  return body ? JSON.parse(body) : {};
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".html": return "text/html; charset=utf-8";
    case ".js": return "text/javascript; charset=utf-8";
    case ".css": return "text/css; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".svg": return "image/svg+xml";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    default: return "application/octet-stream";
  }
}

function loadEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  } catch {
    // Ignore missing env files.
  }
}
