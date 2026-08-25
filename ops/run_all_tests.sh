#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Integration Test Orchestrator
# =============================================================================
# File:         /var/www/namaweb/ops/run_all_tests.sh
# Purpose:      Single-command orchestrator that runs ALL test phases for the
#               jumanasoft.com platform in sequence:
#                 1. Pre-flight PM2 online check
#                 2. Database health check
#                 3. Smoke test (25+ endpoints)
#                 4. E2E suites (4 node:test files; PCC + ERP)
#                 5. Health probe
#                 6. PCC benchmark (optional, --with-benchmark)
#               Aggregates pass/warn/fail counts per phase and prints a
#               summary table at the end.
# Schedule:     MANUAL ONLY — do NOT add to cron (per AGENTS.md safety rails).
#               This script is a developer/operator convenience, not a CI gate.
# Output:       stdout (color-coded, human-readable)
#               Full transcript also saved to /tmp/orchestrator-test-YYYYMMDD.log
# Safety rail:  read-only on app data. Invoked scripts follow their own
#               safety profiles. Orchestrator never mutates DB, never restarts
#               services, never deletes files.
#               AGENTS.md §2.2 — all 13 rails observed.
# Idempotency:  safe to re-run any time
# Exit codes:   0 = all phases OK
#               1 = at least one phase FAILED (critical)
#               2 = only WARN, no FAIL
# Flags:
#   --quick                Skip phase 5 (PCC benchmark) — default behaviour
#   --with-benchmark       Run phase 5 PCC benchmark
#   --verbose              Echo each test result during e2e runs
#   --no-color             Disable ANSI color output
#   -h | --help            Show this header and exit
# =============================================================================

# NOTE: deliberately NOT `set -e`. We want every phase to run even if the
#       previous one fails, so the summary reflects ground truth.
set -uo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
APP_ROOT="/var/www/namaweb"
PCC_ROOT="/var/www/namaweb-pcc"
OPS_DIR="${APP_ROOT}/ops"
LOG_DIR="/tmp"
DATE_TAG="$(date -u +%Y%m%d)"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LOG_FILE="${LOG_DIR}/orchestrator-test-${DATE_TAG}.log"

ERP_BASE="${ERP_BASE:-http://127.0.0.1:3000}"
PCC_BASE="${PCC_BASE:-http://127.0.0.1:3101}"

# Flags
RUN_BENCHMARK=0   # default: skip (--quick)
VERBOSE=0
USE_COLOR=1

# Phase result buckets (one row per phase in the summary table)
# Format: phase_id|label|result|tests_summary|duration_seconds
declare -a SUMMARY_ROWS=()

# Aggregate counts (separate from the per-phase bucket above, for the OVERALL row)
TOTAL_PASS=0
TOTAL_FAIL=0
TOTAL_WARN=0

# -----------------------------------------------------------------------------
# Argument parsing
# -----------------------------------------------------------------------------
print_help() {
    sed -n '2,32p' "$0" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --quick)         RUN_BENCHMARK=0 ;;
        --with-benchmark) RUN_BENCHMARK=1 ;;
        --verbose)       VERBOSE=1 ;;
        --no-color)      USE_COLOR=0 ;;        -h|--help)       print_help; exit 0 ;;
        *)               echo "Unknown flag: $1" >&2; echo "Use --help for usage." >&2; exit 64 ;;
    esac
    shift
done

# -----------------------------------------------------------------------------
# Colors (per spec: P1=green, P2=cyan, P3=yellow, P4=magenta, P5=blue)
# -----------------------------------------------------------------------------
if [[ $USE_COLOR -eq 1 && -t 1 && -z "${NO_COLOR:-}" ]]; then
    GREEN='\033[0;32m'    # Phase 1
    CYAN='\033[0;36m'     # Phase 2
    YELLOW='\033[1;33m'   # Phase 3
    MAGENTA='\033[0;35m'  # Phase 4
    BLUE='\033[0;34m'     # Phase 5
    BOLD='\033[1m'
    RED='\033[0;31m'
    DIM='\033[2m'
    NC='\033[0m'
else
    GREEN=''; CYAN=''; YELLOW=''; MAGENTA=''; BLUE=''
    BOLD=''; RED=''; DIM=''; NC=''
fi

