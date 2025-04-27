import { EnrichedVideoMetadata } from "./VideoMetadata";

export type ProcessStatus = "success" | "error" | "skipped" | "infected";

export type HistoryEntry = {
  fileName: string;
  timestamp: string;
  durationSeconds: number;
  outputPath: string;
  inputSizeMb?: number;
  outputSizeMb?: number;
  status: ProcessStatus;
  errorMessage?: string;
};
