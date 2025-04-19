import {
  EnrichedVideoMetadata,
  isEnrichedMovieMetadata,
  isEnrichedSeriesMetadata,
} from "@mp4-conversion-hub/shared";

/**
 * Convert enriched metadata into a common metadata map for media containers (mp4, etc).
 * @param metadata Enriched video metadata
 * @returns A record of metadata key-value pairs
 */
export function buildCommonMetadataFromEnrichedVideo(
  metadata: EnrichedVideoMetadata
): Record<string, string> {
  const base: Record<string, string> = {
    title: metadata.title,
  };

  if (isEnrichedMovieMetadata(metadata)) {
    const tmdb = metadata.tmdb;
    if (metadata.year) base.year = String(metadata.year);
    if (tmdb) {
      base.description = tmdb.overview || "";
      base.artist = tmdb.original_title || metadata.title;
      base.genre = tmdb.genres?.[0] || "";
      base.language = tmdb.original_language || "";
    }
  }

  if (isEnrichedSeriesMetadata(metadata)) {
    const tmdb = metadata.tmdb;
    base.comment = `S${String(metadata.season).padStart(2, "0")}E${String(
      metadata.episode
    ).padStart(2, "0")}`;
    if (tmdb) {
      base.description = tmdb.overview || "";
      base.artist = tmdb.original_name || metadata.title;
      base.genre = tmdb.genres?.[0] || "";
      base.language = tmdb.original_language || "";
      if (tmdb.first_air_date) {
        base.year = tmdb.first_air_date.split("-")[0];
      }
    }
  }

  return base;
}
