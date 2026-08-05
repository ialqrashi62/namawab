set -uo pipefail
# Mirror of db_health_check.sh, with extra tracing
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
MIGRATIONS_DIR="${APP_ROOT}/migrations"
LOG_DIR="/var/log/namaweb"
mkdir -p "${LOG_DIR}"

set -a
. <(grep -E '^(DB_HOST|DB_PORT|DB_NAME|DB_USER|DB_PASSWORD)=' "${ENV_FILE}" | tr -d '\r')
set +a

export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" PGDATABASE="$DB_NAME" PGPASSWORD="$DB_PASSWORD"

echo "Test 1: connection"
psql -tAc 'SHOW server_version' || echo "DB CONN FAIL"

echo ""
echo "Test 2: table counts"
psql -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" || echo "TABLE COUNT FAIL"

echo ""
echo "Test 3: rls counts"
psql -tAc "SELECT count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity=true;" || echo "RLS COUNT FAIL"

echo ""
echo "Test 4: disk df"
df -P /var/lib/postgresql /var/www /var

echo ""
echo "Test 5: slow queries (extension check)"
psql -tAc "SELECT extname FROM pg_extension WHERE extname='pg_stat_statements';"

echo ""
echo "Test 6: connections"
psql -tAc "SELECT count(*) FROM pg_stat_activity;" 2>&1
psql -tAc "SHOW max_connections;" 2>&1

echo ""
echo "Test 7: long-running"
psql -tAc "SELECT count(*) FROM pg_stat_activity WHERE state='active' AND now()-query_start > interval '5 minutes';" 2>&1

echo ""
echo "Test 8: orphan_downs check"
COUNT=$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_down.sql' \
  | while read -r d; do
      base="${d%_down.sql}"
      [[ ! -f "${base}_up.sql" ]] && echo "${d}"
    done | wc -l)
echo "Orphan downs: $COUNT"

echo ""
echo "DONE"
