#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Daily Database Health Check
# =============================================================================
# File:         /var/www/namaweb/ops/db_health_check.sh
# Purpose:      Daily diagnostic sweep: connection, table count, RLS coverage,
#               migration drift, disk usage, long-running queries, connection
#               saturation. Emits a human-readable report.
# Schedule:     cron daily 03:00 UTC (see ops/INSTALL.md)
# Output:       /var/log/namaweb/db_health_YYYY-MM-DD.log
#               (also echoes to stdout for cron mail)
# Safety rail:  reads DB_* from /var/www/namaweb/.env (no hardcoded secrets)
#               AGENTS.md §2.2 rail 1 — observed
#               Never DELETEs or mutates DB state.
# Thresholds:   env-overridable (DISK_WARN_PCT, DISK_CRIT_PCT,
#               RLS_DRIFT_WARN, CONN_PCT_WARN)
# Exit codes:   0 = all checks OK
#               1 = warning threshold breached (disk >80%, RLS drift, etc.)
#               2 = critical / unreachable (disk >95%, DB down)
# Idempotency:  safe to re-run any time; read-only
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
MIGRATIONS_DIR="${APP_ROOT}/migrations"
LOG_DIR="/var/log/namaweb"
DATE_TAG="$(date -u +%Y-%m-%d)"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LOG_FILE="${LOG_DIR}/db_health_${DATE_TAG}.log"

# Thresholds (env-overridable)
DISK_WARN_PCT="${DISK_WARN_PCT:-80}"
DISK_CRIT_PCT="${DISK_CRIT_PCT:-95}"
RLS_DRIFT_WARN="${RLS_DRIFT_WARN:-5}"   # warn if expected-rls differs by N+
CONN_PCT_WARN="${CONN_PCT_WARN:-80}"    # warn if used/max connections ≥ N%
LONG_QUERY_SEC="${LONG_QUERY_SEC:-60}"  # warn if any query > N seconds

# Show help and exit early — before any side effects (mkdir, DB connect).
# (Mirrors the convention in backup_db_auto.sh / safety_audit.sh.)
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat <<EOF
Usage: $0 [--help]

Reads DB connection from ${APP_ROOT}/.env, runs health checks via psql,
and writes a per-day log to ${LOG_DIR}/db_health_YYYY-MM-DD.log.

Thresholds (env overrides):
  DISK_WARN_PCT         (default ${DISK_WARN_PCT})
  DISK_CRIT_PCT         (default ${DISK_CRIT_PCT})
  RLS_DRIFT_WARN        (default ${RLS_DRIFT_WARN})
  CONN_PCT_WARN         (default ${CONN_PCT_WARN})
  LONG_QUERY_SEC        (default ${LONG_QUERY_SEC})

Exit codes:
  0  all checks OK
  1  warning threshold breached
  2  critical (DB unreachable, disk ≥${DISK_CRIT_PCT}%, etc.)
EOF
    exit 0
fi

mkdir -p "${LOG_DIR}" 2>/dev/null || true

# Severity counters
WARN=0
CRIT=0
LINES=()

record() {
    # record <severity> <message>   severity in {ok, warn, crit, info}
    local sev="$1"; shift
    case "${sev}" in
        ok)   LINES+=("OK    $*") ;;
        info) LINES+=("INFO  $*") ;;
        warn) LINES+=("WARN  $*"); WARN=$((WARN+1)) ;;
        crit) LINES+=("CRIT  $*"); CRIT=$((CRIT+1)) ;;
        *)    LINES+=("      $*") ;;
    esac
}

# -----------------------------------------------------------------------------
# Env loader (same pattern as backup_db_auto.sh)
# -----------------------------------------------------------------------------
load_env() {
    [[ -f "${ENV_FILE}" ]] || { record crit ".env missing at ${ENV_FILE}"; return 1; }
    local env_tmp
    env_tmp="$(mktemp)"
    tr -d '\r' < "${ENV_FILE}" > "${env_tmp}"
    # shellcheck disable=SC1090
    set -a
    # shellcheck disable=SC1090
    source "${env_tmp}"
    set +a
    rm -f "${env_tmp}"
}

