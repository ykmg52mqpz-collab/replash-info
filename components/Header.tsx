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
    { href: "/find" as const, label: t("find") },
    { href: "/about" as const, label: t("about") },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-ink-900/80 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/replash-logo.png"
              alt="REPLASH"
              className="h-10 w-auto select-none md:h-11"
              draggable={false}
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-3 py-1.5 text-sm transition-colors duration-200 ${
                    isActive ? "text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3 bottom-0 h-px rounded-full bg-accent transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/contact"
              className="hidden rounded-full bg-accent px-5 py-2 text-sm font-semibold text-ink-900 shadow-glow transition-all duration-200 hover:bg-accent-neon hover:shadow-[0_0_30px_rgba(253,230,138,0.4)] md:inline-flex"
            >
              {t("bookDemo")}
            </Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
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

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-white/[0.06] bg-ink-900/95 backdrop-blur-2xl transition-all duration-300 md:hidden ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="container-x flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2.5 text-sm transition ${
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-ink-900 shadow-glow transition hover:bg-accent-neon"
            >
              {t("bookDemo")}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
