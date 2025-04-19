import { FfmpegProgress } from "./FfmpegProgress";
import { ScanReport } from "./ScanReport";
import { EnrichedVideoMetadata } from "./VideoMetadata";

export type Progress = FfmpegProgress & {
    minutesLeft: number;
    secondsLeft: number;
}

export type FileItemProgressData = {
    fileName: string;
    enrichedMetadata?: EnrichedVideoMetadata;
    scanReport?: ScanReport;
    progress?: Progress;
}

export type ProgressStateData = {
    fileItems: FileItemProgressData[];
}