#!/usr/bin/env bash
# =============================================================================
# toggle_csp_enforce_test.sh — self-test for toggle_csp_enforce.sh
# =============================================================================
# Validates: structure, refusal without OPS_BYOK, success with OPS_BYOK=1,
# correct .env mutation (with restore), and log-file creation.
# =============================================================================

set -euo pipefail

SCRIPT_PATH="/var/www/namaweb/ops/toggle_csp_enforce.sh"
ENV_FILE="/var/www/namaweb/.env"
LOG_FILE="/var/log/namaweb/csp_changes.log"
BACKUP_VAL=""

PASS=0
FAIL=0

cleanup() {
  if [ -n "${BACKUP_VAL}" ] && [ -f "${ENV_FILE}" ]; then
    if [ "${BACKUP_VAL}" = "__ABSENT__" ]; then
      grep -v "^CSP_ENFORCE" "${ENV_FILE}" > "${ENV_FILE}.tmp" 2>/dev/null && mv "${ENV_FILE}.tmp" "${ENV_FILE}" || true
    else
      grep -E "^CSP_ENFORCE" "${ENV_FILE}" >/dev/null 2>&1 \
        && sed -i "s|^CSP_ENFORCE=.*|CSP_ENFORCE=${BACKUP_VAL}|" "${ENV_FILE}" \
        || printf '\nCSP_ENFORCE=%s\n' "${BACKUP_VAL}" >> "${ENV_FILE}"
    fi
  fi
}
trap cleanup EXIT

assert_eq() {
  # assert_eq <name> <expected> <actual>
  local n="$1" e="$2" a="$3"
  if [ "${e}" = "${a}" ]; then
    PASS=$((PASS+1))
    printf '  [PASS] %s (=%s)\n' "${n}" "${a}"
  else
    FAIL=$((FAIL+1))
    printf '  [FAIL] %s expected=%s actual=%s\n' "${n}" "${e}" "${a}"
  fi
}

echo "=== Test 1: script exists + executable ==="
if [ -x "${SCRIPT_PATH}" ]; then
  PASS=$((PASS+1))
  echo "  [PASS] script present and executable"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] script missing or not executable: ${SCRIPT_PATH}"
  exit 1
fi

echo "=== Test 2: bash -n syntax check ==="
if bash -n "${SCRIPT_PATH}"; then
  PASS=$((PASS+1))
  echo "  [PASS] syntax OK"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] syntax error"
fi

echo "=== Test 3: refuses to run without OPS_BYOK ==="
set +e
unset OPS_BYOK
bash "${SCRIPT_PATH}" enable >/dev/null 2>&1
RC=$?
set -e
assert_eq "no_byok_refused" "2" "${RC}"

echo "=== Test 4: invalid arg rejected (even with OPS_BYOK) ==="
set +e
OPS_BYOK=1 bash "${SCRIPT_PATH}" bogus >/dev/null 2>&1
RC=$?
set -e
assert_eq "invalid_arg_rejected" "64" "${RC}"

echo "=== Test 5: backup current CSP_ENFORCE value (if any) ==="
if [ -f "${ENV_FILE}" ] && grep -E "^CSP_ENFORCE" "${ENV_FILE}" >/dev/null 2>&1; then
  BACKUP_VAL="$(grep -E "^CSP_ENFORCE" "${ENV_FILE}" | tail -1 | cut -d= -f2- | tr -d "'\"[:space:]")"
else
  BACKUP_VAL="__ABSENT__"
fi

echo "=== Test 6: disable with OPS_BYOK=1 sets CSP_ENFORCE=false ==="
OPS_BYOK=1 bash "${SCRIPT_PATH}" disable >/dev/null 2>&1
if grep -E "^CSP_ENFORCE=false" "${ENV_FILE}" >/dev/null 2>&1; then
  PASS=$((PASS+1))
  echo "  [PASS] CSP_ENFORCE=false written"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] CSP_ENFORCE=false not found"
fi

echo "=== Test 7: enable with OPS_BYOK=1 sets CSP_ENFORCE=true ==="
OPS_BYOK=1 bash "${SCRIPT_PATH}" enable >/dev/null 2>&1
if grep -E "^CSP_ENFORCE=true" "${ENV_FILE}" >/dev/null 2>&1; then
  PASS=$((PASS+1))
  echo "  [PASS] CSP_ENFORCE=true written"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] CSP_ENFORCE=true not found"
fi

echo "=== Test 8: csp_changes.log was appended ==="
if [ -f "${LOG_FILE}" ] && [ -s "${LOG_FILE}" ]; then
  PASS=$((PASS+1))
  echo "  [PASS] log file present and non-empty"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] log file missing or empty"
fi

echo "=== Test 9: log entries contain action= tokens ==="
if grep -E "action=(enable|disable)" "${LOG_FILE}" >/dev/null 2>&1; then
  PASS=$((PASS+1))
  echo "  [PASS] log entries contain action= tokens"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] log entries missing action= tokens"
fi

echo ""
echo "=== Summary ==="
echo "PASS: ${PASS}"
echo "FAIL: ${FAIL}"
if [ "${FAIL}" -gt 0 ]; then
  exit 1
fi
exit 0
