import path from "path";
import {
  EnrichedVideoMetadata,
  isEnrichedSeriesMetadata,
  isEnrichedMovieMetadata,
  sanitizeFilename,
} from "@mp4-conversion-hub/shared";
import { buildFilenameFromMetadata } from "./buildFilenameFromMetadata";

/**
 * Builds output paths for a file based on its metadata.
 *
 * @param baseOutputDir - The root output directory.
 * @param metadata - The extracted metadata (optional).
 * @returns An object with paths: seriesDirPath, seasonDirPath, and outputDirPath.
 */
export function buildOutputPaths(
  baseOutputDir: string,
  metadata?: EnrichedVideoMetadata
): {
  seriesDirPath?: string;
  seasonDirPath?: string;
  outputDirPath: string;
} {
  if (!metadata) {
    return { outputDirPath: baseOutputDir };
  }

  if (isEnrichedSeriesMetadata(metadata)) {
    const seriesFolder = sanitizeFilename(
      metadata.tmdb?.name ?? metadata.title
    );
    const seasonStr = metadata.season.toString().padStart(2, "0");
    const seasonFolder = `Season ${seasonStr}`;

    const seriesDirPath = path.join(baseOutputDir, "series", seriesFolder);
    const seasonDirPath = path.join(seriesDirPath, seasonFolder);
    return { seriesDirPath, seasonDirPath, outputDirPath: seasonDirPath };
  }

  if (isEnrichedMovieMetadata(metadata)) {
    const title = sanitizeFilename(metadata.tmdb?.title ?? metadata.title);
    const year =
      metadata.tmdb?.release_date?.slice(0, 4) || metadata.year?.toString();

    const movieFolder = year ? `${title} (${year})` : title;
    const outputDirPath = path.join(baseOutputDir, "movies", movieFolder);
    return { outputDirPath };
  }

  return { outputDirPath: baseOutputDir };
}

/**
 * Builds the output filename (with extension) based on metadata or original name.
 *
 * @param originalName - The original file name without extension.
 * @param metadata - The extracted metadata (optional).
 * @returns The output file name ending with .mp4.
 */
export function buildOutputFileName(
  originalName: string,
  metadata?: EnrichedVideoMetadata
): string {
  const cleanName = metadata
    ? buildFilenameFromMetadata(metadata)
    : originalName;

  return sanitizeFilename(cleanName) + ".mp4";
}
