import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/components/content/ContentProvider";
import { EditorToggle } from "@/components/content/EditorToggle";
import { loadContentForLayout } from "@/lib/content/server";
import { LocaleProvider } from "@/lib/i18n/client";
import { getLocale } from "@/lib/i18n/server";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jedi Drive — автошкола в Тбилиси",
  description: "Подготовка к экзамену по категории B. Теория и практика на русском и грузинском.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ overrides, isEditor, canEdit }, locale] = await Promise.all([
    loadContentForLayout(),
    getLocale(),
  ]);
  return (
    <html lang={locale === "ge" ? "ka" : "ru"} className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale}>
          <ContentProvider overrides={overrides} isEditor={isEditor} canEdit={canEdit}>
            {children}
            <EditorToggle />
          </ContentProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
