"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { SubmitButton } from "./SubmitButton";
import { homePathForRole, type UserRole } from "@/lib/auth/roles";
import { useT } from "@/lib/i18n/client";

type Errors = Record<string, string>;

export function LoginForm() {
  const { t } = useT();
  const router = useRouter();
  const search = useSearchParams();
  const explicitNext = search.get("next");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errs: Errors = {};
        for (const e of data.errors ?? []) errs[e.field] = e.message;
        setErrors(errs);
        return;
      }
      const role = (data?.user?.role ?? "student") as UserRole;
      const destination = explicitNext ?? homePathForRole(role);
      router.push(destination);
      router.refresh();
    } catch {
      setErrors({ form: t("cab.error.network") });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Field
        id="login"
        label={t("cab.auth.login.field.login")}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        autoComplete="username"
        autoFocus
        error={errors.login}
      />
      <Field
        id="password"
        label={t("cab.auth.login.field.password")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        error={errors.password}
      />
      {errors.form && (
        <div className="mb-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
          {errors.form}
        </div>
      )}
      <SubmitButton pending={pending}>{t("cab.auth.login.submit")}</SubmitButton>
    </form>
  );
}
