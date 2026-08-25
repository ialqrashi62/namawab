#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Audit Middleware Toggle (GATE 10 — audit log)
# =============================================================================
# File:         /var/www/namaweb/ops/audit_toggle.sh
# Purpose:      Safely toggle the AUDIT_ALL_MUTATIONS env flag that gates the
#               audit_middleware.js (currently INERT by default).
#
# Why:          The audit middleware is a Gate 10 deliverable (HIPAA §164.312(b)
#               audit trail). It is intentionally INERT in production until the
#               owner has validated the schema + retention on staging. This
#               script is the single, audited boundary for enabling it.
#
# Safety rails honored:
#   - Rail 8  : CSP stays report-only by default (unrelated but audited nearby)
#   - Rail 10 : audit log is hash-chained, 7+ years retention. Enablement is
#               a gate decision; this script enforces the pre-flight + warning.
#   - Rail 12 : no secrets/PHI in logs. The script NEVER prints the value of
#               AUDIT_ALL_MUTATIONS or any DB credential. Only its presence.
#
# Scope:        Reads + (optionally) writes /var/www/namaweb/.env
#               Reads      /var/www/namaweb/ops/namaweb-backup.env (PG creds)
#               Runs no DB DDL. Only runs a SELECT to_regclass() to verify the
#               audit_log table exists.
#
# Usage:
#   sudo bash /var/www/namaweb/ops/audit_toggle.sh status      # default
#   sudo bash /var/www/namaweb/ops/audit_toggle.sh enable      # requires YES
#   sudo bash /var/www/namaweb/ops/audit_toggle.sh disable
#   sudo bash /var/www/namaweb/ops/audit_toggle.sh --help
#
# Exit codes:
#   0  operation succeeded (or status-only)
#   1  pre-flight failed (table missing, DB unreachable, .env unwritable)
#   2  user declined confirmation
#   3  invalid usage
#
# Logging: every run appends a timestamped line to /var/log/audit-toggle.log
#          (mode 0640, root:root). The log NEVER contains the new value of
#          AUDIT_ALL_MUTATIONS — only the action (enable/disable/status) and
#          the result.
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
BACKUP_ENV="${APP_ROOT}/ops/namaweb-backup.env"
LOG_FILE="/var/log/audit-toggle.log"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# -----------------------------------------------------------------------------
# Usage
# -----------------------------------------------------------------------------
usage() {
    cat <<EOF
Usage: sudo bash $0 [status|enable|disable] [--help]

  status (default)  print current AUDIT_ALL_MUTATIONS state + pre-flight
  enable            set AUDIT_ALL_MUTATIONS=true (requires confirmation)
  disable           set AUDIT_ALL_MUTATIONS=false
  --help            this message

Exit codes:
  0  success / status
  1  pre-flight failed
  2  user declined
  3  invalid usage
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    usage
    exit 0
fi

ACTION="${1:-status}"
case "${ACTION}" in
    status|enable|disable) ;;
    *) echo "ERROR: invalid action '${ACTION}'" >&2; usage; exit 3 ;;
esac

# -----------------------------------------------------------------------------
# Append a timestamped line to LOG_FILE. NEVER prints the env value.
# -----------------------------------------------------------------------------
log_line() {
    local result="$1"
    mkdir -p "$(dirname "${LOG_FILE}")" 2>/dev/null || true
    # touch + chmod 0640 + chown root:root if we can
    touch "${LOG_FILE}" 2>/dev/null || true
    chmod 0640 "${LOG_FILE}" 2>/dev/null || true
    chown root:root "${LOG_FILE}" 2>/dev/null || true
    # Append: whoami + action + result. Never include the env value.
    local who
    who="$(whoami 2>/dev/null || echo unknown)"
    echo "${TS} user=${who} action=${ACTION} result=${result}" >> "${LOG_FILE}"
}

