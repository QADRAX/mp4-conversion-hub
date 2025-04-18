export type VideoMetadata =
  | { type: 'series'; title: string; season: number; episode: number }
  | { type: 'movie'; title: string; year: number };