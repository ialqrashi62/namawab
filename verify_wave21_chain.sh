#!/usr/bin/env bash
# Wave 21 audit hash-chain verification
# Uploads to /tmp and runs via: bash /tmp/verify_wave21_chain.sh
set -u

echo "=== before chain writes ==="
APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d '\r\n')
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web \
  -c "SET app.tenant_id = '1'; SELECT count(*) AS chain_rows FROM audit_trail WHERE row_hash <> '';" \
  2>&1 | grep -v "could not change directory"

echo ""
echo "=== trigger 3 audit writes via direct DB INSERT LOGIN MFA LOGOUT ==="
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web <<'SQL' 2>&1 | grep -v "could not change directory"
SET app.tenant_id = '1';
INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id)
VALUES (1, 'wave21-test', 'LOGIN', 'Auth', 'chain test 1', '127.0.0.1', 1);
INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id)
VALUES (1, 'wave21-test', 'MFA_VERIFY', 'Auth', 'chain test 2', '127.0.0.1', 1);
INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id)
VALUES (1, 'wave21-test', 'LOGOUT', 'Auth', 'chain test 3', '127.0.0.1', 1);
SQL

echo ""
echo "=== verify hash chain list ==="
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web \
  -c "SET app.tenant_id = '1'; SELECT id, action, chain_idx, substr(row_hash, 1, 12) AS hash_12, substr(prev_hash, 1, 12) AS prev_12 FROM audit_trail WHERE row_hash <> '' ORDER BY chain_idx ASC;" \
  2>&1 | grep -v "could not change directory"

echo ""
echo "=== verify chain integrity each row hashes to its declared row_hash ==="
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web \
  -c "SET app.tenant_id = '1'; SELECT id, action, chain_idx, CASE WHEN row_hash = encode(digest(tenant_id || '|' || chain_idx || '|' || COALESCE(prev_hash, '') || '|' || action || '|' || module || '|' || new_values || '|' || COALESCE(user_id::text, ''), 'sha256'), 'hex') THEN 'OK' ELSE 'BROKEN' END AS chain_check FROM audit_trail WHERE row_hash <> '' ORDER BY chain_idx ASC;" \
  2>&1 | grep -v "could not change directory"
