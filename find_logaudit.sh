#!/bin/bash
echo "=== logAudit definition ==="
grep -rn "function logAudit\|logAudit = function\|const logAudit\|async function logAudit" /var/www/namaweb/*.js /var/www/namaweb/lib/ /var/www/namaweb/routes/ 2>/dev/null | head -5
echo ""
echo "=== logAudit INSERT body ==="
grep -rn "INSERT INTO audit_trail" /var/www/namaweb/ 2>/dev/null | head -5
echo ""
echo "=== logAudit call sites (top 10) ==="
grep -rn "logAudit(" /var/www/namaweb/*.js /var/www/namaweb/lib/ /var/www/namaweb/routes/ 2>/dev/null | grep -v "node_modules" | grep -v "function logAudit\|logAudit =" | head -10