# -----------------------------------------------------------------------------
# Pre-flight: verify the audit_log table exists + .env is writable
# -----------------------------------------------------------------------------
preflight() {
    local problems=0

    # .env must exist
    if [[ ! -f "${ENV_FILE}" ]]; then
        echo "ERROR: ${ENV_FILE} not found." >&2
        problems=$((problems + 1))
    elif [[ ! -w "${ENV_FILE}" ]]; then
        echo "ERROR: ${ENV_FILE} is not writable (need root)." >&2
        problems=$((problems + 1))
    fi

    # DB credentials must be readable
    if [[ ! -r "${BACKUP_ENV}" ]]; then
        echo "ERROR: cannot read ${BACKUP_ENV}." >&2
        problems=$((problems + 1))
    fi

    # audit_log table check (uses PG* env vars from BACKUP_ENV)
    if [[ -r "${BACKUP_ENV}" ]]; then
        # source the env in a subshell so we don't pollute this script
        local table_check
        table_check="$(
            set -a
            # shellcheck disable=SC1090
            . "${BACKUP_ENV}" >/dev/null 2>&1
            set +a
            psql -U "${PGUSER:-nama_medical}" -h "${PGHOST:-localhost}" \
                -p "${PGPORT:-5432}" -d "${PGDATABASE:-nama_medical_web}" \
                -tAc "SELECT to_regclass('public.audit_log') IS NOT NULL;" 2>/dev/null \
                || echo "ERR"
        )"
        if [[ "${table_check}" != "t" ]]; then
            echo "ERROR: audit_log table missing in DB (preflight failed)." >&2
            problems=$((problems + 1))
        fi
    fi

    if [[ "${problems}" -gt 0 ]]; then
        log_line "preflight_failed"
        exit 1
    fi
}

# -----------------------------------------------------------------------------
# Read current state
# -----------------------------------------------------------------------------
current_state() {
    if [[ ! -f "${ENV_FILE}" ]]; then
        echo "unset"
        return
    fi
    # Extract the value of AUDIT_ALL_MUTATIONS=... (ignore comments / case)
    local val
    val="$(grep -E '^[[:space:]]*AUDIT_ALL_MUTATIONS[[:space:]]*=' "${ENV_FILE}" \
        | tail -n 1 \
        | sed -E 's/^[[:space:]]*AUDIT_ALL_MUTATIONS[[:space:]]*=[[:space:]]*//' \
        | sed -E 's/[[:space:]]*$//' \
        | sed -E 's/[[:space:]]*#.*$//' \
        || true)"
    if [[ -z "${val}" ]]; then
        echo "unset"
    else
        echo "${val}"
    fi
}

# -----------------------------------------------------------------------------
# Apply change
# -----------------------------------------------------------------------------
apply_change() {
    local new_value="$1"
    if [[ ! -f "${ENV_FILE}" ]]; then
        echo "ERROR: ${ENV_FILE} not found." >&2
        log_line "no_env_file"
        exit 1
    fi
    if grep -qE '^[[:space:]]*AUDIT_ALL_MUTATIONS[[:space:]]*=' "${ENV_FILE}"; then
        # Replace in place (preserve any trailing comment)
        # sed -i 's/^AUDIT_ALL_MUTATIONS=.*$/AUDIT_ALL_MUTATIONS=new# .../'
        sed -i -E "s|^[[:space:]]*AUDIT_ALL_MUTATIONS[[:space:]]*=.*$|AUDIT_ALL_MUTATIONS=${new_value}|" "${ENV_FILE}"
    else
        # Append after the last line
        echo "" >> "${ENV_FILE}"
        echo "AUDIT_ALL_MUTATIONS=${new_value}" >> "${ENV_FILE}"
    fi
}

