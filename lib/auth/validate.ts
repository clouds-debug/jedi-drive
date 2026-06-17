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

// Топ самых частых паролей — отказываем сразу. Список короткий специально:
// больше — задача внешнего breached-password lookup, тут только заметные кейсы.
const COMMON_PASSWORDS = new Set([
  "12345678", "123456789", "1234567890",
  "qwerty123", "qwerty1234", "qwertyuiop",
  "password", "password1", "password123",
  "11111111", "11111111111", "111111111", "00000000",
  "iloveyou", "1qaz2wsx", "1q2w3e4r5t",
  "admin123", "admin1234", "letmein123",
]);

export function validatePassword(password: unknown): FieldError | null {
  if (typeof password !== "string") return { field: "password", message: "Пароль обязателен" };
  if (password.length < 10) return { field: "password", message: "Минимум 10 символов" };
  if (password.length > 200) return { field: "password", message: "Слишком длинный пароль" };
  // Простая проверка: есть и буква, и цифра
  if (!/[A-Za-zА-Яа-я]/.test(password) || !/[0-9]/.test(password)) {
    return { field: "password", message: "Должны быть и буквы, и цифры" };
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return { field: "password", message: "Этот пароль слишком частый. Придумай другой." };
  }
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
