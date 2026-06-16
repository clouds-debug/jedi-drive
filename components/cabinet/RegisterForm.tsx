"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { SubmitButton } from "./SubmitButton";
import { useT } from "@/lib/i18n/client";

type Errors = Record<string, string>;

export function RegisterForm() {
  const { t } = useT();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/cabinet/profile";

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [company, setCompany] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login, password, dob, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errs: Errors = {};
        for (const e of data.errors ?? []) errs[e.field] = e.message;
        setErrors(errs);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setErrors({ form: t("cab.error.network") });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>
      <Field
        id="login"
        label={t("cab.auth.register.field.login")}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        autoComplete="username"
        autoFocus
        hint={t("cab.auth.register.field.login.hint")}
        error={errors.login}
      />
      <Field
        id="password"
        label={t("cab.auth.register.field.password")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        hint={t("cab.auth.register.field.password.hint")}
        error={errors.password}
      />
      <Field
        id="dob"
        label={t("cab.auth.register.field.dob")}
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        hint={t("cab.auth.register.field.dob.hint")}
        error={errors.dob}
      />
      {errors.form && (
        <div className="mb-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
          {errors.form}
        </div>
      )}
      <SubmitButton pending={pending}>{t("cab.auth.register.submit")}</SubmitButton>
    </form>
  );
}
