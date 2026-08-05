#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — CSP Enforce Toggle (Owner-Authorized)
# =============================================================================
# File:         /var/www/namaweb/ops/toggle_csp_enforce.sh
# Purpose:      Toggle CSP_ENFORCE in /var/www/namaweb/.env (true|false)
# Usage:        OPS_BYOK=1 bash toggle_csp_enforce.sh enable
#               OPS_BYOK=1 bash toggle_csp_enforce.sh disable
# Safety rail:  AGENTS.md §2.2 rail 8 — CSP_ENFORCE is owner-authorized only.
#               Refuses to run without OPS_BYOK=1 in the env.
# Refuses to enable if recent (last 1h) CSP violation-report count > 100.
# Does NOT restart the server (the operator does that manually after review).
# Idempotency:  append/update; safe to re-run.
# =============================================================================

set -euo pipefail

APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
LOG_DIR="/var/log/namaweb"
LOG_FILE="${LOG_DIR}/csp_changes.log"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
VIOLATION_LOG="${LOG_DIR}/csp_violations.log"

mkdir -p "${LOG_DIR}"

# ---------- Safety rail: must be explicitly authorized ----------
if [ "${OPS_BYOK:-0}" != "1" ]; then
  echo "REFUSED: this script is owner-authorized only (AGENTS.md §2.2 rail 8)." >&2
  echo "Re-run with:  OPS_BYOK=1 bash $0 <enable|disable>" >&2
  exit 2
fi

# ---------- Validate arg ----------
ACTION="${1:-}"
if [ "${ACTION}" != "enable" ] && [ "${ACTION}" != "disable" ]; then
  echo "Usage: OPS_BYOK=1 bash $0 <enable|disable>" >&2
  exit 64
fi

if [ "${ACTION}" = "enable" ]; then
  NEW_VAL="true"
else
  NEW_VAL="false"
fi

# ---------- If enabling, refuse if recent violation count > 100 ----------
if [ "${ACTION}" = "enable" ] && [ -f "${VIOLATION_LOG}" ]; then
  ONE_HOUR_AGO="$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -u -v-1H +%Y-%m-%dT%H:%M:%S)"
  RECENT_COUNT="$(awk -v cutoff="${ONE_HOUR_AGO}" '
    /^#/ { next }
    { ts=$1; if (ts >= cutoff) c++ }
    END { print c+0 }
  ' "${VIOLATION_LOG}" 2>/dev/null || echo 0)"
  if [ "${RECENT_COUNT}" -gt 100 ]; then
    echo "REFUSED: ${RECENT_COUNT} CSP violations in the last hour (>100 threshold)." >&2
    echo "Investigate ${VIOLATION_LOG} and reduce violations before enabling enforce mode." >&2
    exit 3
  fi
fi

# ---------- Read current value ----------
CURRENT_VAL=""
if [ -f "${ENV_FILE}" ]; then
  CURRENT_LINE="$(grep -E "^CSP_ENFORCE" "${ENV_FILE}" 2>/dev/null | tail -1 || true)"
  if [ -n "${CURRENT_LINE}" ]; then
    CURRENT_VAL="$(printf '%s' "${CURRENT_LINE}" | cut -d= -f2- | tr -d "'\"[:space:]")"
  fi
fi

# ---------- Apply change ----------
if [ -n "${CURRENT_LINE:-}" ]; then
  # Replace existing
  TMP_FILE="$(mktemp)"
  awk -v new="CSP_ENFORCE=${NEW_VAL}" '
    /^CSP_ENFORCE=/ { print new; replaced=1; next }
    { print }
    END { if (!replaced) print new }
  ' "${ENV_FILE}" > "${TMP_FILE}"
  cat "${TMP_FILE}" > "${ENV_FILE}"
  rm -f "${TMP_FILE}"
  OP="updated"
else
  # Append
  if [ -f "${ENV_FILE}" ]; then
    printf '\n# CSP enforce mode (toggled %s)\nCSP_ENFORCE=%s\n' "${TS}" "${NEW_VAL}" >> "${ENV_FILE}"
  else
    printf 'CSP_ENFORCE=%s\n' "${NEW_VAL}" > "${ENV_FILE}"
    chmod 600 "${ENV_FILE}"
  fi
  OP="appended"
fi

# Set restrictive perms on .env (best effort)
chmod 600 "${ENV_FILE}" 2>/dev/null || true

# ---------- Log ----------
printf '%s action=%s from=%s to=%s op=%s by=%s\n' \
  "${TS}" "${ACTION}" "${CURRENT_VAL:-unset}" "${NEW_VAL}" "${OP}" "${SUDO_USER:-${USER:-unknown}}" \
  >> "${LOG_FILE}"
chmod 600 "${LOG_FILE}" 2>/dev/null || true

# ---------- Report ----------
printf 'CSP_ENFORCE: %s -> %s (op=%s)\n' "${CURRENT_VAL:-unset}" "${NEW_VAL}" "${OP}"
printf 'Logged:      %s\n' "${LOG_FILE}"
printf '\nNEXT STEP (operator must run manually):\n'
printf '  pm2 restart nama-medical-erp\n'
printf '\nReminder: monitor /var/log/namaweb/csp_violations.log for 5 minutes after restart.\n'

exit 0
