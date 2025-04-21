import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function updateClamAvDb(): Promise<string> {
  try {
    const { stdout } = await execAsync("freshclam");
    return stdout;
  } catch (err: any) {
    throw err;
  }
}
