import { timingSafeEqual } from "node:crypto";

// Безопасное сравнение Bearer-токена с константой из env, защищённое от
// timing-атак. Возвращает false если токен не задан или не совпал.
export function checkInternalAuth(req: Request): boolean {
  const expected = process.env.INTERNAL_API_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const expectedFull = `Bearer ${expected}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expectedFull);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
