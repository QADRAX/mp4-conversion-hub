import { startFileProcessing } from "@mp4-conversion-hub/core";
import {
  INPUT_DIR,
  OUTPUT_DIR,
  CONCURRENCY,
  VIDEO_CRF,
  VIDEO_ENCODING_PRESET,
  TMDB_API_KEY,
  GEMINI_API_KEY,
  GEMINI_MODEL,
  LANGUAGE,
  WEBHOOK_URL,
} from "../config";

let started = false;

let getHistoryFn: (() => Promise<unknown>) | null = null;
let closeFn: (() => void) | null = null;

/**
 * Starts the file processing service.
 */
export function startFileProcessor() {
  if (started) return;
  const processor = startFileProcessing({
    inputDir: INPUT_DIR,
    outputDir: OUTPUT_DIR,
    concurrency: CONCURRENCY,
    videoCrf: VIDEO_CRF,
    mp4Preset: VIDEO_ENCODING_PRESET,
    tmdbApiKey: TMDB_API_KEY,
    geminiApiKey: GEMINI_API_KEY,
    geminiModel: GEMINI_MODEL,
    language: LANGUAGE,
    webhookUrl: WEBHOOK_URL,
  });

  getHistoryFn = processor.getHistory;
  closeFn = processor.close;

  started = true;
}

/**
 * Closes the processor.
 */
export function stopFileProcessor() {
  if (closeFn) {
    closeFn();
  }
  started = false;
}

/**
 * Exposed utilities
 */
export function getHistory() {
  if (!getHistoryFn) throw new Error("Processor not started");
  return getHistoryFn();
}