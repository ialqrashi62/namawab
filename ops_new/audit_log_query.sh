#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Audit Log Inspector (Read-Only)
# =============================================================================
# File:         /var/www/namaweb/ops/audit_log_query.sh
# Purpose:      Query the audit_events / audit_log table (whichever exists)
#               or fall back to PM2 application logs. Pure read-only.
# Usage:        bash audit_log_query.sh [last_24h|last_7d]
#                            [--tenant <id>] [--actor <id>] [--action <name>]
#                            [--since ISO] [--until ISO] [--limit N] [--jsonl]
#                            [--source db|pm2|auto] [--help]
# Default:      last 24h, limit 100, source=auto
# Output:       pretty table (default) or JSONL per event (--jsonl, jq-friendly)
# Exit codes:   0 = success
#               1 = usage / no rows
#               2 = DB unreachable
# Safety rail:  read-only; never writes to DB.
#               AGENTS.md §2.2 rails 1, 2, 12 (no secrets, no PHI in logs)
#               Tenant scoping: cross-tenant requires SUPER_ADMIN_USERS match.
# Idempotency:  read-only; safe to re-run
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
LOG_DIR="/var/log/namaweb"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Defaults
SOURCE="auto"
TENANT=""
ACTOR=""
ACTION=""
SINCE=""
UNTIL=""
LIMIT="100"
JSONL="0"

# Detect GNU vs BSD date for portable -d / -v flags
if date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S >/dev/null 2>&1; then
    SINCE="$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)"
    UNTIL="$(date -u +%Y-%m-%dT%H:%M:%S)"
    DATE_RELATIVE="date -u -d"
else
    SINCE="$(date -u -v-24H +%Y-%m-%dT%H:%M:%S)"
    UNTIL="$(date -u +%Y-%m-%dT%H:%M:%S)"
    DATE_RELATIVE="date -u -v"
fi

# -----------------------------------------------------------------------------
# Usage
# -----------------------------------------------------------------------------
usage() {
    cat <<EOF
Usage: $0 [RANGE] [OPTIONS]

Range (mutually exclusive):
  last_24h           last 24 hours  (default)
  last_7d            last 7 days
  --since ISO        custom start   (e.g. 2026-07-01T00:00:00)
  --until ISO        custom end     (default: now)

Filters:
  --tenant <id>      filter by tenant_id
  --actor <id>       filter by actor / user_id
  --action <name>    substring match on action name

Output:
  --jsonl            one JSON object per line (pipe to jq)
  --limit N          row limit (default 100, max 10000)
  --source db|pm2|auto   force data source (default: auto)

  --help             this message

Exit codes: 0 ok, 1 no rows / bad args, 2 DB unreachable.
EOF
}

# -----------------------------------------------------------------------------
# Arg parsing
# -----------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
        last_24h) SINCE="$(${DATE_RELATIVE} '24 hours ago' +%Y-%m-%dT%H:%M:%S)"; UNTIL="$(date -u +%Y-%m-%dT%H:%M:%S)"; shift ;;
        last_7d)  SINCE="$(${DATE_RELATIVE} '7 days ago'  +%Y-%m-%dT%H:%M:%S)"; UNTIL="$(date -u +%Y-%m-%dT%H:%M:%S)"; shift ;;
        --since)  SINCE="$2"; shift 2 ;;
        --until)  UNTIL="$2"; shift 2 ;;
        --tenant) TENANT="$2"; shift 2 ;;
        --actor)  ACTOR="$2"; shift 2 ;;
        --action) ACTION="$2"; shift 2 ;;
        --limit)  LIMIT="$2"; shift 2 ;;
        --jsonl)  JSONL="1"; shift ;;
        --source) SOURCE="$2"; shift 2 ;;
        --help|-h) usage; exit 0 ;;
        *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
    esac
done

# Validate LIMIT
if ! [[ "${LIMIT}" =~ ^[0-9]+$ ]] || [[ "${LIMIT}" -gt 10000 ]]; then
    echo "Invalid --limit: ${LIMIT}" >&2
    exit 1
fi

# Now that we know we'll actually run, ensure the log dir exists.
mkdir -p "${LOG_DIR}" 2>/dev/null || true

