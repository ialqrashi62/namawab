#!/bin/bash
# health_check.sh — probes PCC Sandbox endpoints
# USAGE: ./health_check.sh [BASE_URL]
# DEFAULT BASE_URL: http://localhost:3100
#
# Returns 0 if all probes pass, 1 if any fail.
# Respects $PCC_BASE env var if no arg supplied.

set -u

BASE_URL="${1:-${PCC_BASE:-http://localhost:3100}}"

check_endpoint() {
  local name="$1"
  local path="$2"
  local expected="${3:-200}"
  local actual
  actual=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL$path" 2>&1)
  if [[ "$actual" == "$expected" ]]; then
    echo "  PASS $name ($path) -> $actual"
    return 0
  else
    echo "  FAIL $name ($path) -> $actual (expected $expected)"
    return 1
  fi
}

echo "PCC Sandbox health check -> $BASE_URL"
echo "============================================"

FAILED=0

check_endpoint "Health"        "/health"           200 || FAILED=$((FAILED+1))
check_endpoint "Liveness"      "/livez"            200 || FAILED=$((FAILED+1))
check_endpoint "Readiness"     "/readyz"           200 || FAILED=$((FAILED+1))
check_endpoint "Metrics"       "/_metrics"         200 || FAILED=$((FAILED+1))
check_endpoint "Catalog Stats" "/api/v1/pcc-catalog/stats" 200 || FAILED=$((FAILED+1))
check_endpoint "Catalog Ping"  "/api/v1/pcc-catalog/ping"  200 || FAILED=$((FAILED+1))

echo "============================================"
if [[ $FAILED -eq 0 ]]; then
  echo "ALL GREEN"
  exit 0
else
  echo "FAILED: $FAILED check(s)"
  exit 1
fi
