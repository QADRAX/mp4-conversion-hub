import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";
import path from "path";

/**
 * Checks if a file type corresponds to an MP4 file.
 */
export function isAlreadyMp4(fileType: { ext: string }): boolean {
  return fileType.ext === "mp4";
}

/**
 * Copies a file to a new location with a .mp4 extension.
 */
export async function copyAsMp4(
  filePath: string,
  outputPath: string
): Promise<void> {
  await fs.copyFile(filePath, outputPath);
  console.log(`ℹ️ File copied as MP4: ${path.basename(filePath)}`);
}

/**
 * Deletes the original file after processing.
 */
export async function cleanupFile(filePath: string, fileName: string) {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️ Original file deleted: ${fileName}`);
  } catch (err) {
    console.error(`❌ Error deleting file ${fileName}:`, err);
  }
}

export async function isVideoFile(filePath: string): Promise<boolean> {
  const fileType = await fileTypeFromFile(filePath);
  return !!fileType && fileType.mime.startsWith("video/");
}
