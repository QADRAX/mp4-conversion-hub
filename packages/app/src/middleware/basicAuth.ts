import { Request, Response, NextFunction } from "express";
import {
  ADMIN_USER,
  ADMIN_PASSWORD,
  AUTH_RATE_LIMIT_MAX_ATTEMPTS,
  AUTH_RATE_LIMIT_COOLDOWN_MINUTES,
} from "../config";

const failedAttempts = new Map<string, { count: number; expiresAt: number }>();
const BLOCK_DURATION_MS = AUTH_RATE_LIMIT_COOLDOWN_MINUTES * 60 * 1000;

export function basicAuth(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown";
  const now = Date.now();

  const record = failedAttempts.get(ip);

  if (
    record &&
    record.count >= AUTH_RATE_LIMIT_MAX_ATTEMPTS &&
    record.expiresAt > now
  ) {
    return res.status(429).send("Too many failed attempts. Try again later.");
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).send("Authentication required.");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const isValid = username === ADMIN_USER && password === ADMIN_PASSWORD;

  if (!isValid) {
    const prev = failedAttempts.get(ip) || { count: 0, expiresAt: 0 };
    const newCount = prev.count + 1;
    const newExpiresAt =
      newCount >= AUTH_RATE_LIMIT_MAX_ATTEMPTS
        ? now + BLOCK_DURATION_MS
        : prev.expiresAt;

    failedAttempts.set(ip, { count: newCount, expiresAt: newExpiresAt });

    return res.status(403).send("Access denied.");
  }

  failedAttempts.delete(ip);
  next();
}
