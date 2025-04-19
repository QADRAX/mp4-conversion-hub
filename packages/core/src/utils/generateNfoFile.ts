import fs from "fs/promises";
import path from "path";
import {
  EnrichedVideoMetadata,
  isEnrichedMovieMetadata,
  isEnrichedSeriesMetadata,
} from "@mp4-conversion-hub/shared";

/**
 * Generate a .nfo file (XML) with metadata for media centers like Kodi or Jellyfin.
 * @param outputDir Directory where the .nfo file will be saved.
 * @param fileNameWithoutExtension Desired filename (without extension).
 * @param metadata Enriched video metadata to write.
 */
export async function generateNfoFile(
  outputDir: string,
  fileNameWithoutExtension: string,
  metadata: EnrichedVideoMetadata
): Promise<void> {
  try {
    const nfoPath = path.join(outputDir, `${fileNameWithoutExtension}.nfo`);

    let xml = "";

    if (isEnrichedMovieMetadata(metadata) && metadata.tmdb) {
      const tmdb = metadata.tmdb;
      xml = `<movie>
  <title>${escapeXml(tmdb.title)}</title>
  <originaltitle>${escapeXml(tmdb.original_title)}</originaltitle>
  <plot>${escapeXml(tmdb.overview)}</plot>
  <year>${tmdb.release_date.split("-")[0]}</year>
  <id>${tmdb.id}</id>
  <language>${tmdb.original_language}</language>
  ${tmdb.genres.map((g) => `<genre>${escapeXml(g)}</genre>`).join("\n  ")}
</movie>`;
    } else if (isEnrichedSeriesMetadata(metadata) && metadata.tmdb) {
      const tmdb = metadata.tmdb;
      xml = `<episodedetails>
  <title>${escapeXml(tmdb.name)}</title>
  <plot>${escapeXml(tmdb.overview)}</plot>
  <season>${metadata.season}</season>
  <episode>${metadata.episode}</episode>
  <aired>${tmdb.first_air_date}</aired>
  <id>${tmdb.id}</id>
  <language>${tmdb.original_language}</language>
  ${tmdb.genres.map((g) => `<genre>${escapeXml(g)}</genre>`).join("\n  ")}
</episodedetails>`;
    } else {
      console.warn("⚠️ No TMDB metadata available. Skipping .nfo generation.");
      return;
    }

    await fs.writeFile(nfoPath, xml, "utf-8");
    console.log(`📄 NFO file generated: ${nfoPath}`);
  } catch (err) {
    console.error("❌ Failed to write .nfo file:", err);
  }
}

/**
 * Escape special XML characters.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
