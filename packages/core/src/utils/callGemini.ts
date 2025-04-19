import { GeminiModel } from "@mp4-conversion-hub/shared";

/**
 * Sends a prompt to the Gemini API and returns the response text.
 * @param prompt The text prompt to send to Gemini.
 * @param apiKey Your Gemini API key.
 * @returns The generated response text from Gemini.
 */
export async function callGemini(
  prompt: string,
  apiKey: string,
  model: GeminiModel = "gemini-2.0-flash"
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  return text?.trim() || "No response from Gemini.";
}
