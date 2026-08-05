set -uo pipefail
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
set -a
. <(grep -E '^(DB_HOST|DB_PORT|DB_NAME|DB_USER|DB_PASSWORD)=' "${ENV_FILE}" | tr -d '\r')
set +a
export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" PGDATABASE="$DB_NAME" PGPASSWORD="$DB_PASSWORD"

echo "Test 1: connection"
psql -tAc 'SHOW server_version'
echo "Test 1 RC=$?"

echo ""
echo "Test 2: pg_stat_activity count"
psql -tAc "SELECT count(*) FROM pg_stat_activity;"
echo "Test 2 RC=$?"

echo ""
echo "Test 3: max_connections"
psql -tAc "SHOW max_connections;"
echo "Test 3 RC=$?"

echo ""
echo "Test 4: long-running queries"
psql -tAc "SELECT count(*) FROM pg_stat_activity WHERE state='active' AND now()-query_start > interval '5 minutes';"
echo "Test 4 RC=$?"

echo ""
echo "Test 5: orphan downs (small)"
ls /var/www/namaweb/migrations/*_down.sql 2>/dev/null | head -3
echo "Test 5 RC=$?"

echo ""
echo "DONE"
