import { FfmpegProgress } from "../types/FfmpegProgress";
import ffmpeg from "fluent-ffmpeg";
import { ConvertToMp4Options } from "../types/Mp4";

/**
 * Converts a video to MP4 using ffmpeg with configurable options.
 */
export function convertToMp4(
  inputPath: string,
  outputPath: string,
  options: ConvertToMp4Options = {}
): Promise<void> {
  const {
    videoCodec = "libx264",
    audioCodec = "aac",
    videoPreset = "veryfast",
    crf = 23,
    audioBitrate = "128k",
    movFlags = "+faststart",
    format = "mp4",
    resolution,
    extraOutputOptions = [],
    onProgress,
  } = options;

  console.log(`Converting to mp4 input: ${inputPath} output: ${outputPath}`);

  const outputOptions = [
    `-preset ${videoPreset}`,
    `-crf ${crf}`,
    `-b:a ${audioBitrate}`,
    `-movflags ${movFlags}`,
    ...extraOutputOptions,
  ];

  if (resolution) {
    outputOptions.push(`-vf scale=${resolution}`);
  }

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec(videoCodec)
      .audioCodec(audioCodec)
      .outputOptions(outputOptions)
      .format(format)
      .on("progress", (progress: FfmpegProgress) => {
        onProgress?.(progress);
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err: Error) => {
        reject(err);
      })
      .run();
  });
}
