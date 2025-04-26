import { convertToMp4 } from "../utils/convertToMp4";
import { progressState } from "../state/ProgressState";
import {
  FfmpegProgress,
  FileProcessingConfig,
} from "@mp4-conversion-hub/shared";
import { logFfmpegProgress } from "../utils/logFfmpegProgress";

/**
 * Converts a file to MP4 with progress tracking.
 */
export async function convertWithProgress(
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
