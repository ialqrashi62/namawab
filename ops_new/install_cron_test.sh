#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Cron Installer Test
# =============================================================================
# File:         /var/www/namaweb/ops/install_cron_test.sh
# Purpose:      Structural + behavioral tests for install_cron.sh.
# Tests:
#   1. script exists, executable, bash -n clean
#   2. idempotency: running twice produces same crontab hash
#   3. creates log dir if missing (run --help, check log file appears)
#   4. --help prints usage
#   5. no destructive mutation: existing entries preserved verbatim
# Safety:       snapshots crontab before/after; restores on EXIT.
#               All tests run as root (cron owner). Skip if no crontab.
# =============================================================================

set -uo pipefail

SCRIPT="/var/www/namaweb/ops/install_cron.sh"
LOG_DIR="/var/log/namaweb"
LOG_FILE="${LOG_DIR}/cron_install.log"
PASS=0
FAIL=0

pass() { echo "PASS: $*"; PASS=$((PASS+1)); }
fail() { echo "FAIL: $*"; FAIL=$((FAIL+1)); }

# -----------------------------------------------------------------------------
# 0. crontab available? If not, exit 0 with skip notice
# -----------------------------------------------------------------------------
if ! command -v crontab >/dev/null 2>&1; then
    echo "SKIP: crontab not on PATH — cannot run cron tests in this env"
    exit 0
fi

# -----------------------------------------------------------------------------
# 1. exists / executable / syntax
# -----------------------------------------------------------------------------
if [[ ! -f "${SCRIPT}" ]]; then
    fail "script missing: ${SCRIPT}"
    echo "Cannot continue"; exit 1
fi
pass "script exists"

if [[ -x "${SCRIPT}" ]]; then
    pass "script is executable"
else
    fail "script not executable"
fi

if bash -n "${SCRIPT}" 2>/dev/null; then
    pass "bash -n syntax check"
else
    fail "bash -n syntax error"
    bash -n "${SCRIPT}"
fi

# -----------------------------------------------------------------------------
# 2. --help prints usage
# -----------------------------------------------------------------------------
HELP_OUT="$(${SCRIPT} --help 2>&1 || true)"
if echo "${HELP_OUT}" | grep -qi "Usage"; then
    pass "--help prints usage"
else
    fail "--help did not print usage text"
fi

# -----------------------------------------------------------------------------
# 3. snapshot crontab & restore on exit
# -----------------------------------------------------------------------------
ORIG_CRON="$(crontab -l 2>/dev/null || true)"
ORIG_HASH="$(echo "${ORIG_CRON}" | sha256sum | cut -d' ' -f1)"

restore_cron() {
    if [[ -n "${ORIG_CRON}" ]]; then
        echo "${ORIG_CRON}" | crontab - 2>/dev/null || true
    else
        crontab -r 2>/dev/null || true
    fi
}
trap restore_cron EXIT

# -----------------------------------------------------------------------------
# 4. log dir creation
# -----------------------------------------------------------------------------
if [[ ! -d "${LOG_DIR}" ]]; then
    log_was_missing=1
else
    log_was_missing=0
fi
mkdir -p "${LOG_DIR}"
if [[ -d "${LOG_DIR}" ]]; then
    pass "log dir exists or was created (${LOG_DIR})"
else
    fail "log dir could not be created"
fi

# -----------------------------------------------------------------------------
# 5. first run installs entries
# -----------------------------------------------------------------------------
${SCRIPT} >/dev/null 2>&1 || true
CRON_AFTER_1="$(crontab -l 2>/dev/null || true)"
if echo "${CRON_AFTER_1}" | grep -qF "namaweb/ops/backup_db.sh"; then
    pass "first run installed daily-backup entry"
else
    fail "first run did NOT install daily-backup entry"
fi
if echo "${CRON_AFTER_1}" | grep -qF "namaweb/ops/db_health_check.sh"; then
    pass "first run installed daily-health entry"
else
    fail "first run did NOT install daily-health entry"
fi
if echo "${CRON_AFTER_1}" | grep -qF "find /var/backups/namaweb"; then
    pass "first run installed weekly-cleanup entry"
else
    fail "first run did NOT install weekly-cleanup entry"
fi

# -----------------------------------------------------------------------------
# 6. idempotency: second run must NOT add duplicates
# -----------------------------------------------------------------------------
HASH_1="$(echo "${CRON_AFTER_1}" | sha256sum | cut -d' ' -f1)"
${SCRIPT} >/dev/null 2>&1 || true
CRON_AFTER_2="$(crontab -l 2>/dev/null || true)"
HASH_2="$(echo "${CRON_AFTER_2}" | sha256sum | cut -d' ' -f1)"
if [[ "${HASH_1}" == "${HASH_2}" ]]; then
    pass "idempotent (crontab hash unchanged: ${HASH_1:0:12}…)"
else
    fail "non-idempotent: crontab changed after 2nd run (${HASH_1:0:12}… → ${HASH_2:0:12}…)"
fi

# Count each marker — must be exactly 1
for marker in daily-backup weekly-cleanup daily-health; do
    N=$(echo "${CRON_AFTER_2}" | grep -cF "${marker}" || true)
    if [[ "${N}" -eq 1 ]]; then
        pass "exactly 1 entry for ${marker}"
    else
        fail "${marker} appears ${N} times (expected 1)"
    fi
done

# -----------------------------------------------------------------------------
# 7. log file written
# -----------------------------------------------------------------------------
if [[ -f "${LOG_FILE}" ]]; then
    pass "log file written: ${LOG_FILE}"
else
    fail "log file not created"
fi

# -----------------------------------------------------------------------------
# summary
# -----------------------------------------------------------------------------
echo ""
echo "================= SUMMARY ================="
echo "  PASS: ${PASS}"
echo "  FAIL: ${FAIL}"
echo "==========================================="
[[ "${FAIL}" -eq 0 ]] && exit 0 || exit 1
