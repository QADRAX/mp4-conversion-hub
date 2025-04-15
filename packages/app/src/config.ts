import dotenv from "dotenv";
import { parseCsvString } from "./utils/parseCsvString";
import { Mp4Preset } from "@mp4-conversion-hub/shared";

dotenv.config();

export const BANNER = `

███    ███ ██████  ██   ██      ██████  ██████  ███    ██ ██    ██ ███████ ██████  ███████ ██  ██████  ███    ██     ██   ██ ██    ██ ██████  
████  ████ ██   ██ ██   ██     ██      ██    ██ ████   ██ ██    ██ ██      ██   ██ ██      ██ ██    ██ ████   ██     ██   ██ ██    ██ ██   ██ 
██ ████ ██ ██████  ███████     ██      ██    ██ ██ ██  ██ ██    ██ █████   ██████  ███████ ██ ██    ██ ██ ██  ██     ███████ ██    ██ ██████  
██  ██  ██ ██           ██     ██      ██    ██ ██  ██ ██  ██  ██  ██      ██   ██      ██ ██ ██    ██ ██  ██ ██     ██   ██ ██    ██ ██   ██ 
██      ██ ██           ██      ██████  ██████  ██   ████   ████   ███████ ██   ██ ███████ ██  ██████  ██   ████     ██   ██  ██████  ██████
                                                       
 ▄▄▄·      ▄▄▌ ▐ ▄▌▄▄▄ .▄▄▄  ▄▄▄ .·▄▄▄▄      ▄▄▄▄·  ▄· ▄▌    .▄▄▄   ▄▄▄· ·▄▄▄▄  ▄▄▄   ▄▄▄· ▐▄• ▄ 
▐█ ▄█▪     ██· █▌▐█▀▄.▀·▀▄ █·▀▄.▀·██▪ ██     ▐█ ▀█▪▐█▪██▌    ▐▀•▀█ ▐█ ▀█ ██▪ ██ ▀▄ █·▐█ ▀█  █▌█▌▪
 ██▀· ▄█▀▄ ██▪▐█▐▐▌▐▀▀▪▄▐▀▀▄ ▐▀▀▪▄▐█· ▐█▌    ▐█▀▀█▄▐█▌▐█▪    █▌·.█▌▄█▀▀█ ▐█· ▐█▌▐▀▀▄ ▄█▀▀█  ·██· 
▐█▪·•▐█▌.▐▌▐█▌██▐█▌▐█▄▄▌▐█•█▌▐█▄▄▌██. ██     ██▄▪▐█ ▐█▀·.    ▐█▪▄█·▐█ ▪▐▌██. ██ ▐█•█▌▐█ ▪▐▌▪▐█·█▌
.▀    ▀█▄▀▪ ▀▀▀▀ ▀▪ ▀▀▀ .▀  ▀ ▀▀▀ ▀▀▀▀▀•     ·▀▀▀▀   ▀ •     ·▀▀█.  ▀  ▀ ▀▀▀▀▀• .▀  ▀ ▀  ▀ •▀▀ ▀▀

`;

/**
 * Port where the backend server listens.
 */
export const BACKEND_PORT: number = 3000;

/**
 * Absolute path to the directory where input files are watched.
 */
export const INPUT_DIR = "/input";

/**
 * Absolute path to the directory where processed output files are stored.
 */
export const OUTPUT_DIR = "/output";

/**
 * Number of concurrent processing jobs allowed.
 * Read from the CONCURRENCY environment variable, default is 1.
 */
export const CONCURRENCY = parseInt(process.env.CONCURRENCY || "1", 10);

/**
 * Encoding preset for MP4 video conversion.
 * Read from the VIDEO_ENCODING_PRESET environment variable, default is 'ultrafast'.
 */
export const VIDEO_ENCODING_PRESET: Mp4Preset =
  (process.env.VIDEO_ENCODING_PRESET as Mp4Preset) || "ultrafast";

/**
 * Constant Rate Factor (CRF) used for MP4 video compression quality.
 * (CRF 0 = lossless, 18-28 common range) Default is 23.
 */
export const VIDEO_CRF: number = parseInt(process.env.VIDEO_CRF || "28", 10);

/**
 * Username for basic authentication.
 * Read from the ADMIN_USER environment variable, default is 'admin'.
 */
export const ADMIN_USER = process.env.ADMIN_USER || "admin";

/**
 * Password for basic authentication.
 * Read from the ADMIN_PASSWORD environment variable, default is 'changeme'.
 */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

/**
 * List of allowed origins for CORS requests.
 * Read from the CORS_ALLOWED_ORIGINS environment variable, parsed as CSV. Default is '*'.
 */
export const CORS_ALLOWED_ORIGINS: string[] = parseCsvString(
  process.env.CORS_ALLOWED_ORIGINS || "*"
);

/**
 * Maximum number of allowed upload attempts before rate limiting is enforced.
 * Read from the UPLOAD_RATE_LIMIT_MAX_ATTEMPTS environment variable, default is 5.
 */
export const UPLOAD_RATE_LIMIT_MAX_ATTEMPTS: number = parseInt(
  process.env.UPLOAD_RATE_LIMIT_MAX_ATTEMPTS || "5",
  10
);

/**
 * Cooldown period in minutes before upload attempts are reset after hitting the limit.
 * Read from the UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES environment variable, default is 1.
 */
export const UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES: number = parseInt(
  process.env.UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES || "1",
  10
);

/**
 * Maximum allowed size for uploads, in megabytes.
 * Read from the UPLOAD_SIZE_LIMIT_MB environment variable, default is 3000 MB.
 */
export const UPLOAD_SIZE_LIMIT_MB: number = parseInt(
  process.env.UPLOAD_SIZE_LIMIT_MB || "3000",
  10
);

/**
 * Maximum number of failed authentication attempts before rate limiting is enforced.
 * Read from the AUTH_RATE_LIMIT_MAX_ATTEMPTS environment variable, default is 3.
 */
export const AUTH_RATE_LIMIT_MAX_ATTEMPTS: number = parseInt(
  process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS || "3",
  10
);

/**
 * Cooldown period in minutes before failed authentication attempts are reset.
 * Read from the AUTH_RATE_LIMIT_COOLDOWN_MINUTES environment variable, default is 5.
 */
export const AUTH_RATE_LIMIT_COOLDOWN_MINUTES: number = parseInt(
  process.env.AUTH_RATE_LIMIT_COOLDOWN_MINUTES || "5",
  10
);

/**
 * Maximum number of general requests (e.g. from an IP) before general rate limiting is enforced.
 * Read from the GENERAL_RATE_LIMIT_MAX_ATTEMPTS environment variable, default is 100.
 */
export const GENERAL_RATE_LIMIT_MAX_ATTEMPTS: number = parseInt(
  process.env.GENERAL_RATE_LIMIT_MAX_ATTEMPTS || "100",
  10
);

/**
 * Cooldown period in minutes before general rate limiting is lifted.
 * Read from the GENERAL_RATE_LIMIT_COOLDOWN_MINUTES environment variable, default is 1.
 */
export const GENERAL_RATE_LIMIT_COOLDOWN_MINUTES: number = parseInt(
  process.env.GENERAL_RATE_LIMIT_COOLDOWN_MINUTES || "1",
  10
);
