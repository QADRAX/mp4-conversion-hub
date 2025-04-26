import path from "path";
import {
  EnrichedVideoMetadata,
  isEnrichedSeriesMetadata,
  isEnrichedMovieMetadata,
  sanitizeFilename,
} from "@mp4-conversion-hub/shared";
import { buildFilenameFromMetadata } from "../utils/buildFilenameFromMetadata";

/**
 * Builds the output filename (without path) based on metadata or original name.
 *
 * @param originalName - The original file name without extension.
 * @param metadata - The extracted metadata (optional).
 * @returns The output file name with .mp4 extension.
 */
export function buildOutputFileName(
  originalName: string,
  metadata?: EnrichedVideoMetadata
): string {
  if (metadata) {
    const cleanName = buildFilenameFromMetadata(metadata);
    return sanitizeFilename(cleanName) + ".mp4";
  }
  return sanitizeFilename(originalName) + ".mp4";
}

/**
 * Builds the output directory path based on metadata.
 *
 * @param outputDir - The base output directory.
 * @param metadata - The extracted metadata (optional).
 * @returns The path to the output directory.
 */
export function buildOutputDirectory(
  outputDir: string,
  metadata?: EnrichedVideoMetadata
): string {
  if (!metadata) {
    return outputDir;
  }

  if (isEnrichedSeriesMetadata(metadata)) {
    const seriesFolder = sanitizeFilename(
      metadata.tmdb?.name ?? metadata.title
    );
    const seasonStr = metadata.season.toString().padStart(2, "0"); // Padding Season 01, 02
    const seasonFolder = `Season ${seasonStr}`;
    return path.join(outputDir, "series", seriesFolder, seasonFolder);
  }

  if (isEnrichedMovieMetadata(metadata)) {
    const title = sanitizeFilename(metadata.tmdb?.title ?? metadata.title);
    const year =
      metadata.tmdb?.release_date?.slice(0, 4) || metadata.year?.toString();
    if (year) {
      return path.join(outputDir, "movies", `${title} (${year})`);
    }
    return path.join(outputDir, "movies", title);
  }

  return outputDir;
}
