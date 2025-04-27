import path from "path";
import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";
import { waitUntilFileIsStableAndReadable } from "../utils/waitUntilFileIsReadable";
import { scanFile } from "../utils/scanFile";
import { extractVideoMetadata } from "../utils/extractVideoMetadata";
import { generateNfoFile } from "../utils/generateNfoFile";
import { downloadImage } from "../utils/downloadImage";
import { sendWebhook } from "../utils/sendWebhook";
import { progressState } from "../state/ProgressState";
import {
  JsonStorage,
  HistoryEntry,
  ProcessStatus,
  FileProcessingConfig,
  EnrichedVideoMetadata,
} from "@mp4-conversion-hub/shared";
import {
  isAlreadyMp4,
  copyAsMp4,
  cleanupFile,
  isVideoFile,
} from "../utils/fileUtils";
import { convertWithProgress } from "../utils/handleConversion";
import { logMetadata } from "../utils/logMetadata";
import {
  buildOutputDirectory,
  buildOutputFileName,
} from "../utils/buildOutputPath";
import { ensureDirectoryExists } from "../utils/ensureDirectoryExists";

/**
 * Handles a single file for conversion.
 */
export async function handleFile(
  filePath: string,
  config: FileProcessingConfig,
  historyStorage: JsonStorage<HistoryEntry>
): Promise<void> {
  const originalFileName = path.basename(filePath);
  const parsedPath = path.parse(filePath);
  const startTime = Date.now();

  let status: ProcessStatus = "success";
  let errorMessage: string | undefined;
  let inputSizeMb: number | undefined;
  let outputSizeMb: number | undefined;
  let metadata: EnrichedVideoMetadata | undefined;
  let outputPath = "";

  console.log(`📥 Processing file: ${originalFileName}`);

  try {
    await waitUntilFileIsStableAndReadable(filePath);

    const inputStats = await fs.stat(filePath);
    inputSizeMb = +(inputStats.size / (1024 * 1024)).toFixed(2);

    const isVideo = await isVideoFile(filePath);
    if (!isVideo) {
      console.log(`⚠️ Skipping non-video file: ${originalFileName}`);
      status = "skipped";
      return;
    }

    const fileType = await fileTypeFromFile(filePath);

    console.log(`⏳ Scanning with ClamAV: ${originalFileName}`);
    const scanReport = await scanFile(filePath);
    progressState.updateFileItemScanReport(originalFileName, scanReport);
    if (scanReport.isInfected) {
      console.log(`⚠️ File infected: ${originalFileName}`);
      status = "infected";
      errorMessage = `ClamAV detected virus: ${scanReport.viruses.join(", ")}`;
      return;
    }

    if (config.geminiApiKey && config.tmdbApiKey) {
      console.log(`⏳ Extracting metadata...`);
      metadata = await extractVideoMetadata(
        originalFileName,
        config.geminiApiKey,
        config.tmdbApiKey,
        config.language,
        config.geminiModel
      );
      logMetadata(metadata);
      progressState.updateFileItemMetadata(originalFileName, metadata);
    } else {
      console.log(`⚠️ Metadata extraction skipped (no API keys).`);
    }

    const outputDirPath = buildOutputDirectory(config.outputDir, metadata);
    const outputFileName = buildOutputFileName(parsedPath.name, metadata);
    outputPath = path.join(outputDirPath, outputFileName);

    await ensureDirectoryExists(path.dirname(outputPath));

    if (metadata) {
      await generateNfoFile(
        outputDirPath,
        path.basename(outputPath, ".mp4"),
        metadata
      );

      if (metadata.tmdb?.poster_path) {
        const posterPath = path.join(
          outputDirPath,
          `${path.basename(outputPath, ".mp4")}-poster.jpg`
        );
        try {
          console.log(`⏳ Downloading poster...`);
          await downloadImage(metadata.tmdb.poster_path, posterPath);
          console.log(`🖼️ Poster downloaded: ${posterPath}`);
        } catch (err) {
          console.error(`❌ Poster download failed:`, err);
        }
      }
    }

    if (isAlreadyMp4(fileType!)) {
      await copyAsMp4(filePath, outputPath);
    } else {
      await convertWithProgress(filePath, outputPath, config, originalFileName);
    }
  } catch (err) {
    console.error(`❌ Error processing ${originalFileName}:`, err);
    status = "error";
    errorMessage = (err as Error).message;
  } finally {
    progressState.deleteFileItem(originalFileName);
    await cleanupFile(filePath, originalFileName);

    if (status === "success") {
      try {
        const outputStats = await fs.stat(outputPath);
        outputSizeMb = +(outputStats.size / (1024 * 1024)).toFixed(2);
      } catch {
        console.warn(`⚠️ Could not retrieve output size.`);
      }
    }

    const end = Date.now();
    const durationSeconds = Math.round((end - startTime) / 1000);
    const historyEntry: HistoryEntry = {
      fileName: originalFileName,
      timestamp: new Date().toISOString(),
      durationSeconds,
      outputPath: status === "success" ? outputPath : "",
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
