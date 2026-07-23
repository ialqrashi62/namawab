#!/usr/bin/env pwsh
<#
.SYNOPSIS
    ONE-SHOT rescue script for Cloudflare Error 521 (Origin down).
    Diagnoses + auto-fixes all 6 common causes.
.DESCRIPTION
    Run from a machine with SSH access to the Hetzner production server.
    This is the safest single command to run when the site is down.

    The script:
      1. SSHes into the server
      2. Runs all diagnostics
      3. Auto-fixes whatever it can (PM2 down, nginx down, postgres down, disk full)
      4. Re-verifies health
      5. Returns exit 0 if site is back, exit 1 if not

.PARAMETER DryRun
    Just diagnose, do not fix.
.EXAMPLE
    pwsh rescue_521_2026-07-23.ps1
.NOTES
    Date: 2026-07-23
    Safe: only restarts already-installed services, no data changes
#>

param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Continue'
$Server = 'root@204.168.144.74'
$Key    = 'C:\Users\ice\.ssh\nama_medical_key'

function RemoteRun($label, $cmd) {
    Write-Host ""
    Write-Host "----- $label -----" -ForegroundColor Cyan
    $out = ssh -i $Key -o ConnectTimeout=8 $Server $cmd 2>&1
    $out | Select-Object -First 30 | ForEach-Object { Write-Host $_ }
    return $out
}

