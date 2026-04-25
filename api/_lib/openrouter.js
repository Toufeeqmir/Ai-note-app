const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODEL = "google/gemma-3-4b-it:free";

function json(response, statusCode, payload) {
  response.status(statusCode).json(payload);
}

export async function handleAi(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
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
    const host = request.headers.host;
    const protocol =
      request.headers["x-forwarded-proto"] ||
      (host?.includes("localhost") ? "http" : "https");
    const referer = host ? `${protocol}://${host}` : "https://vercel.com";

    const upstreamResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": referer,
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
          message:
            payload?.error?.message ||
            `Request failed with status ${upstreamResponse.status}.`,
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
