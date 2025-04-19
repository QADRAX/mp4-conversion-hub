export const GeminiModels = [
    "gemini-1.0-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-2.0-pro",
    "gemini-2.0-flash",
    "gemini-pro", // por si algún alias sigue funcionando
  ] as const;
  
  export type GeminiModel = (typeof GeminiModels)[number];
  