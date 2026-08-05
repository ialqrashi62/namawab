#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Automated Daily PostgreSQL Backup
# =============================================================================
# File:         /var/www/namaweb/ops/backup_db_auto.sh
# Purpose:      Daily cron-driven dump of nama_medical_web DB
#               → compressed → 30-day rotation → human-readable log.
# Schedule:     cron daily 02:00 UTC (see ops/INSTALL.md)
# DB engine:    PostgreSQL 14+
# Format:       pg_dump -Fc (custom) → gzip -9
# Retention:    30 days (deletes *.sql.gz older than 30d; LATEST symlink spared)
# Safety rail:  reads DB_PASSWORD from /var/www/namaweb/.env (no hardcoded secrets)
#               AGENTS.md §2.2 rail 1 (no secrets in tracked files) — observed
# Idempotency:  safe to re-run (timestamped filename; later file wins)
# Exit codes:   0 = success
#               1 = runtime failure (db unreachable, dump error, verify fail)
#               2 = usage / env error
# Owner:        nama-medical-platform
# Status:       production-ready
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"

BACKUP_ROOT="${APP_ROOT}/backups/auto"
LOG_DIR="/var/log/namaweb"
LOG_FILE="${LOG_DIR}/backup.log"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
# BACKUP_USER: when set (e.g. "postgres"), pg_dump runs as that user via
# sudo. Required when the app role is RLS-bound (247 tables). The
# corresponding .env value for cron is typically:
#   BACKUP_USER=postgres
# Default: empty (use app role from .env).
BACKUP_USER="${BACKUP_USER:-}"
DATE_TAG="$(date -u +%Y-%m-%d_%H%M)"
BACKUP_FILE="${BACKUP_ROOT}/db_${DATE_TAG}.sql.gz"
LATEST_LINK="${BACKUP_ROOT}/db_LATEST.sql.gz"

mkdir -p "${BACKUP_ROOT}" "${LOG_DIR}"

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

# Normalize .env (strip CRLF) and source into current shell.
load_env() {
    [[ -f "${ENV_FILE}" ]] || die ".env not found at ${ENV_FILE}"
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

# Run pg_dump. When BACKUP_USER is set (e.g. "postgres"), we run pg_dump
# under that user via sudo. This is REQUIRED when the app role
# (nama_medical_app) is bound by 247 RLS-enabled tables — only a
# superuser/owner can COPY the full DB through pg_dump. The script must
# be invoked by root (cron runs as root, so this is the production case).
# `sudo -n` (non-interactive) fails fast if the calling user lacks sudo
# NOPASSWD for that target user.
# When BACKUP_USER is empty, we use the app role directly — works for
# schema-only dumps and tenants where RLS is permissive.
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
        log "Using app role: ${DB_USER} (RLS-bound — may fail on RLS tables)"
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

# Verify that the produced gzip file is a non-empty, valid gzip stream and
# that pg_restore can read the embedded TOC. This is a fast, non-destructive
# sanity check — `pg_restore --list` only reads the table of contents, it
# does not write to the DB.
verify_backup() {
    local target="$1"
    if [[ ! -s "${target}" ]]; then
        die "backup file is empty or missing: ${target}"
    fi
    if ! gunzip -t "${target}" 2>/dev/null; then
        die "backup file is not a valid gzip stream: ${target}"
    fi
    local toc
    if ! toc="$(gunzip -c "${target}" | pg_restore --list 2>/dev/null | grep -cE '^[0-9]+;')"; then
        die "pg_restore --list failed for ${target}"
    fi
    if [[ "${toc}" -lt 10 ]]; then
        die "pg_restore --list reported only ${toc} TOC entries (suspicious)"
    fi
    log "verify OK: ${toc} TOC entries in $(basename "${target}")"
}

# Rotate old backups. Deletes any *.sql.gz in BACKUP_ROOT whose mtime is
# older than RETENTION_DAYS. NEVER touches the LATEST symlink.
rotate() {
    local deleted
    deleted="$(find "${BACKUP_ROOT}" -maxdepth 1 -type f -name 'db_*.sql.gz' -mtime +${RETENTION_DAYS} -print -delete | wc -l)"
    log "rotation: deleted ${deleted} file(s) older than ${RETENTION_DAYS} days"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
    log "=== backup_db_auto START ==="
    load_env
    log "DB: ${DB_NAME}@${DB_HOST}:${DB_PORT} as ${DB_USER}"
    log "Target: ${BACKUP_FILE}"

    if run_pg_dump | gzip -9 > "${BACKUP_FILE}.tmp"; then
        mv "${BACKUP_FILE}.tmp" "${BACKUP_FILE}"
    else
        rm -f "${BACKUP_FILE}.tmp"
        die "pg_dump failed for ${DB_NAME}"
    fi

    local size
    size="$(du -h "${BACKUP_FILE}" | cut -f1)"
    log "wrote: ${BACKUP_FILE} (${size})"

    # Atomic replace of the LATEST symlink
    ln -sfn "${BACKUP_FILE}" "${LATEST_LINK}"
    log "linked: ${LATEST_LINK}"

    verify_backup "${BACKUP_FILE}"
    rotate

    log "=== backup_db_auto OK ==="
    exit 0
}

main "$@"
