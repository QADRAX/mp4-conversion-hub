import rateLimit from "express-rate-limit";
import {
  GENERAL_RATE_LIMIT_COOLDOWN_MINUTES,
  GENERAL_RATE_LIMIT_MAX_ATTEMPTS,
  UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES,
  UPLOAD_RATE_LIMIT_MAX_ATTEMPTS,
} from "../config";

export const uploadRateLimiter = rateLimit({
  windowMs: UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES * 60 * 1000,
  max: UPLOAD_RATE_LIMIT_MAX_ATTEMPTS,
  message: {
    error: "Too many upload requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: GENERAL_RATE_LIMIT_COOLDOWN_MINUTES * 60 * 1000,
  max: GENERAL_RATE_LIMIT_MAX_ATTEMPTS,
});
