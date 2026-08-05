#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Production Secrets & Hardcoded-Credential Audit
# =============================================================================
# File:         /var/www/namaweb/ops/audit_secrets.sh
# Purpose:      Verify production secrets hygiene:
#                 1. .env exists with mode 600 or 640 (not world-readable)
#                 2. .env is in .gitignore
#                 3. No hardcoded password/secret/api_key/token in .js files
#                 4. No real ZATCA CSID or NPHIES creds in tracked scripts
#                 5. .env.example uses __CHANGE_ME__ placeholders, not real values
#                 6. DB credentials file has restrictive perms
#                 7. audit_middleware is INERT in production (AGENTS.md §2.2 rail 10)
#                 8. CSP mode is REPORT-ONLY by default (AGENTS.md §2.2 rail 8)
# Output:       JSON to stdout
#               Also writes /var/log/namaweb/secrets_audit_YYYY-MM-DD.json
# Exit codes:   0 = all checks PASS
#               1 = one or more checks FAIL (WARN is non-blocking)
# Safety rail:  read-only — never modifies .env or any tracked file
# Idempotency:  safe to re-run any time
# =============================================================================

set -euo pipefail

APP_ROOT="/var/www/namaweb"
ENV_FILE="${APP_ROOT}/.env"
ENV_EXAMPLE="${APP_ROOT}/.env.example"
LOG_DIR="/var/log/namaweb"
DATE_TAG="$(date -u +%Y-%m-%d)"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
OUT_FILE="${LOG_DIR}/secrets_audit_${DATE_TAG}.json"

mkdir -p "${LOG_DIR}"

# JSON accumulator
CHECKS_JSON=""

add_check() {
  local name="$1" status="$2" details="$3"
  # Escape double quotes in details for JSON
  local esc
  esc="$(printf '%s' "$details" | sed 's/"/\\"/g; s/	/\\t/g')"
  if [ -n "$CHECKS_JSON" ]; then
    CHECKS_JSON="${CHECKS_JSON},"
  fi
  CHECKS_JSON="${CHECKS_JSON}{\"name\":\"${name}\",\"status\":\"${status}\",\"details\":\"${esc}\"}"
}

# ---------- Check 1: .env exists + mode ----------
if [ ! -f "${ENV_FILE}" ]; then
  add_check "env_file_exists" "FAIL" "Missing ${ENV_FILE}"
elif [ ! -r "${ENV_FILE}" ]; then
  add_check "env_file_perms" "FAIL" "${ENV_FILE} not readable by current user"
else
  PERMS="$(stat -c '%a' "${ENV_FILE}" 2>/dev/null || stat -f '%Lp' "${ENV_FILE}")"
  WORLD="$(stat -c '%A' "${ENV_FILE}" 2>/dev/null | cut -c9-9 || stat -f '%Sp' "${ENV_FILE}" | cut -c9-9)"
  case "${PERMS}" in
    600|640)
      add_check "env_file_perms" "PASS" "mode=${PERMS}"
      ;;
    *)
      if [ "${WORLD}" != "-" ] && [ -n "${WORLD}" ]; then
        add_check "env_file_perms" "FAIL" "world-readable/accessible; mode=${PERMS}"
      else
        add_check "env_file_perms" "WARN" "mode=${PERMS} (acceptable but not preferred; prefer 600)"
      fi
      ;;
  esac
fi

# ---------- Check 2: .env in .gitignore ----------
if [ -d "${APP_ROOT}/.git" ] || git -C "${APP_ROOT}" rev-parse --git-dir >/dev/null 2>&1; then
  if [ -f "${APP_ROOT}/.gitignore" ] && grep -E '^\.env$|^\.env\.' "${APP_ROOT}/.gitignore" >/dev/null 2>&1; then
    add_check "env_in_gitignore" "PASS" ".env pattern present in .gitignore"
  else
    add_check "env_in_gitignore" "FAIL" ".env not listed in .gitignore"
  fi
else
  add_check "env_in_gitignore" "WARN" "no git repo at ${APP_ROOT}; skipping"
fi

# ---------- Check 3: no hardcoded creds in .js (exclude tests/node_modules) ----------
HITS=0
HITS_LIST=""
if command -v grep >/dev/null 2>&1; then
  HITS_LIST="$(grep -RInE "(password|secret|api_?key|token)\s*[:=]\s*['\"][^'\"]+['\"]" \
      --include="*.js" "${APP_ROOT}" 2>/dev/null \
    | grep -v "\.env" \
    | grep -v "node_modules" \
    | grep -v "_test\.js" \
    | grep -v "/public/" \
    | grep -v "pcc-modules.txt" \
    || true)"
  HITS="$(printf '%s' "${HITS_LIST}" | grep -c '.' || true)"
fi
if [ "${HITS}" -eq 0 ]; then
  add_check "no_hardcoded_creds_js" "PASS" "no hardcoded password/secret/api_key/token in .js sources"
else
  # Truncate the list for the JSON details (first 3 hits only)
  PREVIEW="$(printf '%s' "${HITS_LIST}" | head -3 | tr '\n' '|')"
  add_check "no_hardcoded_creds_js" "FAIL" "${HITS} potential hit(s); sample: ${PREVIEW}"
fi

# ---------- Check 4: no real ZATCA CSID / NPHIES creds in scripts ----------
ZATCA_HITS="$(grep -RInE "ZATCA.*CSID|csid[_-]?serial|certificate[_-]?secret" \
    --include="*.sh" --include="*.js" "${APP_ROOT}/ops" "${APP_ROOT}/tools" 2>/dev/null \
  | grep -viE "__CHANGE_ME__|placeholder|example|TODO|example\.|test_" || true)"
