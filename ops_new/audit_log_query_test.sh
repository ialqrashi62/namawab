#!/usr/bin/env bash
# =============================================================================
# audit_log_query_test.sh — self-test for audit_log_query.sh
# =============================================================================
# Validates: script structure, --help output, --dry-run SQL emission,
# and that querying an empty (or missing) audit_events table does not crash.
# =============================================================================

set -euo pipefail

SCRIPT_PATH="/var/www/namaweb/ops/audit_log_query.sh"
PASS=0
FAIL=0

assert_eq() {
  local n="$1" e="$2" a="$3"
  if [ "${e}" = "${a}" ]; then
    PASS=$((PASS+1))
    printf '  [PASS] %s (=%s)\n' "${n}" "${a}"
  else
    FAIL=$((FAIL+1))
    printf '  [FAIL] %s expected=%s actual=%s\n' "${n}" "${e}" "${a}"
  fi
}

echo "=== Test 1: script exists and executable ==="
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

echo "=== Test 3: --help output ==="
set +e
HELP_OUT="$(bash "${SCRIPT_PATH}" --help 2>&1)"
HELP_RC=$?
set -e
assert_eq "help_exit_code" "0" "${HELP_RC}"
if printf '%s' "${HELP_OUT}" | grep -q "Usage:" && printf '%s' "${HELP_OUT}" | grep -q "\-\-since"; then
  PASS=$((PASS+1))
  echo "  [PASS] --help prints usage and --since"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] --help output incomplete"
fi

echo "=== Test 4: --dry-run emits SQL without DB access ==="
set +e
DRY_OUT="$(bash "${SCRIPT_PATH}" --dry-run --since 2026-07-01 --until 2026-07-30 --limit 50 2>&1)"
DRY_RC=$?
set -e
assert_eq "dry_run_exit_code" "0" "${DRY_RC}"
if printf '%s' "${DRY_OUT}" | grep -q "DRY RUN" && printf '%s' "${DRY_OUT}" | grep -q "audit_events"; then
  PASS=$((PASS+1))
  echo "  [PASS] --dry-run emitted SQL containing 'audit_events'"
else
  FAIL=$((FAIL+1))
  echo "  [FAIL] --dry-run output missing expected tokens"
fi

echo "=== Test 5: invalid arg rejected ==="
set +e
bash "${SCRIPT_PATH}" --bogus 2>/dev/null
BAD_RC=$?
set -e
assert_eq "invalid_arg_rc" "2" "${BAD_RC}"

echo "=== Test 6: --limit must be numeric ==="
set +e
bash "${SCRIPT_PATH}" --limit abc 2>/dev/null
LIM_RC=$?
set -e
assert_eq "non_numeric_limit_rc" "2" "${LIM_RC}"

echo "=== Test 7: empty/missing audit_events does not crash ==="
# If we can run a real query and the DB is up, fine; otherwise skip.
if [ -f "/var/www/namaweb/.env" ]; then
  set +e
    bash "${SCRIPT_PATH}" --since 2026-01-01 --until 2026-01-02 --limit 5 >/dev/null 2>&1
    RC=$?
  set -e
  if [ "${RC}" = "0" ] || [ "${RC}" = "1" ]; then
    PASS=$((PASS+1))
    echo "  [PASS] real query ran (rc=${RC}); no crash on empty result set"
  else
    FAIL=$((FAIL+1))
    echo "  [FAIL] real query returned unexpected rc=${RC}"
  fi
else
  FAIL=$((FAIL+1))
  echo "  [SKIP] no /var/www/namaweb/.env on this host — cannot test real query"
fi

echo ""
echo "=== Summary ==="
echo "PASS: ${PASS}"
echo "FAIL: ${FAIL}"
if [ "${FAIL}" -gt 0 ]; then
  exit 1
fi
exit 0
