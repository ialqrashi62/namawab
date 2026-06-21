# NamaMedical — PM2 resurrect at logon (operational hardening; NOT app code).
# Waits briefly for Docker/Redis, then restores the saved PM2 process list (nama-app).
# Safe + idempotent. No DB, no .env, no secrets. Logs only.
$ErrorActionPreference = 'SilentlyContinue'
$log = "C:\Users\ice\Desktop\NamaMedical\ops\watchdogs\logs\startup.log"
function L($m) { "$(Get-Date -Format s) [resurrect] $m" | Out-File -Append -FilePath $log -Encoding utf8 }
$pm2 = 'C:\nvm4w\nodejs\pm2.cmd'

L "logon resurrect started; waiting for redis"
# Docker Desktop autostarts at login but takes time; nama-redis is unless-stopped. Wait up to ~3 min for PONG.
$ok = $false
for ($i = 0; $i -lt 18; $i++) {
    $pong = (docker exec nama-redis redis-cli ping 2>$null)
    if ($pong -match 'PONG') { $ok = $true; break }
    if ($i -eq 1) { docker start nama-redis 2>$null | Out-Null }   # nudge once if daemon is up but container stopped
    Start-Sleep -Seconds 10
}
L "redis ready=$ok"
& $pm2 resurrect 2>&1 | Out-Null
L "pm2 resurrect invoked"
