"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Facility Panel — 6-digit PIN login, match register, 'Video sold'
 * (LOCKED → UNLOCKABLE, irreversible) revealing the player access code,
 * read-only billing summary.
 */

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";

const T: Record<string, Record<string, string>> = {
  it: {
    login: "Accesso Area Centro", sub: "Inserisci il PIN a 6 cifre del tuo centro.", pin: "PIN a 6 cifre",
    enter: "Entra", bad: "PIN non valido.", logout: "Esci", title: "Registro partite",
    hint: "Sblocca solo le partite pagate premendo «Video venduto». L'operazione è irreversibile. Dai il codice al giocatore.",
    court: "Campo", slot: "Fascia", date: "Data", status: "Stato", code: "Codice", views: "Visual.", action: "Azione",
    sell: "Video venduto", sold: "Venduto", confirm: "Confermi lo sblocco? L'operazione è irreversibile.",
    codegiven: "Dai questo codice al giocatore:",
    sTotal: "Registri", sSold: "Vendute", sViews: "Visualizzazioni", sBill: "Fatturabile",
    unit: "Prezzo unitario", count: "Partite vendute", total: "Totale (IVA incl.)", billing: "Riepilogo fatturazione",
    empty: "Nessuna partita nel periodo di conservazione.", demo: "Demo PIN",
  },
  en: {
    login: "Facility Panel Login", sub: "Enter your facility's 6-digit PIN.", pin: "6-digit PIN",
    enter: "Enter", bad: "Invalid PIN.", logout: "Log out", title: "Match register",
    hint: "Unlock only paid matches by pressing 'Video sold'. The action is irreversible. Give the code to the player.",
    court: "Court", slot: "Slot", date: "Date", status: "Status", code: "Code", views: "Views", action: "Action",
    sell: "Video sold", sold: "Sold", confirm: "Confirm unlocking? This action is irreversible.",
    codegiven: "Give this code to the player:",
    sTotal: "Records", sSold: "Sold", sViews: "Views", sBill: "Billable",
    unit: "Unit price", count: "Matches sold", total: "Total (VAT incl.)", billing: "Billing summary",
    empty: "No matches within the retention window.", demo: "Demo PIN",
  },
  tr: {
    login: "Tesis Paneli Girişi", sub: "Tesisinin 6 haneli PIN'ini gir.", pin: "6 haneli PIN",
    enter: "Giriş", bad: "Geçersiz PIN.", logout: "Çıkış", title: "Maç kayıtları",
    hint: "Yalnızca ödemesi alınan maçları «Video satıldı» ile aç. İşlem geri alınamaz. Kodu oyuncuya ver.",
    court: "Saha", slot: "Saat", date: "Tarih", status: "Durum", code: "Kod", views: "İzlenme", action: "İşlem",
    sell: "Video satıldı", sold: "Satıldı", confirm: "Açılsın mı? İşlem geri alınamaz.",
    codegiven: "Bu kodu oyuncuya ver:",
    sTotal: "Kayıt", sSold: "Satılan", sViews: "İzlenme", sBill: "Faturalanabilir",
    unit: "Birim fiyat", count: "Satılan maç", total: "Toplam (KDV dahil)", billing: "Fatura özeti",
    empty: "Saklama süresi içinde maç yok.", demo: "Demo PIN",
  },
  es: {
    login: "Acceso Panel del Club", sub: "Introduce el PIN de 6 dígitos de tu club.", pin: "PIN de 6 dígitos",
    enter: "Entrar", bad: "PIN no válido.", logout: "Salir", title: "Registro de partidos",
    hint: "Desbloquea solo los partidos pagados pulsando «Vídeo vendido». La acción es irreversible. Da el código al jugador.",
    court: "Pista", slot: "Franja", date: "Fecha", status: "Estado", code: "Código", views: "Vistas", action: "Acción",
    sell: "Vídeo vendido", sold: "Vendido", confirm: "¿Confirmar desbloqueo? La acción es irreversible.",
    codegiven: "Da este código al jugador:",
    sTotal: "Registros", sSold: "Vendidos", sViews: "Vistas", sBill: "Facturable",
    unit: "Precio unitario", count: "Partidos vendidos", total: "Total (IVA incl.)", billing: "Resumen de facturación",
    empty: "No hay partidos en el período de retención.", demo: "PIN demo",
  },
};

type Row = {
  id: string; code: string; court: string; date: string; timeSlot: string; status: string;
  views: number; accessCode: string | null;
};
type Summary = {
  total: number; unlockable: number; locked: number; totalViews: number;
  unitPriceEur: number; billableCount: number; billableTotalEur: number;
};

