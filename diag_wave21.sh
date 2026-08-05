#!/usr/bin/env bash
set -u
APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d '\r\n')
export PGPASSWORD="$APP_PW"

echo "=== pgcrypto extension ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc \
  "SELECT extname, extversion FROM pg_extension WHERE extname='pgcrypto';" 2>&1 | grep -v "could not change"

echo ""
echo "=== triggers on audit_trail ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc \
  "SELECT trigger_name, event_manipulation, action_timing, action_statement FROM information_schema.triggers WHERE event_object_table='audit_trail';" 2>&1 | grep -v "could not change"

echo ""
echo "=== chain column definitions ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc \
  "SELECT column_name, data_type, character_maximum_length, column_default FROM information_schema.columns WHERE table_name='audit_trail' AND column_name IN ('row_hash','prev_hash','chain_idx') ORDER BY column_name;" 2>&1 | grep -v "could not change"

echo ""
echo "=== chain stats ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc \
  "SELECT count(*) AS total, count(*) FILTER (WHERE row_hash<>'') AS chained, count(*) FILTER (WHERE row_hash='') AS unchained, max(chain_idx) AS max_chain_idx FROM audit_trail;" 2>&1 | grep -v "could not change"

echo ""
echo "=== last 5 audit_trail rows by id ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web \
  -c "SELECT id, action, chain_idx, substr(coalesce(row_hash,''),1,16) AS hash16, substr(coalesce(prev_hash,''),1,16) AS prev16, created_at FROM audit_trail ORDER BY id DESC LIMIT 5;" 2>&1 | grep -v "could not change"

echo ""
echo "=== logAudit function source (Node.js helper) ==="
grep -n "function logAudit\|logAudit =" /var/www/namaweb/server.js | head -5
