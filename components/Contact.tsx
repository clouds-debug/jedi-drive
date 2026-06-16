"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { EditableText } from "./content/EditableText";
import { useContentCtx, useContentValue } from "./content/ContentProvider";
import { useT } from "@/lib/i18n/client";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { t } = useT();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !question.trim()) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("sent");
  }

  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-orange/[0.08] blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute -left-32 top-1/4 w-[380px] h-[380px] rounded-full bg-orange/[0.04] blur-[140px] pointer-events-none" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/25 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel num="04">
                <EditableText storageKey="home.contact.section.label">{t("home.contact.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[30px] sm:text-[36px] font-medium text-white tracking-[-0.01em] leading-[1.1] mb-4">
                <EditableText storageKey="home.contact.section.title.lead">{t("home.contact.section.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="home.contact.section.title.accent">{t("home.contact.section.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[420px]">
                <EditableText storageKey="home.contact.section.subtitle" multiline>{t("home.contact.section.subtitle")}</EditableText>
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul className="space-y-3.5">
                <ContactLink
                  defaultHref="tel:+995500000000"
                  labelKey="home.contact.phone.label"
                  label={t("home.contact.phone.label")}
                  valueKey="home.contact.phone.value"
                  value="+995 500 00 00 00"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                    </svg>
                  }
                />
                <ContactLink
                  hrefKey="home.contact.telegram.href"
                  defaultHref="https://t.me/jedidrive"
                  labelKey="home.contact.telegram.label"
                  label={t("home.contact.telegram.label")}
                  valueKey="home.contact.telegram.value"
                  value="@jedidrive"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.5 4.2L2.5 11.5c-.9.3-.9 1.6.1 1.9l4.7 1.5 1.8 5.6c.2.7 1 .9 1.5.4l2.7-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6l3.4-15c.2-.9-.7-1.6-1.5-1.1zM10.4 14.6l-.3 3.2-1.3-4 9.2-5.8-7.6 6.6z" />
                    </svg>
                  }
                />
                <ContactLink
                  defaultHref="mailto:hello@jedidrive.ge"
                  labelKey="home.contact.email.label"
                  label={t("home.contact.email.label")}
                  valueKey="home.contact.email.value"
                  value="hello@jedidrive.ge"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  }
                />
                <ContactLink
                  hrefKey="home.contact.whatsapp.href"
                  defaultHref="https://wa.me/995500000000"
                  labelKey="home.contact.whatsapp.label"
                  label={t("home.contact.whatsapp.label")}
                  valueKey="home.contact.whatsapp.value"
                  value="+995 500 00 00 00"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.05 4.92A10 10 0 002.6 16.8l-1.5 5.5 5.6-1.47A10 10 0 1019.05 4.92zM12 20.4a8.4 8.4 0 01-4.27-1.17l-.3-.18-3.32.87.88-3.24-.2-.32A8.4 8.4 0 1112 20.4zm4.6-6.3c-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.8.99-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.25-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.87-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.13.17 1.74 2.66 4.22 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.49-.61 1.7-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3z" />
                    </svg>
                  }
                />
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <form
                onSubmit={handleSubmit}
                className="bg-white/[0.04] border border-white/10 rounded-[var(--radius-card)] p-6 sm:p-7 backdrop-blur-sm"
              >
                {status !== "sent" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Field
                        label={t("home.contact.form.name.label")}
                        value={name}
                        onChange={setName}
                        placeholder={t("home.contact.form.name.placeholder")}
                        autoComplete="name"
                      />
                      <Field
                        label={t("home.contact.form.contact.label")}
                        value={contact}
                        onChange={setContact}
                        placeholder={t("home.contact.form.contact.placeholder")}
                        autoComplete="tel"
                      />
                    </div>
                    <Field
                      label={t("home.contact.form.question.label")}
                      value={question}
                      onChange={setQuestion}
                      placeholder={t("home.contact.form.question.placeholder")}
                      textarea
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                      <p className="text-[11.5px] text-muted-on-navy/80 leading-[1.55] max-w-[280px]">
                        {t("home.contact.form.consent")}
                      </p>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex items-center justify-center gap-2 bg-orange text-white px-6 py-3 rounded-[var(--radius-btn)] text-[14px] font-medium transition-all hover:bg-[#EA670F] hover:translate-x-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {status === "sending" ? t("home.contact.form.sending") : t("home.contact.form.submit")}
                        {status !== "sending" && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-orange/15 grid place-items-center mb-4">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                        <path d="M5 12l5 5L20 6" />
                      </svg>
                    </div>
                    <div className="text-white text-[18px] font-medium mb-1.5">{t("home.contact.form.success.title")}, {name || t("home.contact.form.success.title.fallback")}!</div>
                    <p className="text-[13.5px] text-muted-on-navy max-w-[340px] mx-auto leading-[1.6]">
                      {t("home.contact.form.success.desc")}
                    </p>
                  </div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  hrefKey,
  defaultHref,
  labelKey,
  label,
  valueKey,
  value,
  icon,
}: {
  hrefKey?: string;
  defaultHref: string;
  labelKey: string;
  label: string;
  valueKey: string;
  value: string;
  icon: React.ReactNode;
}) {
  const { t } = useT();
  const href = useContentValue(hrefKey ?? "", defaultHref);
  const { isEditor } = useContentCtx();
  return (
    <li>
      <div className="group/contact flex items-center gap-3.5 flex-wrap">
        <a
          href={href}
          className="group/link flex items-center gap-3.5 text-white transition-transform hover:translate-x-0.5"
        >
          <span className="w-10 h-10 rounded-[var(--radius-chip)] bg-white/[0.07] border border-white/10 grid place-items-center text-orange-soft group-hover/link:bg-orange/15 group-hover/link:border-orange/30 transition-colors">
            {icon}
          </span>
          <span>
            <span className="block text-[11px] text-muted-on-navy tracking-[0.08em] uppercase">
              <EditableText storageKey={labelKey}>{label}</EditableText>
            </span>
            <span className="block text-[14.5px] text-white">
              <EditableText storageKey={valueKey}>{value}</EditableText>
            </span>
          </span>
        </a>
        {isEditor && hrefKey && (
          <span className="basis-full text-[11px] text-muted-on-navy/80 font-mono break-all">
            {t("home.contact.editor.link")}: <EditableText storageKey={hrefKey}>{defaultHref}</EditableText>
          </span>
        )}
      </div>
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const baseClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-[var(--radius-btn)] px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/50 outline-none transition-colors focus:border-orange/50 focus:bg-white/[0.06]";
  return (
    <label className="block">
      <span className="block text-[11px] text-muted-on-navy tracking-[0.08em] uppercase mb-1.5">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={baseClass + " resize-none"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={baseClass}
        />
      )}
    </label>
  );
}