ZATCA_COUNT="$(printf '%s' "${ZATCA_HITS}" | grep -c '.' || true)"
if [ "${ZATCA_COUNT}" -eq 0 ]; then
  add_check "no_real_zatca_nphies" "PASS" "no real ZATCA CSID/NPHIES creds in ops/ or tools/"
else
  add_check "no_real_zatca_nphies" "WARN" "${ZATCA_COUNT} possible references — review needed"
fi

# ---------- Check 5: .env.example has __CHANGE_ME__ placeholders ----------
if [ ! -f "${ENV_EXAMPLE}" ]; then
  add_check "env_example_placeholders" "WARN" "${ENV_EXAMPLE} not present"
else
  REAL_HITS="$(grep -E "^[A-Z_]+=.+$" "${ENV_EXAMPLE}" 2>/dev/null | grep -viE "__CHANGE_ME__|change.?me|placeholder|REPLACE|<.*>|^#" | head -5 || true)"
  if [ -z "${REAL_HITS}" ]; then
    add_check "env_example_placeholders" "PASS" ".env.example uses placeholders only"
  else
    PREVIEW="$(printf '%s' "${REAL_HITS}" | tr '\n' '|')"
    add_check "env_example_placeholders" "WARN" "possible real values in .env.example: ${PREVIEW}"
  fi
fi

# ---------- Check 6: DB credentials file perms ----------
DB_CREDS="${APP_ROOT}/db_creds"
DB_CREDS_FOUND="0"
for cand in "${DB_CREDS}" "${APP_ROOT}/db_creds.json" "${APP_ROOT}/db_creds.sh"; do
  if [ -f "${cand}" ]; then
    DB_CREDS_FOUND="1"
    DB_PERMS="$(stat -c '%a' "${cand}" 2>/dev/null || stat -f '%Lp' "${cand}")"
    if [ "${DB_PERMS}" = "600" ] || [ "${DB_PERMS}" = "400" ]; then
      add_check "db_creds_file_perms" "PASS" "${cand} mode=${DB_PERMS}"
    else
      add_check "db_creds_file_perms" "WARN" "${cand} mode=${DB_PERMS} (expected 600/400)"
    fi
    break
  fi
done
if [ "${DB_CREDS_FOUND}" = "0" ]; then
  add_check "db_creds_file_perms" "WARN" "no separate db_creds file (creds likely in .env only)"
fi

# ---------- Check 7: audit_middleware is INERT in production ----------
AUDIT_HITS="$(grep -RInE "audit_middleware|AUDIT_ENABLED|AUDIT_MIDDLEWARE_ENABLED" \
    --include="*.js" "${APP_ROOT}" 2>/dev/null \
  | grep -v "node_modules" \
  | grep -v "_test\.js" \
  | head -20 || true)"
# Heuristic: if any file has AUDIT_ENABLED=true or auditMiddleware(...).enable(), warn
ENABLED_HITS="$(printf '%s' "${AUDIT_HITS}" | grep -iE "AUDIT_ENABLED[ ]*=[ ]*['\"]?true|auditMiddleware\(.+\)\.enable" || true)"
if [ -z "${ENABLED_HITS}" ]; then
  add_check "audit_middleware_inert" "PASS" "no production code enables audit_middleware"
else
  add_check "audit_middleware_inert" "WARN" "audit_middleware appears enabled — review owner-authorized"
fi

# ---------- Check 8: CSP mode is report-only by default ----------
CSP_FILE="${APP_ROOT}/.env"
CSP_STATUS="unknown"
if [ -f "${CSP_FILE}" ]; then
  CSP_LINE="$(grep -E "^CSP_ENFORCE" "${CSP_FILE}" 2>/dev/null | tail -1 || true)"
  if [ -z "${CSP_LINE}" ]; then
    CSP_STATUS="not_set_default_report_only"
  else
    CSP_VAL="$(printf '%s' "${CSP_LINE}" | cut -d= -f2 | tr -d "'\"[:space:]" | tr '[:upper:]' '[:lower:]')"
    if [ "${CSP_VAL}" = "true" ] || [ "${CSP_VAL}" = "1" ] || [ "${CSP_VAL}" = "yes" ]; then
      CSP_STATUS="enforced"
    else
      CSP_STATUS="report_only"
    fi
  fi
fi
if [ "${CSP_STATUS}" = "report_only" ] || [ "${CSP_STATUS}" = "not_set_default_report_only" ]; then
  add_check "csp_report_only_default" "PASS" "CSP_ENFORCE=${CSP_STATUS}"
else
  add_check "csp_report_only_default" "WARN" "CSP_ENFORCE=${CSP_STATUS} (rail 8: report-only by default; enforce is owner-authorized)"
fi

# ---------- Final aggregate ----------
PASS_COUNT="$(printf '%s' "${CHECKS_JSON}" | grep -o '"status":"PASS"' | wc -l | tr -d ' ')"
WARN_COUNT="$(printf '%s' "${CHECKS_JSON}" | grep -o '"status":"WARN"' | wc -l | tr -d ' ')"
FAIL_COUNT="$(printf '%s' "${CHECKS_JSON}" | grep -o '"status":"FAIL"' | wc -l | tr -d ' ')"

FINAL_JSON="{\"timestamp\":\"${TS}\",\"checks\":[${CHECKS_JSON}],\"summary\":{\"pass\":${PASS_COUNT},\"warn\":${WARN_COUNT},\"fail\":${FAIL_COUNT}}}"

# Write to log
printf '%s\n' "${FINAL_JSON}" > "${OUT_FILE}"
chmod 600 "${OUT_FILE}" 2>/dev/null || true

# Echo to stdout
printf '%s\n' "${FINAL_JSON}"

# Exit code
if [ "${FAIL_COUNT}" -gt 0 ]; then
  exit 1
fi
exit 0
