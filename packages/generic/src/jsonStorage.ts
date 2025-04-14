import fs from "fs/promises";
import path from "path";

export type JsonStorage<T> = {
  append: (entry: T) => Promise<void>;
  getAll: () => Promise<T[]>;
};

/**
 * Creates a JSON storage handler for a given file and type.
 *
 * @param fileName - Name of the JSON file to store data in.
 * @returns Functions to append and get all records.
 */
export function createJsonStorage<T>(targetDir: string, fileName: string): JsonStorage<T> {
  const filePath = path.resolve(targetDir, fileName);

  async function getAll(): Promise<T[]> {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.warn(`⚠️ ${filePath} is not an array`);
        return [];
      }
      return parsed as T[];
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        return [];
      }
      console.error(`❌ Failed to read ${filePath}:`, err);
      return [];
    }
  }

  async function append(entry: T): Promise<void> {
    const all = await getAll();
    all.push(entry);
    try {
      await fs.writeFile(filePath, JSON.stringify(all, null, 2));
    } catch (err) {
      console.error(`❌ Failed to write to ${filePath}:`, err);
    }
  }

  return { append, getAll };
}