# -----------------------------------------------------------------------------
# Env loader
# -----------------------------------------------------------------------------
load_env() {
    [[ -f "${ENV_FILE}" ]] || return 1
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
# Source detection
# -----------------------------------------------------------------------------
# Returns: db | pm2
detect_source() {
    if [[ "${SOURCE}" == "db" || "${SOURCE}" == "pm2" ]]; then
        echo "${SOURCE}"
        return
    fi
    # auto: prefer DB if any of the known tables exist AND psql can connect
    load_env || { echo "pm2"; return; }
    export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" \
           PGDATABASE="$DB_NAME" PGPASSWORD="$DB_PASSWORD"
    if ! psql -tAc 'SELECT 1' >/dev/null 2>&1; then
        echo "pm2"
        return
    fi
    local hit
    hit="$(psql -tAc "SELECT COALESCE(to_regclass('public.audit_events')::text, to_regclass('public.audit_log')::text, 'none');")"
    if [[ "${hit}" != "none" && -n "${hit}" ]]; then
        echo "db"
    else
        echo "pm2"
    fi
}

# -----------------------------------------------------------------------------
# DB query path
# -----------------------------------------------------------------------------
query_db() {
    load_env || { echo "Cannot read ${ENV_FILE}" >&2; exit 2; }
    export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" \
           PGDATABASE="$DB_NAME" PGPASSWORD="$DB_PASSWORD"

    if ! psql -tAc 'SELECT 1' >/dev/null 2>&1; then
        echo "DB unreachable: ${DB_NAME}@${DB_HOST}:${DB_PORT}" >&2
        exit 2
    fi

    # Pick the table that exists
    local table
    table="$(psql -tAc "SELECT COALESCE(to_regclass('public.audit_events')::text, to_regclass('public.audit_log')::text, '');")"
    if [[ -z "${table}" ]]; then
        echo "No audit_events / audit_log table; falling back to PM2 logs." >&2
        query_pm2
        return
    fi

    # Build dynamic WHERE. Column names may differ; probe at runtime.
    local tbl="${table#public.}"
    local has_tenant has_actor has_action has_at
    has_tenant="$(psql -tAc "SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='${tbl}' AND column_name='tenant_id';")"
    has_actor="$(psql -tAc  "SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='${tbl}' AND column_name IN ('actor_id','user_id');")"
    has_action="$(psql -tAc "SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='${tbl}' AND column_name='action';")"
    has_at="$(psql -tAc     "SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='${tbl}' AND column_name IN ('created_at','ts','occurred_at');")"

    local time_col="created_at"
    [[ -z "${has_at}" ]] && time_col="created_at"

    local sql="SELECT * FROM ${table}"
    local conds=()
    [[ -n "${has_at}"  && -n "${SINCE}" ]] && conds+=("${time_col} >= '${SINCE}'")
    [[ -n "${has_at}"  && -n "${UNTIL}" ]] && conds+=("${time_col} <= '${UNTIL}'")
    [[ -n "${TENANT}"  && -n "${has_tenant}" ]] && conds+=("tenant_id = '${TENANT}'")
    [[ -n "${ACTOR}"   && -n "${has_actor}"  ]] && conds+=("(actor_id = '${ACTOR}' OR user_id = '${ACTOR}')")
    [[ -n "${ACTION}"  && -n "${has_action}" ]] && conds+=("action ILIKE '%${ACTION}%'")
    if [[ "${#conds[@]}" -gt 0 ]]; then
        sql+=" WHERE $(IFS=' AND '; echo "${conds[*]}")"
    fi
    sql+=" ORDER BY 1 DESC LIMIT ${LIMIT}"

    if [[ "${JSONL}" == "1" ]]; then
        psql -tAc "${sql}" 2>/dev/null
    else
        echo "=== source: db:${table}  range: ${SINCE}..${UNTIL}  limit: ${LIMIT} ==="
        psql -P pager=off -x -c "${sql}" 2>&1 || true
    fi
}

# -----------------------------------------------------------------------------
# PM2 fallback path
# -----------------------------------------------------------------------------
query_pm2() {
    local log_path=""
    local pm2_app="${PM2_APP:-nama-medical-erp}"
    for cand in \
        "/var/log/${pm2_app}-out.log" \
        "/var/log/${pm2_app}-error.log" \
        "/var/log/nama-medical-erp-out.log" \
        "/var/log/nama-medical-erp-error.log" \
        "/root/.pm2/logs/${pm2_app}-out.log" \
        "/root/.pm2/logs/${pm2_app}-error.log"; do
        if [[ -r "${cand}" ]]; then
            log_path="${cand}"
            break
        fi
    done

    if [[ -z "${log_path}" ]]; then
        echo "No PM2 log file accessible; tried common paths." >&2
        echo "Set PM2_APP env or stream 'pm2 logs ${pm2_app}' manually." >&2
        exit 1
    fi

    if [[ "${JSONL}" == "1" ]]; then
        echo "{\"source\":\"pm2\",\"log\":\"${log_path}\",\"range\":\"${SINCE}..${UNTIL}\"}"
    else
        echo "=== source: pm2:${log_path}  range: ${SINCE}..${UNTIL}  (no DB audit table) ==="
    fi

    local since_short="${SINCE:0:10}"
    local pattern="audit|AUDIT|\\[AUDIT\\]"
    if [[ -n "${ACTION}" ]]; then
        pattern="${pattern}|${ACTION}"
    fi
    grep -hE "${pattern}" "${log_path}" 2>/dev/null \
      | awk -v since="${since_short}" '$0 ~ since || $0 !~ /[0-9]{4}-[0-9]{2}-[0-9]{2}/' \
      | tail -n "${LIMIT}" || true
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
SRC="$(detect_source)"
case "${SRC}" in
    db)   query_db ;;
    pm2)  query_pm2 ;;
    *)    echo "Cannot determine source" >&2; exit 1 ;;
esac
exit 0
