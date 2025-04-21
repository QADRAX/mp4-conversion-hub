import cron from "node-cron";
import { DAILY_TASK_CRON, DAILY_TASK_TIMEZONE } from "./config";
import { updateClamAvDb } from "@mp4-conversion-hub/core";
import cronstrue from "cronstrue";

export function setupCronTask() {
  if (!cron.validate(DAILY_TASK_CRON)) {
    throw new Error(`❌ Invalid CRON expression: "${DAILY_TASK_CRON}"`);
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: DAILY_TASK_TIMEZONE });
  } catch {
    throw new Error(`❌ Invalid timezone: "${DAILY_TASK_TIMEZONE}"`);
  }

  async function cronTask() {
    console.log("🚀 Starting ClamAV DB update task...");
    try {
      const result = await updateClamAvDb();
      console.log("📋 ClamAV update output:\n" + result);
      console.log("✅ ClamAV DB update successful.");
      return true;
    } catch (err: any) {
      console.error("❌ ClamAV DB update failed.");
      console.error(err);
      return false;
    }
  }

  cronTask().then((success) => {
    if (success) {
      cron.schedule(DAILY_TASK_CRON, cronTask, {
        timezone: DAILY_TASK_TIMEZONE,
      });
      const humanizedCron = cronstrue.toString(DAILY_TASK_CRON, { locale: 'en', verbose: true });
      console.log(
        `⏰ Task scheduled ${humanizedCron} (timezone: ${DAILY_TASK_TIMEZONE})`
      );
    } else {
      console.warn(
        "⚠️ Skipping CRON scheduling due to failed initial execution."
      );
    }
  });
}
