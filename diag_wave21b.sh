#!/usr/bin/env bash
set -u
APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d '\r\n')
export PGPASSWORD="$APP_PW"

echo "=== chain stats AFTER live LOGIN/MFA writes ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc \
  "SELECT count(*) AS total, count(*) FILTER (WHERE row_hash<>'') AS chained, count(*) FILTER (WHERE row_hash='') AS unchained, max(chain_idx) FILTER (WHERE row_hash<>'') AS max_chain FROM audit_trail;" 2>&1 | grep -v "could not change"

echo ""
echo "=== last 8 chained rows ==="
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web \
  -c "SELECT id, action, chain_idx, substr(row_hash,1,12) AS hash12, substr(prev_hash,1,12) AS prev12, username, created_at FROM audit_trail WHERE row_hash <> '' ORDER BY chain_idx DESC LIMIT 8;" 2>&1 | grep -v "could not change"

echo ""
echo "=== chain integrity check (recompute hash in app, since pgcrypto not installed) ==="
# Recompute the hash using openssl on the local side via PL/pgSQL helper:
psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web <<'SQL' 2>&1 | grep -v "could not change"
DO $$
DECLARE
  rec RECORD;
  expected TEXT;
  ok_count INT := 0;
  bad_count INT := 0;
BEGIN
  FOR rec IN
    SELECT id, tenant_id, chain_idx, prev_hash, row_hash, action, module, new_values, user_id
    FROM audit_trail
    WHERE row_hash <> ''
    ORDER BY chain_idx ASC
  LOOP
    expected := encode(
      digest(
        rec.tenant_id || '|' || rec.chain_idx || '|' || COALESCE(rec.prev_hash,'') || '|' ||
        rec.action || '|' || rec.module || '|' || rec.new_values || '|' || COALESCE(rec.user_id::text,''),
        'sha256'
      ),
      'hex'
    );
    IF expected = rec.row_hash THEN
      ok_count := ok_count + 1;
    ELSE
      bad_count := bad_count + 1;
      RAISE NOTICE 'BROKEN row id=% chain_idx=% expected=% got=%', rec.id, rec.chain_idx, expected, rec.row_hash;
    END IF;
  END LOOP;
  RAISE NOTICE 'CHAIN_OK_COUNT=% CHAIN_BROKEN_COUNT=%', ok_count, bad_count;
END $$;
SQL
