#!/usr/bin/env pwsh
<#
.SYNOPSIS
    One-shot script to bring the LOCAL dev server fully up-to-date with origin.
    Use this any time you have new commits and want to see them on http://localhost:3000
.DESCRIPTION
    1. Pulls latest submodule (integration/all-epics)
    2. Stops + deletes old PM2 process
    3. Starts fresh PM2 process with all updates
    4. Verifies all critical endpoints respond
    5. Reports status

.EXAMPLE
    pwsh sync_local_server.ps1
.NOTES
    Date: 2026-07-23
    Safe: only restarts local dev process, no production impact
#>

$ErrorActionPreference = 'Continue'
$Root  = 'C:\Users\ice\Desktop\NMEDCALVSCODE'
$WebDir = "$Root\namaweb"
$Branch = 'integration/all-epics'
$PM2Name = 'nama-medical-erp'

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  LOCAL SERVER SYNC — pull + restart" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# STEP 1: Update submodule to latest integration/all-epics
Write-Host ""
Write-Host "[1/5] Updating submodule to $Branch..." -ForegroundColor Yellow
Set-Location $WebDir
git fetch origin $Branch 2>&1 | Select-Object -First 3
git checkout $Branch 2>&1 | Select-Object -First 3
git pull origin $Branch 2>&1 | Select-Object -First 5
$tip = git rev-parse --short HEAD
Write-Host "  Submodule now at: $tip" -ForegroundColor Green

# STEP 2: Stop + delete old PM2 process
Write-Host ""
Write-Host "[2/5] Stopping old PM2 process..." -ForegroundColor Yellow
npx pm2 delete $PM2Name 2>&1 | Select-Object -First 3
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "  WARNING: port 3000 still in use" -ForegroundColor Yellow
} else {
    Write-Host "  Port 3000 is free" -ForegroundColor Green
}

# STEP 3: Quick syntax check
Write-Host ""
Write-Host "[3/5] Syntax + load check..." -ForegroundColor Yellow
$check = node --check server.js 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "  SYNTAX ERROR in server.js" -ForegroundColor Red; exit 1 }
Write-Host "  server.js OK" -ForegroundColor Green

# STEP 4: Start fresh PM2
Write-Host ""
Write-Host "[4/5] Starting fresh PM2 process..." -ForegroundColor Yellow
npx pm2 start server.js --name $PM2Name 2>&1 | Select-Object -First 3
Start-Sleep -Seconds 8
$status = npx pm2 status 2>&1
if ($status -match 'online') {
    Write-Host "  PM2 process online" -ForegroundColor Green
} else {
    Write-Host "  PM2 NOT online. Check logs." -ForegroundColor Red
    npx pm2 logs $PM2Name --lines 20 --nostream --raw 2>&1 | Select-Object -First 15
    exit 1
}

# STEP 5: Verify all critical endpoints
Write-Host ""
Write-Host "[5/5] Verifying endpoints..." -ForegroundColor Yellow
$pages = @(
    @{ p = "/";                                expect = 200 },
    @{ p = "/api/health";                      expect = 200 },
    @{ p = "/api/calculators";                 expect = 401 },
    @{ p = "/api/phase3";                      expect = 401 },
    @{ p = "/api/phase3/v2";                   expect = 401 },
    @{ p = "/api/ai/status";                   expect = 401 },
    @{ p = "/api/clinical/knowledge/search";   expect = 401 },
    @{ p = "/api/insurance/companies";         expect = 401 },
    @{ p = "/api/patients";                    expect = 401 }
)
$ok = 0; $fail = 0
foreach ($e in $pages) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$($e.p)" -UseBasicParsing -TimeoutSec 3
        $code = $r.StatusCode
    } catch {
        $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    }
    if ($code -eq $e.expect) {
        Write-Host "  $($e.p) -> $code" -ForegroundColor Green
        $ok++
    } else {
        Write-Host "  $($e.p) -> $code (expected $($e.expect))" -ForegroundColor Red
        $fail++
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
if ($fail -eq 0) {
    Write-Host "  SYNC COMPLETE — all endpoints responding as expected" -ForegroundColor Green
    Write-Host "  Server: http://localhost:3000" -ForegroundColor Green
    Write-Host "  Health: $(Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 3)" -ForegroundColor Green
} else {
    Write-Host "  SYNC COMPLETE — $fail endpoints unexpected" -ForegroundColor Yellow
    Write-Host "  Check: npx pm2 logs $PM2Name --lines 50" -ForegroundColor Yellow
}
Write-Host "================================================" -ForegroundColor Cyan
exit $fail
