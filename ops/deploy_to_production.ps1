<#
  deploy_to_production.ps1 - apply the verified code changes to the live PM2 app, with auto-rollback.

  PM2 'nama-app' runs server.js directly from namaweb/ (NODE_ENV=production), so the on-disk (committed,
  tested) code is applied by a restart. Changes being shipped: validation on 4 routes (verified
  non-breaking, 118/118), audit middleware (INERT unless AUDIT_ALL_MUTATIONS=true), env-gated rate
  limiter (INERT), SKIP_DB_INIT fix (no-op in production). New code already proven to boot in
  NODE_ENV=production on an isolated port.

  Safety: captures health, restarts, health-checks; if NOT healthy within ~24s, AUTO-ROLLS BACK to the
  pre-deploy commit and restarts again. ~5s downtime expected. Run in a low-traffic window.

  USAGE:  .\ops\deploy_to_production.ps1
#>
param(
  [string]$App = "nama-app",
  [string]$RollbackSha = "b6d48f2",
  [string]$HealthUrl = "http://localhost:3000/api/health"
)
$ErrorActionPreference = "Stop"
$nama = Join-Path (Split-Path -Parent $PSScriptRoot) "namaweb"

function Health { try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 $HealthUrl).Content } catch { "" } }
function WaitHealthy([int]$secs=24) { for ($i=0; $i -lt ($secs/2); $i++) { Start-Sleep 2; if ((Health) -match '"status":"UP"') { return $true } }; return $false }

Push-Location $nama
try {
  if ((git status --porcelain).Length -gt 0) { Write-Error "namaweb working tree not clean - commit/stash first."; exit 2 }
  $deploySha = (git rev-parse --short HEAD)
  Write-Host "Baseline health: $(Health)"
  Write-Host "Deploying $deploySha (rollback target: $RollbackSha)..." -ForegroundColor Cyan

  pm2 restart $App --update-env | Out-Null
  if (WaitHealthy) {
    Write-Host "`n=== DEPLOY OK ===" -ForegroundColor Green
    Write-Host "Health: $(Health)  | running $deploySha"
    pm2 save | Out-Null
  } else {
    Write-Host "`n!!! UNHEALTHY after restart - AUTO-ROLLBACK to $RollbackSha !!!" -ForegroundColor Red
    git stash push -u -m "pre-rollback-$deploySha" 2>$null | Out-Null
    git checkout $RollbackSha -- .
    pm2 restart $App --update-env | Out-Null
    if (WaitHealthy) { Write-Host "Rolled back to $RollbackSha and HEALTHY. Restore new code with: git checkout $deploySha -- ." -ForegroundColor Yellow }
    else { Write-Error "ROLLBACK ALSO UNHEALTHY - investigate pm2 logs ($App) immediately." }
    exit 1
  }
} finally { Pop-Location }
