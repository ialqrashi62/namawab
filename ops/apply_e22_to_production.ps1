<#
  apply_e22_to_production.ps1 — apply the PROVEN e22_01 money REAL->NUMERIC migration to PRODUCTION.

  e22_01 was validated on an isolated restore of this exact production DB (validate => 0 floating
  money columns, full suite 118/118). It is idempotent + defensive (only converts floating columns,
  ROUND to 2dp). This script:
    1. takes a MANDATORY full backup first (pg_dump -Fc)
    2. applies e22_01_up.sql
    3. runs e22_01_validate.sql (must print 0)
  Rollback (if ever needed): psql -d <db> -f namaweb/migrations/e22_01_operational_money_numeric_down.sql
  (or restore the backup taken in step 1).

  This TARGETS PRODUCTION, so it requires an explicit acknowledgement flag and a privileged/superuser
  login. Run during a maintenance window. You run it (the app role has no DDL privilege).

  USAGE:
    .\ops\apply_e22_to_production.ps1 -IUnderstandThisIsProduction
#>
param(
  [Parameter(Mandatory=$true)][switch]$IUnderstandThisIsProduction,
  [string]$SuperUser = "postgres",
  [string]$ProdDb    = "nama_medical_web",
  [int]   $Port      = 5432,
  [string]$DbHost    = "localhost",
  [string]$PgBin     = ""
)
$ErrorActionPreference = "Stop"
if (-not $IUnderstandThisIsProduction) { Write-Error "Refusing: pass -IUnderstandThisIsProduction to proceed."; exit 2 }

# auto-locate psql/pg_dump if not on PATH
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  $cands = @(); if ($PgBin) { $cands += $PgBin }
  $cands += (Get-ChildItem "C:\Program Files\PostgreSQL\*\bin","C:\Program Files (x86)\PostgreSQL\*\bin" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -ExpandProperty FullName)
  foreach ($c in $cands) { if (Test-Path (Join-Path $c "psql.exe")) { $env:Path = "$c;$env:Path"; break } }
}
foreach ($t in @("psql","pg_dump")) { if (-not (Get-Command $t -ErrorAction SilentlyContinue)) { Write-Error "'$t' not on PATH."; exit 3 } }

$repo = Split-Path -Parent $PSScriptRoot
$nama = Join-Path $repo "namaweb"
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $repo "local_backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$backup = Join-Path $backupDir "PRE_e22_${ProdDb}_$stamp.dump"

$sec = Read-Host "postgres superuser password" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
$env:PGHOST = $DbHost; $env:PGPORT = "$Port"; $env:PGUSER = $SuperUser
function Step($l, $sb) { Write-Host "`n=== $l ===" -ForegroundColor Cyan; & $sb; if ($LASTEXITCODE -ne 0) { Write-Error "$l FAILED (exit $LASTEXITCODE) — STOPPING. Production unchanged beyond this step; restore $backup if needed."; exit 1 } }

Step "1/3 MANDATORY backup -> $backup" { pg_dump -Fc -d $ProdDb -f $backup }
if (-not (Test-Path $backup) -or (Get-Item $backup).Length -lt 1024) { Write-Error "Backup missing/too small — ABORT before any DDL."; exit 1 }
Write-Host "Backup OK ($([math]::Round((Get-Item $backup).Length/1MB,1)) MB)."

Step "2/3 apply e22_01 (money REAL->NUMERIC)" { psql -d $ProdDb -v ON_ERROR_STOP=1 -f (Join-Path $nama "migrations\e22_01_operational_money_numeric_up.sql") }
Step "3/3 validate (MUST print 0)" { psql -d $ProdDb -v ON_ERROR_STOP=1 -f (Join-Path $nama "migrations\e22_01_operational_money_numeric_validate.sql") }

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "e22_01 applied to $ProdDb. If validate did NOT print 0, ROLLBACK now:"
Write-Host "  psql -d $ProdDb -f `"$nama\migrations\e22_01_operational_money_numeric_down.sql`""
Write-Host "  (or restore: pg_restore --clean -d $ProdDb `"$backup`")"
$env:PGPASSWORD = $null
