"use client";

import { useState } from "react";
import { Field } from "./Field";
import { SubmitButton } from "./SubmitButton";
import { useT } from "@/lib/i18n/client";

type Profile = {
  login: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  telegramUsername: string | null;
};

type Errors = Record<string, string>;

export function ProfileForm({ initial }: { initial: Profile }) {
  const { t } = useT();
  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [telegram, setTelegram] = useState(initial.telegramUsername ?? "");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          telegramUsername: telegram,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errs: Errors = {};
        for (const e of data.errors ?? []) errs[e.field] = e.message;
        setErrors(errs);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setErrors({ form: t("cab.error.network") });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 lg:grid-cols-2">
      <div className="lg:col-span-2 flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-lg">
        <span className="w-9 h-9 rounded-lg bg-orange/15 grid place-items-center font-mono text-[12px] text-orange-soft uppercase shrink-0">
          {initial.login.slice(0, 2)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-muted-on-navy tracking-[0.04em] uppercase">{t("cab.profile.login.label")}</div>
          <div className="text-[14px] text-white truncate">{initial.login}</div>
        </div>
        <span className="text-[11px] text-muted-on-navy">{t("cab.profile.login.locked")}</span>
      </div>

      <Field
        id="firstName"
        label={t("cab.profile.field.firstName")}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        autoComplete="given-name"
        error={errors.firstName}
      />
      <Field
        id="lastName"
        label={t("cab.profile.field.lastName")}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        autoComplete="family-name"
        error={errors.lastName}
      />
      <Field
        id="phone"
        label={t("cab.profile.field.phone")}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
        placeholder={t("cab.profile.field.phone.placeholder")}
        error={errors.phone}
      />
      <Field
        id="telegram"
        label={t("cab.profile.field.telegram")}
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        placeholder={t("cab.profile.field.telegram.placeholder")}
        hint={t("cab.profile.field.telegram.hint")}
        error={errors.telegramUsername}
      />

      {errors.form && (
        <div className="lg:col-span-2 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
          {errors.form}
        </div>
      )}

      <div className="lg:col-span-2 flex items-center gap-4">
        <div className="w-auto">
          <SubmitButton pending={pending}>{t("cab.profile.submit")}</SubmitButton>
        </div>
        {saved && (
          <span className="text-[12.5px] text-orange-soft inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l4 4L19 7" />
            </svg>
            {t("cab.profile.saved")}
          </span>
        )}
      </div>
    </form>
  );
}
