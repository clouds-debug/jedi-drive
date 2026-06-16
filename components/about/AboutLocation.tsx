"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { useContentCtx, useContentValue } from "../content/ContentProvider";
import { useT } from "@/lib/i18n/client";

const OFFICE_EMBED =
  "https://maps.google.com/maps?q=41.7043444,44.7867606&z=17&hl=ru&output=embed";
const OFFICE_LINK =
  "https://www.google.com/maps/place/Jedi+Drive/@41.704323,44.7863486,48m/data=!3m1!1e3!4m6!3m5!1s0x40440d001ee81617:0xb9cbd659e20023c3!8m2!3d41.7043444!4d44.7867606!16s%2Fg%2F11yx_0gb16";

const PAD_EMBED =
  "https://maps.google.com/maps?q=41.7857536,44.761088&z=17&hl=ru&output=embed";
const PAD_LINK = "https://maps.app.goo.gl/i2MwNTmYcXzgypLg8?g_st=ic";

export function AboutLocation() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="03">
            <EditableText storageKey="about.location.section.label">{t("about.location.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="about.location.title.lead">{t("about.location.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="about.location.title.accent">{t("about.location.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="about.location.subtitle" multiline>{t("about.location.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Reveal delay={80}>
            <LocationCard
              base="office"
              addressLine1Default="Проспект Кетеван Дедопали, 71"
              addressLine2Default="Тбилиси, Грузия"
              embedDefault={OFFICE_EMBED}
              linkDefault={OFFICE_LINK}
            />
          </Reveal>
          <Reveal delay={160}>
            <LocationCard
              base="pad"
              addressLine1Default="Адрес площадки"
              addressLine2Default="Тбилиси, Грузия"
              embedDefault={PAD_EMBED}
              linkDefault={PAD_LINK}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LocationCard({
  base,
  addressLine1Default,
  addressLine2Default,
  embedDefault,
  linkDefault,
}: {
  base: "office" | "pad";
  addressLine1Default: string;
  addressLine2Default: string;
  embedDefault: string;
  linkDefault: string;
}) {
  const { t } = useT();
  const kickerKey = `about.location.${base}.kicker`;
  const addressLine1Key = `about.location.${base}.address1`;
  const addressLine2Key = `about.location.${base}.address2`;
  const embedKey = `about.location.${base}.embed`;
  const linkKey = `about.location.${base}.link`;
  const embed = useContentValue(embedKey, embedDefault);
  const link = useContentValue(linkKey, linkDefault);
  const { isEditor } = useContentCtx();
  const kicker = t(kickerKey);

  return (
    <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="relative h-[280px] sm:h-[320px] bg-white/[0.02]">
        <iframe
          title={t("about.location.mapTitle", { name: kicker })}
          src={embed}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full grayscale-[20%] contrast-95 opacity-90"
          style={{ border: 0 }}
        />
        <div className="absolute inset-0 bg-navy/10 pointer-events-none" aria-hidden />
      </div>

      <div className="p-6 sm:p-7 flex flex-col gap-4 bg-navy/40 backdrop-blur-sm flex-1">
        <div>
          <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-2">
            <EditableText storageKey={kickerKey}>{kicker}</EditableText>
          </div>
          <div className="text-[15px] text-white leading-[1.5]">
            <EditableText storageKey={addressLine1Key}>{t(addressLine1Key) || addressLine1Default}</EditableText>
          </div>
          <div className="text-[12.5px] text-muted-on-navy mt-1">
            <EditableText storageKey={addressLine2Key}>{t(addressLine2Key) || addressLine2Default}</EditableText>
          </div>
        </div>

        {isEditor && (
          <div className="space-y-1.5 text-[11px] text-muted-on-navy/80 font-mono break-all border-t border-white/[0.06] pt-3">
            <div>
              {t("about.location.editor.iframe")}: <EditableText storageKey={embedKey} multiline>{embedDefault}</EditableText>
            </div>
            <div>
              {t("about.location.editor.link")}: <EditableText storageKey={linkKey} multiline>{linkDefault}</EditableText>
            </div>
          </div>
        )}

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 bg-orange hover:bg-[#EA670F] text-white px-5 py-3 rounded-lg text-[13.5px] font-medium transition-all hover:translate-y-[-1px]"
        >
          {t("about.location.openMap")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </a>
      </div>
    </div>
  );
}
