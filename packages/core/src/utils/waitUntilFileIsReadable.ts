import fscb from "fs";
import { sleep } from "./sleep";
import { stat } from "fs/promises";

export async function waitUntilFileIsReadable(
  filePath: string,
  maxWait = 60000,
  interval = 1000
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    try {
      await new Promise<void>((resolve, reject) => {
        const stream = fscb.createReadStream(filePath, { start: 0, end: 0 });
        stream.once("error", reject);
        stream.once("readable", () => {
          stream.destroy();
          resolve();
        });
      });
      return;
    } catch (err) {
      console.log(`⏳ Still locked or unreadable...`);
      await sleep(interval, {
        verbose: true,
        message: "⏳ Waiting for file to be readable...",
      });
    }
  }

  throw new Error(
    `⏰ Timeout: file still not readable after ${maxWait / 1000}s`
  );
}

export async function waitUntilFileIsStableAndReadable(
  filePath: string,
  maxWait = 60000,
  interval = 1000,
  stableCycles = 2
): Promise<void> {
  const start = Date.now();
  let lastSize = -1;
  let stableCount = 0;

  while (Date.now() - start < maxWait) {
    try {
      const stats = await stat(filePath);

      if (stats.size === lastSize) {
        stableCount++;
      } else if(stats.size != 0){
        stableCount = 0;
        lastSize = stats.size;
      }

      if (stableCount >= stableCycles) {
        // Size stable for N cycles, now test readability
        await new Promise<void>((resolve, reject) => {
          const stream = fscb.createReadStream(filePath, { start: 0, end: 0 });
          stream.once("error", reject);
          stream.once("readable", () => {
            stream.destroy();
            resolve();
          });
        });

        return;
      }

      await sleep(interval, {
        verbose: true,
        message: "⏳ Waiting for file to stabilize and be readable...",
      });
    } catch (err) {
      stableCount = 0;
      console.log(`⏳ Waiting: file not ready or not found...`);
      await sleep(interval);
    }
  }

  throw new Error(
    `⏰ Timeout: file ${filePath} is not stable or readable after ${
      maxWait / 1000
    }s`
  );
}
