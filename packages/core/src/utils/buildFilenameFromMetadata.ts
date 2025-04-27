import {
  EnrichedVideoMetadata,
  isEnrichedMovieMetadata,
  isEnrichedSeriesMetadata,
  sanitizeFilename,
} from "@mp4-conversion-hub/shared";

export function buildFilenameFromMetadata(
  metadata: EnrichedVideoMetadata
): string {
  if (isEnrichedSeriesMetadata(metadata)) {
    const seasonStr = metadata.season.toString().padStart(2, "0");
    const episodeStr = metadata.episode.toString().padStart(2, "0");
    const title = metadata.tmdb?.name || metadata.title;
    return `${sanitizeFilename(title)}.S${seasonStr}E${episodeStr}`;
  }

  if (isEnrichedMovieMetadata(metadata)) {
    const title = metadata.tmdb?.title || metadata.title;
    if (metadata.year) {
      return `${sanitizeFilename(title)}.${metadata.year}`;
    }
    return sanitizeFilename(title);
  }

  throw new Error("Invalid metadata type");
}
