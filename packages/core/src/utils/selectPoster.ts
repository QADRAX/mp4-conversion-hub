import {
  EnrichedVideoMetadata,
  isEnrichedMovieMetadata,
  isEnrichedSeriesMetadata,
} from "@mp4-conversion-hub/shared";

/**
 * Selects the best poster URL based on available metadata.
 *
 * @param metadata Enriched video metadata
 * @returns The best poster URL if available, undefined otherwise
 */
export function selectPoster(
  metadata: EnrichedVideoMetadata
): string | undefined {
  if (!metadata.tmdb) {
    return undefined;
  }

  if (isEnrichedMovieMetadata(metadata)) {
    return metadata.tmdb.poster_path;
  }

  if (isEnrichedSeriesMetadata(metadata)) {
    return (
      metadata.tmdb.episode_data?.still_path ||
      metadata.tmdb.season_data?.poster_path ||
      metadata.tmdb.poster_path
    );
  }

  return undefined;
}
