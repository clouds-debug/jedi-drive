"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { SubmitButton } from "./SubmitButton";
import { useT } from "@/lib/i18n/client";

type Errors = Record<string, string>;

export function ResetForm() {
  const { t } = useT();
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login, dob, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errs: Errors = {};
        for (const e of data.errors ?? []) errs[e.field] = e.message;
        setErrors(errs);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/cabinet/login"), 1500);
    } catch {
      setErrors({ form: t("cab.error.network") });
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-2">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange/15 grid place-items-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
            <path d="M5 12l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[14px] text-white mb-1">{t("cab.auth.reset.done.title")}</p>
        <p className="text-[12.5px] text-muted-on-navy">{t("cab.auth.reset.done.subtitle")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Field
        id="login"
        label={t("cab.auth.reset.field.login")}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        autoComplete="username"
        autoFocus
        error={errors.login}
      />
      <Field
        id="dob"
        label={t("cab.auth.reset.field.dob")}
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        error={errors.dob}
      />
      <Field
        id="newPassword"
        label={t("cab.auth.reset.field.newPassword")}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        hint={t("cab.auth.reset.field.newPassword.hint")}
        error={errors.newPassword}
      />
      {errors.form && (
        <div className="mb-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
          {errors.form}
        </div>
      )}
      <SubmitButton pending={pending}>{t("cab.auth.reset.submit")}</SubmitButton>
    </form>
  );
}
