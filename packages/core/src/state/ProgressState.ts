import {
  createStateContainer,
  Observer,
  StateContainer,
  Progress, 
  ProgressStateData
} from "@mp4-converter-hub/shared";

export const initialProgressState: ProgressStateData = {
  fileItems: [],
};

export type ProgressState = {
  get: () => Readonly<ProgressStateData>;
  subscribe: (observer: Observer<Readonly<ProgressStateData>>) => () => void;
  pushFileItem: (fileItem: string) => void;
  updateFileItem: (fileItem: string, ffmpegProgress: Progress) => void;
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

  updateFileItem(fileItem, progress) {
    progressStateContainer.update((updater) => {
      const item = updater.fileItems.find((item) => item.fileName === fileItem);
      if (item) {
        item.progress = progress;
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
