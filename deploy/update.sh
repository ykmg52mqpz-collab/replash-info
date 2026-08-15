#!/usr/bin/env bash
set -euo pipefail

# Replash — güncelleme (sunucuda root olarak): bash /opt/replash/app/deploy/update.sh
APP_DIR="/opt/replash/app"
APP_USER="replash"

cd "$APP_DIR"
echo "==> git pull"
sudo -u "$APP_USER" git pull --ff-only
echo "==> npm ci + build"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npm run build
echo "==> restart"
systemctl restart replash
sleep 2
systemctl --no-pager status replash | head -5
echo "==> Güncelleme tamam"
