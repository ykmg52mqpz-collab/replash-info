import LegalPage, { type LegalContent } from "@/components/LegalPage";
import type { Metadata } from "next";

const CONTACT = "partnerships@replash.eu";

const IT: LegalContent = {
  title: "Informativa sulla Privacy",
  updated: "Ultimo aggiornamento: 2026",
  intro:
    "Replash registra le partite nei centri sportivi partner tramite telecamere fisse, così i giocatori possono guardare, ritagliare e condividere la propria partita. Questa informativa spiega quali dati trattiamo e come.",
  sections: [
    {
      heading: "Titolare del trattamento",
      body: [
        `Replash è titolare del trattamento dei dati raccolti tramite il servizio. Per qualsiasi richiesta relativa alla privacy puoi scriverci a ${CONTACT}.`,
      ],
    },
    {
      heading: "Dati che trattiamo",
      body: [
        "Registrazioni video dell'area di gioco durante gli orari di apertura del centro. Le telecamere inquadrano solo il campo.",
        "Non registriamo audio e non utilizziamo alcuna forma di riconoscimento facciale.",
      ],
    },
    {
      heading: "Base giuridica",
      body: [
        "Trattiamo i dati sulla base del legittimo interesse (art. 6, par. 1, lett. f del GDPR) e della necessità contrattuale (art. 6, par. 1, lett. b).",
      ],
    },
    {
      heading: "Conservazione",
      body: [
        "Le registrazioni vengono eliminate automaticamente entro 7 giorni, salvo quelle che il centro abilita su richiesta della squadra per la visione.",
      ],
    },
    {
      heading: "Accesso ai video",
      body: [
        "I video sono privati e accessibili solo tramite il codice della partita consegnato dal centro. Non vengono elencati pubblicamente né indicizzati dai motori di ricerca.",
      ],
    },
    {
      heading: "I tuoi diritti",
      body: [
        `Puoi esercitare i diritti di accesso, rettifica, cancellazione e opposizione scrivendo a ${CONTACT}.`,
      ],
    },
    {
      heading: "Dove vengono trattati i dati",
      body: [
        "Le registrazioni vengono elaborate e archiviate in data center situati nell'Unione Europea.",
      ],
    },
  ],
};

const EN: LegalContent = {
  title: "Privacy Policy",
  updated: "Last updated: 2026",
  intro:
    "Replash records matches at partner sports facilities through fixed cameras, so players can watch, clip and share their match. This policy explains what data we process and how.",
  sections: [
    {
      heading: "Data controller",
      body: [
        `Replash is the controller of the data collected through the service. For any privacy request, contact us at ${CONTACT}.`,
      ],
    },
    {
      heading: "Data we process",
      body: [
        "Video recordings of the playing area during the facility's opening hours. Cameras only frame the court.",
        "We do not record audio and we do not use any form of facial recognition.",
      ],
    },
    {
      heading: "Legal basis",
      body: [
        "We process data on the basis of legitimate interest (Art. 6(1)(f) GDPR) and contractual necessity (Art. 6(1)(b)).",
      ],
    },
    {
      heading: "Retention",
      body: [
        "Recordings are automatically deleted within 7 days, except those the facility enables for viewing at the team's request.",
      ],
    },
    {
      heading: "Access to videos",
      body: [
        "Videos are private and accessible only through the match code handed out by the facility. They are never publicly listed or indexed by search engines.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You can exercise your rights of access, rectification, erasure and objection by contacting ${CONTACT}.`,
      ],
    },
    {
      heading: "Where data is processed",
      body: ["Recordings are processed and stored in data centers located in the European Union."],
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

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  return <LegalPage content={locale === "it" ? IT : EN} />;
}
