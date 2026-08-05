#!/usr/bin/env bash
set -u
OUT=/root/.pm2/logs/nama-medical-erp-out.log
ERR=/root/.pm2/logs/nama-medical-erp-error.log
echo "out: $OUT  err: $ERR"

LB_OUT=$(wc -l < "$OUT" 2>/dev/null || echo 0)
LB_ERR=$(wc -l < "$ERR" 2>/dev/null || echo 0)
echo "lines before: out=$LB_OUT err=$LB_ERR"

APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d '\r\n')
export PGPASSWORD="$APP_PW"

echo ""
echo "=== audit_trail count BEFORE logins ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc "SELECT count(*) FROM audit_trail;" 2>&1 | grep -v "could not change"

echo ""
echo "=== fire 3 logins ==="
for i in 1 2 3; do
  echo "--- attempt $i ---"
  curl -sk -o /dev/null -w 'http_code=%{http_code}\n' \
    -X POST -H 'Content-Type: application/json' \
    -d '{"username":"admin","password":"admin"}' \
    http://127.0.0.1:3000/api/auth/login
done
sleep 2

echo ""
echo "=== audit_trail count AFTER logins ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc "SELECT count(*) FROM audit_trail;" 2>&1 | grep -v "could not change"

echo ""
echo "=== NEW out log lines mentioning audit/error/tenant/denied ==="
tail -n +$((LB_OUT+1)) "$OUT" 2>/dev/null | grep -iE 'audit|tenant_id|denied|error|row_hash|chain' | head -30

echo ""
echo "=== NEW err log lines ==="
tail -n +$((LB_ERR+1)) "$ERR" 2>/dev/null | head -30
