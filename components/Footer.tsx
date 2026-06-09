"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const links = [
    { href: "/how-it-works" as const, label: t("links.howItWorks") },
    { href: "/for-facilities" as const, label: t("links.forFacilities") },
    { href: "/for-players" as const, label: t("links.forPlayers") },
    { href: "/find" as const, label: t("links.find") },
    { href: "/about" as const, label: t("links.about") },
    { href: "/contact" as const, label: t("links.contact") },
  ];

  return (
    <footer className="border-t border-white/5 bg-ink-900">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <span className="inline-block h-2 w-2 rounded-full bg-accent shadow-glow-sm" />
              <span lang="en">replash<span className="text-white/40">.info</span></span>
            </div>
            <p className="max-w-xs text-sm text-white/50 leading-relaxed">{t("tagline")}</p>
            <LanguageToggle />
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-1">Pages</span>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-white/50 transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/25">Get Started</span>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-ink-900 shadow-glow transition hover:bg-accent-neon"
            >
              {tNav("bookDemo")}
            </Link>
            <a href="mailto:replash.info@gmail.com" className="text-sm text-white/40 hover:text-white transition">
              replash.info@gmail.com
            </a>
            <div className="flex flex-col gap-1.5">
              <a
                href="https://wa.me/393447598309"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition"
              >
                <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                +39 344 759 8309
              </a>
              <a
                href="https://wa.me/393455326796"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition"
              >
                <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                +39 345 532 6796
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/35 md:flex-row md:items-center">
          <span>© {year} <span lang="en">replash.info</span>. {t("rights")}</span>
          <a href="#" className="hover:text-white transition">{t("privacy")}</a>
        </div>
      </div>
    </footer>
  );
}
