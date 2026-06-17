export function safeInternalPath(input: string | null | undefined): string | null {
  if (!input) return null;
  if (typeof input !== "string") return null;
  if (input.length > 512) return null;
  if (!input.startsWith("/")) return null;
  if (input.startsWith("//")) return null;
  if (input.startsWith("/\\")) return null;
  if (input.includes("\\")) return null;
  if (/[\x00-\x1f]/.test(input)) return null;
  return input;
}
