import fs from "fs/promises";
import fetch from "node-fetch";

/**
 * Downloads an image from a URL and saves it locally.
 * @param url - The URL of the image.
 * @param outputPath - The local file path where to save the image.
 */
export async function downloadImage(url: string, outputPath: string): Promise<void> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download image: ${res.statusText}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(outputPath, buffer);
  }
