const callGrok = async (prompt) => {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.log("Error details:", errorData);
    const apiMessage = errorData?.error?.message || errorData?.message;
    throw new Error(apiMessage || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data?.text || "";
};

export const summarizeNote = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");
  const prompt = `Summarize the following note into clear, concise bullet points. Keep it short and highlight only the most important points.
  Note:
  ${content}
  Respond with only the bullet points, nothing else.`;
  return await callGrok(prompt);
};

export const cleanupNote = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");
  const prompt = `Clean up and improve the following note. Fix grammar, fix structure, make it more readable. Keep the original meaning intact.
  Note:
  ${content}
  Respond with only the cleaned up note, nothing else.`;
  return await callGrok(prompt);
};

export const generateTags = async (content) => {
  if (!content.trim()) throw new Error("Note is empty!");
  const prompt = `Based on the following note, generate 3-5 relevant short tags/keywords.
  Note:
  ${content}
  Respond with only a JSON array of tag strings like: ["tag1", "tag2", "tag3"]
  Nothing else, no explanation.`;
  const result = await callGrok(prompt);
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
  return await callGrok(prompt);
};