import { Closeable } from "../closeable";
import { Subcribible } from "../observable";

export type FileWatcher = Subcribible<string> & Closeable;

export type FileWatcherEvent = 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
