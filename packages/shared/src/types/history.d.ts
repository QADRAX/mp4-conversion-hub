export type HistoryEntry = {
    fileName: string;
    timestamp: string;
    durationSeconds: number;
    outputPath: string;
    inputSizeMb?: number;
    outputSizeMb?: number;
    status: "success" | "error" | "skipped";
    errorMessage?: string;
};
