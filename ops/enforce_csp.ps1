<#
  enforce_csp.ps1 - flip CSP from Report-Only to ENFORCING on the live PM2 app, with auto-revert.

  IMPORTANT: only run this AFTER an observation window (24-48h) where pm2 logs show NO (or only
  understood/whitelisted) [CSP-REPORT] lines. The SPA uses inline handlers/styles + CDN, so enforcing
  a too-strict policy can break the UI even when the API health endpoint stays UP. Health alone does
  NOT prove the CSP is safe - do a real browser smoke test after running this.

  Mechanism: server.js reads process.env.CSP_ENFORCE === 'true' to pick
  Content-Security-Policy (enforce) vs Content-Security-Policy-Report-Only. This sets that env and
  restarts. If /api/health is not UP within ~24s it auto-reverts (CSP_ENFORCE unset) and restarts.

  Check accumulated reports first (read-only):
    pm2 logs nama-app --nostream --lines 5000 | Select-String '\[CSP-REPORT\]'

  USAGE:
    .\ops\enforce_csp.ps1 -IHaveObservedReportsForAtLeast24h
#>
param(
  [Parameter(Mandatory=$true)][switch]$IHaveObservedReportsForAtLeast24h,
  [string]$App = "nama-app",
  [string]$HealthUrl = "http://localhost:3000/api/health"
)
$ErrorActionPreference = "Stop"
if (-not $IHaveObservedReportsForAtLeast24h) { Write-Error "Refusing: observe /api/csp-report logs 24-48h first, then pass -IHaveObservedReportsForAtLeast24h."; exit 2 }

function Health { try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 $HealthUrl).Content } catch { "" } }
function WaitHealthy([int]$secs=24) { for ($i=0; $i -lt ($secs/2); $i++) { Start-Sleep 2; if ((Health) -match '"status":"UP"') { return $true } }; return $false }

Write-Host "Baseline health: $(Health)"
Write-Host "Enabling CSP enforce (CSP_ENFORCE=true) and restarting $App..." -ForegroundColor Cyan
$env:CSP_ENFORCE = "true"
pm2 restart $App --update-env | Out-Null

if (WaitHealthy) {
  Write-Host "`n=== CSP ENFORCE ON - health UP ===" -ForegroundColor Green
  Write-Host "Health: $(Health)"
  Write-Host "NOW DO A BROWSER SMOKE TEST. If the UI breaks, revert with:" -ForegroundColor Yellow
  Write-Host "  Remove-Item Env:CSP_ENFORCE; pm2 restart $App --update-env; pm2 save"
  pm2 save | Out-Null
} else {
  Write-Host "`n!!! UNHEALTHY after enabling CSP enforce - AUTO-REVERT to Report-Only !!!" -ForegroundColor Red
  Remove-Item Env:CSP_ENFORCE -ErrorAction SilentlyContinue
  pm2 restart $App --update-env | Out-Null
  if (WaitHealthy) { Write-Host "Reverted to Report-Only and HEALTHY." -ForegroundColor Yellow }
  else { Write-Error "REVERT ALSO UNHEALTHY - investigate pm2 logs ($App) immediately." }
  exit 1
}
