/**
 * Attempts to extract a JSON object from raw LLM output.
 */
export function extractJsonFromText(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No valid JSON object found in response: ${text}`);
  }
  return jsonMatch[0];
}