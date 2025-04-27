import fs from "fs/promises";

/**
 * Ensures that a given directory exists, creating it if necessary.
 *
 * @param dirPath - The directory path to ensure.
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}
