@echo off
set SSHKEY=C:\Users\ice\.ssh\nama_medical_key
set HOST=root@204.168.144.74
set REMOTEDIR=/var/www/namaweb/ops

echo === SYNTAX CHECKS ===
ssh -i %SSHKEY% %HOST% "bash -n %REMOTEDIR%/backup_db_auto.sh && echo OK1; bash -n %REMOTEDIR%/db_health_check.sh && echo OK2; bash -n %REMOTEDIR%/audit_log_query.sh && echo OK3; bash -n %REMOTEDIR%/csp_enforce_ready.sh && echo OK4"

echo.
echo === DB_HEALTH_CHECK actual run (one tail) ===
ssh -i %SSHKEY% %HOST% "bash %REMOTEDIR%/db_health_check.sh 2>&1 | tail -20"

echo.
echo === DB_HEALTH_CHECK exit code ===
ssh -i %SSHKEY% %HOST% "bash %REMOTEDIR%/db_health_check.sh > /tmp/dhc2.out 2>&1; echo \"EXIT=$?\""

echo.
echo === CSP_ENFORCE_READY actual run ===
ssh -i %SSHKEY% %HOST% "bash %REMOTEDIR%/csp_enforce_ready.sh 2>&1 | tail -20"

echo.
echo === AUDIT_LOG_QUERY actual run (PM2 fallback) ===
ssh -i %SSHKEY% %HOST% "bash %REMOTEDIR%/audit_log_query.sh last_24h 2>&1 | head -10"

echo.
echo === FILE SIZES ===
ssh -i %SSHKEY% %HOST% "wc -l %REMOTEDIR%/backup_db_auto.sh %REMOTEDIR%/db_health_check.sh %REMOTEDIR%/audit_log_query.sh %REMOTEDIR%/csp_enforce_ready.sh %REMOTEDIR%/INSTALL.md"

echo.
echo === CRONTAB STATE (current, untouched) ===
ssh -i %SSHKEY% %HOST% "crontab -l 2>/dev/null || echo NO_CRONTAB"
