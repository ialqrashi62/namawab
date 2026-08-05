#!/usr/bin/env bash
set -u
echo "=== check node process is running the latest code ==="
ps -fp $(pgrep -f 'node /var/www/namaweb' | head -1) 2>&1 || echo "no node proc"

echo ""
echo "=== check that logAudit chain code is present in the running file ==="
grep -nE "Wave 21|tamper-evident per-tenant hash chain|chain_idx.*BigInt" /var/www/namaweb/server.js | head -10

echo ""
echo "=== tail pm2 logs (last 60 lines) for logAudit activity / errors ==="
pm2 logs nama-medical-erp --lines 60 --nostream 2>&1 | tail -80 || tail -n 60 /var/www/namaweb/logs/*.log 2>&1 | tail -60

echo ""
echo "=== raw last 10 audit_trail rows (no filter on row_hash) ==="
APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d '\r\n')
export PGPASSWORD="$APP_PW"
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c \
  "SELECT id, action, username, tenant_id, chain_idx, length(coalesce(row_hash,'')) AS rh_len, length(coalesce(prev_hash,'')) AS ph_len, created_at FROM audit_trail ORDER BY id DESC LIMIT 10;" 2>&1 | grep -v "could not change"
