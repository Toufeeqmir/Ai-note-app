import { handleAi } from "./_lib/openrouter.js";

export default async function handler(request, response) {
  return handleAi(request, response);
}
