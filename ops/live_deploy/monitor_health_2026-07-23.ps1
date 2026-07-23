#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Monitor jumanasoft.com and report status every interval.
    Use after running the rescue script to confirm recovery.
.PARAMETER Interval
    Seconds between checks (default: 30).
.PARAMETER MaxChecks
    Max number of checks before giving up (default: 60 = 30 min).
.EXAMPLE
    pwsh monitor_health_2026-07-23.ps1
#>

param(
    [int]$Interval = 30,
    [int]$MaxChecks = 60
)

$Server = '204.168.144.74'
$Key    = 'C:\Users\ice\.ssh\nama_medical_key'

function Check-Site {
    $results = @{
        Timestamp = (Get-Date -Format 'HH:mm:ss')
        SSH       = 'down'
        LocalHTTP = 'down'
        Public    = 'down'
    }
    # SSH
    $s = ssh -i $Key -o ConnectTimeout=5 -o BatchMode=yes "root@$Server" 'echo OK' 2>&1
    if ($s -match 'OK') { $results.SSH = 'up' }
    # Local HTTP (via SSH tunnel)
    if ($results.SSH -eq 'up') {
        $h = ssh -i $Key -o ConnectTimeout=5 "root@$Server" 'curl -s -m 3 http://127.0.0.1:3000/api/health' 2>&1
        if ($h -match '"status":"UP"') { $results.LocalHTTP = 'up' }
    }
    # Public via Cloudflare
    try {
        $r = Invoke-WebRequest -Uri 'https://jumanasoft.com/api/health' -UseBasicParsing -TimeoutSec 8
        if ($r.StatusCode -eq 200) { $results.Public = 'up' }
    } catch {}
    return $results
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  HEALTH MONITOR — jumanasoft.com" -ForegroundColor Cyan
Write-Host "  Interval: ${Interval}s | Max: ${MaxChecks} checks" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$upCount = 0
for ($i = 1; $i -le $MaxChecks; $i++) {
    $r = Check-Site
    $status = if ($r.Public -eq 'up' -and $r.SSH -eq 'up' -and $r.LocalHTTP -eq 'up') { 'ALL_UP' } else { 'PARTIAL' }
    $color = if ($status -eq 'ALL_UP') { 'Green' } else { 'Yellow' }
    Write-Host "[$($r.Timestamp)] #$i SSH=$($r.SSH) Local=$($r.LocalHTTP) Public=$($r.Public) -> $status" -ForegroundColor $color
    if ($status -eq 'ALL_UP') {
        $upCount++
        if ($upCount -ge 3) {
            Write-Host ""
            Write-Host "SITE RECOVERED + STABLE for 3 checks" -ForegroundColor Green
            exit 0
        }
    } else { $upCount = 0 }
    if ($i -lt $MaxChecks) { Start-Sleep -Seconds $Interval }
}

Write-Host ""
Write-Host "Site did not recover within $($MaxChecks * $Interval) seconds" -ForegroundColor Red
exit 1