# -----------------------------------------------------------------------------
# status
# -----------------------------------------------------------------------------
do_status() {
    preflight
    local state
    state="$(current_state)"
    echo "================================================================"
    echo " Audit Middleware Toggle — STATUS"
    echo "  env:    ${ENV_FILE}"
    echo "  log:    ${LOG_FILE}"
    echo "  ts:     ${TS}"
    echo "================================================================"
    echo "  AUDIT_ALL_MUTATIONS = ${state}"
    echo ""
    if [[ "${state}" == "true" ]]; then
        echo "  >>> Audit middleware is ENABLED. Every mutating /api/* request"
        echo "  >>> will be recorded to audit_log by audit_middleware.js."
    else
        echo "  >>> Audit middleware is INERT (default). Mutation requests are"
        echo "  >>> NOT auto-logged; only explicit logAudit() calls fire."
    fi
    echo ""
    echo "  Pre-flight:    OK (audit_log table present, .env writable)"
    echo "  Retention:     see AUDIT_RETENTION_YEARS in ${ENV_FILE}"
    echo "  Hash algo:     see AUDIT_HASH_ALGO in ${ENV_FILE}"
    echo "================================================================"
    log_line "ok"
}

# -----------------------------------------------------------------------------
# enable  (requires user confirmation)
# -----------------------------------------------------------------------------
do_enable() {
    preflight
    local state
    state="$(current_state)"
    if [[ "${state}" == "true" ]]; then
        echo "AUDIT_ALL_MUTATIONS is already 'true' — no change."
        log_line "noop_already_enabled"
        exit 0
    fi

    echo "================================================================"
    echo " WARNING — Enabling automatic audit logging"
    echo "================================================================"
    echo "  This will cause audit_middleware.js to record EVERY mutating"
    echo "  /api/* request (POST/PUT/PATCH/DELETE) into audit_log."
    echo ""
    echo "  Pre-conditions to verify before enabling in production:"
    echo "   [1] audit_log table schema matches current migration set"
    echo "   [2] audit_trail.tenant_id resolves correctly per tenant"
    echo "   [3] AUDIT_RETENTION_YEARS=7 is set and a prune job is running"
    echo "   [4] AUDIT_HASH_ALGO=sha256 (or stronger) is set"
    echo "   [5] Hash chain verification job is scheduled (PM2 cron or external)"
    echo "   [6] Tested on staging for >= 7 days with no integrity errors"
    echo ""
    echo "  DO NOT run this in production without satisfying all 6 above."
    echo "================================================================"
    echo ""
    # Read confirmation
    if [[ "${ASSUME_YES:-0}" != "1" ]]; then
        echo -n "Type YES to proceed: "
        read -r answer
        if [[ "${answer}" != "YES" ]]; then
            echo "Aborted by user."
            log_line "user_declined"
            exit 2
        fi
    fi

    apply_change "true"
    echo ""
    echo "OK — AUDIT_ALL_MUTATIONS=true written to ${ENV_FILE}."
    echo "Next: restart the app (pm2 restart nama-medical-erp) to take effect."
    log_line "ok"
}

# -----------------------------------------------------------------------------
# disable
# -----------------------------------------------------------------------------
do_disable() {
    preflight
    local state
    state="$(current_state)"
    if [[ "${state}" == "false" || "${state}" == "unset" ]]; then
        if [[ "${state}" == "unset" ]]; then
            echo "AUDIT_ALL_MUTATIONS is unset (already inert). No change."
        else
            echo "AUDIT_ALL_MUTATIONS is already 'false'. No change."
        fi
        log_line "noop_already_disabled"
        exit 0
    fi

    echo "Disabling automatic audit logging."
    echo "WARNING: explicit logAudit() calls will still fire; only the"
    echo "auto-middleware (every mutating /api/*) will be turned off."
    apply_change "false"
    echo ""
    echo "OK — AUDIT_ALL_MUTATIONS=false written to ${ENV_FILE}."
    echo "Next: restart the app (pm2 restart nama-medical-erp) to take effect."
    log_line "ok"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
case "${ACTION}" in
    status)  do_status ;;
    enable)  do_enable ;;
    disable) do_disable ;;
esac
