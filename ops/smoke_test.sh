#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Post-Deploy Smoke Test
# =============================================================================
# File:         /var/www/namaweb/ops/smoke_test.sh
# Purpose:      Single-shot end-to-end smoke test for jumanasoft.com after
#               a deploy or config change. Covers system health, public
#               marketing pages, static assets, public+protected APIs, and
#               PCC module function call paths.
# Schedule:     MANUAL ONLY — do NOT add to cron (per AGENTS.md safety rails)
# Output:       stdout (human-readable, color-coded)
# Safety rail:  read-only. No DB writes, no DELETE, no secret printing.
#               AGENTS.md §2.2 — all 13 rails observed.
# JSON parse:   python3 (server has python3.10, no jq)
# Idempotency:  safe to re-run; side-effect free
# Exit codes:   0 = all checks PASS
#               1 = at least one FAIL
#               2 = only WARN (no FAIL)
# =============================================================================

# NOTE: deliberately NOT `set -e`. Smoke tests must keep running through
#       individual failures so the summary reflects reality.
set -uo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
BASE_URL="https://jumanasoft.com"
APP_ROOT="/var/www/namaweb"
START_TIME=$(date +%s)
START_TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Thresholds
DISK_WARN_PCT="${DISK_WARN_PCT:-80}"
MEM_WARN_PCT="${MEM_WARN_PCT:-90}"
CATALOG_MIN_MODULES="${CATALOG_MIN_MODULES:-700}"
PCC_FN_MIN_COUNT="${PCC_FN_MIN_COUNT:-1}"

# Severity counters
PASS=0
WARN=0
FAIL=0

# Colors (disabled if NO_COLOR set or non-tty)
if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    BLUE='\033[0;34m'
    NC='\033[0m'
else
    GREEN=''; YELLOW=''; RED=''; BLUE=''; NC=''
fi

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
record_pass() { printf "  ${GREEN}PASS${NC} %s\n" "$1"; PASS=$((PASS + 1)); }
record_warn() { printf "  ${YELLOW}WARN${NC} %s — %s\n" "$1" "${2:-}"; WARN=$((WARN + 1)); }
record_fail() { printf "  ${RED}FAIL${NC} %s — %s\n" "$1" "${2:-}"; FAIL=$((FAIL + 1)); }
section()      { printf "\n${BLUE}== %s ==${NC}\n" "$1"; }

# http_status <url> [expected_code] [allow_codes_csv]
#   If expected_code given, FAIL on mismatch.
#   If allow_codes_csv given (e.g. "200,403"), accept any of those, else FAIL.
http_status() {
    local url="$1" expected="${2:-}" allow="${3:-}"
    local code
    code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 10 "$url" 2>/dev/null || echo 000)
    if [[ -n "$expected" && "$code" == "$expected" ]]; then
        echo "$code"
        return 0
    fi
    if [[ -n "$allow" ]]; then
        if [[ ",${allow}," == *",${code},"* ]]; then
            echo "$code"
            return 0
        fi
    fi
    echo "$code"
    return 1
}

# json_get <body> <python_expression_on_d>
#   e.g. json_get "$body" 'd.get("functions") and len(d["functions"])'
json_get() {
    local body="$1" expr="$2"
    python3 -c "import sys,json; d=json.loads(sys.argv[1]); print($expr)" "$body"
}

# -----------------------------------------------------------------------------
# 1. System health (5 checks)
# -----------------------------------------------------------------------------
section "1. System health"

# 1.1 PM2 process status — both apps must be 'online'
PM2_OUT=$(pm2 jlist 2>/dev/null || echo '[]')
PM2_SUMMARY=$(python3 - "$PM2_OUT" <<'PY'
import sys, json
try:
    apps = json.loads(sys.argv[1])
except Exception:
    apps = []
wanted = {"nama-medical-erp", "nama-medical-pcc"}
rows = []
for a in apps:
    name = a.get("name", "?")
    if name in wanted:
        status = a.get("pm2_env", {}).get("status", "?")
        uptime = a.get("pm2_env", {}).get("pm_uptime", 0)
        restarts = a.get("pm2_env", {}).get("unstable_restarts", 0)
        rows.append(f"{name}|{status}|{uptime}|{restarts}")
print("\n".join(rows))
PY
)
PM2_BAD=""
while IFS='|' read -r n s u r; do
    [[ -z "$n" ]] && continue
    if [[ "$s" == "online" ]]; then
        record_pass "pm2: $n status=online (uptime=${u}s restarts=${r})"
    else
        record_fail "pm2: $n status=$s (expected online)"
        PM2_BAD="yes"
    fi
