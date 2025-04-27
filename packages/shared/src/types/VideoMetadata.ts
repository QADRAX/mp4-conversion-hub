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
  runtime?: number;
  crew?: TMDBCrewMetadata[];
  cast?: TMDBGuestStarMetadata[];
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
  season_data?: TMDBSeasonMetadata;
  episode_data?: TMDBEpisodeMetadata;
}

export interface TMDBSeasonMetadata {
  air_date: string;
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export interface TMDBEpisodeMetadata {
  air_date: string;
  episode_number: number;
  crew: TMDBCrewMetadata[];
  guest_stars: TMDBGuestStarMetadata[];
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  show_id: number;
}

export interface TMDBCrewMetadata {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBGuestStarMetadata {
  credit_id: string;
  order: number;
  character: string;
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
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