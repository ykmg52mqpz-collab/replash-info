import Header from "@/components/Header";
import Footer from "@/components/Footer";

export type LegalSection = { heading: string; body: string[] };
export type LegalContent = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

/**
 * Shared layout for the Privacy and Cookie pages. Content is passed in already
 * resolved for the active locale (IT primary, EN for every other locale) so we
 * don't inflate the i18n message files with long-form legal text.
 */
export default function LegalPage({ content }: { content: LegalContent }) {
  return (
    <main className="relative min-h-screen bg-ink-900">
      <Header />
      <section className="section-y border-t border-white/5">
        <div className="container-x mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-accent/70">
            {content.updated}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {content.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">{content.intro}</p>

          <div className="mt-12 flex flex-col gap-10">
            {content.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-xl font-bold text-white">{s.heading}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-white/60">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
