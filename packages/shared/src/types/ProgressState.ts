import { FfmpegProgress } from "./FfmpegProgress";
import { ScanReport } from "./ScanReport";

export type Progress = FfmpegProgress & {
    minutesLeft: number;
    secondsLeft: number;
}

export type FileItemProgressData = {
    fileName: string;
    scanReport?: ScanReport;
    progress?: Progress;
}

export type ProgressStateData = {
    fileItems: FileItemProgressData[];
}