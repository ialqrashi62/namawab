#!/bin/bash
# probe2.sh - test postgres peer auth + RLS bypass via postgres user
echo "=== peer auth test as postgres ==="
sudo -u postgres psql -c "SELECT current_user, session_user;"
echo "=== try pg_dump as postgres (RLS bypass) ==="
sudo -u postgres pg_dump -d nama_medical_web -Fc --no-owner --no-privileges 2>&1 | head -c 200
echo ""
echo "=== test schema-only dump as nama_medical_app (RLS doesnt affect schema) ==="
tr -d '\r' < /var/www/namaweb/.env > /tmp/env_clean
. /tmp/env_clean
export PGPASSWORD="$DB_PASSWORD"
pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" -Fc --schema-only --no-owner --no-privileges 2>&1 | head -c 200
echo ""
echo "=== count of admin_resource_logs rows visible to app user with default RLS ==="
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SET app.current_tenant_id = 'tenant-1'; SELECT count(*) FROM admin_resource_logs;" 2>&1 | head -10
