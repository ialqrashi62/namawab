#!/usr/bin/env bash
set -u
LOG=/root/.pm2/logs/nama-medical-erp-error.log
[ -f "$LOG" ] || LOG=/var/www/namaweb/logs/error.log
[ -f "$LOG" ] || LOG=/root/.pm2/logs/nama-medical-erp-out.log
echo "tailing: $LOG"
LINES_BEFORE=$(wc -l < "$LOG" 2>/dev/null || echo 0)
echo "lines before: $LINES_BEFORE"
echo ""
echo "=== fire 3 logins ==="
for i in 1 2 3; do
  echo "--- attempt $i ---"
  curl -sk -o /dev/null -w 'http_code=%{http_code}\n' \
    -X POST -H 'Content-Type: application/json' \
    -d '{"username":"admin","password":"admin"}' \
    http://127.0.0.1:3000/api/auth/login
done
sleep 2
echo ""
echo "=== new log lines since fire ==="
LINES_AFTER=$(wc -l < "$LOG" 2>/dev/null || echo 0)
echo "lines after: $LINES_AFTER (delta=$((LINES_AFTER-LINES_BEFORE)))"
tail -n +$((LINES_BEFORE+1)) "$LOG" 2>/dev/null | grep -iE 'audit|tenant_id|permission denied|denied|error|row_hash|chain' | head -40
