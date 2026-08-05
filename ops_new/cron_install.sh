#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — System-Wide Cron Installer for ops/* scripts
# =============================================================================
# File:         /var/www/namaweb/ops/cron_install.sh
# Purpose:      Idempotent installer that wires three ops scripts into
#               /etc/cron.d/namaweb-ops (system-wide cron, NOT user crontab).
#                 1. Daily DB backup       at 02:00 UTC
#                 2. Daily DB health check at 03:00 UTC
#                 3. Weekly safety audit   at 04:00 UTC on Sundays
#
# What it does (each step is a no-op if already in the desired state):
#   1. Verifies root
#   2. Ensures /etc/namaweb-backup.env.example exists
#   3. Creates /etc/namaweb-backup.env from the template (chmod 600)
#      ONLY if missing — does NOT overwrite a real password file
#   4. Ensures /var/backups/namaweb/ exists (chmod 755)
#   5. Writes /etc/cron.d/namaweb-ops (chmod 644, root:root) with the
#      three jobs above. Env is loaded at runtime from
#      /etc/namaweb-backup.env; the crontab itself never contains secrets.
#   6. Reloads cron (service cron reload, falls back to systemctl)
#   7. Verifies the file on disk and prints a summary
#
# Idempotency:  re-running is safe. Existing env files are NEVER overwritten;
#               the cron file is rewritten in place (its content is deterministic).
# Exit codes:   0 = success (including no-op)
#               1 = not root, or write failure
# Safety rail:  AGENTS.md §2.2 rail 1 — no real secrets in tracked files.
#               AGENTS.md §2.2 rail 6 — opt-in + idempotent cron.
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Constants
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
OPS_DIR="${APP_ROOT}/ops"
ENV_FILE="/etc/namaweb-backup.env"
ENV_TEMPLATE_SRC="${OPS_DIR}/namaweb-backup.env.example"
ENV_TEMPLATE_DST="/etc/namaweb-backup.env.example"
BACKUP_DIR="/var/backups/namaweb"
CRON_FILE="/etc/cron.d/namaweb-ops"
LOG_DIR="/var/log/namaweb"

BACKUP_SCRIPT="${OPS_DIR}/backup_db_auto.sh"
HEALTH_SCRIPT="${OPS_DIR}/db_health_check.sh"
SAFETY_SCRIPT="${OPS_DIR}/safety_audit.sh"

BACKUP_LOG="/var/log/namaweb-backup.log"
HEALTH_LOG="/var/log/namaweb-db-health.log"
SAFETY_LOG="/var/log/namaweb-safety.log"

DATE_TAG="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# -----------------------------------------------------------------------------
# Logging helpers (stdout + a transient install log)
# -----------------------------------------------------------------------------
INSTALL_LOG="/var/log/namaweb-cron-install.log"
mkdir -p "${LOG_DIR}" 2>/dev/null || true  # /var/log exists already; defensive

log() {
    echo "[${DATE_TAG}] [cron_install] $*" | tee -a "${INSTALL_LOG}" >&2
}

die() {
    log "ERROR: $*"
    exit 1
}

# -----------------------------------------------------------------------------
# 1. Root check
# -----------------------------------------------------------------------------
if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    die "must run as root (try: sudo bash ${0})"
fi

log "===== START cron_install ====="

# -----------------------------------------------------------------------------
# 2. /etc/namaweb-backup.env.example — install template if missing
# -----------------------------------------------------------------------------
if [[ ! -f "${ENV_TEMPLATE_DST}" ]] && [[ -f "${ENV_TEMPLATE_SRC}" ]]; then
    install -m 0644 -o root -g root "${ENV_TEMPLATE_SRC}" "${ENV_TEMPLATE_DST}"
    log "OK: installed env template → ${ENV_TEMPLATE_DST}"
elif [[ -f "${ENV_TEMPLATE_DST}" ]]; then
    log "SKIP: env template already present at ${ENV_TEMPLATE_DST}"
else
    log "WARN: ${ENV_TEMPLATE_SRC} not found; ${ENV_TEMPLATE_DST} not created"
fi

# -----------------------------------------------------------------------------
# 3. /etc/namaweb-backup.env — create from template ONLY if missing
#    (NEVER overwrite an existing real-password file)
# -----------------------------------------------------------------------------
if [[ -f "${ENV_FILE}" ]]; then
    log "SKIP: env file already present at ${ENV_FILE} (not overwriting)"
else
    if [[ -f "${ENV_TEMPLATE_DST}" ]]; then
        install -m 0600 -o root -g root "${ENV_TEMPLATE_DST}" "${ENV_FILE}"
        log "OK: created env file at ${ENV_FILE} (chmod 600) — EDIT PGPASSWORD"
    else
        # Write a minimal env file inline so cron jobs have something to source.
        cat > "${ENV_FILE}" <<'MIN_ENV'
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=nama_medical
PGUSER=nama_medical_app
PGPASSWORD=__CHANGE_ME__
BACKUP_RETENTION_DAYS=30
BACKUP_DIR=/var/backups/namaweb
MIN_ENV
        chmod 0600 "${ENV_FILE}"
        chown root:root "${ENV_FILE}"
        log "OK: bootstrapped env file at ${ENV_FILE} (chmod 600) — EDIT PGPASSWORD"
    fi
