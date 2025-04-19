import { startFileProcessing, progressState } from "@mp4-conversion-hub/core";
import {
  BACKEND_PORT,
  BANNER,
  CONCURRENCY,
  CORS_ALLOWED_ORIGINS,
  OUTPUT_DIR,
  VIDEO_CRF,
  VIDEO_ENCODING_PRESET,
  INPUT_DIR,
  TRUST_PROXY,
  GEMINI_API_KEY,
  TMDB_API_KEY,
  LANGUAGE,
} from "./config";
import express from "express";
import path from "path";
import { basicAuth } from "./middleware/basicAuth";
import cors from "cors";
import { uploadMiddleware } from "./middleware/storage";
import { generalRateLimiter, uploadRateLimiter } from "./middleware/rateLimit";
import fs from "fs/promises";
import { ProgressStateData } from "@mp4-conversion-hub/shared";

console.log(BANNER);

const { getHistory } = startFileProcessing({
  inputDir: INPUT_DIR,
  outputDir: OUTPUT_DIR,
  concurrency: CONCURRENCY,
  videoCrf: VIDEO_CRF,
  mp4Preset: VIDEO_ENCODING_PRESET,
  tmdbApiKey: TMDB_API_KEY,
  geminiApiKey: GEMINI_API_KEY,
  language: LANGUAGE,
});

const app = express();

app.use(
  cors({
    origin: CORS_ALLOWED_ORIGINS,
    credentials: true,
  })
);

if (TRUST_PROXY != "false") {
  app.set("trust proxy", TRUST_PROXY);
}

const frontendPath = path.resolve(__dirname, "../../ui/dist");

app.use(express.static(frontendPath));

app.get("/api/healthcheck", (_, res) => {
  res.send("ok");
});

app.get("/api/progress", basicAuth, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendProgress = (state: Readonly<ProgressStateData>) => {
    res.write(`data: ${JSON.stringify(state)}\n\n`);
  };
  sendProgress(progressState.get());
  const unsubscribe = progressState.subscribe(sendProgress);
  req.on("close", () => {
    unsubscribe();
  });
});

app.get("/api/history", basicAuth, async (_req, res) => {
  try {
    const history = await getHistory();
    res.json(history);
  } catch (err) {
    console.error("❌ Failed to get history:", err);
    res.status(500).json({ error: "Failed to read history" });
  }
});

app.post(
  "/api/upload",
  uploadRateLimiter,
  basicAuth,
  uploadMiddleware.single("file"),
  (req, res) => {
    res.json({ success: true, file: req.file?.filename });
  }
);

app.get("/api/folders", async (req, res) => {
  const raw = (req.query.path as string) ?? "";
  const subpath = raw.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\.\./g, "");
  const base = path.join(INPUT_DIR, subpath);

  try {
    const entries = await fs.readdir(base, { withFileTypes: true });
    const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    res.json({ path: subpath, folders });
  } catch (err) {
    console.error("Error reading folder:", err);
    res.status(500).json({ error: "Failed to read folder" });
  }
});

app.get("*", basicAuth, (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(generalRateLimiter);

app.listen(BACKEND_PORT, () => {
  console.log("🚀 UI listen on Port " + BACKEND_PORT);
});
