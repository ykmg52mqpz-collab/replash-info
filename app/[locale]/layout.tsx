import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

const locales = routing.locales;
import "../globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import MotionProvider from "@/components/MotionProvider";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://replash.info"),
    applicationName: "Replash",
    appleWebApp: {
      capable: true,
      title: "Replash",
      statusBarStyle: "black-translucent",
    },
    alternates: {
      canonical: locale === "it" ? "/" : `/${locale}`,
      languages: {
        it: "/",
        en: "/en",
        tr: "/tr",
        es: "/es",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: locale === "it" ? "https://replash.info" : `https://replash.info/${locale}`,
      siteName: "Replash",
      locale: { it: "it_IT", en: "en_US", tr: "tr_TR", es: "es_ES" }[locale] || "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Replash. Play. Record. Relive.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Adobe Fonts (Typekit) — Neue Haas Grotesk Display */}
        <link rel="stylesheet" href="https://use.typekit.net/qqj8ayc.css" />
      </head>
      <body className="font-body bg-ink-900 text-white antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <MotionProvider>
            {children}
            <WhatsAppButton />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
