import LegalPage, { type LegalContent } from "@/components/LegalPage";
import type { Metadata } from "next";

const CONTACT = "partnerships@replash.eu";

const IT: LegalContent = {
  title: "Cookie Policy",
  updated: "Ultimo aggiornamento: 2026",
  intro:
    "Questo sito usa un numero minimo di cookie, solo per farlo funzionare correttamente. Ecco quali e perché.",
  sections: [
    {
      heading: "Cookie tecnici",
      body: [
        "Usiamo solo cookie tecnici necessari al funzionamento del sito, ad esempio per ricordare la preferenza di lingua e gestire la sessione di accesso al video.",
      ],
    },
    {
      heading: "Nessuna profilazione",
      body: [
        "Non utilizziamo cookie di profilazione, pubblicitari o di tracciamento di terze parti.",
      ],
    },
    {
      heading: "Gestione dei cookie",
      body: [
        "Puoi bloccare o eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser. La disattivazione dei cookie tecnici può limitare alcune funzioni del sito.",
      ],
    },
    {
      heading: "Contatti",
      body: [`Per qualsiasi domanda sui cookie puoi scriverci a ${CONTACT}.`],
    },
  ],
};

const EN: LegalContent = {
  title: "Cookie Policy",
  updated: "Last updated: 2026",
  intro:
    "This site uses a minimal number of cookies, only to make it work properly. Here's which ones and why.",
  sections: [
    {
      heading: "Essential cookies",
      body: [
        "We only use technical cookies required for the site to function, for example to remember your language preference and manage the video access session.",
      ],
    },
    {
      heading: "No profiling",
      body: ["We do not use profiling, advertising or third-party tracking cookies."],
    },
    {
      heading: "Managing cookies",
      body: [
        "You can block or delete cookies at any time from your browser settings. Disabling essential cookies may limit some site features.",
      ],
    },
    {
      heading: "Contact",
      body: [`For any question about cookies, contact us at ${CONTACT}.`],
    },
  ],
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const c = locale === "it" ? IT : EN;
  return { title: `${c.title} — Replash`, description: c.intro };
}

export default function CookiePage({ params: { locale } }: { params: { locale: string } }) {
  return <LegalPage content={locale === "it" ? IT : EN} />;
}
