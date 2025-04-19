import { AvailableLanguage, EnrichedVideoMetadata } from "@mp4-conversion-hub/shared";
import {
  classifyVideoType,
  getMetadataFromGemini,
} from "./getMetadataFromGemini";
import { enrichWithTmdbMetadata } from "./enrichWithTmdbMetadata";

/**
 * Complete flow: detect type, extract metadata using Gemini, and enrich with TMDb
 */
export async function extractVideoMetadata(
  filename: string,
  geminiApiKey: string,
  tmdbApiKey: string,
  language: AvailableLanguage = 'en-US'
): Promise<EnrichedVideoMetadata> {
  const type = await classifyVideoType(filename, geminiApiKey);
  const metadata = await getMetadataFromGemini(filename, type, geminiApiKey);
  return enrichWithTmdbMetadata(metadata, tmdbApiKey, language);
}
