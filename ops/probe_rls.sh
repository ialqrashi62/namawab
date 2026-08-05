#!/bin/bash
# probe_rls.sh — determine RLS state and bypass strategy
tr -d '\r' < /var/www/namaweb/.env > /tmp/env_clean
. /tmp/env_clean
export PGPASSWORD="$DB_PASSWORD"
echo "--- table owner of admin_resource_logs ---"
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -At -c "SELECT tableowner FROM pg_tables WHERE tablename='admin_resource_logs'"
echo "--- relrowsecurity on admin_resource_logs ---"
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -At -c "SELECT relrowsecurity FROM pg_class WHERE relname='admin_resource_logs'"
echo "--- is app user a superuser ---"
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -At -c "SELECT rolsuper FROM pg_roles WHERE rolname='nama_medical_app'"
echo "--- count of RLS-enabled tables ---"
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -At -c "SELECT count(*) FROM pg_class WHERE relrowsecurity = true"
echo "--- try pg_dump with row_security=off pre-command ---"
PGOPTIONS='--client-min-messages=warning' psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SET row_security = off; SELECT count(*) FROM admin_resource_logs;" 2>&1
