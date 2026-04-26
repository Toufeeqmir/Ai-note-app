const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODEL = "google/gemma-3-4b-it:free";
const TRANSCRIPT_API_URL = "https://transcriptapi.com/api/v2/youtube/transcript";

function json(response, statusCode, payload) {
  response.status(statusCode).json(payload);
}

function getRequestOrigin(request) {
  const host = request.headers.host;
  const protocol =
    request.headers["x-forwarded-proto"] ||
    (host?.includes("localhost") ? "http" : "https");

  return host ? `${protocol}://${host}` : "https://vercel.com";
}

function getApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim();
}

function getTranscriptApiKey() {
  return process.env.TRANSCRIPTAPI_API_KEY?.trim();
}

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
  const transcriptApiKey = getTranscriptApiKey();

  if (transcriptApiKey) {
    const response = await fetch(
      `${TRANSCRIPT_API_URL}?video_url=${encodeURIComponent(url)}`,
      {
        headers: {
          Authorization: `Bearer ${transcriptApiKey}`,
        },
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        getUpstreamErrorMessage(
          response.status,
          payload,
          `Transcript API request failed with status ${response.status}.`
        )
      );
    }

    const transcript = Array.isArray(payload?.transcript)
      ? payload.transcript.map((item) => item.text).join(" ").trim()
      : "";

    if (!transcript) {
      throw new Error("No transcript found for this video.");
    }

    return transcript;
  }

  const { YoutubeTranscript } = await import("youtube-transcript");
  const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  return transcriptItems.map((item) => item.text).join(" ").trim();
}

export async function handleAi(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: { message: "Method not allowed" } });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return json(response, 500, {
      error: { message: "Missing OPENROUTER_API_KEY environment variable." },
    });
  }

  const prompt =
    typeof request.body?.prompt === "string" ? request.body.prompt.trim() : "";

  if (!prompt) {
    return json(response, 400, {
      error: { message: "Prompt is required." },
    });
  }

  try {
    const upstreamResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": getRequestOrigin(request),
        "X-Title": "AI Notes App",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      return json(response, upstreamResponse.status, {
        error: {
          message: getUpstreamErrorMessage(
            upstreamResponse.status,
            payload,
            `Request failed with status ${upstreamResponse.status}.`
          ),
        },
        details: payload,
      });
    }

    return json(response, 200, {
      text: payload?.choices?.[0]?.message?.content || "",
    });
  } catch (error) {
    return json(response, 500, {
      error: {
        message: error instanceof Error ? error.message : "Unknown server error",
      },
    });
  }
}

export async function handleYoutube(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: { message: "Method not allowed" } });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return json(response, 500, {
      error: { message: "Missing OPENROUTER_API_KEY environment variable." },
    });
  }

  const url =
    typeof request.body?.url === "string" ? request.body.url.trim() : "";

  if (!url) {
    return json(response, 400, {
      error: { message: "YouTube URL is required." },
    });
  }

  const videoId = extractVideoId(url);

  if (!videoId) {
    return json(response, 400, {
      error: { message: "Invalid YouTube URL." },
    });
  }
  
  let transcript;
  try {
    transcript = await fetchTranscriptText(url, videoId);
  } catch (error) {
    return json(response, 502, {
      error: {
        message: `Failed to fetch YouTube transcript: ${
          error instanceof Error ? error.message : "Unknown transcript error"
        }`,
      },
    });
  }

  if (!transcript) {
    return json(response, 400, {
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

  try {
    const upstreamResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": getRequestOrigin(request),
        "X-Title": "AI Notes App",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      return json(response, upstreamResponse.status, {
        error: {
          message: getUpstreamErrorMessage(
            upstreamResponse.status,
            payload,
            "AI request failed."
          ),
        },
        details: payload,
      });
    }

    return json(response, 200, {
      text: payload?.choices?.[0]?.message?.content || "",
      videoId,
    });
  } catch (error) {
    return json(response, 500, {
      error: {
        message: error instanceof Error ? error.message : "Unknown server error",
      },
    });
  }
}
