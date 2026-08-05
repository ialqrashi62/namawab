#!/usr/bin/env bash
# =============================================================================
# audit_secrets_test.sh — self-test for audit_secrets.sh
# =============================================================================
# Validates: structure, JSON validity, expected check names, normal exit code,
# and failure behaviour when .env has world-readable perms (reverts on exit).
# =============================================================================

set -euo pipefail

SCRIPT_PATH="/var/www/namaweb/ops/audit_secrets.sh"
ENV_FILE="/var/www/namaweb/.env"
BACKUP_PERMS=""

PASS=0
FAIL=0
TEST_NAME=""

assert() {
  # assert <test_name> <expected_rc> <actual_rc>
  local name="$1" expected="$2" actual="$3"
  if [ "${actual}" = "${expected}" ]; then
    PASS=$((PASS+1))
    printf '  [PASS] %s (rc=%s)\n' "${name}" "${actual}"
  else
    FAIL=$((FAIL+1))
    printf '  [FAIL] %s (expected=%s actual=%s)\n' "${name}" "${expected}" "${actual}"
  fi
}

cleanup() {
  # Always restore .env perms even on failure
  if [ -n "${BACKUP_PERMS}" ] && [ -f "${ENV_FILE}" ]; then
    chmod "${BACKUP_PERMS}" "${ENV_FILE}" 2>/dev/null || true
  fi
  rm -f /tmp/audit_secrets_test_out.json 2>/dev/null || true
}
trap cleanup EXIT

echo "=== Test 1: script exists and executable ==="
if [ -x "${SCRIPT_PATH}" ]; then
  PASS=$((PASS+1))
  echo "  [PASS] script present and executable"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] script not executable or missing: ${SCRIPT_PATH}"
fi

echo "=== Test 2: bash -n syntax check ==="
if bash -n "${SCRIPT_PATH}" 2>/dev/null; then
  PASS=$((PASS+1))
  echo "  [PASS] syntax OK"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] syntax error in ${SCRIPT_PATH}"
fi

echo "=== Test 3: normal run produces valid JSON with expected check names ==="
RAW="$(bash "${SCRIPT_PATH}" 2>/dev/null || true)"
printf '%s' "${RAW}" > /tmp/audit_secrets_test_out.json
# Validate JSON (very small check: leading char { and trailing char })
if head -c1 /tmp/audit_secrets_test_out.json | grep -q '{' \
   && tail -c1 /tmp/audit_secrets_test_out.json | grep -q '}'; then
  PASS=$((PASS+1))
  echo "  [PASS] JSON shape ok"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] output is not valid JSON shape"
fi
for n in env_file_perms env_in_gitignore no_hardcoded_creds_js no_real_zatca_nphies env_example_placeholders db_creds_file_perms audit_middleware_inert csp_report_only_default; do
  if grep -q "\"${n}\"" /tmp/audit_secrets_test_out.json; then
    PASS=$((PASS+1))
    echo "  [PASS] check present: ${n}"
  else
    FAIL=$((FAIL+1))
    echo "  [FAIL] check missing: ${n}"
  fi
done

echo "=== Test 4: normal exit code (0 if no FAIL) ==="
set +e
bash "${SCRIPT_PATH}" >/dev/null 2>&1
RC=$?
set -e
if [ "${RC}" = "0" ] || [ "${RC}" = "1" ]; then
  PASS=$((PASS+1))
  echo "  [PASS] exit code is 0 or 1 (got ${RC})"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] unexpected exit code ${RC}"
fi

echo "=== Test 5: world-readable .env (chmod 644) forces exit 1 ==="
if [ -f "${ENV_FILE}" ]; then
  BACKUP_PERMS="$(stat -c '%a' "${ENV_FILE}" 2>/dev/null || stat -f '%Lp' "${ENV_FILE}")"
  chmod 644 "${ENV_FILE}"
  set +e
  bash "${SCRIPT_PATH}" >/dev/null 2>&1
  RC=$?
  set -e
  # Restore immediately
  chmod "${BACKUP_PERMS}" "${ENV_FILE}"
  BACKUP_PERMS=""
  assert "world_readable_env_fails" "1" "${RC}"
else
  FAIL=$((FAIL+1))
  echo "  [SKIP] no ${ENV_FILE} present on this host"
fi

echo ""
echo "=== Summary ==="
echo "PASS: ${PASS}"
echo "FAIL: ${FAIL}"
if [ "${FAIL}" -gt 0 ]; then
  exit 1
fi
exit 0
