# NamaMedical — health watchdog (operational hardening; NOT app code; runs outside app runtime).
# Checks /api/health; on failure, ensures nama-redis is up and resurrects PM2. Idempotent + safe.
# No DB access, no .env read, no secrets printed. Local log only (rotated at ~1MB).
$ErrorActionPreference = 'SilentlyContinue'
$log = "C:\Users\ice\Desktop\NamaMedical\ops\watchdogs\logs\watchdog.log"
function L($m) { "$(Get-Date -Format s) [watchdog] $m" | Out-File -Append -FilePath $log -Encoding utf8 }
$pm2 = 'C:\nvm4w\nodejs\pm2.cmd'

$healthy = $false
try { $r = Invoke-WebRequest -UseBasicParsing -Uri http://127.0.0.1:3000/api/health -TimeoutSec 5; if ($r.StatusCode -eq 200) { $healthy = $true } } catch {}
if ($healthy) {
    L "OK health=200"
} else {
    L "health DOWN -> recovery"
    # Incident fix: if the Docker daemon itself is down (Docker Desktop stopped), `docker start` fails silently.
    # Recover the daemon first, then the container. Bounded wait (<=~3min; watchdog cadence is 5min).
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        L "docker daemon DOWN -> launching Docker Desktop"
        $dd = 'C:\Program Files\Docker\Docker\Docker Desktop.exe'
        if (Test-Path $dd) { Start-Process $dd }
        for ($i = 0; $i -lt 18; $i++) { Start-Sleep -Seconds 10; docker info > $null 2>&1; if ($LASTEXITCODE -eq 0) { break } }
        if ($LASTEXITCODE -eq 0) { L "docker daemon=UP" } else { L "docker daemon=still-down" }
    }
    docker start nama-redis 2>$null | Out-Null
    $pong = (docker exec nama-redis redis-cli ping 2>$null)
    L "redis=$pong"
    & $pm2 resurrect 2>&1 | Out-Null
    Start-Sleep -Seconds 8
    try { $r2 = Invoke-WebRequest -UseBasicParsing -Uri http://127.0.0.1:3000/api/health -TimeoutSec 5; L "post-recovery health=$($r2.StatusCode)" } catch { L "ALERT post-recovery health=ERR (manual attention; daemon/redis/login may be down)" }
}
# log rotation: keep last ~500 lines if file > 1MB
if ((Test-Path $log) -and ((Get-Item $log).Length -gt 1MB)) { Get-Content $log -Tail 500 | Set-Content $log -Encoding utf8 }
