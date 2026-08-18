"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Admin Panel — email+password login, real-time dashboard, match filters +
 * Match ID search + CSV export, refund approvals, camera registry
 * (channel mapping + online/offline), per-facility pricing.
 */

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";

const T: Record<string, Record<string, string>> = {
  it: {
    login: "Accesso Amministratore", sub: "Accedi con email e password.", email: "Email", pass: "Password",
    enter: "Accedi", bad: "Credenziali non valide.", logout: "Esci", title: "Pannello Amministratore",
    sTotal: "Registri (live)", sLocked: "Bloccate", sUnlock: "Sbloccate", sRev: "Ricavo",
    tabMatches: "Partite", tabRefunds: "Rimborsi", tabCameras: "Camere", tabPricing: "Prezzi",
    all: "Tutti", allFac: "Tutti i centri", search: "Cerca Match ID…", csv: "Esporta CSV",
    fac: "Centro", court: "Campo", slot: "Fascia", date: "Data", status: "Stato", soldAt: "Sbloccata il",
    views: "Visual.", bill: "Fatt.", billable: "Fatturabile", no: "No", empty: "Nessun risultato.",
    rNone: "Nessuna richiesta di rimborso.", rApprove: "Approva (partita gratis)", rOpen: "Aperta", rApproved: "Approvata", rSent: "Email generata per",
    camName: "Camera", camChannel: "Canale", camRec: "Registrazioni", camStatus: "Stato", camOnline: "Online", camOffline: "Offline",
    camAdd: "Aggiungi camera", camAdded: "Camera aggiunta", camExists: "Esiste già una camera per questo campo.",
    pUnit: "Prezzo unitario (EUR, IVA incl.)", pSave: "Salva", pSaved: "Prezzo aggiornato", sold: "vendute", demo: "Demo",
  },
  en: {
    login: "Admin Login", sub: "Sign in with email and password.", email: "Email", pass: "Password",
    enter: "Sign in", bad: "Invalid credentials.", logout: "Log out", title: "Admin Panel",
    sTotal: "Records (live)", sLocked: "Locked", sUnlock: "Unlocked", sRev: "Revenue",
    tabMatches: "Matches", tabRefunds: "Refunds", tabCameras: "Cameras", tabPricing: "Pricing",
    all: "All", allFac: "All facilities", search: "Search Match ID…", csv: "Export CSV",
    fac: "Facility", court: "Court", slot: "Slot", date: "Date", status: "Status", soldAt: "Unlocked at",
    views: "Views", bill: "Bill.", billable: "Billable", no: "No", empty: "No results.",
    rNone: "No refund requests.", rApprove: "Approve (free match)", rOpen: "Open", rApproved: "Approved", rSent: "Email generated for",
    camName: "Camera", camChannel: "Channel", camRec: "Recordings", camStatus: "Status", camOnline: "Online", camOffline: "Offline",
    camAdd: "Add camera", camAdded: "Camera added", camExists: "A camera already exists for this court.",
    pUnit: "Unit price (EUR, VAT incl.)", pSave: "Save", pSaved: "Price updated", sold: "sold", demo: "Demo",
  },
  tr: {
    login: "Yönetici Girişi", sub: "E-posta ve şifreyle giriş yap.", email: "E-posta", pass: "Şifre",
    enter: "Giriş", bad: "Geçersiz bilgiler.", logout: "Çıkış", title: "Yönetici Paneli",
    sTotal: "Kayıt (canlı)", sLocked: "Kilitli", sUnlock: "Açık", sRev: "Gelir",
    tabMatches: "Maçlar", tabRefunds: "İadeler", tabCameras: "Kameralar", tabPricing: "Fiyatlar",
    all: "Tümü", allFac: "Tüm tesisler", search: "Match ID ara…", csv: "CSV indir",
    fac: "Tesis", court: "Saha", slot: "Saat", date: "Tarih", status: "Durum", soldAt: "Açılma",
    views: "İzlenme", bill: "Fat.", billable: "Faturalanır", no: "Hayır", empty: "Sonuç yok.",
    rNone: "İade talebi yok.", rApprove: "Onayla (ücretsiz maç)", rOpen: "Açık", rApproved: "Onaylandı", rSent: "E-posta oluşturuldu:",
    camName: "Kamera", camChannel: "Kanal", camRec: "Kayıt", camStatus: "Durum", camOnline: "Çevrimiçi", camOffline: "Çevrimdışı",
    camAdd: "Kamera ekle", camAdded: "Kamera eklendi", camExists: "Bu saha için zaten kamera var.",
    pUnit: "Birim fiyat (EUR, KDV dahil)", pSave: "Kaydet", pSaved: "Fiyat güncellendi", sold: "satılan", demo: "Demo",
  },
  es: {
    login: "Acceso Administrador", sub: "Inicia sesión con email y contraseña.", email: "Email", pass: "Contraseña",
    enter: "Entrar", bad: "Credenciales no válidas.", logout: "Salir", title: "Panel de Administración",
    sTotal: "Registros (en vivo)", sLocked: "Bloqueados", sUnlock: "Desbloqueados", sRev: "Ingresos",
    tabMatches: "Partidos", tabRefunds: "Reembolsos", tabCameras: "Cámaras", tabPricing: "Precios",
    all: "Todos", allFac: "Todos los clubes", search: "Buscar Match ID…", csv: "Exportar CSV",
    fac: "Club", court: "Pista", slot: "Franja", date: "Fecha", status: "Estado", soldAt: "Desbloqueado el",
    views: "Vistas", bill: "Fact.", billable: "Facturable", no: "No", empty: "Sin resultados.",
    rNone: "No hay solicitudes de reembolso.", rApprove: "Aprobar (partido gratis)", rOpen: "Abierta", rApproved: "Aprobada", rSent: "Email generado para",
    camName: "Cámara", camChannel: "Canal", camRec: "Grabaciones", camStatus: "Estado", camOnline: "En línea", camOffline: "Desconectada",
    camAdd: "Añadir cámara", camAdded: "Cámara añadida", camExists: "Ya existe una cámara para esta pista.",
    pUnit: "Precio unitario (EUR, IVA incl.)", pSave: "Guardar", pSaved: "Precio actualizado", sold: "vendidos", demo: "Demo",
  },
};