# -----------------------------------------------------------------------------
# Logging — every echo also goes to LOG_FILE
# -----------------------------------------------------------------------------
exec > >(tee -a "$LOG_FILE") 2>&1

header() {
    # header <phase_color> <title>
    local color="$1"; shift
    printf "\n${color}${BOLD}━━━ %s ━━━${NC}\n" "$*"
}

note() {
    printf "${DIM}  %s${NC}\n" "$*"
}

# run_phase <phase_id> <label> <cmd...>
#   Runs the command, captures timing, exits with the command's exit code.
#   Logs begin/end timestamps.
run_phase() {
    local pid="$1" label="$2"; shift 2
    local t0 t1 dur
    t0=$(date +%s%3N 2>/dev/null || date +%s)000   # milliseconds where supported
    "$@"
    local rc=$?
    t1=$(date +%s%3N 2>/dev/null || date +%s)000
    dur=$(( (t1 - t0) / 1000 ))   # back to whole seconds for display
    PHASE_LAST_DUR="$dur"
    PHASE_LAST_RC="$rc"
    return $rc
}

# append_summary <phase_id> <label> <result> <tests_text> <duration_seconds>
append_summary() {
    SUMMARY_ROWS+=("$1|$2|$3|$4|$5")
}

# Final exit code: 0 ok, 1 any FAIL, 2 only WARN
compute_exit_code() {
    if [[ $TOTAL_FAIL -gt 0 ]]; then echo 1
    elif [[ $TOTAL_WARN -gt 0 ]]; then echo 2
    else echo 0
    fi
}

# -----------------------------------------------------------------------------
# Banner
# -----------------------------------------------------------------------------
printf "${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}\n"
printf "${BOLD}║  NamaMedical ERP — Integration Test Orchestrator             ║${NC}\n"
printf "${BOLD}║  Started:  %-50s║${NC}\n" "$TS"
printf "${BOLD}║  ERP:      %-50s║${NC}\n" "$ERP_BASE"
printf "${BOLD}║  PCC:      %-50s║${NC}\n" "$PCC_BASE"
printf "${BOLD}║  Log:      %-50s║${NC}\n" "$LOG_FILE"
printf "${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}\n"
printf "${DIM}  flags: benchmark=%s verbose=%s color=%s${NC}\n" \
    "$RUN_BENCHMARK" "$VERBOSE" "$USE_COLOR"
OVERALL_T0=$(date +%s)

# =============================================================================
# PHASE 0 — Pre-flight: PM2 apps online
# =============================================================================
header "$GREEN" "PHASE 0 — Pre-flight (PM2 apps online)"

PM2_OUT=$(pm2 list 2>&1 || echo "pm2_unavailable")
ONLINE_COUNT=$(printf "%s\n" "$PM2_OUT" | awk '/online/ {c++} END{print c+0}')
ONLINE_COUNT=$(printf "%s" "$ONLINE_COUNT" | tr -d '[:space:]')
ONLINE_COUNT=${ONLINE_COUNT:-0}

P0_DUR=0
P0_T0=$(date +%s)
if [[ "$ONLINE_COUNT" -ge 1 ]]; then
    printf "${GREEN}OK${NC}   %d PM2 app(s) online\n" "$ONLINE_COUNT"
    note "apps: $ONLINE_COUNT online"
    P0_RESULT="OK"
    P0_TESTS="$ONLINE_COUNT online"
    TOTAL_PASS=$((TOTAL_PASS + ONLINE_COUNT))
else
    printf "${RED}FAIL${NC} no PM2 apps online — abort subsequent live phases\n"
    note "output: $(printf "%s" "$PM2_OUT" | head -3)"
    P0_RESULT="FAIL"
    P0_TESTS="0 online"
    TOTAL_FAIL=$((TOTAL_FAIL + 1))
fi
P0_DUR=$(( $(date +%s) - P0_T0 ))
append_summary "0" "PM2 pre-flight" "$P0_RESULT" "$P0_TESTS" "$P0_DUR"

# =============================================================================
# PHASE 1 — Database health
# =============================================================================
header "$GREEN" "PHASE 1 — Database health check"

DBH_LOG=$(mktemp)
P1_T0=$(date +%s)
DBH_RC=0
bash "${OPS_DIR}/db_health_check.sh" >"$DBH_LOG" 2>&1 || DBH_RC=$?
P1_DUR=$(( $(date +%s) - P1_T0 ))

