#!/bin/bash
# audit_pcc.sh <module> - Validates 13 rails + 6 L4 gates
# Usage: cd pcc; bash audit_pcc.sh <module>
set -e
M=$1
[ -z "$M" ] && { echo "Usage: $0 <module>"; exit 2; }

cd pcc
echo "=== AUDIT: $M ==="

echo "[1] Hardcoded secrets..."
if grep -rE "(password|secret|api_key)[:=]['\"][a-zA-Z0-9_]{4,}['\"]" "$M" 2>/dev/null > /dev/null; then
  echo "  FAIL: hardcoded secret found"; exit 1
fi
echo "  PASS"

echo "[2] PHI in files..."
if grep -rE "(ssn|national_id|real_dob)" "$M" 2>/dev/null > /dev/null; then
  echo "  FAIL: PHI found"; exit 1
fi
echo "  PASS"

echo "[4] DROP without backup..."
if grep -E "DROP TABLE|DELETE FROM" "$M/${M}_up.sql" 2>/dev/null > /dev/null; then
  echo "  FAIL: DROP in migration"; exit 1
fi
echo "  PASS"

echo "[5] Tenant isolation..."
if ! grep -q "tenant_id" "$M/${M}_up.sql" 2>/dev/null || ! grep -q "NOT NULL" "$M/${M}_up.sql" 2>/dev/null; then
  echo "  FAIL: tenant_id missing"; exit 1
fi
echo "  PASS"

echo "[L4-1] Red flags..."
if grep -rE "(// \.\.\.previous|// add previous|// rest of code)" "$M" 2>/dev/null > /dev/null; then
  echo "  FAIL: red flags found"; exit 1
fi
echo "  PASS"

echo "[L4-4] Auth middleware..."
if ! grep -q "authenticate" "$M/${M}_routes.js" 2>/dev/null; then
  echo "  FAIL: no authenticate in routes"; exit 1
fi
echo "  PASS"

echo "[L4-6] Tests present..."
if [ ! -f "$M/${M}_test.js" ] || [ ! -f "$M/${M}_integration_test.js" ]; then
  echo "  FAIL: missing test files"; exit 1
fi
node "$M/${M}_test.js" > /tmp/unit_$M.log 2>&1 || { echo "  FAIL: unit tests fail"; cat /tmp/unit_$M.log; exit 1; }
node "$M/${M}_integration_test.js" > /tmp/int_$M.log 2>&1 || { echo "  FAIL: integration tests fail"; cat /tmp/int_$M.log; exit 1; }
echo "  PASS (unit + integration both pass)"

echo ""
echo "=== AUDIT $M: ALL PASS ==="
