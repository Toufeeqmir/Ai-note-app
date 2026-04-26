const postJson = async (url, payload, fallbackMessage) => {
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`Cannot reach backend: ${error.message}`);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage =
      data?.error?.message || data?.message || fallbackMessage || `API Error: ${response.status}`;
    throw new Error(apiMessage);
  }

  return data;
};

const callAI = async (prompt) => {
  const data = await postJson("/api/ai", { prompt }, "Failed to process AI request.");
  return data?.text || "";
};

export const summarizeNote = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");

  const prompt = `Summarize the following note into clear, concise bullet points. Keep it short and highlight only the most important points.
  Note:
  ${content}
  Respond with only the bullet points, nothing else.`;

  return await callAI(prompt);
};

export const cleanupNote = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");

  const prompt = `Clean up and improve the following note. Fix grammar, fix structure, make it more readable. Keep the original meaning intact.
  Note:
  ${content}
  Respond with only the cleaned up note, nothing else.`;

  return await callAI(prompt);
};

export const generateTags = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");

  const prompt = `Based on the following note, generate 3-5 relevant short tags/keywords.
  Note:
  ${content}
  Respond with only a JSON array of tag strings like: ["tag1", "tag2", "tag3"]
  Nothing else, no explanation.`;

  const result = await callAI(prompt);

  try {
    const cleaned = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
};

export const generateTitle = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");

  const prompt = `Generate a short, smart title (max 6 words) for the following note.
  Note:
  ${content}
  Respond with only the title, nothing else.`;

  return await callAI(prompt);
};

export const summarizeYoutube = async (url) => {
  if (!url.trim()) throw new Error("YouTube URL is empty!");

  const data = await postJson(
    "/api/youtube",
    { url },
    "Failed to summarize YouTube video."
  );

  return data?.text || "";
};
