import { GeminiModel } from "./Gemini";
import { AvailableLanguage } from "./Languages";
import { Mp4Preset } from "./Mp4";

export type FileProcessingConfig = {
    inputDir: string;
    outputDir: string;
    concurrency: number;
    mp4Preset: Mp4Preset;
    videoCrf: number;

    geminiApiKey: string;
    geminiModel: GeminiModel;
    tmdbApiKey: string;
    language: AvailableLanguage;

    webhookUrl?: string;
}