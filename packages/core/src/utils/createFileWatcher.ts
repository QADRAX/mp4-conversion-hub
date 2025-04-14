import chokidar, { FSWatcher, ChokidarOptions } from "chokidar";
import {
  createObservable,
  FileWatcher,
  FileWatcherEvent,
} from "@mp4-converter-hub/shared";

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
    console.log(`📂 Event "${event}" on file: ${filePath}`);
    observable.notify(filePath);
  });

  console.log(`🚀 Watching "${path}" for "${event}" events`);

  const close = () => {
    watcher.close().then(() => {
      console.log(`❌ Watcher "${path}" for "${event}" events stoped`);
    });
  };

  return {
    subscribe: observable.subscribe,
    unsubscribe: observable.unsubscribe,
    close,
  };
}
