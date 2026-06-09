"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

const locales = routing.locales;

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale) return;
    const segments = pathname.split("/").filter(Boolean);
    if (locales.includes(segments[0] as (typeof locales)[number])) {
      segments.shift();
    }
    const rest = segments.join("/");
    const target = next === "it" ? `/${rest}` : `/${next}${rest ? `/${rest}` : ""}`;
    startTransition(() => {
      router.replace(target || "/");
    });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-medium backdrop-blur"
    >
      {(["it", "en", "tr", "es"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          disabled={isPending}
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1.5 uppercase tracking-wide transition ${
            locale === code
              ? "bg-white text-ink-900"
              : "text-white/70 hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
