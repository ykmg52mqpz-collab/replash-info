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
    { href: "/about" as const, label: t("links.about") },
    { href: "/contact" as const, label: t("links.contact") },
  ];

  return (
    <footer className="border-t border-white/5 bg-ink-900">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/replash-logo.png"
                alt="REPLASH"
                className="h-12 w-auto select-none"
                draggable={false}
              />
              <span lang="en" className="font-display text-2xl font-bold tracking-tight text-accent">
                Replash
              </span>
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
