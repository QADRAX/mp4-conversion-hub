import { AvailableLanguage, EnrichedVideoMetadata, GeminiModel } from "@mp4-conversion-hub/shared";
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
  language: AvailableLanguage = 'en-US',
  geminiModel: GeminiModel = 'gemini-2.0-flash'
): Promise<EnrichedVideoMetadata> {
  const type = await classifyVideoType(filename, geminiApiKey, geminiModel);
  const metadata = await getMetadataFromGemini(filename, type, geminiApiKey, geminiModel);
  return enrichWithTmdbMetadata(metadata, tmdbApiKey, language);
}
