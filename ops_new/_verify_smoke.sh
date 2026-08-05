#!/usr/bin/env bash
echo "=== STEP 1: bash -n ==="
bash -n /var/www/namaweb/ops/smoke_test.sh && echo "syntax OK"

echo ""
echo "=== STEP 2: chmod +x ==="
chmod +x /var/www/namaweb/ops/smoke_test.sh

echo ""
echo "=== STEP 3: ls -la ==="
ls -la /var/www/namaweb/ops/smoke_test.sh

echo ""
echo "=== STEP 4: wc -l ==="
wc -l /var/www/namaweb/ops/smoke_test.sh

echo ""
echo "=== STEP 5: ACTUAL RUN (last 30 lines) ==="
bash /var/www/namaweb/ops/smoke_test.sh 2>&1 | tail -30

echo ""
echo "=== STEP 6: Exit code ==="
bash /var/www/namaweb/ops/smoke_test.sh > /tmp/_smoke_rc.out 2>&1
echo "exit_code=$?"
echo ""
echo "=== STEP 7: Total runtime in seconds ==="
{ time bash /var/www/namaweb/ops/smoke_test.sh > /tmp/_smoke_time.out 2>&1; } 2>&1 | grep real