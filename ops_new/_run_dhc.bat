@echo off
set SSHKEY=C:\Users\ice\.ssh\nama_medical_key
set HOST=root@204.168.144.74
set REMOTEDIR=/var/www/namaweb/ops

echo === SYNTAX CHECKS ===
ssh -i %SSHKEY% %HOST% "bash -n %REMOTEDIR%/backup_db_auto.sh && echo OK1; bash -n %REMOTEDIR%/db_health_check.sh && echo OK2; bash -n %REMOTEDIR%/audit_log_query.sh && echo OK3; bash -n %REMOTEDIR%/csp_enforce_ready.sh && echo OK4"

echo.
echo === DBC RUN ===
ssh -i %SSHKEY% %HOST% "bash %REMOTEDIR%/db_health_check.sh 1>/tmp/dhc.out 2>/tmp/dhc.err; echo RC=$?"
ssh -i %SSHKEY% %HOST% "wc -c /tmp/dhc.out /tmp/dhc.err"

echo.
echo === DBC OUTPUT ===
ssh -i %SSHKEY% %HOST% "tail -25 /tmp/dhc.out"

echo.
echo === DHC STDERR ===
ssh -i %SSHKEY% %HOST% "tail -10 /tmp/dhc.err"

echo.
echo === CSP RUN ===
ssh -i %SSHKEY% %HOST% "bash %REMOTEDIR%/csp_enforce_ready.sh 1>/tmp/csp.out 2>/tmp/csp.err; echo RC=$?"
ssh -i %SSHKEY% %HOST% "tail -20 /tmp/csp.out"
