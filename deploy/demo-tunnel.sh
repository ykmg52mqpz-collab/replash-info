#!/usr/bin/env bash
# Kararlı demo tüneli — koparsa otomatik yeniden bağlanır.
# Kullanım: bash deploy/demo-tunnel.sh   (durdurmak: pkill -f demo-tunnel)
LOG="${1:-/tmp/replash-tunnel.log}"
: > "$LOG"
while true; do
  ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=20 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -R 80:localhost:3000 nokey@localhost.run >> "$LOG" 2>&1
  echo "[$(date '+%H:%M:%S')] tunnel dropped, reconnecting in 3s" >> "$LOG"
  sleep 3
done
