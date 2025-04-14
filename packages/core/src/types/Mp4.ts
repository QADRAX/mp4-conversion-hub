import { FfmpegProgress } from "./FfmpegProgress";

/**
 * Available video presets for encoding speed vs. compression efficiency.
 */
export type Mp4Preset =
  | "ultrafast"
  | "superfast"
  | "veryfast"
  | "faster"
  | "fast"
  | "medium"
  | "slow"
  | "slower"
  | "veryslow";

/**
 * Available constant rate factor values (CRF 0 = lossless, 18-28 common range).
 */
export type CRF = number; // optionally narrow to a specific range with branded types

/**
 * Common audio bitrates.
 */
export type AudioBitrate = "96k" | "128k" | "160k" | "192k" | "256k" | "320k";

/**
 * Supported video codecs.
 */
export type VideoCodec = "libx264" | "libx265" | "libvpx-vp9";

/**
 * Supported audio codecs.
 */
export type AudioCodec = "aac" | "libmp3lame" | "libopus";

/**
 * Output video format.
 */
export type VideoFormat = "mp4" | "webm" | "mkv";

/**
 * Common video resolutions.
 */
export type Resolution =
  | "1920x1080"
  | "1280x720"
  | "854x480"
  | "640x360"
  | "426x240"
  | `${number}x${number}`;

/**
 * Options for converting a video file to a compressed format (e.g. MP4).
 */
export interface ConvertToMp4Options {
  /**
   * Video codec to use. Defaults to "libx264".
   */
  videoCodec?: VideoCodec;
  /**
   * Audio codec to use. Defaults to "aac".
   */
  audioCodec?: AudioCodec;
  /**
   * Preset for encoding speed vs compression. Defaults to "veryfast".
   */
  videoPreset?: Mp4Preset;
  /**
   * Constant Rate Factor. Lower means higher quality. Defaults to 23.
   */
  crf?: CRF;
  /**
   * Audio bitrate (e.g. "128k"). Defaults to "128k".
   */
  audioBitrate?: AudioBitrate;
  /**
   * movflags to apply. Useful for streamable MP4s. Defaults to "+faststart".
   */
  movFlags?: string;
  /**
   * Output format. Defaults to "mp4".
   */
  format?: VideoFormat;
  /**
   * Target resolution (e.g. "1280x720"). If not set, original resolution is preserved.
   */
  resolution?: Resolution;
  /**
   * Additional ffmpeg output options.
   */
  extraOutputOptions?: string[];
  /**
   * Callback to track ffmpeg progress.
   */
  onProgress?: (progress: FfmpegProgress) => void;
}