const eur = (n: number) => "€" + Number(n).toFixed(2);

export default function PanelApp() {
  const locale = useLocale();
  const t = (k: string) => (T[locale] || T.en)[k];
  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setToken(sessionStorage.getItem("replash_panel_token")); }, []);

  const load = useCallback(async (tok: string) => {
    const r = await fetch("/api/panel/matches", { headers: { Authorization: "Bearer " + tok } });
    if (!r.ok) { sessionStorage.removeItem("replash_panel_token"); setToken(null); return; }
    const d = await r.json();
    setFacilityName(d.facility.name);
    setRows(d.matches);
    setSummary(d.summary);
  }, []);

  useEffect(() => { if (token) load(token); }, [token, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/panel/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }),
    });
    if (r.ok) {
      const d = await r.json();
      sessionStorage.setItem("replash_panel_token", d.token);
      setErr(false); setToken(d.token);
    } else setErr(true);
  }

  async function sell(id: string) {
    if (!token || !confirm(t("confirm"))) return;
    const r = await fetch("/api/panel/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ matchId: id }),
    });
    if (r.ok) {
      const d = await r.json();
      setToast(`${t("codegiven")} ${d.match.accessCode}`);
      setTimeout(() => setToast(null), 6000);
      load(token);
    }
  }

  const input = "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-accent";

  if (!token) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="font-display text-xl font-bold">{t("login")}</h1>
          <p className="mb-5 mt-1 text-sm text-white/50">{t("sub")}</p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="••••••"
            className={`${input} w-full text-center font-mono text-2xl font-bold tracking-[0.5em]`}
          />
          {err && <div className="mt-3 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{t("bad")}</div>}
          <button className="mt-4 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-ink-900">{t("enter")}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-accent">{facilityName}</div>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("replash_panel_token"); setToken(null); }}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-accent hover:text-accent"
        >
          {t("logout")}
        </button>
      </div>

      <p className="mb-5 inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">ⓘ {t("hint")}</p>

      {toast && (
        <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 font-mono text-sm text-emerald-200">{toast}</div>
      )}

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [t("sTotal"), String(summary.total), "text-white"],
            [t("sSold"), String(summary.unlockable), "text-emerald-400"],
            [t("sViews"), String(summary.totalViews), "text-white"],
            [t("sBill"), eur(summary.billableTotalEur), "text-accent"],
          ].map(([k, v, cls]) => (
            <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/40">{k}</div>
              <div className={`mt-1 font-display text-2xl font-bold ${cls}`}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">Match ID</th>
              <th className="px-4 py-3">{t("court")}</th>
              <th className="px-4 py-3">{t("slot")}</th>
              <th className="px-4 py-3">{t("date")}</th>
              <th className="px-4 py-3">{t("status")}</th>
              <th className="px-4 py-3">{t("code")}</th>
              <th className="px-4 py-3">{t("views")}</th>
              <th className="px-4 py-3">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-white/40">{t("empty")}</td></tr>
            )}
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs">{m.code}</td>
                <td className="px-4 py-3">{m.court}</td>
                <td className="px-4 py-3 font-mono text-xs">{m.timeSlot}</td>
                <td className="px-4 py-3">{m.date}</td>
                <td className="px-4 py-3">
                  {m.status === "UNLOCKABLE" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />UNLOCKABLE</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/15 px-2.5 py-0.5 text-[11px] font-bold text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />LOCKED</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-bold tracking-wider text-accent">{m.accessCode || <span className="text-white/25">—</span>}</td>
                <td className="px-4 py-3 font-mono text-xs">{m.views}</td>
                <td className="px-4 py-3">
                  {m.status === "LOCKED" ? (
                    <button onClick={() => sell(m.id)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-ink-900">{t("sell")}</button>
                  ) : (
                    <span className="text-xs text-white/40">✓ {t("sold")}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {summary && (
        <div className="mt-6 max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="font-semibold">{t("billing")}</h3>
          <div className="mt-3 flex justify-between text-sm"><span className="text-white/50">{t("unit")}</span><span className="font-mono">{eur(summary.unitPriceEur)}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-white/50">{t("count")}</span><span className="font-mono">{summary.billableCount}</span></div>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3"><span>{t("total")}</span><span className="font-display text-xl font-bold text-accent">{eur(summary.billableTotalEur)}</span></div>
        </div>
      )}
    </div>
  );
}
