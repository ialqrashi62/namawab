#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Cron Installer for Backups + Health Checks
# =============================================================================
# File:         /var/www/namaweb/ops/install_cron.sh
# Purpose:      Add 3 cron entries to root's crontab:
#                 1. Daily DB backup at 02:00
#                 2. Weekly retention cleanup at 03:00 Sunday
#                 3. Daily DB health check at 04:00
# Idempotency:  skips each entry that already exists (grep -q)
# Safety:       uses crontab -l + temp file (no clobber); never destructive
# Exit codes:   0 = success (or no-op)
#               1 = unable to install (no crontab, write failure)
# Logs:         /var/log/namaweb/cron_install.log
# =============================================================================

set -euo pipefail

APP_ROOT="/var/www/namaweb"
LOG_DIR="/var/log/namaweb"
LOG_FILE="${LOG_DIR}/cron_install.log"
MARKER="# namaweb-ops-automation"

DATE_TAG="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "${LOG_DIR}"

log() {
    echo "[${DATE_TAG}] $*" | tee -a "${LOG_FILE}" >&2
}

die() {
    log "ERROR: $*"
    exit 1
}

usage() {
    cat <<EOF
Usage: $0 [--help]

Installs 3 cron entries under root's crontab (idempotent):
  - Daily 02:00  ${APP_ROOT}/ops/backup_db.sh
  - Sun 03:00    find ${APP_ROOT}/backups -name '*.sql.gz' -mtime +30 -delete
  - Daily 04:00  ${APP_ROOT}/ops/db_health_check.sh

Logs to: ${LOG_FILE}
EOF
}

[[ "${1:-}" == "--help" || "${1:-}" == "-h" ]] && { usage; exit 0; }

# -----------------------------------------------------------------------------
# 1. crontab availability
# -----------------------------------------------------------------------------
if ! command -v crontab >/dev/null 2>&1; then
    log "WARN: crontab not on PATH — nothing to do, exiting 0"
    exit 0
fi

# -----------------------------------------------------------------------------
# 2. define the 3 entries (single source of truth)
# -----------------------------------------------------------------------------
declare -a ENTRIES=(
    "${MARKER}:daily-backup|0 2 * * * /var/www/namaweb/ops/backup_db.sh >> /var/log/namaweb/backup.log 2>&1"
    "${MARKER}:weekly-cleanup|0 3 * * 0 find /var/backups/namaweb/ -name '*.sql.gz' -mtime +30 -delete >> /var/log/namaweb/backup.log 2>&1"
    "${MARKER}:daily-health|0 4 * * * /var/www/namaweb/ops/db_health_check.sh >> /var/log/namaweb/health.log 2>&1"
)

# -----------------------------------------------------------------------------
# 3. read current crontab (may be empty)
# -----------------------------------------------------------------------------
CURRENT="$(crontab -l 2>/dev/null || true)"
TMP_NEW="$(mktemp)"
TMP_BASE="$(mktemp)"
trap 'rm -f "${TMP_NEW}" "${TMP_BASE}"' EXIT

# write current crontab (or empty) as base
if [[ -n "${CURRENT}" ]]; then
    echo "${CURRENT}" > "${TMP_BASE}"
else
    : > "${TMP_BASE}"
fi

# -----------------------------------------------------------------------------
# 4. append missing entries
# -----------------------------------------------------------------------------
INSTALLED=0
SKIPPED=0
cp "${TMP_BASE}" "${TMP_NEW}"
for entry in "${ENTRIES[@]}"; do
    LABEL="${entry%%|*}"
    CRON_LINE="${entry##*|}"
    if echo "${CURRENT}" | grep -qF "${CRON_LINE}"; then
        log "SKIP: already installed: ${LABEL}"
        SKIPPED=$((SKIPPED+1))
    else
        echo "${CRON_LINE}  ${LABEL}" >> "${TMP_NEW}"
        log "ADD: ${LABEL}  →  ${CRON_LINE}"
        INSTALLED=$((INSTALLED+1))
    fi
done

# -----------------------------------------------------------------------------
# 5. install (only if changed)
# -----------------------------------------------------------------------------
if [[ "${INSTALLED}" -gt 0 ]]; then
    if crontab "${TMP_NEW}"; then
        log "OK: installed ${INSTALLED} entry/ies, skipped ${SKIPPED}"
        exit 0
    else
        die "crontab install failed"
    fi
else
    log "OK: nothing to install (skipped ${SKIPPED} already present)"
    exit 0
fi
