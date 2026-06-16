"use client";

import { EditableText } from "./content/EditableText";
import { useContentValue } from "./content/ContentProvider";
import { L, useT } from "@/lib/i18n/client";

export function Footer() {
  const { t } = useT();
  const phone = useContentValue("home.contact.phone.value", "+995 500 00 00 00");
  const email = useContentValue("home.contact.email.value", "hello@jedidrive.ge");
  const phoneHref = "tel:" + phone.replace(/[^+\d]/g, "");
  const mailHref = "mailto:" + email.trim();

  return (
    <footer className="bg-navy-deep text-muted-on-navy pt-14 pb-8 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <L href="/" className="inline-flex items-center mb-3" aria-label="Jedi Drive">
              <img src="/logo.svg" alt="Jedi Drive" className="h-14 w-auto" />
            </L>
            <p className="text-[13px] leading-[1.6] max-w-[340px]">
              <EditableText storageKey="footer.tagline" multiline>
                {t("footer.tagline")}
              </EditableText>
            </p>
          </div>

          <div>
            <div className="text-white text-[13px] font-medium mb-3">
              <EditableText storageKey="footer.nav.title">{t("footer.nav.title")}</EditableText>
            </div>
            <ul className="space-y-2 text-[13px]">
              <li><L href="/services/theory" className="hover:text-white transition-colors">{t("footer.link.theory")}</L></li>
              <li><L href="/services/practice" className="hover:text-white transition-colors">{t("footer.link.practice")}</L></li>
              <li><L href="/tickets" className="hover:text-white transition-colors">{t("footer.link.tickets")}</L></li>
              <li><L href="/instructors" className="hover:text-white transition-colors">{t("footer.link.instructors")}</L></li>
              <li><L href="/about" className="hover:text-white transition-colors">{t("footer.link.about")}</L></li>
            </ul>
          </div>

          <div>
            <div className="text-white text-[13px] font-medium mb-3">
              <EditableText storageKey="footer.contacts.title">{t("footer.contacts.title")}</EditableText>
            </div>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a href={phoneHref} className="hover:text-white transition-colors">
                  <EditableText storageKey="home.contact.phone.value">{phone}</EditableText>
                </a>
              </li>
              <li>
                <a href={mailHref} className="hover:text-white transition-colors">
                  <EditableText storageKey="home.contact.email.value">{email}</EditableText>
                </a>
              </li>
              <li>
                <EditableText storageKey="footer.address">{t("footer.address")}</EditableText>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px]">
          <div>
            © {new Date().getFullYear()} Jedi Drive.{" "}
            <EditableText storageKey="footer.copyright.suffix">{t("footer.copyright.suffix")}</EditableText>
          </div>
          <div className="flex gap-5">
            <L href="/privacy" className="hover:text-white transition-colors">{t("footer.link.privacy")}</L>
            <L href="/terms" className="hover:text-white transition-colors">{t("footer.link.terms")}</L>
          </div>
        </div>
      </div>
    </footer>
  );
}
