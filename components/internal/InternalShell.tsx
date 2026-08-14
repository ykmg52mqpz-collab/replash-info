"use client";

/**
 * Minimal chrome for internal tools (/panel, /admin, /ingest).
 * Deliberately has no marketing nav — these surfaces are reached by direct
 * URL only and are never linked from the public site.
 */

import Image from "next/image";
import Link from "next/link";

export default function InternalShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ink-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/85 backdrop-blur">
        <div className="container-x flex h-16 items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
            <Image src="/icon-512.png" alt="Replash" width={28} height={28} className="rounded" />
            Replash<span className="text-accent">.</span>
          </Link>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50">
            {label}
          </span>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Replash
      </footer>
    </main>
  );
}
