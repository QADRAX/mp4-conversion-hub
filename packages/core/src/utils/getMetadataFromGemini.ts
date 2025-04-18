import { VideoMetadata } from "@mp4-conversion-hub/shared";
import {
  DETECT_TYPE_PROMPT,
  MOVIE_PROMPT_TEMPLATE,
  SERIES_PROMPT_TEMPLATE,
} from "./getMetadataFromGemini.promts";
import { callGemini } from "./callGemini";
import { z } from "zod";
import { extractJsonFromText } from "./extractJsonFromText";

// Schemas for type-safe parsing
const movieSchema = z.object({
  title: z.string(),
  year: z.coerce.number(),
});

const seriesSchema = z.object({
  title: z.string(),
  season: z.coerce.number(),
  episode: z.coerce.number(),
});

function logAIResponse(stage: string, text: string) {
  console.log(`[Gemini][${stage}] ${text}`);
}

export async function classifyVideoType(
  filename: string,
  apiKey: string
): Promise<"series" | "movie"> {
  const prompt = DETECT_TYPE_PROMPT.replace("{{FILENAME}}", filename);
  const response = (await callGemini(prompt, apiKey)).trim().toLowerCase();

  logAIResponse("classification", response);

  if (response.includes("series")) return "series";
  if (response.includes("movie")) return "movie";

  throw new Error(`Could not classify filename: ${response}`);
}

function buildPrompt(filename: string, type: "series" | "movie"): string {
  const template =
    type === "series" ? SERIES_PROMPT_TEMPLATE : MOVIE_PROMPT_TEMPLATE;
  return `${template.replace(
    "{{FILENAME}}",
    filename
  )}\nRespond ONLY with JSON.`;
}

export async function getMetadataFromGemini(
  filename: string,
  type: "series" | "movie",
  apiKey: string
): Promise<VideoMetadata> {
  const prompt = buildPrompt(filename, type);
  const response = await callGemini(prompt, apiKey);

  logAIResponse("metadata", response);

  const json = extractJsonFromText(response);

  if (type === "series") {
    const parsed = seriesSchema.parse(JSON.parse(json));
    return {
      type: "series",
      title: parsed.title.trim(),
      season: parsed.season,
      episode: parsed.episode,
    };
  } else {
    const parsed = movieSchema.parse(JSON.parse(json));
    return {
      type: "movie",
      title: parsed.title.trim(),
      year: parsed.year,
    };
  }
}