import { UPLOAD_SIZE_LIMIT_MB, INPUT_DIR } from "../config";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const dest = path.join(INPUT_DIR);
    try {
      await fs.mkdir(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err as Error, dest);
    }
  },
  filename: (_req, file, cb) => {
    const name = path.basename(file.originalname);
    cb(null, name);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: UPLOAD_SIZE_LIMIT_MB * 1024 * 1024 },
});