fi

# -----------------------------------------------------------------------------
# 4. /var/backups/namaweb/ — create if missing
# -----------------------------------------------------------------------------
if [[ -d "${BACKUP_DIR}" ]]; then
    log "SKIP: backup dir already present at ${BACKUP_DIR}"
else
    install -d -m 0755 -o root -g root "${BACKUP_DIR}"
    log "OK: created backup dir at ${BACKUP_DIR} (chmod 755)"
fi

# -----------------------------------------------------------------------------
# 5. Write /etc/cron.d/namaweb-ops
#    - Cron file format: user field is REQUIRED in /etc/cron.d/*
#    - Env is loaded at runtime via 'set -a; . /etc/namaweb-backup.env; set +a;'
#    - Cron file content is deterministic → re-running is safe
# -----------------------------------------------------------------------------
cat > "${CRON_FILE}" <<CRON_EOF
# NamaMedical ERP daily ops cron
# Managed by /var/www/namaweb/ops/cron_install.sh — do not hand-edit.
# Loaded env: /etc/namaweb-backup.env (chmod 600, root:root, real password)
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=ops@jumanasoft.com

# Daily DB backup at 02:00 UTC
0 2 * * * root bash -c 'set -a; . /etc/namaweb-backup.env; set +a; ${BACKUP_SCRIPT}' >> ${BACKUP_LOG} 2>&1

# Daily DB health check at 03:00 UTC
0 3 * * * root bash -c 'set -a; . /etc/namaweb-backup.env; set +a; ${HEALTH_SCRIPT}' >> ${HEALTH_LOG} 2>&1

# Weekly safety audit (Sundays 04:00 UTC)
0 4 * * 0 root bash -c 'set -a; . /etc/namaweb-backup.env; set +a; ${SAFETY_SCRIPT}' >> ${SAFETY_LOG} 2>&1
CRON_EOF

chmod 0644 "${CRON_FILE}"
chown root:root "${CRON_FILE}"
log "OK: wrote cron file → ${CRON_FILE} (chmod 644, root:root)"

# -----------------------------------------------------------------------------
# 6. Reload cron — service first, systemctl fallback
# -----------------------------------------------------------------------------
if command -v service >/dev/null 2>&1; then
    if service cron reload >/dev/null 2>&1; then
        log "OK: reloaded cron via 'service cron reload'"
    elif systemctl reload cron >/dev/null 2>&1; then
        log "OK: reloaded cron via 'systemctl reload cron'"
    else
        log "WARN: 'service cron reload' failed; cron will pick up changes within ~1 min"
    fi
elif command -v systemctl >/dev/null 2>&1; then
    if systemctl reload cron >/dev/null 2>&1; then
        log "OK: reloaded cron via 'systemctl reload cron'"
    else
        log "WARN: 'systemctl reload cron' failed; cron will pick up changes within ~1 min"
    fi
else
    log "WARN: neither 'service' nor 'systemctl' on PATH; cron may need manual reload"
fi

# -----------------------------------------------------------------------------
# 7. Verify
# -----------------------------------------------------------------------------
log "----- verify: ls -la ${CRON_FILE} -----"
ls -la "${CRON_FILE}" 2>&1 | tee -a "${INSTALL_LOG}" >&2 || true

log "----- verify: crontab -l (user crontab, should be empty) -----"
( crontab -l 2>/dev/null || echo "(no user crontab — system cron in use)" ) | tee -a "${INSTALL_LOG}" >&2

# -----------------------------------------------------------------------------
# 8. Summary
# -----------------------------------------------------------------------------
cat <<SUMMARY

===== cron_install SUMMARY =====
  env file:     ${ENV_FILE}  ($( [[ -f "${ENV_FILE}" ]] && echo "present" || echo "MISSING" ))
  env template: ${ENV_TEMPLATE_DST}  ($( [[ -f "${ENV_TEMPLATE_DST}" ]] && echo "present" || echo "MISSING" ))
  backup dir:   ${BACKUP_DIR}  ($( [[ -d "${BACKUP_DIR}" ]] && echo "present" || echo "MISSING" ))
  cron file:    ${CRON_FILE}  ($( [[ -f "${CRON_FILE}" ]] && echo "present" || echo "MISSING" ))
  log file:     ${INSTALL_LOG}

  Next required action (manual):
    sudoedit ${ENV_FILE}   # replace PGPASSWORD=__CHANGE_ME__ with real value

  Next run times (UTC):
    02:00 daily  — ${BACKUP_SCRIPT}    → ${BACKUP_LOG}
    03:00 daily  — ${HEALTH_SCRIPT}    → ${HEALTH_LOG}
    04:00 Sun    — ${SAFETY_SCRIPT}    → ${SAFETY_LOG}

===== cron_install DONE =====
SUMMARY

log "===== END cron_install ====="
exit 0
