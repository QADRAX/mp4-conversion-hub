export function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "").trim();
}