done <<< "$PM2_SUMMARY"
if [[ -z "$PM2_SUMMARY" ]]; then
    record_fail "pm2: no apps returned from pm2 jlist"
fi

# 1.2 nginx config syntax
if nginx -t >/dev/null 2>&1; then
    record_pass "nginx: config syntax OK"
else
    record_fail "nginx: config syntax error"
fi

# 1.3 Disk usage — warn if any mount > DISK_WARN_PCT
DISK_LINE=$(df -h /var/www /var/lib/postgresql 2>/dev/null | awk 'NR>1 && $5+0 > '"$DISK_WARN_PCT"' {print $6" "$5}')
if [[ -n "$DISK_LINE" ]]; then
    record_warn "disk usage > ${DISK_WARN_PCT}%" "$DISK_LINE"
else
    record_pass "disk usage OK (<= ${DISK_WARN_PCT}% on /var/www, /var/lib/postgresql)"
fi

# 1.4 Memory — warn if used/total > MEM_WARN_PCT
MEM_PCT=$(free -m | awk '/Mem:/ {if ($2>0) printf "%.0f", $3/$2*100; else print 0}')
if [[ "${MEM_PCT:-0}" -gt "$MEM_WARN_PCT" ]]; then
    record_warn "memory high" "used=${MEM_PCT}% (warn > ${MEM_WARN_PCT}%)"
else
    record_pass "memory OK (used=${MEM_PCT}% <= ${MEM_WARN_PCT}%)"
fi

# 1.5 TLS cert expiry — warn if < 14 days
CERT_NOTAFTER=$(openssl s_client -connect jumanasoft.com:443 -servername jumanasoft.com \
    < /dev/null 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null \
    | sed 's/^notAfter=//')
if [[ -z "$CERT_NOTAFTER" ]]; then
    record_warn "TLS cert: could not read notAfter" "(firewall or self-signed chain)"
else
    CERT_EPOCH=$(date -d "$CERT_NOTAFTER" +%s 2>/dev/null || echo 0)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (CERT_EPOCH - NOW_EPOCH) / 86400 ))
    if [[ "$DAYS_LEFT" -lt 14 ]]; then
        record_warn "TLS cert expires soon" "notAfter=$CERT_NOTAFTER (${DAYS_LEFT}d left)"
    else
        record_pass "TLS cert OK (notAfter=$CERT_NOTAFTER, ${DAYS_LEFT}d left)"
    fi
fi

# -----------------------------------------------------------------------------
# 2. Public endpoints (10 checks)
# -----------------------------------------------------------------------------
section "2. Public endpoints"

PUBLIC_URLS=(
    "/"
    "/about/"
    "/pcc-catalog/"
    "/solutions/"
    "/departments/"
    "/manifest.json"
    "/sw.js"
    "/offline.html"
    "/sitemap.xml"
    "/openapi-pcc.yaml"   # intentional 403 per AGENTS.md §2.2 rail 1
)

for path in "${PUBLIC_URLS[@]}"; do
    url="${BASE_URL}${path}"
    if [[ "$path" == "/openapi-pcc.yaml" ]]; then
        code=$(http_status "$url" "" "200,403") && {
            if [[ "$code" == "200" ]]; then
                record_pass "public $path (200)"
            else
                record_warn "public $path (403 — nginx blocks .yaml by design; file is reachable from server)"
            fi
        } || record_fail "public $path" "got unexpected code"
    else
        if code=$(http_status "$url" "200"); then
            record_pass "public $path (200)"
        else
            record_fail "public $path" "got $code (expected 200)"
        fi
    fi
done

# -----------------------------------------------------------------------------
# 3. Authenticated endpoints (3 checks)
# -----------------------------------------------------------------------------
section "3. Authenticated endpoints"

# 3.1 /api/public/plans → 200
if code=$(http_status "${BASE_URL}/api/public/plans" "200"); then
    record_pass "/api/public/plans (200)"
else
    record_fail "/api/public/plans" "got $code"
fi

# 3.2 /api/super-admin/plans no auth → 401
if code=$(http_status "${BASE_URL}/api/super-admin/plans" "401"); then
    record_pass "/api/super-admin/plans (401 unauthorized, as expected)"
else
    record_fail "/api/super-admin/plans" "got $code (expected 401)"
