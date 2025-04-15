import { FfmpegProgress } from "@mp4-conversion-hub/shared";

export function logFfmpegProgress(
  fileName: string,
  start: number,
  progress: FfmpegProgress
): { minutesLeft: number; secondsLeft: number } {
  const percent = progress.percent ?? 0;
  const elapsedMs = Date.now() - start;

  if (percent > 0) {
    const estimatedTotal = (elapsedMs / percent) * 100;
    const remainingMs = estimatedTotal - elapsedMs;
    const remainingSec = Math.round(remainingMs / 1000);

    const minutesLeft = Math.floor(remainingSec / 60);
    const secondsLeft = remainingSec % 60;
    const humanTime =
      minutesLeft > 0 ? `${minutesLeft}m ${secondsLeft}s` : `${secondsLeft}s`;

    console.log(
      `🎞️ [${fileName}] ${percent.toFixed(2)}% - ${
        progress.timemark ?? "??"
      } - ⏳ ~${humanTime} remaining`
    );

    return { minutesLeft, secondsLeft };
  } else {
    console.log(`🎞️ [${fileName}] starting...`);
    return { minutesLeft: 0, secondsLeft: 0 };
  }
}
