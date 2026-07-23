#!/usr/bin/env pwsh
<#
.SYNOPSIS
    ENHANCED rescue script for Cloudflare Error 521 (Origin down).
    Includes Hetzner Cloud API fallback when SSH is unreachable.
.DESCRIPTION
    3-tier recovery:
      TIER 1: SSH + restart services (PM2/nginx/Postgres/Disk)
      TIER 2: Hetzner Cloud API reboot (if HCLOUD_TOKEN is set)
      TIER 3: Hetzner Console manual reboot (printed instructions)

.PARAMETER HCLOUD_TOKEN
    Hetzner Cloud API token (optional, enables Tier 2 auto-reboot).
    Get one at: https://console.hetzner.cloud/ -> Project -> Security -> API Tokens
.PARAMETER ServerIP
    IP of the production server (default: 204.168.144.74).
.PARAMETER DryRun
    Diagnose only; do not change anything.
.EXAMPLE
    pwsh rescue_521_enhanced_2026-07-23.ps1
    pwsh rescue_521_enhanced_2026-07-23.ps1 -HCLOUD_TOKEN "hcloud_xxx..."
#>

param(
    [string]$HCLOUD_TOKEN,
    [string]$ServerIP = '204.168.144.74',
    [switch]$DryRun
)

$ErrorActionPreference = 'Continue'
$Key    = 'C:\Users\ice\.ssh\nama_medical_key'
$Server = "root@$ServerIP"

function Write-Step($n, $t) { Write-Host ""; Write-Host "===== STEP $n : $t =====" -ForegroundColor Cyan }
function Write-OK($t) { Write-Host "  OK: $t" -ForegroundColor Green }
function Write-FAIL($t) { Write-Host "  FAIL: $t" -ForegroundColor Red }
function Write-FIX($t) { Write-Host "  FIX: $t" -ForegroundColor Yellow }
function Write-INFO($t) { Write-Host "  $t" -ForegroundColor Gray }

function RemoteRun($cmd) {
    return ssh -i $Key -o ConnectTimeout=8 $Server $cmd 2>&1
}

function HetznerAPI($method, $uri) {
    $headers = @{ 'Authorization' = "Bearer $HCLOUD_TOKEN" }
    try {
        return Invoke-RestMethod -Uri "https://api.hetzner.cloud/v1$uri" -Method $method -Headers $headers -TimeoutSec 10
    } catch { return $null }
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  ENHANCED RESCUE 521 — Hetzner Origin Down" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# === TIER 1: SSH + restart services ===
Write-Step 'TIER 1' 'SSH + service restart'

$sshTest = ssh -i $Key -o ConnectTimeout=8 -o BatchMode=yes $Server 'echo REACHABLE' 2>&1
if ($sshTest -match 'REACHABLE') {
    Write-OK "SSH reachable"

    $pm2Out   = RemoteRun 'pm2 status 2>&1 | head -20'
    $nginxOut = RemoteRun 'systemctl is-active nginx 2>&1'
    $portOut  = RemoteRun 'ss -tlnp 2>&1 | grep :3000 || echo NO_LISTENER'
    $pgOut    = RemoteRun 'systemctl is-active postgresql 2>&1'
    $diskOut  = RemoteRun 'df -h / 2>&1 | tail -1'

    Write-INFO "PM2:     $pm2Out"
    Write-INFO "Nginx:   $nginxOut"
    Write-INFO "Port:    $portOut"
    Write-INFO "Postgres:$pgOut"
    Write-INFO "Disk:    $diskOut"

    $fixed = @()
    if ($diskOut -match '100%') {
        if (-not $DryRun) {
            RemoteRun 'pm2 flush; find /root/nama_backups -name "*.dump" -mtime +30 -delete; journalctl --vacuum-size=100M; df -h /' | Out-Null
        }
        $fixed += "Disk cleanup"
        Write-FIX "Disk full — cleaned"
    }
    if ($pgOut -notmatch 'active') {
        if (-not $DryRun) { RemoteRun 'systemctl start postgresql' | Out-Null; Start-Sleep 3 }
        $fixed += "Postgres restart"
        Write-FIX "Postgres restarted"
    }
    if ($pm2Out -notmatch 'online') {
        if (-not $DryRun) { RemoteRun 'pm2 restart nama-medical-erp --update-env' | Out-Null; Start-Sleep 5 }
        $fixed += "PM2 restart"
        Write-FIX "PM2 restarted"
    }
    if ($nginxOut -notmatch 'active') {
        if (-not $DryRun) { RemoteRun 'systemctl start nginx; systemctl enable nginx' | Out-Null }
        $fixed += "Nginx start"
        Write-FIX "Nginx started"
    }
    if (-not $DryRun) { RemoteRun 'pm2 save' | Out-Null }

    $finalHealth = RemoteRun 'curl -s -m 5 http://127.0.0.1:3000/api/health'
    if ($finalHealth -match '"status":"UP"') {
        Write-OK "Local health: UP"
        Write-Host ""
        Write-Host "=================================================" -ForegroundColor Green
        Write-Host "  TIER 1 SUCCESS — site should be back in 30-60s" -ForegroundColor Green
        Write-Host "  Fixes: $($fixed -join ', ')" -ForegroundColor Green
        Write-Host "=================================================" -ForegroundColor Green

        # Wait for Cloudflare to retry
        Write-Host "  Waiting 30s for Cloudflare to re-check origin..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        try {
            $pub = Invoke-WebRequest -Uri 'https://jumanasoft.com/api/health' -UseBasicParsing -TimeoutSec 15
            if ($pub.StatusCode -eq 200) {
                Write-OK "Public (Cloudflare): UP"
                exit 0
            }
        } catch { Write-INFO "Cloudflare still showing 521 — wait another 30s" }
        exit 0
    } else {
        Write-FAIL "Local health: $finalHealth"
    }
} else {
    Write-FAIL "SSH UNREACHABLE — server is completely down"
}

