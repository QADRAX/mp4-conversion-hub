import { Mp4Preset } from "./Mp4";

export type FileProcessingConfig = {
    inputDir: string;
    outputDir: string;
    concurrency: number;
    mp4Preset: Mp4Preset;
    videoCrf: number;
}