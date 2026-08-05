#!/bin/bash
# smoke_test.sh — end-to-end smoke test against PCC Sandbox
# USAGE: ./smoke_test.sh [BASE_URL]
# DEFAULT BASE_URL: http://localhost:3100
#
# Returns 0 if all tests pass, 1 if any fail.
# Respects $PCC_BASE env var if no arg supplied.

set -u

BASE_URL="${1:-${PCC_BASE:-http://localhost:3100}}"

smoke_get() {
  local name="$1"
  local path="$2"
  local grep_pattern="$3"
  local response
  response=$(curl -sS "$BASE_URL$path" 2>&1)
  if echo "$response" | grep -q "$grep_pattern"; then
    echo "  PASS $name"
    return 0
  else
    echo "  FAIL $name -- got: $(echo "$response" | head -c 100)"
    return 1
  fi
}

smoke_post() {
  local name="$1"
  local path="$2"
  local body="$3"
  local grep_pattern="$4"
  local response
  response=$(curl -sS -X POST -H "Content-Type: application/json" -d "$body" "$BASE_URL$path" 2>&1)
  if echo "$response" | grep -q "$grep_pattern"; then
    echo "  PASS $name"
    return 0
  else
    echo "  FAIL $name -- got: $(echo "$response" | head -c 100)"
    return 1
  fi
}

echo "PCC Sandbox smoke test -> $BASE_URL"
echo "============================================"

FAILED=0

smoke_get    "1. Catalog stats"        "/api/v1/pcc-catalog/stats"          '"modules":1'            || FAILED=$((FAILED+1))
smoke_get    "2. Module list"          "/api/v1/pcc-catalog/modules?limit=5" "pcc-"                || FAILED=$((FAILED+1))
smoke_get    "3. Search cardio"        "/api/v1/pcc-catalog/search?q=cardio&limit=2" "pcc-cardio"  || FAILED=$((FAILED+1))
smoke_get    "4. Audit endpoint"       "/api/v1/pcc-catalog/audit?limit=3"  '"entries"'             || FAILED=$((FAILED+1))
smoke_get    "5. Prometheus metrics"   "/_metrics"                          "pcc_uptime_seconds"    || FAILED=$((FAILED+1))
smoke_post   "6. GraphQL stats"        "/graphql/query"  '{"query":"{ stats { totalModules } }"}' '"totalModules":1322' || FAILED=$((FAILED+1))
smoke_get    "7. Coverage endpoint"    "/api/v1/pcc-catalog/coverage"       "total_categories"      || FAILED=$((FAILED+1))
smoke_get    "8. Duplicates endpoint"  "/api/v1/pcc-catalog/duplicates"     "total_duplicate_names" || FAILED=$((FAILED+1))

echo "============================================"
if [[ $FAILED -eq 0 ]]; then
  echo "ALL SMOKE TESTS PASSED"
  exit 0
else
  echo "FAILED: $FAILED test(s)"
  exit 1
fi
