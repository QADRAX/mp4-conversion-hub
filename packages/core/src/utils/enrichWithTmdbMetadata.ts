import {
  VideoMetadata,
  isMovieMetadata,
  isSeriesMetadata,
  TMDBMovieMetadata,
  TMDBSeriesMetadata,
  EnrichedVideoMetadata,
  AvailableLanguage,
} from "@mp4-conversion-hub/shared";
import { TMDB } from "tmdb-ts";

/**
 * Enriches a VideoMetadata object with TMDB data (movies, series, and optionally seasons and episodes).
 */
export async function enrichWithTmdbMetadata(
  metadata: VideoMetadata,
  tmdbApiKey: string,
  language: AvailableLanguage = "en-US"
): Promise<EnrichedVideoMetadata> {
  const client = new TMDB(tmdbApiKey);

  try {
    const query = metadata.title;

    if (isMovieMetadata(metadata)) {
      const [genreList, searchResults] = await Promise.all([
        client.genres.movies({ language }),
        client.search.movies({ query, year: metadata.year, language }),
      ]);

      const genreMap = Object.fromEntries(
        genreList.genres.map((g) => [g.id, g.name])
      ) as Record<number, string>;

      const result = searchResults.results[0];
      if (!result) return metadata;

      const details = await client.movies.details(result.id, ['credits'], language);

      return {
        ...metadata,
        tmdb: {
          ...result,
          poster_path: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
          backdrop_path: `https://image.tmdb.org/t/p/w780${result.backdrop_path}`,
          genres: result.genre_ids.map((id) => genreMap[id]).filter(Boolean),
          runtime: details.runtime,
          crew: details.credits.crew,
          cast: details.credits.cast,
        } satisfies TMDBMovieMetadata,
      };
    }

    if (isSeriesMetadata(metadata)) {
      const [genreList, searchResults] = await Promise.all([
        client.genres.tvShows({ language }),
        client.search.tvShows({ query, language }),
      ]);

      const genreMap = Object.fromEntries(
        genreList.genres.map((g) => [g.id, g.name])
      ) as Record<number, string>;

      const result = searchResults.results[0];
      if (!result) return metadata;

      let seasonData = undefined;
      let episodeData = undefined;
      
      if (metadata.season !== undefined && metadata.episode !== undefined) {
        const seasonDetails = await client.tvShows.season(
          result.id,
          metadata.season
        );

        // Season data
        seasonData = {
          air_date: seasonDetails.air_date,
          name: seasonDetails.name,
          overview: seasonDetails.overview,
          id: seasonDetails.id,
          poster_path: seasonDetails.poster_path
            ? `https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`
            : null,
          season_number: seasonDetails.season_number,
        };

        // Episode data
        const episodeDetails = seasonDetails.episodes.find(
          (ep) => ep.episode_number === metadata.episode
        );

        if (episodeDetails) {
          episodeData = {
            air_date: episodeDetails.air_date,
            episode_number: episodeDetails.episode_number,
            crew: episodeDetails.crew,
            guest_stars: episodeDetails.guest_stars,
            id: episodeDetails.id,
            name: episodeDetails.name,
            overview: episodeDetails.overview,
            production_code: episodeDetails.production_code,
            season_number: episodeDetails.season_number,
            still_path: episodeDetails.still_path,
            vote_average: episodeDetails.vote_average,
            vote_count: episodeDetails.vote_count,
            runtime: episodeDetails.runtime,
            show_id: episodeDetails.show_id,
          };
        }
      }

      return {
        ...metadata,
        tmdb: {
          ...result,
          poster_path: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
          backdrop_path: `https://image.tmdb.org/t/p/w780${result.backdrop_path}`,
          genres: result.genre_ids.map((id) => genreMap[id]).filter(Boolean),
          season_data: seasonData,
          episode_data: episodeData,
        } satisfies TMDBSeriesMetadata,
      };
    }

    return metadata;
  } catch (error) {
    console.warn("TMDb enrichment failed:", error);
    return metadata;
  }
}
