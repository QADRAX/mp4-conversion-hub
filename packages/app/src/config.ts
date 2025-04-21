import dotenv from "dotenv";
import { parseCsvString } from "./utils/parseCsvString";
import { AvailableLanguage, GeminiModel, Mp4Preset, TimeZone } from "@mp4-conversion-hub/shared";

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
 * If you are behind another proxy (like Nginx or Docker bridge), you can use its IP (e.g. "172.17.0.1" in Docker networking).
 * If your application is not behind any proxy, simply set it to false.
 */
export const TRUST_PROXY = process.env.TRUST_PROXY || "false"

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

/**
 * API key to access Google Gemini (LLM) services.
 *
 * @env GEMINI_API_KEY
 * @required for AI-based metadata extraction
 */
export const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";

/**
 * API key to access TMDB (The Movie Database).
 * Used to enrich video metadata with real-world data.
 *
 * @env TMDB_API_KEY
 * @required for fetching movie/series metadata
 */
export const TMDB_API_KEY: string = process.env.TMDB_API_KEY || "";

/**
 * Preferred language for metadata results from Gemini and TMDB.
 *
 * @env LANGUAGE
 * @default 'en-US'
 * @type {AvailableLanguage}
 */
export const LANGUAGE: AvailableLanguage =
  (process.env.LANGUAGE as AvailableLanguage) || "en-US";

/**
 * Gemini model to use for AI-based processing.
 * Should match one of the valid GeminiModel options.
 *
 * @env GEMINI_MODEL
 * @default 'gemini-2.0-flash'
 * @type {GeminiModel}
 */
export const GEMINI_MODEL: GeminiModel =
  (process.env.GEMINI_MODEL as GeminiModel) || "gemini-2.0-flash";

/**
 * Optional environment variable that defines the URL of the webhook endpoint. *
 */
export const WEBHOOK_URL: string | undefined = process.env.WEBHOOK_URL;

export const DAILY_TASK_CRON: string = process.env.DAILY_TASK_CRON || '0 2 * * *';
export const DAILY_TASK_TIMEZONE: TimeZone = process.env.DAILY_TASK_TIMEZONE as TimeZone || 'UTC';