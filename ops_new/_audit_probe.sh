#!/bin/bash
echo "=== backup.log ==="
head -5 /var/log/namaweb/backup.log
echo "=== db_health_2026-07-28.log ==="
head -5 /var/log/namaweb/db_health_2026-07-28.log
echo "=== csp_preflight ==="
head -5 /var/log/namaweb/csp_preflight_2026-07-28T23:53:03Z.log
echo "=== PM2 ERP out (last 5) ==="
tail -5 /root/.pm2/logs/nama-medical-erp-out.log
echo "=== PM2 ERP error (last 5) ==="
tail -5 /root/.pm2/logs/nama-medical-erp-error.log
echo "=== PM2 PCC out (last 5) ==="
tail -5 /root/.pm2/logs/nama-medical-pcc-out.log
echo "=== PM2 PCC error (last 5) ==="
tail -5 /root/.pm2/logs/nama-medical-pcc-error.log
