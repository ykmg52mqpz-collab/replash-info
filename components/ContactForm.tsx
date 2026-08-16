"use client";

import { FormEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "./SectionHeading";

const fieldOptions = ["1", "2", "3", "4", "5+"] as const;
const sportOptions = ["football", "padel", "both"] as const;

export default function ContactForm() {
  const t = useTranslations("contact");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => (data.get(k) ?? "").toString().trim();
    const sportVal = get("sport") ? t(`fields.sportOptions.${get("sport")}`) : "";
    const lines = [
      t("whatsappIntro"),
      "",
      `${t("fields.facilityName")}: ${get("facilityName")}`,
      `${t("fields.contactName")}: ${get("contactName")}`,
      `${t("fields.email")}: ${get("email")}`,
      get("phone") && `${t("fields.phone")}: ${get("phone")}`,
      get("fields") && `${t("fields.fields")}: ${get("fields")}`,
      sportVal && `${t("fields.sport")}: ${sportVal}`,
      get("message") && `${t("fields.message")}: ${get("message")}`,
    ].filter(Boolean);
    window.open(
      `https://wa.me/393447598309?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section
      id="contact"
      className="section-y border-t border-white/5 bg-section-gradient"
    >
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
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="facilityName" label={t("fields.facilityName")} required />
            <Field name="contactName" label={t("fields.contactName")} required />
            <Field name="email" type="email" label={t("fields.email")} required />
            <Field name="phone" type="tel" label={t("fields.phone")} />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t("fields.fields")}
              </label>
              <select
                name="fields"
                required
                defaultValue=""
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              >
                <option value="" disabled className="bg-ink-900">
                  —
                </option>
                {fieldOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-ink-900">
                    {t(`fields.fieldOptions.${opt}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t("fields.sport")}
              </label>
              <select
                name="sport"
                required
                defaultValue=""
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              >
                <option value="" disabled className="bg-ink-900">
                  —
                </option>
                {sportOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-ink-900">
                    {t(`fields.sportOptions.${opt}`)}
                  </option>
                ))}
              </select>
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
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)] transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24.044 12.045.044 5.463.044.104 5.401.101 11.986c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.96 11.96 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945 0-3.19-1.245-6.19-3.503-8.457" />
            </svg>
            {t("whatsappSubmit")}
          </button>

          {/* Trust line */}
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
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-white/60">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent"
      />
    </div>
  );
}
