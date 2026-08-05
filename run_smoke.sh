#!/bin/bash
echo "=== .env password vars (key=value preview) ==="
grep -E "^DB_PASSWORD|^DATABASE_URL|^DB_APP_PASSWORD" /var/www/namaweb/.env 2>/dev/null | awk -F= '{
  if (NF >= 2) printf "%s=%s***\n", $1, substr($2,1,3);
  else print $0
}'
echo ""
echo "=== extracting just the password ==="
P=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env 2>/dev/null | cut -d= -f2- | tr -d "\r\n")
if [ -z "$P" ]; then
  URL=$(grep "^DATABASE_URL=" /var/www/namaweb/.env 2>/dev/null | cut -d= -f2- | tr -d "\r\n")
  echo "URL=$URL"
  P=$(echo "$URL" | sed -E "s#.*://[^:]+:(.+)@.*#\1#")
fi
echo "Password: ${P:0:4}***"
echo ""
echo "=== smoke test with real password (tenant 1 set) ==="
PGPASSWORD="$P" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c "SET app.tenant_id = '1'; SELECT count(*) AS rows_visible FROM medical_records;" 2>&1 | grep -v "could not change directory"
echo ""
echo "=== fail-closed smoke (no tenant context) ==="
PGPASSWORD="$P" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c "SELECT count(*) AS rows_visible_no_ctx FROM medical_records;" 2>&1 | grep -v "could not change directory"