# -----------------------------------------------------------------------------
# Checks
# -----------------------------------------------------------------------------
check_connection() {
    if ! command -v psql >/dev/null 2>&1; then
        record crit "psql not on PATH"
        return 1
    fi
    export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" \
           PGDATABASE="$DB_NAME" PGPASSWORD="$DB_PASSWORD"
    local version
    if version="$(psql -tAc 'SHOW server_version' 2>/dev/null)"; then
        record ok "connection: ${DB_NAME}@${DB_HOST}:${DB_PORT} (PG ${version})"
    else
        record crit "connection FAILED to ${DB_NAME}@${DB_HOST}:${DB_PORT}"
        return 1
    fi
}

check_table_counts() {
    local total rls
    total="$(psql -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")"
    rls="$(psql -tAc "SELECT count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity=true;")"
    if [[ -z "${total}" || -z "${rls}" ]]; then
        record crit "table count query returned empty"
        return 1
    fi
    record ok "tables: ${total} public, ${rls} with RLS enabled"
}

check_rls_drift() {
    # Drift = tables that the audit baseline says should be RLS but aren't.
    # Without an external baseline file, we surface the raw ratio. If a
    # baseline file is dropped at $APP_ROOT/ops/rls_baseline.txt (one table
    # name per line) we use it; otherwise we record the live count and move on.
    local rls
    rls="$(psql -tAc "SELECT count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity=true;")"
    if [[ -f "${APP_ROOT}/ops/rls_baseline.txt" ]]; then
        local expected
        expected="$(wc -l < "${APP_ROOT}/ops/rls_baseline.txt" | tr -d ' ')"
        local diff=$(( expected - rls ))
        if [[ "${diff#-}" -gt "${RLS_DRIFT_WARN}" ]]; then
            record warn "RLS drift: live=${rls} expected=${expected} (Δ=${diff})"
        else
            record ok "RLS drift: live=${rls} expected=${expected} (Δ=${diff})"
        fi
    else
        record info "RLS drift: no baseline file (live=${rls}); create ${APP_ROOT}/ops/rls_baseline.txt to enable drift check"
    fi
}

check_migrations() {
    if [[ ! -d "${MIGRATIONS_DIR}" ]]; then
        record warn "migrations dir missing: ${MIGRATIONS_DIR}"
        return 0
    fi
    local up_files
    up_files="$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_up.sql' | wc -l)"
    local down_files
    down_files="$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_down.sql' | wc -l)"
    local orphan_downs
    # `local` is forbidden in pipe subshells and `set -o pipefail` would
    # propagate `while read` returning 1 on EOF. Workaround: capture the
    # whole loop output into a variable via process substitution.
    local orphan_list=""
    orphan_list="$(find "${MIGRATIONS_DIR}" -maxdepth 1 -type f -name '*_down.sql' \
        -exec sh -c 'for f; do base="${f%_down.sql}"; [ -f "${base}_up.sql" ] || echo "$f"; done' _ {} +)"
    if [[ -z "${orphan_list}" ]]; then
        orphan_downs="0"
    else
        orphan_downs="$(printf '%s\n' "${orphan_list}" | wc -l)"
    fi
    if [[ "${up_files}" -eq 0 ]]; then
        record warn "no *_up.sql migrations found"
    else
        record ok "migrations: ${up_files} up, ${down_files} down"
        if [[ "${orphan_downs}" -gt 0 ]]; then
            record warn "orphan down migrations (no matching up): ${orphan_downs}"
        fi
    fi
    local latest
    latest="$(ls -1t "${MIGRATIONS_DIR}"/*_up.sql 2>/dev/null | head -1 || true)"
    if [[ -n "${latest}" ]]; then
        record info "latest: $(basename "${latest}")"
    fi
}

check_disk() {
    # DB data dir + web root + /var (catch-all).
    local targets=("/var/lib/postgresql" "/var/www" "/var")
    local target pct
    for target in "${targets[@]}"; do
        [[ -d "${target}" ]] || continue
        read -r _ _ _ _ pct _ < <(df -P "${target}" | tail -1)
        pct="${pct%\%}"
        if [[ "${pct}" -ge "${DISK_CRIT_PCT}" ]]; then
            record crit "disk: ${target} ${pct}% used (≥${DISK_CRIT_PCT}%)"
        elif [[ "${pct}" -ge "${DISK_WARN_PCT}" ]]; then
            record warn "disk: ${target} ${pct}% used (≥${DISK_WARN_PCT}%)"
        else
            record ok "disk: ${target} ${pct}% used"
        fi
    done
}

