export type VideoMetadata =
  | { type: "series"; title: string; season: number; episode: number }
  | { type: "movie"; title: string; year: number };

export type EnrichedVideoMetadata = VideoMetadata & {
  tmdb?: {
    id: number;
    overview: string;
    poster: string | null;
    backdrop: string | null;
    rating: number;
    voteCount: number;
  };
};