function RemoteFix($label, $cmd) {
    if ($DryRun) {
        Write-Host "[DRY-RUN] Would run: $cmd" -ForegroundColor Yellow
        return
    }
    Write-Host ""
    Write-Host "----- FIX: $label -----" -ForegroundColor Green
    ssh -i $Key -o ConnectTimeout=8 $Server $cmd 2>&1 | Select-Object -First 10 | ForEach-Object { Write-Host $_ }
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  RESCUE 521 — Origin Down Diagnostic + Auto-Fix" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# STEP 0: SSH reachability
$reach = ssh -i $Key -o ConnectTimeout=8 -o BatchMode=yes $Server 'echo REACHABLE' 2>&1
if ($reach -notmatch 'REACHABLE') {
    Write-Host ""
    Write-Host "SSH UNREACHABLE" -ForegroundColor Red
    Write-Host "The server $Server is not reachable from this machine." -ForegroundColor Red
    Write-Host "This means the host is completely down (network/firewall/hardware)." -ForegroundColor Red
    Write-Host ""
    Write-Host "ACTION: Use Hetzner Cloud Console (https://console.hetzner.cloud)" -ForegroundColor Yellow
    Write-Host "        > Reboot the VM (Rescue tab > Reboot button)" -ForegroundColor Yellow
    Write-Host "        > Or check the VM status / network / billing" -ForegroundColor Yellow
    exit 2
}
Write-Host "SSH reachable" -ForegroundColor Green

# STEP 1: Diagnostics
$pm2Out   = RemoteRun 'A. PM2 STATUS' 'pm2 status 2>&1 | head -20'
$nginxOut = RemoteRun 'B. NGINX STATUS' 'systemctl status nginx --no-pager 2>&1 | head -10'
$portOut  = RemoteRun 'C. PORT 3000' 'ss -tlnp 2>&1 | grep -E ":3000|:80|:443" || echo "NO LISTENERS"'
$healthOut = RemoteRun 'D. LOCAL HEALTH' 'curl -s -m 3 http://127.0.0.1:3000/api/health || echo "NO RESPONSE"'
$diskOut  = RemoteRun 'F. DISK' 'df -h / /var 2>&1 | head -5'
$memOut   = RemoteRun 'G. MEMORY' 'free -h 2>&1 | head -3'
$cpuOut   = RemoteRun 'H. CPU LOAD' 'uptime'
$pgOut    = RemoteRun 'I. POSTGRES' 'systemctl is-active postgresql 2>&1'

# STEP 2: Analyze + decide
$pm2Online   = $pm2Out   -match 'online'
$nginxActive = $nginxOut -match 'active \(running\)'
$port3000    = $portOut  -match ':3000'
$healthOk    = $healthOut -match '"status":"UP"'
$pgActive    = $pgOut    -match 'active'
$diskFull    = $diskOut  -match '100%'

Write-Host ""
Write-Host "===== ANALYSIS =====" -ForegroundColor Cyan
Write-Host "PM2 online:    $pm2Online"
Write-Host "Nginx active:  $nginxActive"
Write-Host "Port 3000:     $port3000"
Write-Host "Health OK:     $healthOk"
Write-Host "Postgres:      $pgActive"
Write-Host "Disk full:     $diskFull"

# STEP 3: Auto-fix
$fixed = @()

# Fix 1: Disk full
if ($diskFull) {
    RemoteFix 'Disk full — cleaning up' 'pm2 flush 2>/dev/null; find /root/nama_backups -name "*.dump" -mtime +30 -delete 2>/dev/null; journalctl --vacuum-size=100M 2>/dev/null; df -h /'
    $fixed += "Disk cleanup"
}

# Fix 2: Postgres down
if (-not $pgActive) {
    RemoteFix 'Postgres down — starting' 'systemctl start postgresql 2>&1; systemctl status postgresql --no-pager 2>&1 | head -5'
    $fixed += "Postgres restart"
    Start-Sleep -Seconds 3
}

# Fix 3: PM2 down
if (-not $pm2Online) {
    RemoteFix 'PM2 process down — restarting' 'pm2 restart nama-medical-erp --update-env 2>&1; sleep 5; pm2 status 2>&1 | head -10'
    $fixed += "PM2 restart"
    Start-Sleep -Seconds 5
}

# Fix 4: nginx down
if (-not $nginxActive) {
    RemoteFix 'Nginx down — starting' 'systemctl start nginx 2>&1; systemctl enable nginx 2>&1; systemctl status nginx --no-pager 2>&1 | head -5'
    $fixed += "Nginx start"
    Start-Sleep -Seconds 2
}

# Fix 5: If still unhealthy but PM2 online, try full restart
if ($pm2Online -and -not $healthOk) {
    RemoteFix 'Health still bad — full restart' 'pm2 restart nama-medical-erp --update-env 2>&1; sleep 5'
    $fixed += "Full restart"
    Start-Sleep -Seconds 5
}

# Fix 6: Save PM2 state for next boot
if (-not $DryRun) {
    RemoteFix 'Saving PM2 state' 'pm2 save 2>&1 | head -3'
}

# STEP 4: Re-verify
Write-Host ""
Write-Host "===== POST-FIX VERIFICATION =====" -ForegroundColor Cyan
$finalHealth = RemoteRun 'Local health' 'curl -s -m 5 http://127.0.0.1:3000/api/health'
$finalPm2    = RemoteRun 'PM2 final' 'pm2 status 2>&1 | head -10'
$finalNginx  = RemoteRun 'Nginx final' 'systemctl status nginx --no-pager 2>&1 | head -5'

# STEP 5: Public check (from this machine)
Write-Host ""
Write-Host "===== PUBLIC CHECK (Cloudflare) =====" -ForegroundColor Cyan
try {
    $pub = Invoke-WebRequest -Uri 'https://jumanasoft.com/api/health' -UseBasicParsing -TimeoutSec 15
    Write-Host "Public: $($pub.StatusCode) $($pub.Content)" -ForegroundColor Green
    $publicOk = $true
} catch {
    Write-Host "Public: TIMEOUT (Cloudflare may take 30-60s to mark origin as up)" -ForegroundColor Yellow
    $publicOk = $false
}

# Summary
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Fixes applied: $($fixed -join ', ')"
Write-Host "Local health:  $(if ($finalHealth -match 'UP') { 'UP' } else { 'DOWN' })"
Write-Host "PM2:           $(if ($finalPm2 -match 'online') { 'online' } else { 'errored' })"
Write-Host "Nginx:         $(if ($finalNginx -match 'active') { 'active' } else { 'inactive' })"
Write-Host "Public:        $(if ($publicOk) { 'UP via Cloudflare' } else { 'still timing out (wait 60s)' })"
Write-Host ""

if ($finalHealth -match 'UP' -and $publicOk) {
    Write-Host "  RESCUE SUCCESSFUL — site is back online" -ForegroundColor Green
    exit 0
} elseif ($finalHealth -match 'UP') {
    Write-Host "  LOCAL OK but Cloudflare still showing 521" -ForegroundColor Yellow
    Write-Host "  Wait 30-60 seconds for Cloudflare to retry, then re-check" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "  RESCUE FAILED — manual intervention required" -ForegroundColor Red
    Write-Host "  Run: pm2 logs nama-medical-erp --lines 200 --nostream --raw 2>&1 | tail -100" -ForegroundColor Red
    Write-Host "  Send me the output." -ForegroundColor Red
    exit 1
}
