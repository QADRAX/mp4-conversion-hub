import { Closeable, Subcribible } from "@mp4-converter/generic";

export type FileWatcher = Subcribible<string> & Closeable;

export type FileWatcherEvent = 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
