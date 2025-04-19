import {
  GeminiModel,
  MovieMetadata,
  SeriesMetadata,
  VideoMetadata,
} from "@mp4-conversion-hub/shared";
import {
  DETECT_TYPE_PROMPT,
  MOVIE_PROMPT_TEMPLATE,
  SERIES_PROMPT_TEMPLATE,
} from "./getMetadataFromGemini.promts";
import { callGemini } from "./callGemini";
import { z } from "zod";
import { extractJsonFromText } from "./extractJsonFromText";

// Zod schemas for LLM output validation
const movieSchema = z.object({
  title: z.string(),
  year: z.coerce.number().optional(),
});

const seriesSchema = z.object({
  title: z.string(),
  season: z.coerce.number(),
  episode: z.coerce.number(),
});

function logAIResponse(
  stage: "classification" | "metadata",
  text: string,
  geminiModel: GeminiModel,
  filename?: string
) {
  const icons = {
    classification: "🧠",
    metadata: "🎬",
  };

  const descriptions = {
    classification: "Classified the type of video",
    metadata: "Extracted metadata from the filename",
  };

  const icon = icons[stage];
  const description = descriptions[stage];
  const context = filename ? `Filename: "${filename}"` : "Unknown file";

  console.log(`${icon} [${geminiModel}][${stage.toUpperCase()}] ${description}`);
  console.log(`   ↪ ${context}`);
  console.log(`   ↪ Response: ${text}`);
}



/**
 * Use LLM to classify whether a filename refers to a movie or a series.
 */
export async function classifyVideoType(
  filename: string,
  apiKey: string,
  geminiModel: GeminiModel = 'gemini-2.0-flash',
): Promise<"series" | "movie"> {
  const prompt = DETECT_TYPE_PROMPT.replace("{{FILENAME}}", filename);
  const response = (await callGemini(prompt, apiKey, geminiModel)).trim().toLowerCase();

  logAIResponse("classification", response, geminiModel, filename);

  if (response.includes("series")) return "series";
  if (response.includes("movie")) return "movie";

  throw new Error(`Could not classify filename: ${response}`);
}

/**
 * Build the prompt for metadata extraction.
 */
function buildPrompt(filename: string, type: "series" | "movie"): string {
  const template =
    type === "series" ? SERIES_PROMPT_TEMPLATE : MOVIE_PROMPT_TEMPLATE;
  return `${template.replace(
    "{{FILENAME}}",
    filename
  )}\nRespond ONLY with JSON.`;
}

/**
 * Use Gemini to extract metadata from a filename.
 */
export async function getMetadataFromGemini(
  filename: string,
  type: "series" | "movie",
  apiKey: string,
  geminiModel: GeminiModel = 'gemini-2.0-flash',
): Promise<MovieMetadata | SeriesMetadata> {
  const prompt = buildPrompt(filename, type);
  const response = await callGemini(prompt, apiKey, geminiModel);

  logAIResponse("metadata", response, geminiModel, filename);

  const json = extractJsonFromText(response);

  if (type === "series") {
    const parsed = seriesSchema.parse(JSON.parse(json));
    return {
      title: parsed.title.trim(),
      season: parsed.season,
      episode: parsed.episode,
    };
  } else {
    const parsed = movieSchema.parse(JSON.parse(json));
    return {
      title: parsed.title.trim(),
      year: parsed.year,
    };
  }
}
