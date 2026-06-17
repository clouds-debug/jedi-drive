// Возвращает path только если это безопасный внутренний путь.
// Отсекает protocol-relative URLs (//evil.com), absolute URLs (http://, javascript:),
// и backslash-обходы (\\\\evil.com).
export function safeInternalPath(input: string | null | undefined): string | null {
  if (!input) return null;
  if (typeof input !== "string") return null;
  if (input.length > 512) return null;
  if (!input.startsWith("/")) return null;
  if (input.startsWith("//")) return null;
  if (input.startsWith("/\\")) return null;
  // запрещаем backslash везде — некоторые браузеры трактуют как /
  if (input.includes("\\")) return null;
  // запрещаем control characters
  if (/[\x00-\x1f]/.test(input)) return null;
  return input;
}
