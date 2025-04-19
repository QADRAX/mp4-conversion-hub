import {
  createStateContainer,
  Observer,
  StateContainer,
  Progress, 
  ProgressStateData,
  ScanReport,
  EnrichedVideoMetadata
} from "@mp4-conversion-hub/shared";

export const initialProgressState: ProgressStateData = {
  fileItems: [],
};

export type ProgressState = {
  get: () => Readonly<ProgressStateData>;
  subscribe: (observer: Observer<Readonly<ProgressStateData>>) => () => void;
  pushFileItem: (fileItem: string) => void;
  updateFileItemProgress: (fileItem: string, ffmpegProgress: Progress) => void;
  updateFileItemScanReport: (fileItem: string, scanReport: ScanReport) => void;
  updateFileItemMetadata: (fileItem: string, metadata: EnrichedVideoMetadata) => void;
  deleteFileItem: (fileItem: string) => void;
};

const progressStateContainer: StateContainer<ProgressStateData> =
  createStateContainer<ProgressStateData>(initialProgressState);

export const progressState: ProgressState = {
  get: progressStateContainer.get,
  subscribe: progressStateContainer.subscribe,
  pushFileItem(fileItem) {
    progressStateContainer.update((updater) => {
      updater.fileItems.push({
        fileName: fileItem,
      });
    });
  },

  updateFileItemProgress(fileItem, progress) {
    progressStateContainer.update((updater) => {
      const item = updater.fileItems.find((item) => item.fileName === fileItem);
      if (item) {
        item.progress = progress;
      }
    });
  },

  updateFileItemScanReport(fileItem, scanReport) {
    progressStateContainer.update((updater) => {
      const item = updater.fileItems.find((item) => item.fileName === fileItem);
      if (item) {
        item.scanReport = scanReport;
      }
    });
  },

  updateFileItemMetadata(fileItem, metadata) {
    progressStateContainer.update((updater) => {
      const item = updater.fileItems.find((item) => item.fileName === fileItem);
      if (item) {
        item.enrichedMetadata = metadata;
      }
    });
  },

  deleteFileItem(fileItem) {
    progressStateContainer.update((updater) => {
      updater.fileItems = updater.fileItems.filter(
        (item) => item.fileName !== fileItem
      );
    });
  },
};
