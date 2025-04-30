import express from "express";
import path from "path";
import fs from "fs/promises";
import { basicAuth } from "../middleware/basicAuth";
import { uploadMiddleware } from "../middleware/storage";
import { uploadRateLimiter } from "../middleware/rateLimit";
import { INPUT_DIR } from "../config";
import { getHistory } from "../services/fileProcessor";
import { ProgressStateData } from "@mp4-conversion-hub/shared";
import { progressState } from "@mp4-conversion-hub/core";

const routerApi = express.Router();

routerApi.use(basicAuth);

routerApi.get("/progress", (req, res) => {
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

routerApi.get("/history", async (_req, res) => {
  try {
    const history = await getHistory();
    res.json(history);
  } catch (err) {
    console.error("❌ Failed to get history:", err);
    res.status(500).json({ error: "Failed to read history" });
  }
});

routerApi.post(
  "/upload",
  uploadRateLimiter,
  basicAuth,
  uploadMiddleware.single("file"),
  (req, res) => {
    res.json({ success: true, file: req.file?.filename });
  }
);

export default routerApi;
