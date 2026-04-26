import { handleYoutube } from "./_lib/openrouter.js";

export default async function handler(request, response) {
  return handleYoutube(request, response);
}
