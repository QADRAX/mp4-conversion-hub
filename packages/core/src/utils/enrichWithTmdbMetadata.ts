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

      return {
        ...metadata,
        tmdb: {
          ...result,
          poster_path: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
          backdrop_path: `https://image.tmdb.org/t/p/w780${result.backdrop_path}`,
          genres: result.genre_ids.map((id) => genreMap[id]).filter(Boolean),
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

      return {
        ...metadata,
        tmdb: {
          ...result,
          poster_path: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
          backdrop_path: `https://image.tmdb.org/t/p/w780${result.backdrop_path}`,
          genres: result.genre_ids.map((id) => genreMap[id]).filter(Boolean),
        } satisfies TMDBSeriesMetadata,
      };
    }

    return metadata;
  } catch (error) {
    console.warn("TMDb enrichment failed:", error);
    return metadata;
  }
}
