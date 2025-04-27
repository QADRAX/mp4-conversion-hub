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

  if (!metadata.tmdb) {
    console.warn(
      "❌ TMDB metadata not found. This file may not be recognized."
    );
    return;
  }

  if (isEnrichedMovieMetadata(metadata)) {
    console.log(`🎞️ Type      : MOVIE`);
    if (metadata.year) console.log(`📅 Year      : ${metadata.year}`);
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
    const { tmdb } = metadata;

    const episodeTitle = tmdb.episode_data?.name;
    const episodeOverview = tmdb.episode_data?.overview;
    const episodeAirDate = tmdb.episode_data?.air_date;
    const runtime = tmdb.episode_data?.runtime;

    if (episodeTitle) console.log(`🎞️ Episode Title : ${episodeTitle}`);
    if (episodeOverview) console.log(`📝 Plot           : ${episodeOverview}`);
    else console.log(`📝 Plot           : ${tmdb.overview}`);
    if (episodeAirDate) console.log(`📅 Air Date       : ${episodeAirDate}`);
    else console.log(`📅 First Air      : ${tmdb.first_air_date}`);
    if (runtime) console.log(`⏱️ Runtime        : ${runtime} min`);

    console.log(`🔗 TMDB ID        : ${tmdb.id}`);
    console.log(`🏷️ Genres         : ${tmdb.genres.join(", ")}`);
    console.log(`🌐 Language       : ${tmdb.original_language}`);
    console.log(
      `⭐ Rating         : ${tmdb.vote_average} (${tmdb.vote_count} votes)`
    );
  }
}
