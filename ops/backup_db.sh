#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Automated PostgreSQL Backup
# =============================================================================
# File:         /var/www/namaweb/ops/backup_db.sh
# Purpose:      Nightly cron-driven dump of nama_medical_web, compressed, rotated
# DB engine:    PostgreSQL 14+
# Format:       pg_dump -Fc (custom) → gzip (extra compression)
# Retention:    30 days (deletes *.sql.gz older than 30d)
# Safety rail:  reads DB_PASSWORD from /var/www/namaweb/.env (no hardcoded secrets)
# Idempotency:  writes timestamped file; safe to re-run (new filename each time)
# Owner:        nama-medical-platform
# Status:       production-ready
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration (read from .env — never hardcode credentials)
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"

BACKUP_ROOT="${APP_ROOT}/backups/auto"
LOG_FILE="/var/log/nama-backup.log"
RETENTION_DAYS=30
DATE_TAG="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_FILE="${BACKUP_ROOT}/db_${DATE_TAG}.sql.gz"
LATEST_LINK="${BACKUP_ROOT}/db_LATEST.sql.gz"

# BACKUP_USER: when set (e.g. "postgres"), pg_dump runs as that user via sudo.
# Required because the app role (nama_medical_app) is non-superuser and
# is bound by 247 RLS-enabled tables; only a superuser/owner can read
# the full DB through pg_dump. Default: empty (use app role from .env).
BACKUP_USER="${BACKUP_USER:-}"

mkdir -p "${BACKUP_ROOT}"

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
log() {
    local ts
    ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "[${ts}] $*" | tee -a "${LOG_FILE}"
}

die() {
    log "ERROR: $*"
    exit 1
}

usage() {
    cat <<EOF
Usage: $0 [--verify] [--help]

Options:
  --verify    Verify the most recent backup integrity via 'pg_restore --list'
              (does not create a new backup).
  --help      Show this message.

Default behavior (no flag):
  Dump DB → gzip → rotate (>30d) → symlink db_LATEST.sql.gz

Exit codes:
  0  success
  1  failure (db unreachable, dump error, etc.)
  2  invalid arguments

Logs: ${LOG_FILE}
Backups: ${BACKUP_ROOT}
EOF
}

load_env() {
    [[ -f "${ENV_FILE}" ]] || die ".env not found at ${ENV_FILE}"
    # Source a CRLF-normalized copy into a tmp file. This handles the
    # common case where .env was uploaded from a Windows host and still
    # contains carriage returns that would otherwise break `source`.
    local env_tmp
    env_tmp="$(mktemp)"
    tr -d '\r' < "${ENV_FILE}" > "${env_tmp}"
    # shellcheck disable=SC1090
    set -a
    # shellcheck disable=SC1090
    source "${env_tmp}"
    set +a
    rm -f "${env_tmp}"
    : "${DB_HOST:?DB_HOST missing in .env}"
    : "${DB_PORT:?DB_PORT missing in .env}"
    : "${DB_NAME:?DB_NAME missing in .env}"
    : "${DB_USER:?DB_USER missing in .env}"
    : "${DB_PASSWORD:?DB_PASSWORD missing in .env}"
}

# -----------------------------------------------------------------------------
# pg_dump wrapper — handles both app-role and superuser modes
# -----------------------------------------------------------------------------
# When BACKUP_USER is set (e.g. "postgres"), we run pg_dump under that user
# via sudo. The script must be invoked by root (cron runs as root, so this
# is the production case). sudo -n (non-interactive) is used to fail fast
# if the calling user lacks sudo NOPASSWD for that target user.
# When BACKUP_USER is empty, we run pg_dump directly with the app creds —
# this works for schema-only dumps and for tenants where RLS is permissive.
run_pg_dump() {
    if [[ -n "${BACKUP_USER}" ]]; then
        log "Using backup user: ${BACKUP_USER} (sudo)"
        sudo -n -u "${BACKUP_USER}" pg_dump \
            -h "${DB_HOST}" \
            -p "${DB_PORT}" \
            -d "${DB_NAME}" \
            -Fc \
            --no-owner \
            --no-privileges
    else
        log "Using app role: ${DB_USER} (RLS-bound)"
        export PGPASSWORD="${DB_PASSWORD}"
        pg_dump \
            -h "${DB_HOST}" \
            -p "${DB_PORT}" \
            -U "${DB_USER}" \
            -d "${DB_NAME}" \
            -Fc \
            --no-owner \
            --no-privileges
    fi
}

# -----------------------------------------------------------------------------
# Backup routine
# -----------------------------------------------------------------------------
do_backup() {
    load_env
    log "=== backup START (${DATE_TAG}) ==="
    log "DB: ${DB_NAME}@${DB_HOST}:${DB_PORT} as ${DB_USER}"
    log "Target: ${BACKUP_FILE}"

    # pg_dump -Fc already compresses; we pipe through gzip for an extra tier
    # (small, but consistent with task spec).
    if run_pg_dump | gzip -9 > "${BACKUP_FILE}.tmp"; then
        mv "${BACKUP_FILE}.tmp" "${BACKUP_FILE}"
    else
        rm -f "${BACKUP_FILE}.tmp"
        die "pg_dump failed for ${DB_NAME} (BACKUP_USER='${BACKUP_USER}')"
    fi

    # Refresh latest symlink (atomic replace)
    ln -sfn "${BACKUP_FILE}" "${LATEST_LINK}"

    local size
    size="$(du -h "${BACKUP_FILE}" | cut -f1)"
    log "Backup written: ${BACKUP_FILE} (${size})"

    # Rotate: delete files older than RETENTION_DAYS (skip LATEST symlink)
    local deleted
    deleted="$(find "${BACKUP_ROOT}" -maxdepth 1 -type f -name 'db_*.sql.gz' -mtime +${RETENTION_DAYS} -print -delete | wc -l)"
    log "Rotation: deleted ${deleted} file(s) older than ${RETENTION_DAYS} days"

    log "=== backup OK ==="
}

# -----------------------------------------------------------------------------
# Verify routine
# -----------------------------------------------------------------------------
do_verify() {
    if [[ ! -e "${LATEST_LINK}" ]]; then
        die "No backup found at ${LATEST_LINK}"
    fi
    local target
    target="$(readlink -f "${LATEST_LINK}")"
    log "=== verify START (${DATE_TAG}) ==="
    log "Verifying: ${target}"

    # pg_restore --list just reads the TOC; doesn't actually restore.
    # We need to decompress first since file is .sql.gz.
    if ! command -v gunzip >/dev/null 2>&1; then
        die "gunzip not found on PATH"
    fi

    local toc_count
    if toc_count="$(gunzip -c "${target}" | pg_restore --list 2>/dev/null | grep -cE '^[0-9]+;')"; then
        log "Verify OK: ${toc_count} TOC entries in ${target}"
        log "=== verify OK ==="
        return 0
    else
        die "pg_restore --list failed for ${target}"
    fi
}

# -----------------------------------------------------------------------------
# Entry point
# -----------------------------------------------------------------------------
main() {
    case "${1:-}" in
        --verify) do_verify ;;
        --help|-h|"") do_backup ;;
        *) usage; exit 2 ;;
    esac
}

main "$@"
