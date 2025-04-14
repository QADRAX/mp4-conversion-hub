import PQueue from "p-queue";
import path from "path";
import { createFileWatcher } from "../utils/createFileWatcher";
import { progressState } from "../state/ProgressState";
import { Closeable, createJsonStorage, FileProcessingConfig, HistoryEntry } from "@mp4-converter-hub/shared";
import { handleFile } from "./handleFile";

/**
 * Starts watching a directory and processing video files.
 */
export function startFileProcessing(config: FileProcessingConfig): Closeable & { getHistory: () => Promise<HistoryEntry[]> } {
  const queue = new PQueue({ concurrency: config.concurrency });
  const fileWatcher = createFileWatcher(config.watchDir, "add");

  const history = createJsonStorage<HistoryEntry>(config.outputDir, "history.json");
  
  const onFileAdded = (filePath: string) => {
    const fileName = path.basename(filePath);
    progressState.pushFileItem(fileName);
    queue.add(() => handleFile(filePath, config, history));
  };

  fileWatcher.subscribe(onFileAdded);
  return {
    close() {
      fileWatcher.unsubscribe(onFileAdded);
      fileWatcher.close();
      queue.clear();
    },
    getHistory: history.getAll
  };
}