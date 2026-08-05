set -euo pipefail
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
MIGRATIONS_DIR="${APP_ROOT}/migrations"

set -a
. <(grep -E '^(DB_HOST|DB_PORT|DB_NAME|DB_USER|DB_PASSWORD)=' "${ENV_FILE}" | tr -d '\r')
set +a
export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" PGDATABASE="$DB_NAME" PGPASSWORD="$DB_PASSWORD"

WARN=0
CRIT=0
LINES=()
record() {
    local sev="$1"; shift
    case "${sev}" in
        ok)   LINES+=("OK    $*") ;;
        info) LINES+=("INFO  $*") ;;
        warn) LINES+=("WARN  $*"); WARN=$((WARN+1)) ;;
        crit) LINES+=("CRIT  $*"); CRIT=$((CRIT+1)) ;;
        *)    LINES+=("      $*") ;;
    esac
}

echo "Step 1: check_migrations in isolation"
up_files="$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_up.sql' | wc -l)"
echo "up_files=[$up_files]"
down_files="$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_down.sql' | wc -l)"
echo "down_files=[$down_files]"

echo ""
echo "Step 2: orphan_downs"
orphan_downs="$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_down.sql' \
    | while read -r d; do
        local base="${d%_down.sql}"
        [[ ! -f "${base}_up.sql" ]] && echo "${d}"
      done | wc -l)"
echo "orphan_downs=[$orphan_downs]"

echo ""
echo "Step 3: if/else"
if [[ "${up_files}" -eq 0 ]]; then
    record warn "no *_up.sql migrations found"
else
    record ok "migrations: ${up_files} up, ${down_files} down"
    if [[ "${orphan_downs}" -gt 0 ]]; then
        record warn "orphan down migrations (no matching up): ${orphan_downs}"
    fi
fi
echo "Step 3 RC=$?"
echo "LINES count: ${#LINES[@]}"

echo ""
echo "Step 4: latest"
latest="$(ls -1t "${MIGRATIONS_DIR}"/*_up.sql 2>/dev/null | head -1 || true)"
echo "latest=[$latest]"

echo ""
echo "Step 5: emit_report in isolation"
emit() {
    {
        echo "================================================================"
        printf ' %s\n' "${LINES[@]}"
        echo " Summary: ${WARN} warning(s), ${CRIT} critical"
        echo "================================================================"
    } | cat
}
emit
echo "DONE"
