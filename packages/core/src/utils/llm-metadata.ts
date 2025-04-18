import { VideoMetadata } from "@mp4-conversion-hub/shared";
import {
  DETECT_TYPE_PROMPT,
  MOVIE_PROMPT_TEMPLATE,
  SERIES_PROMPT_TEMPLATE,
} from "./llm-metadata.promts";

async function detectFileTypeViaLLM(
  filename: string,
  ollamaUrl: string,
): Promise<"series" | "movie"> {
  const prompt = DETECT_TYPE_PROMPT.replace("{{FILENAME}}", filename);

  const res = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "mistral", prompt, stream: false }),
  });

  const data = await res.json();
  const text = data.response.trim().toLowerCase();

  console.log(`IA said: ${text}`);

  if (text.includes("series")) return "series";
  if (text.includes("movie")) return "movie";

  throw new Error(`Could not classify filename: ${data.response}`);
}

function buildPrompt(filename: string, type: "series" | "movie") {
  const template =
    type === "series" ? SERIES_PROMPT_TEMPLATE : MOVIE_PROMPT_TEMPLATE;
  return template.replace("{{FILENAME}}", filename);
}

export async function extractVideoMetadata(
  filename: string,
  ollamaUrl: string,
): Promise<VideoMetadata> {
  const type = await detectFileTypeViaLLM(filename, ollamaUrl);

  console.log(`IA recognize this file as type '${type}'`);

  const prompt = buildPrompt(filename, type);

  const res = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "mistral", prompt, stream: false }),
  });

  const data = await res.json();

  try {
    console.log(`IA said: ${data.response}`);
    const parsed = JSON.parse(data.response.trim());

    if (type === "series") {
      return {
        type: "series",
        title: parsed.title.trim(),
        season: Number(parsed.season),
        episode: Number(parsed.episode),
      };
    } else {
      return {
        type: "movie",
        title: parsed.title.trim(),
        year: Number(parsed.year),
      };
    }
  } catch (err) {
    throw new Error(`Failed to parse ${type} metadata: ${data.response}`);
  }
}
