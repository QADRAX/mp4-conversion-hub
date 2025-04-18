import {
  EnrichedVideoMetadata,
  VideoMetadata,
} from "@mp4-conversion-hub/shared";
import { TMDB } from "tmdb-ts";

/**
 * Enrich metadata from Gemini with TMDb info.
 */
export async function enrichWithTmdbMetadata(
  metadata: VideoMetadata,
  tmdbApiKey: string
): Promise<EnrichedVideoMetadata> {
  const client = new TMDB(tmdbApiKey);

  try {
    const query = metadata.title;
    const year = metadata.type === "movie" ? metadata.year : undefined;

    const result =
      metadata.type === "movie"
        ? (await client.search.movies({ query, year })).results[0]
        : (await client.search.tvShows({ query })).results[0];

    if (!result) return metadata;

    return {
      ...metadata,
      tmdb: {
        id: result.id,
        overview: result.overview,
        poster: result.poster_path
          ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
          : null,
        backdrop: result.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${result.backdrop_path}`
          : null,
        rating: result.vote_average,
        voteCount: result.vote_count,
      },
    };
  } catch (error) {
    console.warn("TMDb enrichment failed:", error);
    return metadata;
  }
}
