"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarCropModal } from "./AvatarCropModal";
import { useT } from "@/lib/i18n/client";

const LANGS: { code: string; labelKey: string }[] = [
  { code: "ru", labelKey: "admin.bio.lang.ru" },
  { code: "ge", labelKey: "admin.bio.lang.ge" },
  { code: "en", labelKey: "admin.bio.lang.en" },
];

const COLORS: { code: string; labelKey: string; cls: string }[] = [
  { code: "orange", labelKey: "admin.bio.color.orange", cls: "bg-orange/40" },
  { code: "indigo", labelKey: "admin.bio.color.indigo", cls: "bg-indigo-500/40" },
  { code: "violet", labelKey: "admin.bio.color.violet", cls: "bg-violet-500/40" },
  { code: "emerald", labelKey: "admin.bio.color.emerald", cls: "bg-emerald-500/40" },
  { code: "rose", labelKey: "admin.bio.color.rose", cls: "bg-rose-500/40" },
];

type Initial = {
  firstName: string;
  lastName: string;
  bio: string;
  car: string;
  experienceYears: string;
  languages: string[];
  avatarColor: string;
  isPublished: boolean;
  avatarUrl: string | null;
};

type Errors = Record<string, string>;

export function InstructorBioForm({ initial }: { initial: Initial }) {
  const { t } = useT();
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [bio, setBio] = useState(initial.bio);
  const [car, setCar] = useState(initial.car);
  const [experienceYears, setExperienceYears] = useState(initial.experienceYears);
  const [languages, setLanguages] = useState<string[]>(initial.languages);
  const [avatarColor, setAvatarColor] = useState(initial.avatarColor || "orange");
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial.avatarUrl);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setAvatarError(t("admin.bio.fileTooBig"));
      return;
    }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setAvatarError(t("admin.bio.fileBadType"));
      return;
    }
    setAvatarError(null);
    setCropFile(file);
  }

  async function uploadCropped(blob: Blob) {
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const ext = blob.type === "image/png" ? "png" : "jpg";
      const form = new FormData();
      form.append("file", new File([blob], `avatar.${ext}`, { type: blob.type }));
      const res = await fetch("/api/admin/me/instructor-profile/avatar", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAvatarError(data?.error ?? t("admin.bio.uploadFail"));
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      setAvatarUrl(blobUrl);
      setCropFile(null);
      router.refresh();
    } finally {
      setAvatarBusy(false);
    }
  }

  async function onRemoveAvatar() {
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const res = await fetch("/api/admin/me/instructor-profile/avatar", {
        method: "DELETE",
      });
      if (!res.ok) {
        setAvatarError(t("admin.bio.removeFail"));
        return;
      }
      setAvatarUrl(null);
      router.refresh();
    } finally {
      setAvatarBusy(false);
    }
  }

  function toggleLang(code: string) {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setSaved(false);
    try {
      const res = await fetch("/api/admin/me/instructor-profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          car,
          experienceYears: experienceYears === "" ? null : Number(experienceYears),
          languages,
          avatarColor,
          isPublished,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errs: Errors = {};
        for (const e of data.errors ?? []) errs[e.field] = e.message;
        setErrors(errs);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "—";
  const initials =
    (firstName?.[0] ?? "") + (lastName?.[0] ?? "");

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_280px] gap-8">
      {cropFile && (
        <AvatarCropModal
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onConfirm={uploadCropped}
        />
      )}
      <div className="space-y-5">
        <div>
          <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-2">
            {t("admin.bio.photo")}
          </div>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={t("admin.bio.avatarAlt")}
                className="w-20 h-20 rounded-full object-cover border border-white/10"
              />
            ) : (
              <span
                className={`w-20 h-20 rounded-full grid place-items-center text-[18px] font-medium border border-white/10 ${
                  COLORS.find((c) => c.code === avatarColor)?.cls ?? "bg-orange/20"
                } text-white`}
              >
                {((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "?"}
              </span>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={avatarBusy}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-50 border border-white/15 text-white text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
                >
                  {avatarBusy ? "..." : avatarUrl ? t("admin.bio.replace") : t("admin.bio.upload")}
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    disabled={avatarBusy}
                    onClick={onRemoveAvatar}
                    className="bg-white/[0.03] hover:bg-red-500/[0.12] hover:border-red-500/30 disabled:opacity-50 border border-white/12 text-muted-on-navy hover:text-red-300 text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t("admin.bio.remove")}
                  </button>
                )}
              </div>
              <div className="text-[11px] text-muted-on-navy/80">
                {t("admin.bio.fileHint")}
              </div>
              {avatarError && (
                <div className="text-[11.5px] text-orange-soft">{avatarError}</div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onPickFile}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="firstName"
            label={t("admin.bio.firstName")}
            value={firstName}
            onChange={setFirstName}
            error={errors.firstName}
          />
          <Field
            id="lastName"
            label={t("admin.bio.lastName")}
            value={lastName}
            onChange={setLastName}
            error={errors.lastName}
          />
        </div>

        <label className="block">
          <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
            {t("admin.bio.bio")}
          </span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            maxLength={1500}
            placeholder={t("admin.bio.bioPlaceholder")}
            className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60 resize-none"
          />
          <span className="block text-right mt-1 text-[11px] text-muted-on-navy/70 font-mono">
            {bio.length}/1500
          </span>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="car"
            label={t("admin.bio.car")}
            value={car}
            onChange={setCar}
            placeholder={t("admin.bio.carPlaceholder")}
          />
          <Field
            id="experienceYears"
            label={t("admin.bio.experience")}
            type="number"
            value={experienceYears}
            onChange={setExperienceYears}
            placeholder={t("admin.bio.experiencePlaceholder")}
            error={errors.experienceYears}
          />
        </div>

        <div>
          <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-2">
            {t("admin.bio.langs")}
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => {
              const active = languages.includes(l.code);
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => toggleLang(l.code)}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] border transition-colors ${
                    active
                      ? "bg-orange/15 border-orange/50 text-white"
                      : "bg-white/[0.04] border-white/12 text-muted-on-navy hover:text-white hover:border-white/25"
                  }`}
                >
                  {t(l.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-2">
            {t("admin.bio.avatarColor")}
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setAvatarColor(c.code)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] border transition-colors ${
                  avatarColor === c.code
                    ? "border-orange/50 text-white"
                    : "border-white/12 text-muted-on-navy hover:text-white hover:border-white/25"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${c.cls}`} aria-hidden />
                {t(c.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="mt-1"
          />
          <span className="flex-1">
            <span className="block text-[13.5px] text-white">
              {t("admin.bio.publish")}
            </span>
            <span className="block text-[12px] text-muted-on-navy mt-0.5">
              {t("admin.bio.publishHint")}
            </span>
          </span>
        </label>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="bg-orange hover:bg-orange/90 disabled:opacity-50 text-white font-medium text-[13.5px] px-5 py-2.5 rounded-lg transition-colors"
          >
            {busy ? t("admin.bio.saving") : t("admin.bio.save")}
          </button>
          {saved && (
            <span className="text-[12.5px] text-orange-soft inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12l4 4L19 7" />
              </svg>
              {t("admin.bio.saved")}
            </span>
          )}
        </div>
      </div>

      {/* Preview */}
      <aside className="lg:sticky lg:top-8 self-start">
        <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-3">
          {t("admin.bio.preview")}
        </div>
        <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5">
          <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={t("admin.bio.avatarAlt")}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span
                  className={`w-12 h-12 rounded-full grid place-items-center font-mono text-[14px] ${
                    COLORS.find((c) => c.code === avatarColor)?.cls ?? "bg-orange/20"
                  } text-white`}
                >
                  {initials.toUpperCase() || "?"}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-[14.5px] text-white font-medium truncate">
                  {fullName}
                </div>
                {languages.length > 0 && (
                  <div className="text-[10.5px] font-mono tracking-[0.1em] uppercase text-muted-on-navy">
                    {languages.join(" · ")}
                  </div>
                )}
              </div>
            </div>
            {experienceYears && (
              <div className="text-[12.5px] text-muted-on-navy mb-1">
                {t("admin.bio.experienceLabel")} <span className="text-white">{experienceYears} {t("admin.bio.yearsSuffix")}</span>
              </div>
            )}
            {car && (
              <div className="text-[12.5px] text-muted-on-navy mb-3">{car}</div>
            )}
            {bio && (
              <p className="text-[12.5px] text-muted-on-navy leading-[1.55] line-clamp-5">
                {bio}
              </p>
            )}
            {!isPublished && (
              <div className="mt-3 inline-flex text-[10.5px] font-mono uppercase tracking-[0.1em] text-muted-on-navy border border-white/15 bg-white/[0.04] rounded px-2 py-0.5">
                {t("admin.bio.notPublished")}
              </div>
            )}
          </div>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white/[0.04] border ${
          error ? "border-orange/60" : "border-white/12"
        } rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/70 transition-colors`}
      />
      {error && (
        <span className="block mt-1.5 text-[11.5px] text-orange-soft">{error}</span>
      )}
    </label>
  );
}
