"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "./SectionHeading";

const sportOptions = ["football", "padel", "other"] as const;
type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [sport, setSport] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    try {
      if (!endpoint) {
        await new Promise((r) => setTimeout(r, 700));
        setStatus("success");
        form.reset();
        return;
      }
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-y border-t border-white/5 bg-section-gradient">
      <div className="container-x">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
        />

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label={t("fields.name")} required />
            <Field name="facilityName" label={t("fields.facilityName")} required />
            <Field name="email" type="email" label={t("fields.email")} required />
            <Field name="phone" type="tel" label={t("fields.phone")} />

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t("fields.sport")}
              </label>
              <select
                name="sport"
                required
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              >
                <option value="" disabled className="bg-ink-900">—</option>
                {sportOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-ink-900">
                    {t(`fields.sportOptions.${opt}`)}
                  </option>
                ))}
              </select>
              {sport === "other" && (
                <input
                  type="text"
                  name="sportOther"
                  required
                  placeholder={t("fields.sportOtherPlaceholder")}
                  className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent"
                />
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-white/60">
              {t("fields.message")}
            </label>
            <textarea
              name="message"
              rows={4}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-ink-900 shadow-glow transition hover:bg-accent-neon disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
          </button>

          {status === "success" && (
            <p className="mt-4 rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {t("error")}
            </p>
          )}

          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-white/35">
            <svg className="h-3.5 w-3.5 text-accent/60" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            {t("trust")}
          </p>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  name, label, type = "text", required,
}: {
  name: string; label: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent"
      />
    </div>
  );
}
