import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function updateClamAvDb(): Promise<void> {
  try {
    const { stdout } = await execAsync("freshclam");
    console.log("✅ ClamAV database updated:\n", stdout);
  } catch (err: any) {
    console.error(
      "❌ Failed to update ClamAV database:\n",
      err.stderr || err.message
    );
    throw err;
  }
}
