import { UPLOAD_SIZE_LIMIT_MB, INPUT_DIR } from "../config";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

function sanitizeSubpath(subpath: string): string {
  return subpath
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/^\//, "")
    .replace(/\.\./g, "");
}

const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    const raw = (req.query.path as string) ?? "";
    const subpath = sanitizeSubpath(raw);
    const dest = path.join(INPUT_DIR, subpath);

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