# === TIER 2: Hetzner Cloud API reboot ===
Write-Step 'TIER 2' 'Hetzner Cloud API reboot'

if (-not $HCLOUD_TOKEN) {
    Write-INFO "No -HCLOUD_TOKEN provided. Skipping API reboot."
    Write-INFO "To enable: get a token at https://console.hetzner.cloud/ -> Security -> API Tokens"
    Write-INFO "Then re-run: pwsh rescue_521_enhanced_2026-07-23.ps1 -HCLOUD_TOKEN 'hcloud_xxx'"
} else {
    Write-INFO "Querying Hetzner Cloud API..."
    $servers = HetznerAPI 'GET' '/servers'
    if ($servers -and $servers.servers) {
        $target = $servers.servers | Where-Object { $_.public_net.ipv4.ip -eq $ServerIP } | Select-Object -First 1
        if ($target) {
            Write-INFO "Found server: $($target.name) (ID: $($target.id), status: $($target.status))"
            if ($target.status -eq 'running') {
                if (-not $DryRun) {
                    Write-FIX "Sending reboot command to server $ServerIP..."
                    HetznerAPI 'POST' "/servers/$($target.id)/actions/reboot" | Out-Null
                    Write-OK "Reboot sent. Server will be back in 1-3 minutes."
                } else {
                    Write-INFO "[DRY-RUN] Would reboot server $ServerIP"
                }
            } else {
                Write-INFO "Server is in state: $($target.status) — manual intervention needed"
                if (-not $DryRun -and $target.status -in @('off', 'stopping')) {
                    HetznerAPI 'POST' "/servers/$($target.id)/actions/poweron" | Out-Null
                    Write-OK "Power-on command sent"
                }
            }
        } else {
            Write-FAIL "No Hetzner server found with IP $ServerIP"
        }
    } else {
        Write-FAIL "Hetzner API call failed (check -HCLOUD_TOKEN)"
    }
}

# === TIER 3: Hetzner Console manual reboot ===
Write-Step 'TIER 3' 'Hetzner Console manual reboot (if T1 + T2 fail)'

Write-Host ""
Write-Host "  MANUAL STEPS (Hetzner Cloud Console):" -ForegroundColor Yellow
Write-Host "  1. Open https://console.hetzner.cloud/" -ForegroundColor White
Write-Host "  2. Select project containing $ServerIP" -ForegroundColor White
Write-Host "  3. Click on the server" -ForegroundColor White
Write-Host "  4. Click 'Reboot' (or 'Power off' then 'Power on' if reboot hangs)" -ForegroundColor White
Write-Host "  5. Wait 1-3 minutes for server to come back" -ForegroundColor White
Write-Host "  6. Re-run this script to start TIER 1 (SSH + restart services)" -ForegroundColor White
Write-Host ""
Write-Host "  IF VM IS COMPLETELY UNRESPONSIVE:" -ForegroundColor Yellow
Write-Host "  - Use Hetzner Cloud Console 'Reboot into Rescue' option" -ForegroundColor White
Write-Host "  - This boots a rescue Linux image you can SSH into" -ForegroundColor White
Write-Host "  - From there, check /var/log/syslog, /var/log/nginx/error.log" -ForegroundColor White
Write-Host "  - Mount the real disk: mount /dev/sda1 /mnt" -ForegroundColor White
Write-Host ""

# === TIER 4: Wait + verify ===
Write-Step 'TIER 4' 'Wait + verify recovery'

if (-not $DryRun) {
    Write-INFO "Waiting 90 seconds for reboot to complete..."
    Start-Sleep -Seconds 90
    $s2 = ssh -i $Key -o ConnectTimeout=8 -o BatchMode=yes $Server 'echo OK' 2>&1
    if ($s2 -match 'OK') {
        Write-OK "SSH back online"
        $h = RemoteRun 'curl -s -m 5 http://127.0.0.1:3000/api/health'
        Write-INFO "Health: $h"
    } else {
        Write-FAIL "SSH still unreachable after 90s"
        Write-INFO "Re-run this script after a few more minutes"
    }
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  RESCUE ATTEMPT COMPLETE" -ForegroundColor Cyan
Write-Host "  If site is still 521, contact Hetzner support" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
