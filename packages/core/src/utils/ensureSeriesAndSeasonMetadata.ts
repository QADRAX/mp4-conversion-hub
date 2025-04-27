import { downloadImage } from "../utils/downloadImage";
import { generateNfoFile, generateNfoSeason, generateNfoSerie } from "../utils/generateNfoFile";
import path from "path";
import fs from "fs/promises";
import { EnrichedVideoMetadata, isEnrichedSeriesMetadata } from "@mp4-conversion-hub/shared";

/**
 * Ensures that the metadata and poster images for a TV series and its season exist.
 * 
 * If the series metadata (`tvshow.nfo`) or series poster (`poster.jpg`) do not exist
 * in the series directory, they are generated or downloaded based on the provided metadata.
 * Similarly, if the season metadata (`seasonXX.nfo`) or season poster (`seasonXX-poster.jpg`)
 * do not exist in the season directory, they are also generated or downloaded.
 *
 * This function only applies to series metadata. If the provided metadata does not correspond
 * to a series, the function exits without doing anything.
 * 
 * @param seriesDirPath - Path to the root directory of the series (where `tvshow.nfo` and `poster.jpg` should be).
 * @param seasonDirPath - Path to the directory of the season (where `seasonXX.nfo` and `seasonXX-poster.jpg` should be).
 * @param metadata - Enriched video metadata containing TMDB information used for generating files.
 */
export async function ensureSeriesAndSeasonMetadata(
  seriesDirPath: string,
  seasonDirPath: string,
  metadata: EnrichedVideoMetadata
): Promise<void> {
  if (!isEnrichedSeriesMetadata(metadata)) return;
  if (!metadata.tmdb) return;

  const tvshowNfoPath = path.join(seriesDirPath, "tvshow.nfo");
  const seriesPosterPath = path.join(seriesDirPath, "poster.jpg");

  try {
    await fs.access(tvshowNfoPath);
  } catch {
    console.log(`📄 Generating tvshow.nfo...`);
    await generateNfoSerie(seriesDirPath, metadata);
  }

  if (metadata.tmdb.poster_path) {
    try {
      await fs.access(seriesPosterPath);
    } catch {
      console.log(`🖼️ Downloading series poster...`);
      await downloadImage(metadata.tmdb.poster_path, seriesPosterPath);
    }
  }

  const seasonNumber = metadata.tmdb.episode_data?.season_number ?? metadata.season;
  if (seasonNumber !== undefined) {
    const seasonNfoPath = path.join(seasonDirPath, `season${seasonNumber.toString().padStart(2, "0")}.nfo`);
    const seasonPosterPath = path.join(seasonDirPath, `season${seasonNumber.toString().padStart(2, "0")}-poster.jpg`);

    try {
      await fs.access(seasonNfoPath);
    } catch {
      console.log(`📄 Generating season NFO...`);
      await generateNfoSeason(seasonDirPath, seasonNumber, metadata);
    }

    const posterUrl = metadata.tmdb.season_data?.poster_path;
    if (posterUrl) {
      try {
        await fs.access(seasonPosterPath);
      } catch {
        console.log(`🖼️ Downloading season poster...`);
        await downloadImage(posterUrl, seasonPosterPath);
      }
    }
  }
}