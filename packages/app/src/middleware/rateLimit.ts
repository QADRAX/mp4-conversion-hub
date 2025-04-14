import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../config";

export const uploadRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: RATE_LIMIT,
  message: {
    error: "Too many upload requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