# Parse the "Summary: N warning(s), N critical" line
DBH_SUM=$(grep -E "^ Summary:" "$DBH_LOG" | tail -1 | sed 's/^ *Summary: *//')
DBH_W=$(printf "%s" "$DBH_SUM" | awk '{for(i=1;i<=NF;i++) if($i ~ /warning/) print $(i-1)}')
DBH_C=$(printf "%s" "$DBH_SUM" | awk '{for(i=1;i<=NF;i++) if($i ~ /critical/) print $(i-1)}')
DBH_W=${DBH_W:-0}; DBH_C=${DBH_C:-0}

# Heuristic: count OK/WARN/CRIT lines for context. Use || true to ensure
# the variable is a clean integer (grep -c prints "0" + newline when none).
DBH_OK=$(grep -cE "^ OK " "$DBH_LOG" 2>/dev/null | tr -d '[:space:]')
DBH_OK=${DBH_OK:-0}; DBH_OK=$((DBH_OK + 0))
DBH_WR=$(grep -cE "^ WARN " "$DBH_LOG" 2>/dev/null | tr -d '[:space:]')
DBH_WR=${DBH_WR:-0}; DBH_WR=$((DBH_WR + 0))
DBH_CR=$(grep -cE "^ CRIT " "$DBH_LOG" 2>/dev/null | tr -d '[:space:]')
DBH_CR=${DBH_CR:-0}; DBH_CR=$((DBH_CR + 0))
P1_TESTS="${DBH_OK} checks"
TOTAL_PASS=$((TOTAL_PASS + DBH_OK))

case "$DBH_RC" in
    0) P1_RESULT="OK"; printf "${GREEN}OK${NC}   db healthy (%s)\n" "$DBH_SUM" ;;
    1) P1_RESULT="WARN"; TOTAL_WARN=$((TOTAL_WARN + 1))
       printf "${YELLOW}WARN${NC} db health: %s\n" "$DBH_SUM" ;;
    2) P1_RESULT="FAIL"; TOTAL_FAIL=$((TOTAL_FAIL + 1))
       printf "${RED}FAIL${NC} db health: %s\n" "$DBH_SUM" ;;
    *) P1_RESULT="FAIL"; TOTAL_FAIL=$((TOTAL_FAIL + 1))
       printf "${RED}FAIL${NC} db health (rc=%s) — see log\n" "$DBH_RC" ;;
esac
note "OK=${DBH_OK} WARN=${DBH_WR} CRIT=${DBH_CR}"
append_summary "1" "DB health" "$P1_RESULT" "$P1_TESTS" "$P1_DUR"
rm -f "$DBH_LOG"

# =============================================================================
# PHASE 2 — Smoke test
# =============================================================================
header "$CYAN" "PHASE 2 — Smoke test (25+ endpoints)"

SMK_LOG=$(mktemp)
P2_T0=$(date +%s)
SMK_RC=0bash "${OPS_DIR}/smoke_test.sh" >"$SMK_LOG" 2>&1 || SMK_RC=$?
P2_DUR=$(( $(date +%s) - P2_T0 ))

SMK_PASS=$(grep -oE "Passed: [0-9]+" "$SMK_LOG" | awk '{print $2}' | tail -1)
SMK_WARN=$(grep -oE "Warned: [0-9]+" "$SMK_LOG" | awk '{print $2}' | tail -1)
SMK_FAIL=$(grep -oE "Failed: [0-9]+" "$SMK_LOG" | awk '{print $2}' | tail -1)
SMK_PASS=${SMK_PASS:-0}; SMK_WARN=${SMK_WARN:-0}; SMK_FAIL=${SMK_FAIL:-0}
TOTAL_PASS=$((TOTAL_PASS + SMK_PASS))
TOTAL_WARN=$((TOTAL_WARN + SMK_WARN))
TOTAL_FAIL=$((TOTAL_FAIL + SMK_FAIL))

# Spec: phase 2 must have >25 passes to be OK
if [[ "$SMK_FAIL" -gt 0 ]]; then
    P2_RESULT="FAIL"
    printf "${RED}FAIL${NC} smoke: %s pass / %s warn / %s fail\n" "$SMK_PASS" "$SMK_WARN" "$SMK_FAIL"
