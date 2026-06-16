import type { FieldError } from "./validate";

const NAME_RE = /^[\p{L}\p{M} '\-]{1,60}$/u;
const PHONE_RE = /^[+()\d\s\-]{6,24}$/;
const TG_RE = /^[a-zA-Z0-9_]{4,32}$/;

export function validateName(field: "firstName" | "lastName", v: unknown): FieldError | null {
  if (v === null || v === "" || v === undefined) return null;
  if (typeof v !== "string") return { field, message: "Неверное значение" };
  const t = v.trim();
  if (!NAME_RE.test(t)) return { field, message: "Только буквы, пробелы, дефис, апостроф" };
  return null;
}

export function validatePhone(v: unknown): FieldError | null {
  if (v === null || v === "" || v === undefined) return null;
  if (typeof v !== "string") return { field: "phone", message: "Неверное значение" };
  const t = v.trim();
  if (!PHONE_RE.test(t)) return { field: "phone", message: "Цифры, пробелы, +, скобки, дефис" };
  return null;
}

export function validateTelegram(v: unknown): FieldError | null {
  if (v === null || v === "" || v === undefined) return null;
  if (typeof v !== "string") return { field: "telegramUsername", message: "Неверное значение" };
  const t = v.trim().replace(/^@/, "");
  if (!TG_RE.test(t))
    return { field: "telegramUsername", message: "4–32 символа: латиница, цифры, _" };
  return null;
}

export function normalizeOptional(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export function normalizeTelegram(v: unknown): string | null {
  const t = normalizeOptional(v);
  if (!t) return null;
  return t.replace(/^@/, "");
}
