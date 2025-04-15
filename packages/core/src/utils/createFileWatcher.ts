import chokidar, { FSWatcher, ChokidarOptions } from "chokidar";
import {
  createObservable,
  FileWatcher,
  FileWatcherEvent,
} from "@mp4-conversion-hub/shared";

export function createFileWatcher(
  path: string,
  event: FileWatcherEvent,
  options: ChokidarOptions = {}
): FileWatcher {
  const observable = createObservable<string>();

  const watcher: FSWatcher = chokidar.watch(path, {
    ignoreInitial: true,
    usePolling: true,
    interval: 1000,
    ...options,
  });

  watcher.on(event, (filePath) => {
    console.log(`📂 Event triggered on file: ${filePath}`);
    observable.notify(filePath);
  });

  console.log(`🚀 Watching "${path}" folder for new file events`);

  const close = () => {
    watcher.close().then(() => {
      console.log(`❌ Watcher "${path}" for file events`);
    });
  };

  return {
    subscribe: observable.subscribe,
    unsubscribe: observable.unsubscribe,
    close,
  };
}
