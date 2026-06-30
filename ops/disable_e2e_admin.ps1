<#
  disable_e2e_admin.ps1 - disable (NOT delete) the weak temporary test account on PRODUCTION.

  The e2e_admin account was created with a weak password ('11') for end-to-end testing. Leaving it
  active on production is a credential-strength risk. This script sets system_users.is_active = 0 for
  that account (reversible: set it back to 1). It does NOT delete the row, so any audit_trail / FK
  references stay intact. Idempotent: running twice is harmless.

  Requires a privileged/superuser login because system_users has FORCE RLS (app role is scoped).
  You run it (the app role cannot reliably UPDATE across tenants).

  USAGE:
    .\ops\disable_e2e_admin.ps1 -IUnderstandThisIsProduction
    # optional:  -Username e2e_admin  -ProdDb nama_medical_web
#>
param(
  [Parameter(Mandatory=$true)][switch]$IUnderstandThisIsProduction,
  [string]$Username  = "e2e_admin",
  [string]$SuperUser = "postgres",
  [string]$ProdDb    = "nama_medical_web",
  [int]   $Port      = 5432,
  [string]$DbHost    = "localhost",
  [string]$PgBin     = ""
)
$ErrorActionPreference = "Stop"
if (-not $IUnderstandThisIsProduction) { Write-Error "Refusing: pass -IUnderstandThisIsProduction to proceed."; exit 2 }

# auto-locate psql if not on PATH
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  $cands = @(); if ($PgBin) { $cands += $PgBin }
  $cands += (Get-ChildItem "C:\Program Files\PostgreSQL\*\bin","C:\Program Files (x86)\PostgreSQL\*\bin" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -ExpandProperty FullName)
  foreach ($c in $cands) { if (Test-Path (Join-Path $c "psql.exe")) { $env:Path = "$c;$env:Path"; break } }
}
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) { Write-Error "'psql' not on PATH."; exit 3 }

$sec = Read-Host "postgres superuser password" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
$env:PGHOST = $DbHost; $env:PGPORT = "$Port"; $env:PGUSER = $SuperUser

Write-Host "=== BEFORE ===" -ForegroundColor Cyan
psql -d $ProdDb -v ON_ERROR_STOP=1 -c "SELECT id, username, is_active FROM system_users WHERE username = '$Username';"

Write-Host "`n=== disabling '$Username' (is_active -> 0) ===" -ForegroundColor Cyan
psql -d $ProdDb -v ON_ERROR_STOP=1 -c "UPDATE system_users SET is_active = 0 WHERE username = '$Username';"
if ($LASTEXITCODE -ne 0) { Write-Error "UPDATE failed (exit $LASTEXITCODE)."; $env:PGPASSWORD=$null; exit 1 }

Write-Host "`n=== AFTER (is_active must be 0) ===" -ForegroundColor Green
psql -d $ProdDb -v ON_ERROR_STOP=1 -c "SELECT id, username, is_active FROM system_users WHERE username = '$Username';"
Write-Host "`nDone. To re-enable later: UPDATE system_users SET is_active = 1 WHERE username = '$Username';"
$env:PGPASSWORD = $null
