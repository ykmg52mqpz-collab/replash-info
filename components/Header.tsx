"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/how-it-works" as const, label: t("howItWorks") },
    { href: "/for-facilities" as const, label: t("forFacilities") },
    { href: "/for-players" as const, label: t("forPlayers") },
    { href: "/about" as const, label: t("about") },
  ];

  return (
    <>
      {/* Floating pill nav */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3">
        <div className="container-x">
          <div
            className={`pointer-events-auto mx-auto flex h-14 items-center justify-between gap-4 rounded-full border px-3 pl-4 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 md:px-4 md:pl-5 md:pr-2.5 ${
              scrolled
                ? "border-white/[0.08] bg-ink-900/85 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                : "border-white/[0.06] bg-ink-900/50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/replash-logo.png"
                alt="REPLASH"
                className="h-8 w-auto select-none md:h-9"
                draggable={false}
              />
              <span
                lang="en"
                className="font-display text-xl font-bold tracking-tight text-accent md:text-2xl"
              >
                replash
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 bottom-1 h-px rounded-full bg-accent transition-transform duration-200 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Player action — find your match */}
              <Link
                href="/find"
                className="hidden rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition-[background-color,border-color,transform] active:scale-[0.98] duration-200 hover:border-accent hover:bg-accent/10 lg:inline-flex"
              >
                {t("find")}
              </Link>
              <LanguageToggle />
              <Link
                href="/contact"
                className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink-900 shadow-glow transition-[background-color,box-shadow,transform] active:scale-[0.98] duration-200 hover:bg-accent-neon hover:shadow-[0_0_30px_rgba(253,230,138,0.4)] md:inline-flex"
              >
                {t("bookDemo")}
              </Link>
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu — dropped below the pill */}
          <div
            className={`pointer-events-auto mx-auto mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/95 backdrop-blur-2xl transition-[max-height,opacity] duration-300 md:hidden ${
              mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1 p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2.5 text-sm transition ${
                    pathname === link.href
                      ? "bg-accent/10 text-accent"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/find"
                className="mt-2 rounded-full border border-accent/40 px-5 py-2.5 text-center text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent/10"
              >
                {t("find")}
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-ink-900 shadow-glow transition hover:bg-accent-neon"
              >
                {t("bookDemo")}
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
