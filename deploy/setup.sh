#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Replash — tek seferlik sunucu kurulumu (Ubuntu 22.04 / 24.04)
# Kullanım (sunucuda root olarak):
#   bash setup.sh [domain] [github-repo-url]
# Örnek:
#   bash setup.sh replash.info https://github.com/ykmg52mqpz-collab/replash-info.git
# ============================================================

DOMAIN="${1:-replash.info}"
REPO="${2:-https://github.com/ykmg52mqpz-collab/replash-info.git}"
APP_DIR="/opt/replash"
APP_USER="replash"

echo "==> Replash kurulumu: domain=$DOMAIN"

# --- 1) Sistem paketleri ---
apt-get update -y
apt-get install -y curl git ufw debian-keyring debian-archive-keyring apt-transport-https

# --- 2) Node.js 20 (NodeSource) ---
if ! command -v node >/dev/null || [[ "$(node -v)" != v2* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "    node $(node -v) / npm $(npm -v)"

# --- 3) Caddy (otomatik HTTPS'li reverse proxy) ---
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y && apt-get install -y caddy
fi

# --- 4) Uygulama kullanıcısı + kod ---
id -u "$APP_USER" &>/dev/null || useradd -r -m -d "$APP_DIR" -s /bin/bash "$APP_USER"
if [[ ! -d "$APP_DIR/app/.git" ]]; then
  sudo -u "$APP_USER" git clone "$REPO" "$APP_DIR/app"
fi
cd "$APP_DIR/app"

# --- 5) Ortam değişkenleri (bir kez üretilir, korunur) ---
ENV_FILE="$APP_DIR/app/.env.production"
if [[ ! -f "$ENV_FILE" ]]; then
  cat > "$ENV_FILE" <<EOF
NODE_ENV=production
PORT=3000
REPLASH_SECRET=$(openssl rand -hex 32)
REPLASH_WEBHOOK_SECRET=whsec_$(openssl rand -hex 24)
PROCESSING_MINUTES=10
# STORAGE=s3   # AB bucket'a geçince aç (bkz. .env.production.example)
EOF
  chown "$APP_USER:$APP_USER" "$ENV_FILE" && chmod 600 "$ENV_FILE"
  echo "    .env.production oluşturuldu (secret'lar üretildi)"
fi

# --- 6) Bağımlılıklar + build + ilk veri ---
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npm run build
[[ -f db/data.json ]] || sudo -u "$APP_USER" npm run seed

# --- 7) systemd servisi ---
sed "s|__APP_DIR__|$APP_DIR/app|g; s|__APP_USER__|$APP_USER|g" deploy/replash.service > /etc/systemd/system/replash.service
systemctl daemon-reload
systemctl enable --now replash

# --- 8) Caddy (HTTPS) ---
sed "s|__DOMAIN__|$DOMAIN|g" deploy/Caddyfile > /etc/caddy/Caddyfile
systemctl reload caddy

# --- 9) Güvenlik duvarı ---
ufw allow OpenSSH >/dev/null; ufw allow 80 >/dev/null; ufw allow 443 >/dev/null
ufw --force enable >/dev/null

# --- 10) Günlük veri yedeği (03:00) ---
CRON_LINE="0 3 * * * cp $APP_DIR/app/db/data.json $APP_DIR/backup-\$(date +\%u).json"
( crontab -u "$APP_USER" -l 2>/dev/null | grep -v 'backup-' ; echo "$CRON_LINE" ) | crontab -u "$APP_USER" -

echo ""
echo "==> KURULUM TAMAM"
echo "    Site:            https://$DOMAIN  (DNS bu sunucuya işaret edince)"
echo "    Servis durumu:   systemctl status replash"
echo "    Loglar:          journalctl -u replash -f"
echo "    Webhook secret (Müjdat'a verilecek):"
grep REPLASH_WEBHOOK_SECRET "$ENV_FILE"
