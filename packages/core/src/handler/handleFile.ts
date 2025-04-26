import path from "path";
import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";
import { waitUntilFileIsStableAndReadable } from "../utils/waitUntilFileIsReadable";
import { convertToMp4 } from "../utils/convertToMp4";
import { logFfmpegProgress } from "../utils/logFfmpegProgress";
import { progressState } from "../state/ProgressState";
import {
  JsonStorage,
  FfmpegProgress,
  FileProcessingConfig,
  HistoryEntry,
  ProcessStatus,
  EnrichedVideoMetadata,
} from "@mp4-conversion-hub/shared";
import { scanFile } from "../utils/scanFile";
import { extractVideoMetadata } from "../utils/extractVideoMetadata";
import { logMetadata } from "../utils/logMetadata";
import { generateNfoFile } from "../utils/generateNfoFile";
import { sendWebhook } from "../utils/sendWebhook";

async function isVideoFile(filePath: string): Promise<boolean> {
  const fileType = await fileTypeFromFile(filePath);
  return !!fileType && fileType.mime.startsWith("video/");
}

function getOutputPath(
  filePath: string,
  outputDir: string,
  watchDir: string
): string {
  const relativePath = path.relative(watchDir, filePath);
  const { dir, name } = path.parse(relativePath);

  return path.join(outputDir, dir, `${name}.mp4`);
}

function isAlreadyMp4(fileType: { ext: string }): boolean {
  return fileType.ext === "mp4";
}

async function copyAsMp4(filePath: string, outputPath: string): Promise<void> {
  await fs.copyFile(filePath, outputPath);
  console.log(`ℹ️ File copied as MP4: ${path.basename(filePath)}`);
}

async function convertWithProgress(
  filePath: string,
  outputPath: string,
  config: FileProcessingConfig,
  fileName: string
): Promise<void> {
  const start = Date.now();
  const onProgress = (progress: FfmpegProgress) => {
    const { minutesLeft, secondsLeft } = logFfmpegProgress(
      fileName,
      start,
      progress
    );
    progressState.updateFileItemProgress(fileName, {
      ...progress,
      minutesLeft,
      secondsLeft,
    });
  };

  await convertToMp4(filePath, outputPath, {
    onProgress,
    videoPreset: config.mp4Preset,
    crf: config.videoCrf,
  });

  console.log(`✅ Conversion finished: ${fileName}`);
}

async function cleanupFile(filePath: string, fileName: string) {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️ Original file deleted: ${fileName}`);
  } catch (err) {
    console.error(`❌ Error deleting file ${fileName}:`, err);
  }
}

/**
 * Handles a single file for conversion.
 *
 * @param filePath - Path to the file.
 * @param config - Configuration for processing.
 */
export async function handleFile(
  filePath: string,
  config: FileProcessingConfig,
  historyStorage: JsonStorage<HistoryEntry>
): Promise<void> {
  const fileName = path.basename(filePath);
  const outputPath = getOutputPath(filePath, config.outputDir, config.inputDir);
  const startTime = Date.now();
  let errorMessage: string | undefined;
  let inputSizeMb: number | undefined;
  let outputSizeMb: number | undefined;
  let status: ProcessStatus = "success";
  let metadata: EnrichedVideoMetadata | undefined;

  console.log(`📥 Processing file: ${fileName}`);

  let fileType;

  try {
    await waitUntilFileIsStableAndReadable(filePath);

    const inputStats = await fs.stat(filePath);
    inputSizeMb = +(inputStats.size / (1024 * 1024)).toFixed(2);

    const isVideo = await isVideoFile(filePath);
    if (!isVideo) {
      console.log(`⚠️ Skipping non-video file: ${fileName}`);
      status = "skipped";
      return;
    }

    fileType = await fileTypeFromFile(filePath);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    console.log(`⏳ Waiting for ClamAV antivirus scan for: ${fileName} ...`);
    const scanReport = await scanFile(filePath);
    progressState.updateFileItemScanReport(fileName, scanReport);
    if (scanReport.isInfected) {
      console.log(`⚠️ ALERT infected file: ${fileName}`);
      status = "infected";
      errorMessage = `ClamAV detects viruses in this file: ${scanReport.viruses.toString()}`;
      return;
    }

    if (config.geminiApiKey && config.tmdbApiKey) {
      console.log(`⏳ Extracting video metadata with Gemini IA and TMDB ...`);
      metadata = await extractVideoMetadata(
        fileName,
        config.geminiApiKey,
        config.tmdbApiKey,
        config.language,
        config.geminiModel
      );
      logMetadata(metadata);
      const outputDir = path.dirname(outputPath);
      const baseName = path.basename(outputPath, path.extname(outputPath));
      await generateNfoFile(outputDir, baseName, metadata);
      progressState.updateFileItemMetadata(fileName, metadata);
    } else {
      console.log(`⚠️ Skipping metadata generation: missing Gemini and/or TMDB API keys`);
    }

    if (isAlreadyMp4(fileType!)) {
      await copyAsMp4(filePath, outputPath);
    } else {
      await convertWithProgress(filePath, outputPath, config, fileName);
    }
  } catch (err) {
    console.error(`❌ Error processing ${fileName}:`, err);
    status = "error";
    errorMessage = (err as Error).message;
  } finally {
    progressState.deleteFileItem(fileName);
    await cleanupFile(filePath, fileName);

    if (status == "success") {
      try {
        const outputStats = await fs.stat(outputPath);
        outputSizeMb = +(outputStats.size / (1024 * 1024)).toFixed(2);
      } catch {
        console.warn("⚠️ Could not read output file size.");
      }
    }

    const end = Date.now();
    const durationSeconds = Math.round((end - startTime) / 1000);
    const historyEntry: HistoryEntry = {
      fileName,
      timestamp: new Date().toISOString(),
      durationSeconds,
      outputPath: status == "success" ? outputPath : "",
      status,
      errorMessage,
      outputSizeMb,
      inputSizeMb,
      metadata,
    };

    await historyStorage.append(historyEntry);
    await sendWebhook(historyEntry, config.webhookUrl);
  }
}
