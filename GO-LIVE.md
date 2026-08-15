# Replash — Canlıya Alma Rehberi (AB VPS)

Platformu Vercel'den **AB'de bir VPS'e** taşıma adımları. Vercel yalnızca statik/serverless çalıştığı için backend (veritabanı, video ingest, webhook'lar) orada çalışmaz; VPS'te **her şey sıfır kod değişikliğiyle** çalışır.

Toplam süre: ~30-45 dk. Senin yapman gerekenler 🙋 ile, sunucunun otomatik yaptıkları ⚙️ ile işaretli.

---

## 1) 🙋 Sunucu aç (Hetzner önerisi, ~€5/ay)

1. https://www.hetzner.com/cloud → hesap aç
2. **New Server**:
   - Konum: **Falkenstein** veya **Nürnberg** (Almanya, AB ✅)
   - İmaj: **Ubuntu 24.04**
   - Tip: **CX22** (2 vCPU / 4 GB) — başlangıç için yeterli
   - SSH anahtarı ekle (yoksa parola ile de olur)
3. Sunucunun **IP adresini** not al (örn. `188.34.x.x`)

> Alternatifler: Scaleway (Paris), OVH (Fransa) — hepsi AB, kurulum aynı.

## 2) 🙋 Kurulum scriptini çalıştır

Sunucuya bağlan ve tek script'i çalıştır:

```bash
ssh root@SUNUCU_IP
```

```bash
git clone https://github.com/ykmg52mqpz-collab/replash-info.git /tmp/r && bash /tmp/r/deploy/setup.sh replash.info
```

> Repo private ise `git clone` kullanıcı adı/token sorar (GitHub → Settings →
> Developer settings → Personal access token ile).

⚙️ Script otomatik olarak: Node 20 + Caddy kurar, kodu `/opt/replash/app`'e
alır, secret'ları üretir, build eder, demo veriyi yükler, systemd servisi +
HTTPS + güvenlik duvarı + günlük yedek kurar.

Script sonunda ekrana **webhook secret** yazar → not al (Müjdat'a verilecek).

## 3) 🙋 DNS'i çevir

Domain'in DNS yönetiminde (şu an Vercel'e işaret ediyor):

| Kayıt | Tip | Değer |
|---|---|---|
| `replash.info` | A | `SUNUCU_IP` |
| `www.replash.info` | A | `SUNUCU_IP` |

- Vercel'deki A/CNAME kayıtlarını bunlarla değiştir.
- Yayılma genelde 5-30 dk. Caddy, DNS gelir gelmez HTTPS sertifikasını otomatik alır.

## 4) 🙋 Doğrula

Tarayıcıda sırayla:

- `https://replash.info` → site açılıyor ✅
- `https://replash.info/find` → kod girişi görünüyor ✅
- `https://replash.info/panel` → PIN `482913` ile giriş oluyor ✅ (demo veri)
- `https://replash.info/admin` → `admin@replash.info` / `replash2025` ✅

## 5) 🙋 Müjdat'a ver

- **INTEGRATION.md** (bu repodaki kontrat belgesi)
- Webhook adresleri:
  - `POST https://replash.info/api/hooks/recording`
  - `POST https://replash.info/api/hooks/camera-status`
- **Webhook secret** (adım 2'de üretilen `whsec_…`)
- Kanal listesi: Admin → Cameras sekmesindeki `channelId` değerleri

## 6) Sonrası

- **Güncelleme** (yeni kod push'landığında, sunucuda):
  `bash /opt/replash/app/deploy/update.sh`
- **Loglar:** `journalctl -u replash -f`
- **Gerçek veriye geçiş:** demo tesisler/PIN'ler `db/seed.js`'ten geliyor; gerçek
  tesis eklerken admin Cameras sekmesi kamera üretir, tesis kayıtları için bana
  (Claude) "gerçek tesis ekle" de — seed'i gerçek verilerle güncelleriz ve demo
  hesapları/PIN'leri kaldırırız.
- **Vercel:** DNS dönünce eski Vercel projesi devre dışı kalır; istersen
  panelden silebilirsin.

## Sık sorunlar

| Belirti | Çözüm |
|---|---|
| `https` açılmıyor, sertifika hatası | DNS henüz yayılmadı — 15 dk bekle; `systemctl status caddy` |
| Site 502 | `systemctl status replash` + `journalctl -u replash -n 50` |
| Webhook 401 | Müjdat'ın imzaladığı secret ile sunucudaki `REPLASH_WEBHOOK_SECRET` aynı mı? (`grep WEBHOOK /opt/replash/app/.env.production`) |
