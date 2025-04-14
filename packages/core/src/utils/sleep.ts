export async function sleep(
  ms: number,
  options?: {
    verbose?: boolean;
    message?: string;
  }
): Promise<void> {
  const { verbose = false, message = "⏳ Waiting... {s}s left" } =
    options ?? {};
  const totalSeconds = Math.ceil(ms / 1000);
  let remaining = totalSeconds;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      remaining--;
      if (remaining > 0 && verbose) {
        console.log(message.replace("{s}", `${remaining}`));
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, ms);

    if (remaining > 0 && verbose) {
      console.log(message.replace("{s}", `${remaining}`));
    }
  });
}