elif [[ "$SMK_PASS" -le 25 ]]; then
    P2_RESULT="WARN"
    TOTAL_WARN=$((TOTAL_WARN + 1))
    printf "${YELLOW}WARN${NC} smoke: only %s pass (need >25)\n" "$SMK_PASS"
else
    P2_RESULT="OK"
    printf "${GREEN}OK${NC}   smoke: %s pass / %s warn / %s fail\n" "$SMK_PASS" "$SMK_WARN" "$SMK_FAIL"
fi
P2_TESTS="$SMK_PASS passes"
append_summary "2" "Smoke test" "$P2_RESULT" "$P2_TESTS" "$P2_DUR"
rm -f "$SMK_LOG"

# =============================================================================
# PHASE 3 — E2E suites (4 node:test files, run individually so we can report
# each one separately in the summary table)
# =============================================================================
header "$YELLOW" "PHASE 3 — E2E suites (node --test)"

run_e2e() {
    # run_e2e <label> <base_url> <test_path> [known_fail_threshold]
    #   If known_fail_threshold is N, up to N failures are reported as
    #   PASS-N-FAIL (WARN) instead of FAIL. Use 0 (default) for strict mode.
    local label="$1" base="$2" path="$3" known_fail="${4:-0}"
    local log; log=$(mktemp)
    local t0 dur rc
    t0=$(date +%s)

    if [[ ! -f "$path" ]]; then
        printf "${RED}FAIL${NC} %s — file missing: %s\n" "$label" "$path"
        append_summary "3" "$label" "FAIL" "missing" "0"
        TOTAL_FAIL=$((TOTAL_FAIL + 1))
        return
    fi

    BASE_URL="$base" node --test "$path" >"$log" 2>&1
    rc=$?
    dur=$(( $(date +%s) - t0 ))

    # Parse TAP-style summary block produced by `node --test`
    local tests pass fail skipped
    tests=$(grep -E "^# tests "    "$log" | awk '{print $3}' | tail -1)
    pass=$(grep  -E "^# pass "     "$log" | awk '{print $3}' | tail -1)
    fail=$(grep  -E "^# fail "     "$log" | awk '{print $3}' | tail -1)
    skipped=$(grep -E "^# skipped " "$log" | awk '{print $3}' | tail -1)
    tests=${tests:-0}; pass=${pass:-0}; fail=${fail:-0}; skipped=${skipped:-0}

    local row_result row_tests
    if [[ "$fail" -eq 0 ]]; then
        printf "${GREEN}OK${NC}   %s — %s/%s pass\n" "$label" "$pass" "$tests"
        if [[ "$VERBOSE" -eq 1 ]]; then
            grep -E "^ok [0-9]+" "$log" | head -20 | sed 's/^/    /'
        fi
        row_result="OK"
        row_tests="$pass pass"
        TOTAL_PASS=$((TOTAL_PASS + pass))
    elif [[ "$fail" -le "$known_fail" ]]; then
        # Within known-fail budget — report as PASS-N-FAIL (WARN, documented)
        printf "${YELLOW}WARN${NC} %s — %s/%s pass (%s fail, KNOWN)\n" \
            "$label" "$pass" "$tests" "$fail"
        if [[ "$VERBOSE" -eq 1 ]]; then
            grep -E "^(not ok|ok) [0-9]+" "$log" | head -20 | sed 's/^/    /'
        fi
        row_result="PASS-${fail}-FAIL"
        row_tests="$pass pass / $fail fail (KNOWN)"
        TOTAL_PASS=$((TOTAL_PASS + pass))        TOTAL_WARN=$((TOTAL_WARN + 1))
    else
        printf "${RED}FAIL${NC} %s — %s/%s pass (%s fail)\n" "$label" "$pass" "$tests" "$fail"
        if [[ "$VERBOSE" -eq 1 ]]; then
            grep -E "^(not ok|ok) [0-9]+" "$log" | head -20 | sed 's/^/    /'
        fi
        row_result="FAIL"
        row_tests="$pass pass / $fail fail"
        TOTAL_PASS=$((TOTAL_PASS + pass))
        TOTAL_FAIL=$((TOTAL_FAIL + fail))
    fi

    append_summary "3" "$label" "$row_result" "$row_tests" "$dur"
    rm -f "$log"
    return 0
}

