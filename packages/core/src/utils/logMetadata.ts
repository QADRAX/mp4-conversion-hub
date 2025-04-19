import {
  EnrichedVideoMetadata,
  isEnrichedMovieMetadata,
  isEnrichedSeriesMetadata,
} from "@mp4-conversion-hub/shared";

/**
 * Pretty-print the enriched video metadata to the console.
 * Logs a warning if no TMDB data is available.
 * @param metadata The enriched metadata to log.
 */
export function logMetadata(metadata: EnrichedVideoMetadata): void {
  console.log("✅ Metadata extraction completed.");
  console.log(`📄 Title     : ${metadata.title}`);

  if (isEnrichedMovieMetadata(metadata)) {
    console.log(`🎞️ Type      : MOVIE`);
    if (metadata.year) console.log(`📅 Year      : ${metadata.year}`);
    if (!metadata.tmdb) {
      console.warn(
        "❌ TMDB metadata not found. This file may not be a recognized movie."
      );
      return;
    }

    const { tmdb } = metadata;
    console.log(`🔗 TMDB ID   : ${tmdb.id}`);
    console.log(`📝 Overview  : ${tmdb.overview}`);
    console.log(`🏷️ Genres    : ${tmdb.genres.join(", ")}`);
    console.log(`🌐 Language  : ${tmdb.original_language}`);
    console.log(
      `⭐ Rating    : ${tmdb.vote_average} (${tmdb.vote_count} votes)`
    );
  } else if (isEnrichedSeriesMetadata(metadata)) {
    console.log(`🎞️ Type      : SERIES`);
    console.log(`📅 Season    : ${metadata.season}`);
    console.log(`🎬 Episode   : ${metadata.episode}`);
    if (!metadata.tmdb) {
      console.warn(
        "❌ TMDB metadata not found. This file may not be a recognized TV show."
      );
      return;
    }

    const { tmdb } = metadata;
    console.log(`🔗 TMDB ID   : ${tmdb.id}`);
    console.log(`📝 Overview  : ${tmdb.overview}`);
    console.log(`🏷️ Genres    : ${tmdb.genres.join(", ")}`);
    console.log(`🌐 Language  : ${tmdb.original_language}`);
    console.log(
      `⭐ Rating    : ${tmdb.vote_average} (${tmdb.vote_count} votes)`
    );
    console.log(`📅 First Air : ${tmdb.first_air_date}`);
  }
}
