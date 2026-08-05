#!/bin/bash
# verify_tools.sh — verification script for 3 production tools
# Note: do NOT use `set -e` — some commands intentionally exit non-zero
# (e.g. db_query safety rejection returns exit 2 to signal rejection).

echo "=== STEP 1: SYNTAX CHECK ==="
node -c /var/www/namaweb/tools/db_query.js && echo "db_query: OK"
node -c /var/www/namaweb/tools/pcc_benchmark.js && echo "benchmark: OK"
node -c /var/www/namaweb/tools/health_probe.js && echo "health_probe: OK"
chmod +x /var/www/namaweb/tools/*.js

echo ""
echo "=== STEP 2: db_query.js --help (head 10) ==="
node /var/www/namaweb/tools/db_query.js --help 2>&1 | head -10

echo ""
echo "=== STEP 3: pcc_benchmark.js --help (head 10) ==="
node /var/www/namaweb/tools/pcc_benchmark.js --help 2>&1 | head -10

echo ""
echo "=== STEP 4: health_probe.js --help (head 10) ==="
node /var/www/namaweb/tools/health_probe.js --help 2>&1 | head -10

echo ""
echo "=== STEP 5: db_query safety gate DROP (must reject, exit 2) ==="
node /var/www/namaweb/tools/db_query.js --query="DROP TABLE foo" 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 6: db_query safety gate DELETE (must reject, exit 2) ==="
node /var/www/namaweb/tools/db_query.js --query="DELETE FROM patients" 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 7: db_query safety gate multi-statement with DROP (must reject) ==="
node /var/www/namaweb/tools/db_query.js --query="SELECT 1; DROP TABLE x" 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 8: db_query success: SELECT 1 (json) ==="
node /var/www/namaweb/tools/db_query.js --query="SELECT 1 AS one, now() AS ts" 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 9: db_query success: pg_tables (table format) ==="
node /var/www/namaweb/tools/db_query.js --query="SELECT schemaname, tablename FROM pg_tables WHERE schemaname='pg_catalog' LIMIT 5" --format=table 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 10: db_query success: CSV format ==="
node /var/www/namaweb/tools/db_query.js --query="SELECT 1 AS a, 2 AS b" --format=csv 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 11: db_query LIMIT enforcement (no LIMIT -> LIMIT 10 appended) ==="
node /var/www/namaweb/tools/db_query.js --query="SELECT generate_series(1, 200) AS n" --limit=10 2>&1
echo "exit=$?"

echo ""
echo "=== STEP 12: health_probe --format=json (head 20) ==="
node /var/www/namaweb/tools/health_probe.js --format=json 2>&1 | head -20

echo ""
echo "=== STEP 13: health_probe text default ==="
node /var/www/namaweb/tools/health_probe.js 2>&1 | head -15

echo ""
echo "=== STEP 14: pcc_benchmark --modules=3 --iterations=2 (text) ==="
node /var/www/namaweb/tools/pcc_benchmark.js --modules=3 --iterations=2 --base-url=http://127.0.0.1:3101 2>&1 | head -25

echo ""
echo "=== STEP 15: pcc_benchmark --modules=3 --iterations=2 (json, head 25) ==="
node /var/www/namaweb/tools/pcc_benchmark.js --modules=3 --iterations=2 --base-url=http://127.0.0.1:3101 --format=json 2>&1 | head -25

echo ""
echo "=== STEP 16: FILE SIZES & LOC ==="
wc -l /var/www/namaweb/tools/db_query.js /var/www/namaweb/tools/pcc_benchmark.js /var/www/namaweb/tools/health_probe.js
ls -la /var/www/namaweb/tools/*.js