fi

# 3.3 /api/v1/pcc-catalog/modules → 200, count > CATALOG_MIN_MODULES
CATALOG_BODY=$(curl -sk --max-time 10 "${BASE_URL}/api/v1/pcc-catalog/modules" || echo "")
if [[ -z "$CATALOG_BODY" ]]; then
    record_fail "pcc-catalog/modules" "empty body"
else
    CAT_COUNT=$(json_get "$CATALOG_BODY" 'len(d.get("modules") or d.get("data") or [])' 2>/dev/null || echo 0)
    if [[ "${CAT_COUNT:-0}" -ge "$CATALOG_MIN_MODULES" ]]; then
        record_pass "pcc-catalog/modules count=${CAT_COUNT} (>= ${CATALOG_MIN_MODULES})"
    else
        record_fail "pcc-catalog/modules" "count=${CAT_COUNT} (expected >= ${CATALOG_MIN_MODULES})"
    fi
fi

# -----------------------------------------------------------------------------
# 4. PCC module API (8 checks: 4 modules × {/list, /call})
# -----------------------------------------------------------------------------
section "4. PCC module API"

# test_module <module_slug> <function_name> <min_function_count>
# test_module <module_slug> <min_function_count>
#   Auto-discovers first function name from /list (more robust than hardcoding)
test_module() {
    local mod="$1" min_fn="$2"
    local list_body fn_count first_fn

    # /list → expect 200, JSON has 'functions' array of length >= min_fn
    list_body=$(curl -sk --max-time 10 "${BASE_URL}/api/v1/${mod}/list" || echo "")
    if [[ -z "$list_body" ]]; then
        record_fail "pcc:${mod}/list" "empty body"
        return
    fi

    fn_count=$(json_get "$list_body" 'len(d.get("functions") or [])' 2>/dev/null || echo 0)
    if [[ "${fn_count:-0}" -ge "$min_fn" ]]; then
        record_pass "pcc:${mod}/list (functions=${fn_count} >= ${min_fn})"
    else
        record_fail "pcc:${mod}/list" "functions=${fn_count} (expected >= ${min_fn})"
        return
    fi

    # Auto-discover first function name
    first_fn=$(json_get "$list_body" '((d.get("functions") or [None])[0])' 2>/dev/null || echo "")
    if [[ -z "$first_fn" || "$first_fn" == "None" ]]; then
        record_fail "pcc:${mod}/call" "no function name discovered"
        return
    fi

    # /call/<func> → expect 200, JSON has numeric 'score'
    local call_body score
    call_body=$(curl -sk --max-time 10 -X POST \
        "${BASE_URL}/api/v1/${mod}/call/${first_fn}" \
        -H 'Content-Type: application/json' \
        -d '{}' || echo "")
    if [[ -z "$call_body" ]]; then
        record_fail "pcc:${mod}/call/${first_fn}" "empty body"
        return
    fi

    score=$(json_get "$call_body" 'repr(d.get("score"))' 2>/dev/null || echo None)
    # numeric check (int or float)
    if [[ "$score" =~ ^-?[0-9]+(\.[0-9]+)?$ ]]; then
        record_pass "pcc:${mod}/call/${first_fn} (score=${score})"
    else
        record_fail "pcc:${mod}/call/${first_fn}" "score=${score} (not numeric)"
    fi
}

# Live probe (2026-07-29): each module returns 10 functions; assert >= 1
# so this remains valid as the catalog grows or shrinks.
test_module "pcc-cardiology-ext102"     "$PCC_FN_MIN_COUNT"
test_module "pcc-adolescent-ext101"     "$PCC_FN_MIN_COUNT"
test_module "pcc-endocrinology-ext102"  "$PCC_FN_MIN_COUNT"
test_module "pcc-anesthesiology-ext102" "$PCC_FN_MIN_COUNT"

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "=== Summary ==="
printf "  ${GREEN}Passed${NC}: %d\n" "$PASS"
printf "  ${YELLOW}Warned${NC}: %d\n" "$WARN"
printf "  ${RED}Failed${NC}: %d\n" "$FAIL"
printf "  Duration: %ds\n" "$DURATION"
printf "  Started:  %s\n" "$START_TS"

# Exit code: 0 pass, 2 warn-only, 1 fail
if [[ "$FAIL" -gt 0 ]]; then
    exit 1
elif [[ "$WARN" -gt 0 ]]; then
    exit 2
else
    exit 0
fi