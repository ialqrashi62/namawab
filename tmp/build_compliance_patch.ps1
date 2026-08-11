$ErrorActionPreference = 'Stop'

Set-Location 'c:/Users/ice/Desktop/NMEDCALVSCODE/namaweb'

$tmpDir = 'docs/patches/.tmp'
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$rawPure = Join-Path $tmpDir 'pure.diff'
$rawServer = Join-Path $tmpDir 'server.diff'
$serverFiltered = Join-Path $tmpDir 'server.filtered.diff'
$final = 'docs/patches/compliance_nphies_cbahi_zatca_2026-08-09.patch'

cmd /c "git diff -- lib/compliance/integration_settings.js integration_settings_test.js zatca_settings_route_integration_test.js zatca_submit_fail_closed_guard_test.js nphies_cbahi_ui_config_test.js public/js/app.js > $rawPure"
cmd /c "git diff -- server.js > $rawServer"

$lines = Get-Content -Path $rawServer -Encoding UTF8
$out = New-Object System.Collections.Generic.List[string]
$inHunk = $false
$take = $false

foreach ($line in $lines) {
  if ($line -match '^diff --git ' -or $line -match '^index ' -or $line -match '^--- ' -or $line -match '^\+\+\+ ') {
    if ($line -match '^diff --git a/server.js b/server.js$' -or $line -match '^(index|--- |\+\+\+ )') { $out.Add($line) }
    continue
  }

  if ($line -match '^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@') {
    $oldStart = [int]$Matches[1]
    $take = ($oldStart -ge 80 -and $oldStart -le 14000)
    if ($oldStart -le 50) { $take = $false }
    $inHunk = $true
    if ($take) { $out.Add($line) }
    continue
  }

  if ($inHunk -and $take) { $out.Add($line) }
}

$out | Set-Content -Path $serverFiltered -Encoding UTF8

$header = @(
  '# Compliance-only patch bundle',
  '# Scope: NPHIES/CBAHI/ZATCA settings hardening + UI guards + focused tests',
  '# Generated: 2026-08-09',
  ''
) -join "`n"

Set-Content -Path $final -Value $header -Encoding UTF8
Get-Content -Path $rawPure -Encoding UTF8 | Add-Content -Path $final -Encoding UTF8
Add-Content -Path $final -Value "`n" -Encoding UTF8
Get-Content -Path $serverFiltered -Encoding UTF8 | Add-Content -Path $final -Encoding UTF8

$tmp = '../namaweb_patch_check_20260809'
if (Test-Path $tmp) { git worktree remove $tmp --force }
git worktree add $tmp HEAD | Out-Null
Push-Location $tmp

git apply --check ../namaweb/$final
$code = $LASTEXITCODE

Pop-Location
git worktree remove $tmp --force

if ($code -ne 0) {
  throw "Patch validation failed with exit code $code"
}

Write-Output "Patch regenerated and validated: $final"
Get-Item $final | Select-Object FullName, Length