const eur = (n: number) => "€" + Number(n).toFixed(2);
const input = "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-accent";

export default function AdminApp() {
  const locale = useLocale();
  const t = (k: string) => (T[locale] || T.en)[k];
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  const [dash, setDash] = useState<any>(null);
  const [tab, setTab] = useState<"matches" | "refunds" | "cameras" | "pricing">("matches");
  const [matches, setMatches] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [cameras, setCameras] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [fStatus, setFStatus] = useState("");
  const [fFac, setFFac] = useState("");
  const [fQ, setFQ] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [camFac, setCamFac] = useState("");
  const [camCourt, setCamCourt] = useState("");

  useEffect(() => { setToken(sessionStorage.getItem("replash_admin_token")); }, []);

  const authed = useCallback(
    (path: string, opts: RequestInit = {}) =>
      fetch(path, { ...opts, headers: { "Content-Type": "application/json", Authorization: "Bearer " + token, ...(opts.headers || {}) } }),
    [token]
  );

  const loadDash = useCallback(async () => {
    const r = await authed("/api/admin/dashboard");
    if (!r.ok) { sessionStorage.removeItem("replash_admin_token"); setToken(null); return; }
    setDash(await r.json());
    setFacilities((await (await fetch("/api/facilities")).json()).facilities || []);
  }, [authed]);

  const loadMatches = useCallback(async () => {
    const qs = new URLSearchParams();
    if (fStatus) qs.set("status", fStatus);
    if (fFac) qs.set("facilityId", fFac);
    if (fQ) qs.set("q", fQ);
    const r = await authed("/api/admin/matches?" + qs);
    if (r.ok) setMatches((await r.json()).matches);
  }, [authed, fStatus, fFac, fQ]);

  const loadRefunds = useCallback(async () => {
    const r = await authed("/api/admin/refunds");
    if (r.ok) setRefunds((await r.json()).refunds);
  }, [authed]);

  const loadCameras = useCallback(async () => {
    const r = await authed("/api/admin/cameras");
    if (r.ok) setCameras((await r.json()).cameras);
  }, [authed]);

  useEffect(() => { if (token) loadDash(); }, [token, loadDash]);
  useEffect(() => {
    if (!token) return;
    if (tab === "matches") loadMatches();
    else if (tab === "refunds") loadRefunds();
    else if (tab === "cameras") loadCameras();
  }, [token, tab, loadMatches, loadRefunds, loadCameras]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 4000); }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const r = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    if (r.ok) {
      const d = await r.json();
      sessionStorage.setItem("replash_admin_token", d.token);
      setErr(false); setToken(d.token);
    } else setErr(true);
  }

  async function exportCsv() {
    const r = await authed("/api/admin/export");
    const blob = await r.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "replash-matches.csv";
    a.click();
  }

  async function approveRefund(id: string) {
    const r = await authed("/api/admin/refunds/approve", { method: "POST", body: JSON.stringify({ id }) });
    if (r.ok) { const d = await r.json(); flash(`${t("rSent")} ${d.email.to}`); loadRefunds(); loadDash(); }
  }

  async function addCamera() {
    if (!camFac || !camCourt) return;
    const r = await authed("/api/admin/cameras", { method: "POST", body: JSON.stringify({ facilityId: camFac, court: camCourt }) });
    if (r.ok) { flash(t("camAdded") + " ✓"); loadCameras(); }
    else if (r.status === 409) flash(t("camExists"));
  }

  async function savePrice(facilityId: string, price: number) {
    const r = await authed("/api/admin/pricing", { method: "POST", body: JSON.stringify({ facilityId, unitPriceEur: price }) });
    if (r.ok) { flash(t("pSaved") + " ✓"); loadDash(); }
  }

  if (!token) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="font-display text-xl font-bold">{t("login")}</h1>
          <p className="mb-5 mt-1 text-sm text-white/50">{t("sub")}</p>
          <div className="flex flex-col gap-3">
            <input name="email" type="email" required placeholder={t("email")} className={input} />
            <input name="password" type="password" required placeholder={t("pass")} className={input} />
          </div>
          {err && <div className="mt-3 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{t("bad")}</div>}
          <button className="mt-4 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-ink-900">{t("enter")}</button>
        </form>
      </div>
    );
  }

  const statusBadge = (s: string) =>
    s === "UNLOCKABLE" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />UNLOCKABLE</span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/15 px-2.5 py-0.5 text-[11px] font-bold text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />LOCKED</span>
    );

  return (
    <div className="container-x py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <button
          onClick={() => { sessionStorage.removeItem("replash_admin_token"); setToken(null); }}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-accent hover:text-accent"
        >
          {t("logout")}
        </button>
      </div>

      {toast && <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{toast}</div>}

      {dash && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [t("sTotal"), String(dash.total), "text-white"],
            [t("sLocked"), String(dash.locked), "text-red-400"],
            [t("sUnlock"), String(dash.unlockable), "text-emerald-400"],
            [t("sRev"), eur(dash.revenueEur), "text-accent"],
          ].map(([k, v, cls]) => (
            <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/40">{k}</div>
              <div className={`mt-1 font-display text-2xl font-bold ${cls}`}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-5 inline-flex overflow-hidden rounded-full border border-white/10">
        {(["matches", "refunds", "cameras", "pricing"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 text-sm font-semibold transition ${tab === k ? "bg-accent text-ink-900" : "text-white/60 hover:text-white"}`}
          >
            {t("tab" + k[0].toUpperCase() + k.slice(1))}
            {k === "refunds" && dash?.openRefunds ? ` (${dash.openRefunds})` : ""}
          </button>
        ))}
      </div>

      {tab === "matches" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <select value={fFac} onChange={(e) => setFFac(e.target.value)} className={input}>
              <option value="" className="bg-ink-900">{t("allFac")}</option>
              {facilities.map((f: any) => <option key={f.id} value={f.id} className="bg-ink-900">{f.name}</option>)}
            </select>
            <div className="inline-flex overflow-hidden rounded-full border border-white/10">
              {["", "LOCKED", "UNLOCKABLE"].map((s) => (
                <button key={s} onClick={() => setFStatus(s)} className={`px-3.5 py-2 text-xs font-semibold ${fStatus === s ? "bg-accent text-ink-900" : "text-white/60"}`}>
                  {s || t("all")}
                </button>
              ))}
            </div>
            <input value={fQ} onChange={(e) => setFQ(e.target.value)} placeholder={t("search")} className={`${input} w-44`} />
            <button onClick={exportCsv} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink-900">{t("csv")}</button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3">Match ID</th><th className="px-4 py-3">{t("fac")}</th><th className="px-4 py-3">{t("court")}</th>
                  <th className="px-4 py-3">{t("slot")}</th><th className="px-4 py-3">{t("date")}</th><th className="px-4 py-3">{t("status")}</th>
                  <th className="px-4 py-3">{t("views")}</th><th className="px-4 py-3">{t("bill")}</th>
                </tr>
              </thead>
              <tbody>
                {matches.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-white/40">{t("empty")}</td></tr>}
                {matches.map((m) => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 font-mono text-xs">{m.code}</td>
                    <td className="px-4 py-2.5">{m.facilityName}</td>
                    <td className="px-4 py-2.5">{m.court}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{m.timeSlot}</td>
                    <td className="px-4 py-2.5">{m.date}</td>
                    <td className="px-4 py-2.5">{statusBadge(m.status)}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{m.views}</td>
                    <td className="px-4 py-2.5 text-xs">{m.billable ? <span className="text-emerald-400">{t("billable")}</span> : <span className="text-white/30">{t("no")}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "refunds" && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
                <th className="px-4 py-3">ID</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">{t("fac")}</th>
                <th className="px-4 py-3">{t("date")}</th><th className="px-4 py-3">{t("status")}</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {refunds.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-white/40">{t("rNone")}</td></tr>}
              {refunds.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="px-4 py-2.5 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-2.5">{r.email}</td>
                  <td className="px-4 py-2.5">{r.facilityName || "—"}</td>
                  <td className="px-4 py-2.5">{r.date}</td>
                  <td className="px-4 py-2.5 text-xs">{r.status === "approved" ? <span className="text-emerald-400">{t("rApproved")}</span> : <span className="text-red-300">{t("rOpen")}</span>}</td>
                  <td className="px-4 py-2.5">
                    {r.status === "open" && (
                      <button onClick={() => approveRefund(r.id)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-ink-900">{t("rApprove")}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "cameras" && (
        <div>
          <div className="mb-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3">{t("camName")}</th><th className="px-4 py-3">{t("fac")}</th><th className="px-4 py-3">{t("court")}</th>
                  <th className="px-4 py-3">{t("camChannel")}</th><th className="px-4 py-3">{t("camRec")}</th><th className="px-4 py-3">{t("camStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {cameras.map((c) => (
                  <tr key={c.id} className="border-b border-white/5">
                    <td className="px-4 py-2.5">{c.name}</td>
                    <td className="px-4 py-2.5">{c.facilityName}</td>
                    <td className="px-4 py-2.5">{c.court}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{c.channelId}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{c.recordings}</td>
                    <td className="px-4 py-2.5">
                      {c.status === "online" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{t("camOnline")}</span>
                      ) : c.status === "offline" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-400/15 px-2.5 py-0.5 text-[11px] font-bold text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />{t("camOffline")}</span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-3 font-semibold">{t("camAdd")}</h3>
            <div className="flex flex-wrap gap-2.5">
              <select value={camFac} onChange={(e) => { setCamFac(e.target.value); setCamCourt(""); }} className={input}>
                <option value="" className="bg-ink-900">{t("fac")}…</option>
                {facilities.map((f: any) => <option key={f.id} value={f.id} className="bg-ink-900">{f.name}</option>)}
              </select>
              <select value={camCourt} onChange={(e) => setCamCourt(e.target.value)} className={input}>
                <option value="" className="bg-ink-900">{t("court")}…</option>
                {(facilities.find((f: any) => f.id === camFac)?.courts || []).map((c: string) => (
                  <option key={c} value={c} className="bg-ink-900">{c}</option>
                ))}
              </select>
              <button onClick={addCamera} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink-900">{t("camAdd")}</button>
            </div>
          </div>
        </div>
      )}

      {tab === "pricing" && dash && (
        <div className="grid gap-4 md:grid-cols-2">
          {dash.byFacility.map((f: any) => (
            <div key={f.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold">{f.name}</h3>
              <p className="mb-3 mt-1 text-xs text-white/50">
                <span className="text-emerald-400">{f.soldCount}</span> {t("sold")} · <span className="text-accent">{eur(f.totalEur)}</span>
              </p>
              <label className="text-[11px] uppercase tracking-wider text-white/40">{t("pUnit")}</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="number" step="0.5" min="0" defaultValue={f.unitPriceEur} id={`price-${f.id}`}
                  className={`${input} w-28`}
                />
                <button
                  onClick={() => {
                    const el = document.getElementById(`price-${f.id}`) as HTMLInputElement;
                    savePrice(f.id, Number(el.value));
                  }}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-accent hover:text-accent"
                >
                  {t("pSave")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
