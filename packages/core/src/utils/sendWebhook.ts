async function sendWebhook(
  payload: Record<string, any>,
  webhookUrl: string | undefined
) {
  if (!webhookUrl) {
    console.warn("⚠️ No webhook URL configured");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`❌ Webhook failed with status ${response.status}`);
    } else {
      console.log("✅ Webhook sent successfully");
    }
  } catch (err) {
    console.error("❌ Failed to send webhook:", err);
  }
}
