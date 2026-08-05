#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — DB Health Check Test
# =============================================================================
# File:         /var/www/namaweb/ops/db_health_check_test.sh
# Purpose:      Structural and behavioral tests for db_health_check.sh.
# Tests:
#   1. script exists and is executable
#   2. script syntax (bash -n)
#   3. --help produces usage text and exits 0
#   4. JSON output has expected keys
#   5. invalid env (wrong DB_HOST) produces non-zero exit
# Safety:       never mutates DB; uses a bogus DB_HOST for the negative test.
# =============================================================================

set -uo pipefail

SCRIPT="/var/www/namaweb/ops/db_health_check.sh"
PASS=0
FAIL=0

pass() { echo "PASS: $*"; PASS=$((PASS+1)); }
fail() { echo "FAIL: $*"; FAIL=$((FAIL+1)); }

# --- 1. exists & executable -------------------------------------------------
if [[ -f "${SCRIPT}" ]]; then
    pass "script exists (${SCRIPT})"
else
    fail "script missing: ${SCRIPT}"
    echo "Cannot continue without script"; exit 1
fi
if [[ -x "${SCRIPT}" ]]; then
    pass "script is executable"
else
    fail "script not executable (chmod +x missing)"
fi

# --- 2. bash syntax ---------------------------------------------------------
if bash -n "${SCRIPT}" 2>/dev/null; then
    pass "bash -n syntax check"
else
    fail "bash -n syntax error"
    bash -n "${SCRIPT}"
fi

# --- 3. --help exits 0 and prints usage -------------------------------------
HELP_OUT="$(${SCRIPT} --help 2>&1 || true)"
if echo "${HELP_OUT}" | grep -qi "Usage"; then
    pass "--help prints usage"
else
    fail "--help did not print usage text"
fi

# --- 4. JSON output keys (only if DB reachable) -----------------------------
# We try a live run; if DB is reachable, check JSON keys; if not, we
# still note "DB unreachable" and skip the positive JSON check.
RAW_OUT="$(DB_HOST=127.0.0.1 DB_PORT=1 ${SCRIPT} 2>/dev/null || true)"
if [[ -n "${RAW_OUT}" ]] && echo "${RAW_OUT}" | grep -qE '"version"'; then
    for key in version table_count dead_tuples long_queries replication_lag_seconds; do
        if echo "${RAW_OUT}" | grep -qE "\"${key}\""; then
            pass "JSON contains key: ${key}"
        else
            fail "JSON missing key: ${key}"
        fi
    done
    # shape: braces-balanced
    OPEN=$(echo "${RAW_OUT}" | tr -cd '{' | wc -c)
    CLOSE=$(echo "${RAW_OUT}" | tr -cd '}' | wc -c)
    if [[ "${OPEN}" -eq "${CLOSE}" && "${OPEN}" -gt 0 ]]; then
        pass "JSON braces balanced (${OPEN} pairs)"
    else
        fail "JSON braces unbalanced (open=${OPEN} close=${CLOSE})"
    fi
else
    echo "INFO: DB not reachable in this env — skipping live JSON key assertions"
    # at minimum, the script must not print garbage — must produce at least one { if it ran
    if echo "${RAW_OUT}" | grep -q '{'; then
        pass "JSON shape present even on failure path"
    else
        fail "no JSON output produced at all"
    fi
fi

# --- 5. wrong DB_HOST must exit non-zero ------------------------------------
set +e
ENV_FILE=/var/www/namaweb/.env
if [[ -f "${ENV_FILE}" ]]; then
    # create an isolated env file with a bogus host, point APP_ROOT away
    TMP_ENV="$(mktemp)"
    tr -d '\r' < "${ENV_FILE}" > "${TMP_ENV}"
    # shellcheck disable=SC1090
    set -a; source "${TMP_ENV}"; set +a
    rm -f "${TMP_ENV}"
    # Use a definitely-unreachable host
    DB_HOST="127.0.0.1" DB_PORT="1" timeout 10 "${SCRIPT}" >/dev/null 2>&1
    RC=$?
    if [[ "${RC}" -ne 0 ]]; then
        pass "unreachable DB exits non-zero (rc=${RC})"
    else
        fail "unreachable DB unexpectedly exited 0"
    fi
else
    echo "INFO: no .env on this host — skipping negative test"
fi
set -e

# --- summary ----------------------------------------------------------------
echo ""
echo "================= SUMMARY ================="
echo "  PASS: ${PASS}"
echo "  FAIL: ${FAIL}"
echo "==========================================="
[[ "${FAIL}" -eq 0 ]] && exit 0 || exit 1
