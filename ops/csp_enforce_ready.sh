#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — CSP Enforce Pre-Flight Check (Dry-Run)
# =============================================================================
# File:         /var/www/namaweb/ops/csp_enforce_ready.sh
# Purpose:      Inspect the last 7 days of CSP violation reports and tell you
#               whether it is safe to flip CSP_ENFORCE from report-only → enforce.
# Scope:        Dry-run only. Does NOT mutate .env, does NOT restart the app.
#               Companion to ops/toggle_csp_enforce.sh (which IS mutating).
# Data source:  PM2 application logs (server.js logs "[CSP-REPORT]" lines to
#               console.warn; see server.js:148). Falls back to /var/log/ files.
# Output:       per-directive violation counts + a list of breaking URLs
#               (top 10 by frequency).
# Exit codes:   0 = SAFE TO ENFORCE (no violations in any directive)
#               1 = UNSAFE — at least one directive has violations
#               2 = unable to read logs / invalid args
# Safety rail:  read-only; never restarts anything.
#               AGENTS.md §2.2 rail 8 (CSP enforce = owner-authorized)
# Idempotency:  safe to re-run any time
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
LOG_DIR="/var/log/namaweb"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LOOKBACK_DAYS="${LOOKBACK_DAYS:-7}"
TOP_N="${TOP_N:-10}"
PM2_APP="${PM2_APP:-nama-medical-erp}"
LOG_FILE="${LOG_DIR}/csp_preflight_${TS}.log"

# Show help and exit early — before any side effects.
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat <<EOF
Usage: $0 [--days N] [--top N] [--app PM2_NAME] [--help]

  --days N        lookback window in days (default ${LOOKBACK_DAYS})
  --top N         how many breaking URLs to list per directive (default ${TOP_N})
  --app NAME      PM2 app name to inspect (default ${PM2_APP})
  --help          this message

Exit codes:
  0  SAFE TO ENFORCE — no violations in any CSP directive
  1  UNSAFE — at least one directive has violations
  2  cannot read PM2 logs / invalid args
EOF
    exit 0
fi

mkdir -p "${LOG_DIR}" 2>/dev/null || true

usage() {
    cat <<EOF
Usage: $0 [--days N] [--top N] [--app PM2_NAME] [--help]

  --days N        lookback window in days (default ${LOOKBACK_DAYS})
  --top N         how many breaking URLs to list per directive (default ${TOP_N})
  --app NAME      PM2 app name to inspect (default ${PM2_APP})
  --help          this message

Exit codes:
  0  SAFE TO ENFORCE — no violations in any CSP directive
  1  UNSAFE — at least one directive has violations
  2  cannot read PM2 logs
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --days)  LOOKBACK_DAYS="$2"; shift 2 ;;
        --top)   TOP_N="$2"; shift 2 ;;
        --app)   PM2_APP="$2"; shift 2 ;;
        --help|-h) usage; exit 0 ;;   # unreachable (early-exit above) but kept for clarity
        *) echo "Unknown arg: $1" >&2; usage; exit 2 ;;
    esac
done

# -----------------------------------------------------------------------------
# Locate the most recent PM2 log
# -----------------------------------------------------------------------------
find_pm2_log() {
    local cand
    for cand in \
        "/var/log/${PM2_APP}-out.log" \
        "/var/log/${PM2_APP}-error.log" \
        "/root/.pm2/logs/${PM2_APP}-out.log" \
        "/root/.pm2/logs/${PM2_APP}-error.log" \
        "/root/.pm2/logs/${PM2_APP}-out.log.last.log" \
        "/var/log/nama-medical-erp-out.log" \
        "/var/log/nama-medical-erp-error.log"; do
        if [[ -r "${cand}" ]]; then
            echo "${cand}"
            return 0
        fi
    done
    return 1
}

LOG_PATH="$(find_pm2_log || true)"
if [[ -z "${LOG_PATH}" ]]; then
    echo "ERROR: cannot find readable PM2 log for '${PM2_APP}'." >&2
    echo "Tried: /var/log/${PM2_APP}-*.log, /root/.pm2/logs/${PM2_APP}-*.log" >&2
    echo "Hint:  pm2 logs ${PM2_APP} --lines 50 --nostream --raw  (verify file path)" >&2
    exit 2
fi

# -----------------------------------------------------------------------------
# Header
# -----------------------------------------------------------------------------
{
    echo "================================================================"
    echo " CSP Enforce Pre-Flight — ${TS}"
    echo " log:    ${LOG_PATH}"
    echo " app:    ${PM2_APP}"
    echo " window: last ${LOOKBACK_DAYS} day(s)"
    echo "================================================================"
} | tee -a "${LOG_FILE}"

# -----------------------------------------------------------------------------
# Cut window: only consider lines whose timestamp is within the last N days.
# PM2 lines typically begin with YYYY-MM-DDTHH:MM:SS. We use GNU mtime/awk
# to filter. As a fallback (no parseable timestamp), we take the last N days
# of file mtime — but that requires log rotation, which the app already does.
# Here we filter by line timestamp prefix to be precise.
# -----------------------------------------------------------------------------
SINCE_EPOCH="$(date -u -d "${LOOKBACK_DAYS} days ago" +%s 2>/dev/null || date -u -v-${LOOKBACK_DAYS}d +%s)"
NOW_EPOCH="$(date -u +%s)"

