import fs from "fs/promises";
import path from "path";
import {
  EnrichedVideoMetadata,
  isEnrichedMovieMetadata,
  isEnrichedSeriesMetadata,
} from "@mp4-conversion-hub/shared";

/**
 * Options for NFO generation.
 */
interface GenerateNfoOptions {
  includeCast?: boolean;
  includeThumb?: boolean;
}

/**
 * Generate a .nfo file (XML) with metadata for media centers like Kodi or Jellyfin.
 * @param outputDir Directory where the .nfo file will be saved.
 * @param fileNameWithoutExtension Desired filename (without extension).
 * @param metadata Enriched video metadata to write.
 * @param options Optional flags to include cast and thumb.
 */
export async function generateNfoFile(
  outputDir: string,
  fileNameWithoutExtension: string,
  metadata: EnrichedVideoMetadata,
  options: GenerateNfoOptions = { includeCast: true, includeThumb: true }
): Promise<void> {
  const nfoPath = path.join(outputDir, `${fileNameWithoutExtension}.nfo`);

  try {
    if (!metadata.tmdb) {
      console.warn("⚠️ No TMDB metadata available. Skipping .nfo generation.");
      return;
    }

    const xml = isEnrichedMovieMetadata(metadata)
      ? buildXml("movie", {
          title: metadata.tmdb.title,
          originaltitle: metadata.tmdb.original_title,
          plot: metadata.tmdb.overview,
          year: metadata.tmdb.release_date?.split("-")[0],
          id: metadata.tmdb.id.toString(),
          language: metadata.tmdb.original_language,
          genres: metadata.tmdb.genres,
          runtime: metadata.tmdb.runtime?.toString(),
          thumb: options.includeThumb ? metadata.tmdb.poster_path : undefined,
          director: findDirector(metadata.tmdb.crew),
          credits: findWriter(metadata.tmdb.crew),
          actors: options.includeCast ? metadata.tmdb.cast : undefined,
        })
      : isEnrichedSeriesMetadata(metadata)
      ? buildXml("episodedetails", {
          title: metadata.tmdb.episode_data?.name || metadata.tmdb.name,
          showtitle: metadata.tmdb.name,
          plot: metadata.tmdb.episode_data?.overview || metadata.tmdb.overview,
          season:
            metadata.tmdb.episode_data?.season_number?.toString() ||
            metadata.season?.toString(),
          episode:
            metadata.tmdb.episode_data?.episode_number?.toString() ||
            metadata.episode?.toString(),
          aired:
            metadata.tmdb.episode_data?.air_date ||
            metadata.tmdb.first_air_date,
          runtime: metadata.tmdb.episode_data?.runtime?.toString(),
          id: metadata.tmdb.id.toString(),
          language: metadata.tmdb.original_language,
          genres: metadata.tmdb.genres,
          thumb: options.includeThumb
            ? metadata.tmdb.episode_data?.still_path
            : undefined,
          director: findDirector(metadata.tmdb.episode_data?.crew),
          credits: findWriter(metadata.tmdb.episode_data?.crew),
          actors: options.includeCast
            ? metadata.tmdb.episode_data?.guest_stars
            : undefined,
        })
      : null;

    if (!xml) {
      console.warn(
        "⚠️ Metadata type not recognized. Skipping .nfo generation."
      );
      return;
    }

    await fs.writeFile(nfoPath, xml, "utf-8");
    console.log(`📄 NFO file generated: ${nfoPath}`);
  } catch (err) {
    console.error("❌ Failed to write .nfo file:", err);
  }
}

/**
 * Build an XML string from a tag and an object of properties.
 */
function buildXml(
  rootTag: string,
  fields: Record<string, string | string[] | undefined | any[]>
): string {
  const entries = Object.entries(fields)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (key === "actors" && Array.isArray(value)) {
        return value
          .map(
            (actor) =>
              `  <actor>\n    <name>${escapeXml(actor.name)}</name>\n    <role>${escapeXml(
                actor.character || ""
              )}</role>\n  </actor>`
          )
          .join("\n");
      } else if (Array.isArray(value)) {
        return value
          .map(
            (v) =>
              `  <${key.slice(0, -1)}>${escapeXml(v)}</${key.slice(0, -1)}>`
          )
          .join("\n");
      }
      return `  <${key}>${escapeXml(value as string)}</${key}>`;
    });

  return `<${rootTag}>\n${entries.join("\n")}\n</${rootTag}>`;
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

/**
 * Find the first director from the crew list.
 */
function findDirector(crew?: any[]): string | undefined {
  return crew?.find((member) => member.job === "Director")?.name;
}

/**
 * Find the first writer from the crew list.
 */
function findWriter(crew?: any[]): string | undefined {
  return crew?.find((member) => member.job === "Writer")?.name;
}
