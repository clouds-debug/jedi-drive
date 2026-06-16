export type FieldError = { field: string; message: string };

const LOGIN_RE = /^[a-zA-Z0-9_.-]{3,32}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateLogin(login: unknown): FieldError | null {
  if (typeof login !== "string") return { field: "login", message: "Логин обязателен" };
  const v = login.trim();
  if (!v) return { field: "login", message: "Логин обязателен" };
  if (!LOGIN_RE.test(v))
    return {
      field: "login",
      message: "3–32 символа: буквы, цифры, точка, дефис, подчёркивание",
    };
  return null;
}

export function validatePassword(password: unknown): FieldError | null {
  if (typeof password !== "string") return { field: "password", message: "Пароль обязателен" };
  if (password.length < 8) return { field: "password", message: "Минимум 8 символов" };
  if (password.length > 200) return { field: "password", message: "Слишком длинный пароль" };
  return null;
}

export function validateDob(dob: unknown): FieldError | null {
  if (typeof dob !== "string" || !ISO_DATE_RE.test(dob))
    return { field: "dob", message: "Дата в формате ГГГГ-ММ-ДД" };
  const d = new Date(dob + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return { field: "dob", message: "Неверная дата" };
  const year = d.getUTCFullYear();
  if (year < 1900 || year > new Date().getUTCFullYear())
    return { field: "dob", message: "Неверный год" };
  return null;
}

export function normalizeLogin(login: string): string {
  return login.trim();
}