# Extract [CSP-REPORT] lines within the time window.
# Format: "[CSP-REPORT] {"doc":"...","directive":"...","blocked":"..."}"
TMP_RAW="$(mktemp)"
TMP_FILTERED="$(mktemp)"
trap 'rm -f "${TMP_RAW}" "${TMP_FILTERED}"' EXIT

grep -h "\[CSP-REPORT\]" "${LOG_PATH}" 2>/dev/null > "${TMP_RAW}" || true

awk -v since="${SINCE_EPOCH}" -v now="${NOW_EPOCH}" '
    # Match leading ISO timestamp on the line: 2026-07-29T03:12:45
    match($0, /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/) {
        ts_str = substr($0, RSTART, 19)
        # Convert to epoch via mktime
        Y = substr(ts_str, 1, 4)
        M = substr(ts_str, 6, 2) - 1
        D = substr(ts_str, 9, 2)
        h = substr(ts_str, 12, 2)
        m = substr(ts_str, 15, 2)
        s = substr(ts_str, 18, 2)
        ts = mktime(Y" "M" "D" "h" "m" "s)
        if (ts >= since && ts <= now) print
        next
    }
    # No timestamp on line → assume current (include)
    { print }
' "${TMP_RAW}" > "${TMP_FILTERED}"

TOTAL_LINES="$(wc -l < "${TMP_FILTERED}" | tr -d ' ')"
echo "" | tee -a "${LOG_FILE}"
echo "Total [CSP-REPORT] lines in window: ${TOTAL_LINES}" | tee -a "${LOG_FILE}"

if [[ "${TOTAL_LINES}" -eq 0 ]]; then
    echo "" | tee -a "${LOG_FILE}"
    echo "----------------------------------------------------------------" | tee -a "${LOG_FILE}"
    echo " SAFE TO ENFORCE" | tee -a "${LOG_FILE}"
    echo " No CSP violations observed in the last ${LOOKBACK_DAYS} day(s)." | tee -a "${LOG_FILE}"
    echo " You may set CSP_ENFORCE=true in ${APP_ROOT}/.env and restart." | tee -a "${LOG_FILE}"
    echo "----------------------------------------------------------------" | tee -a "${LOG_FILE}"
    exit 0
fi

# -----------------------------------------------------------------------------
# Aggregate by directive
# -----------------------------------------------------------------------------
# We parse the directive field out of the JSON-ish payload.
# field: "directive":"..."
TMP_BY_DIRECTIVE="$(mktemp)"
trap 'rm -f "${TMP_RAW}" "${TMP_FILTERED}" "${TMP_BY_DIRECTIVE}"' EXIT

awk '
    {
        # Extract directive value — handle both "directive":"x" and bare x
        if (match($0, /"directive"[[:space:]]*:[[:space:]]*"([^"]+)"/, arr)) {
            d = arr[1]
        } else if (match($0, /"effective-directive"[[:space:]]*:[[:space:]]*"([^"]+)"/, arr)) {
            d = arr[1]
        } else {
            d = "(unknown)"
        }
        print d
    }
' "${TMP_FILTERED}" | sort | uniq -c | sort -rn > "${TMP_BY_DIRECTIVE}"

echo "" | tee -a "${LOG_FILE}"
echo "=== Violations by directive ===" | tee -a "${LOG_FILE}"
cat "${TMP_BY_DIRECTIVE}" | tee -a "${LOG_FILE}"

# -----------------------------------------------------------------------------
# Top breaking URLs per directive (the ones that would actually break)
# -----------------------------------------------------------------------------
echo "" | tee -a "${LOG_FILE}"
echo "=== Top breaking URLs (across all directives) ===" | tee -a "${LOG_FILE}"
awk '
    {
        if (match($0, /"blocked"[[:space:]]*:[[:space:]]*"([^"]+)"/, b)) {
            print b[1]
        } else if (match($0, /"blocked-uri"[[:space:]]*:[[:space:]]*"([^"]+)"/, b)) {
            print b[1]
        }
    }
' "${TMP_FILTERED}" | sort | uniq -c | sort -rn | head -n "${TOP_N}" \
    | tee -a "${LOG_FILE}"

# -----------------------------------------------------------------------------
# Verdict
# -----------------------------------------------------------------------------
echo "" | tee -a "${LOG_FILE}"
echo "----------------------------------------------------------------" | tee -a "${LOG_FILE}"
echo " UNSAFE TO ENFORCE" | tee -a "${LOG_FILE}"
echo " ${TOTAL_LINES} CSP violation(s) in the last ${LOOKBACK_DAYS} day(s)." | tee -a "${LOG_FILE}"
echo " Fix the top breaking URLs above first, then re-run this script." | tee -a "${LOG_FILE}"
echo " When this script exits 0, you may set CSP_ENFORCE=true and restart." | tee -a "${LOG_FILE}"
echo "----------------------------------------------------------------" | tee -a "${LOG_FILE}"

exit 1