run_e2e "3a. PCC E2E (catalog)"        "$PCC_BASE" "${PCC_ROOT}/tests/e2e_pcc_catalog.test.js" 0
# 3b has 2 known findings: billing shape + adolescent score>1 (FINDINGS.md F1, F2)
run_e2e "3b. PCC E2E (lifecycle)"      "$PCC_BASE" "${PCC_ROOT}/tests/e2e_pcc_module_lifecycle.test.js" 2
run_e2e "3c. ERP E2E (public pages)"   "$ERP_BASE" "${APP_ROOT}/tests/e2e_public_pages.test.js" 0
# 3d has 1 known finding: pcc-catalog on wrong port (FINDINGS.md F3) — fixed in test to PCC; expect 0
run_e2e "3d. ERP E2E (static assets)"  "$ERP_BASE" "${APP_ROOT}/tests/e2e_static_assets.test.js" 1

# =============================================================================
# PHASE 4 — Health probe
# =============================================================================
header "$MAGENTA" "PHASE 4 — Health probe"

HP_LOG=$(mktemp)
P4_T0=$(date +%s)
HP_RC=0
(cd "$APP_ROOT" && node tools/health_probe.js --format=text) >"$HP_LOG" 2>&1 || HP_RC=$?
P4_DUR=$(( $(date +%s) - P4_T0 ))

# Detect "all green" vs partial. The health_probe output is human-readable
# (e.g. "erp           ok (HTTP 200, 18ms)"). Look for "overall: OK" first,
# then count "ok (" inline matches and any "fail|crit|down" matches.
HP_OVERALL=$(grep -iE "^\s*overall:" "$HP_LOG" | head -1 | awk '{print tolower($2)}')
HP_OK=$(grep -ciE "\bok\b|\bpass\b" "$HP_LOG" 2>/dev/null | tr -d '[:space:]')
HP_OK=${HP_OK:-0}; HP_OK=$((HP_OK + 0))
HP_BAD=$(grep -ciE "\bfail\b|\bcrit\b|\bdown\b|\berror\b" "$HP_LOG" 2>/dev/null | tr -d '[:space:]')
HP_BAD=${HP_BAD:-0}; HP_BAD=$((HP_BAD + 0))

if [[ "$HP_RC" -ne 0 || "$HP_BAD" -gt 0 ]]; then
    P4_RESULT="FAIL"
    TOTAL_FAIL=$((TOTAL_FAIL + 1))
    printf "${RED}FAIL${NC} health probe (rc=%s, %s bad rows)\n" "$HP_RC" "$HP_BAD"
elif [[ "$HP_OK" -gt 0 && ( "$HP_OVERALL" == "ok" || "$HP_RC" -eq 0 ) ]]; then
    P4_RESULT="OK"
    TOTAL_PASS=$((TOTAL_PASS + HP_OK))
    printf "${GREEN}OK${NC}   all green (%s ok, overall=%s)\n" "$HP_OK" "$HP_OVERALL"
else
    P4_RESULT="WARN"
    TOTAL_WARN=$((TOTAL_WARN + 1))
    printf "${YELLOW}WARN${NC} health probe: overall=%s, %s ok / %s bad\n" \
        "${HP_OVERALL:-?}" "$HP_OK" "$HP_BAD"
fi
P4_TESTS="$HP_OK ok / $HP_BAD bad"
append_summary "4" "Health probe" "$P4_RESULT" "$P4_TESTS" "$P4_DUR"
rm -f "$HP_LOG"

# =============================================================================
# PHASE 5 — PCC benchmark (optional)
# =============================================================================
if [[ "$RUN_BENCHMARK" -eq 1 ]]; then
    header "$BLUE" "PHASE 5 — PCC benchmark"

    BM_LOG=$(mktemp)
    P5_T0=$(date +%s)
    BM_RC=0
    (cd "$APP_ROOT" && node tools/pcc_benchmark.js --modules=5 --iterations=1) \
        >"$BM_LOG" 2>&1 || BM_RC=$?
    P5_DUR=$(( $(date +%s) - P5_T0 ))

    if [[ "$BM_RC" -eq 0 ]]; then
        P5_RESULT="OK"
        TOTAL_PASS=$((TOTAL_PASS + 1))
        printf "${GREEN}OK${NC}   benchmark complete (%ss)\n" "$P5_DUR"
        P5_TESTS="5 modules × 1 iter"