export interface MovieMetadata {
  title: string;
  year?: number;
}

export interface SeriesMetadata {
  title: string;
  season: number;
  episode: number;
}

export type VideoMetadata = MovieMetadata | SeriesMetadata;

export type EnrichedMovieMetadata = MovieMetadata & {
  tmdb?: TMDBMovieMetadata;
};

export type EnrichedSeriesMetadata = SeriesMetadata & {
  tmdb?: TMDBSeriesMetadata;
};

export type EnrichedVideoMetadata =
  | EnrichedMovieMetadata
  | EnrichedSeriesMetadata;

export interface TMDBMovieMetadata {
  id: number;
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  genres: string[];
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface TMDBSeriesMetadata {
  id: number;
  adult: boolean;
  name: string;
  first_air_date: string;
  backdrop_path: string;
  genre_ids: number[];
  genres: string[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
}

export function isSeriesMetadata(
  metadata: VideoMetadata
): metadata is SeriesMetadata {
  return "season" in metadata && "episode" in metadata;
}

export function isMovieMetadata(
  metadata: VideoMetadata
): metadata is MovieMetadata {
  return "title" in metadata && !("season" in metadata);
}

export function isEnrichedMovieMetadata(
  metadata: EnrichedVideoMetadata
): metadata is EnrichedMovieMetadata {
  return "title" in metadata && !("season" in metadata);
}

export function isEnrichedSeriesMetadata(
  metadata: EnrichedVideoMetadata
): metadata is EnrichedSeriesMetadata {
  return "season" in metadata && "episode" in metadata;
}