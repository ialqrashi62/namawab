<#
  finish_everything.ps1 — one-command path to complete the remaining audit items on Windows.

  WHAT IT DOES (all on an ISOLATED test DB — production is only READ via pg_dump):
    1. pg_dump a READ-ONLY snapshot of production nama_medical_web
    2. create an isolated test DB  nama_medical_test  (refuses to touch production)
    3. pg_restore the snapshot into the test DB
    4. grant the app role + apply e22_01 (money REAL->NUMERIC) + validate
    5. run the FULL test suite (cross-tenant / RLS / e2e) against the test DB
    6. print a PASS/FAIL summary

  YOU RUN THIS because creating a DB needs superuser (the agent's app role has createdb=false).
  It prompts once for the postgres superuser password (kept in-process, never printed/stored).

  USAGE (PowerShell, from repo root):
    .\ops\finish_everything.ps1
  Optional overrides:
    .\ops\finish_everything.ps1 -SuperUser postgres -ProdDb nama_medical_web -TestDb nama_medical_test -Port 5432
#>
param(
  [string]$SuperUser = "postgres",
  [string]$ProdDb    = "nama_medical_web",
  [string]$TestDb    = "nama_medical_test",
  [int]   $Port      = 5432,
  [string]$DbHost    = "localhost",
  [string]$PgBin     = ""
)
$ErrorActionPreference = "Stop"

# ---- Auto-locate PostgreSQL client tools (psql/pg_dump/pg_restore) if not already on PATH ----
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  $candidates = @()
  if ($PgBin) { $candidates += $PgBin }
  $candidates += (Get-ChildItem "C:\Program Files\PostgreSQL\*\bin","C:\Program Files (x86)\PostgreSQL\*\bin" -ErrorAction SilentlyContinue |
                  Sort-Object FullName -Descending | Select-Object -ExpandProperty FullName)
  foreach ($c in $candidates) {
    if (Test-Path (Join-Path $c "psql.exe")) { $env:Path = "$c;$env:Path"; Write-Host "Using PostgreSQL client at: $c" -ForegroundColor DarkGray; break }
  }
}

# ---- PRODUCTION GUARD ----
if ($TestDb -eq $ProdDb -or $TestDb -match "web|prod") {
  Write-Error "Refusing: test DB '$TestDb' must NOT be production."; exit 2
}

$repo = Split-Path -Parent $PSScriptRoot
$nama = Join-Path $repo "namaweb"
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dump = Join-Path $env:TEMP "nama_prod_$stamp.dump"

# tools check
foreach ($t in @("psql","pg_dump","pg_restore","node")) {
  if (-not (Get-Command $t -ErrorAction SilentlyContinue)) { Write-Error "'$t' not on PATH. Install PostgreSQL client / Node and retry."; exit 3 }
}

# superuser password (secure prompt; in-process only)
$sec = Read-Host "postgres superuser password" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
$env:PGHOST = $DbHost; $env:PGPORT = "$Port"; $env:PGUSER = $SuperUser

function Run($label, $sb) { Write-Host "`n=== $label ===" -ForegroundColor Cyan; & $sb; if ($LASTEXITCODE -ne 0) { Write-Error "$label FAILED (exit $LASTEXITCODE)"; exit 1 } }

Run "1/6 READ-ONLY production snapshot -> $dump" { pg_dump -Fc -d $ProdDb -f $dump }
Run "2/6 (re)create isolated test DB $TestDb" {
  psql -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS $TestDb;"
  psql -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $TestDb OWNER $SuperUser;"
}
Run "3/6 restore snapshot into $TestDb" { pg_restore --no-owner --role=$SuperUser -d $TestDb $dump }
Run "4/6 grant app role + apply e22_01 + validate" {
  psql -d $TestDb -v ON_ERROR_STOP=1 -c "DO `$`$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app') THEN CREATE ROLE nama_medical_app LOGIN; END IF; END `$`$;"
  psql -d $TestDb -v ON_ERROR_STOP=1 -c "GRANT USAGE ON SCHEMA public TO nama_medical_app; GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO nama_medical_app; GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO nama_medical_app;"
  psql -d $TestDb -v ON_ERROR_STOP=1 -f (Join-Path $nama "migrations\e22_01_operational_money_numeric_up.sql")
  Write-Host "-- e22_01 validate (expect 0):"
  psql -d $TestDb -v ON_ERROR_STOP=1 -f (Join-Path $nama "migrations\e22_01_operational_money_numeric_validate.sql")
}
Run "5/6 run FULL test suite against $TestDb" {
  Push-Location $nama
  $env:DB_NAME = $TestDb; $env:DB_HOST = $DbHost; $env:DB_PORT = "$Port"
  $env:DB_USER = "nama_medical_app"; $env:NODE_ENV = "test"
  node run_all_tests.js
  Pop-Location
}
Write-Host "`n=== 6/6 DONE ===" -ForegroundColor Green
Write-Host "Isolated test DB '$TestDb' provisioned + full suite run above. Production '$ProdDb' was READ-ONLY (pg_dump only)."
Write-Host "Send the PASS/FAIL summary + e22_01 validate result to continue."
$env:PGPASSWORD = $null