check_slow_queries() {
    # Requires pg_stat_statements; if not present, skip with INFO.
    local ext
    ext="$(psql -tAc "SELECT extname FROM pg_extension WHERE extname='pg_stat_statements';")"
    if [[ -z "${ext}" ]]; then
        record info "pg_stat_statements: not installed (skipping slow query check)"
        return 0
    fi
    local n
    n="$(psql -tAc "SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > ${LONG_QUERY_SEC}*1000;" 2>/dev/null || echo "")"
    if [[ -z "${n}" ]]; then
        record info "slow queries: pg_stat_statements present but query failed"
    elif [[ "${n}" -gt 0 ]]; then
        record warn "slow queries: ${n} statement(s) with mean_exec_time > ${LONG_QUERY_SEC}s"
        # Capture stdout of psql into a variable (not a subshell) so we can
        # call record (which mutates LINES) for each line.
        local top
        top="$(psql -tAc "SELECT '  - ' || round(mean_exec_time::numeric/1000,2) || 's ' || substring(query,1,80) FROM pg_stat_statements WHERE mean_exec_time > ${LONG_QUERY_SEC}*1000 ORDER BY mean_exec_time DESC LIMIT 3;" 2>/dev/null || true)"
        if [[ -n "${top}" ]]; then
            while IFS= read -r l; do
                [[ -n "${l}" ]] && record info "${l}"
            done <<< "${top}"
        fi
    else
        record ok "slow queries: none > ${LONG_QUERY_SEC}s mean"
    fi
}

check_connections() {
    local used max
    used="$(psql -tAc "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null || echo "")"
    max="$(psql -tAc "SHOW max_connections;" 2>/dev/null | tr -d ' ' || echo "")"
    if [[ -z "${used}" || -z "${max}" || "${max}" -eq 0 ]]; then
        record info "connections: unable to read stats"
        return 0
    fi
    local pct=$(( used * 100 / max ))
    if [[ "${pct}" -ge "${CONN_PCT_WARN}" ]]; then
        record warn "connections: ${used}/${max} (${pct}%)"
    else
        record ok "connections: ${used}/${max} (${pct}%)"
    fi
}

check_long_running() {
    # Any active query > 5 minutes — likely a stuck transaction
    local n
    n="$(psql -tAc "SELECT count(*) FROM pg_stat_activity WHERE state='active' AND now()-query_start > interval '5 minutes';" 2>/dev/null || echo "")"
    if [[ -z "${n}" ]]; then
        record info "long-running: query failed"
    elif [[ "${n}" -gt 0 ]]; then
        record warn "long-running: ${n} active query(ies) > 5 minutes"
    else
        record ok "long-running: none > 5 minutes"
    fi
}

# -----------------------------------------------------------------------------
# Emitter
# -----------------------------------------------------------------------------
emit_report() {
    {
        echo "================================================================"
        echo " NamaMedical DB Health — ${TS}"
        echo "================================================================"
        printf ' %s\n' "${LINES[@]}"
        echo "----------------------------------------------------------------"
        echo " Summary: ${WARN} warning(s), ${CRIT} critical"
        echo "================================================================"
    } | tee -a "${LOG_FILE}"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
    load_env || true
    record info "host=$(hostname -f 2>/dev/null || hostname) ts=${TS}"

    check_connection         || true
    if [[ "${CRIT}" -gt 0 ]]; then
        # DB unreachable: skip downstream DB checks but still report disk/migration
        record info "skipping remaining DB checks (unreachable)"
        check_disk
        check_migrations
        emit_report
        exit 2
    fi

    check_table_counts
    check_rls_drift
    check_migrations
    check_disk
    check_slow_queries
    check_connections
    check_long_running

    emit_report

    if [[ "${CRIT}" -gt 0 ]]; then
        exit 2
    fi
    if [[ "${WARN}" -gt 0 ]]; then
        exit 1
    fi
    exit 0
}

main "$@"
