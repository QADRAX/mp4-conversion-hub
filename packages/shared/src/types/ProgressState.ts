import { FfmpegProgress } from "./FfmpegProgress";

export type Progress = FfmpegProgress & {
    minutesLeft: number;
    secondsLeft: number;
}

export type FileItemProgressData = {
    fileName: string;
    progress?: Progress;
}

export type ProgressStateData = {
    fileItems: FileItemProgressData[];
}