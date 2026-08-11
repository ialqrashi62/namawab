$ErrorActionPreference = 'Stop'
Set-Location 'c:/Users/ice/Desktop/NMEDCALVSCODE/namaweb'

$tmpPatch = 'docs/patches/.tmp_raw.patch'
cmd /c "git diff -- public/js/app.js server.js lib/compliance/integration_settings.js integration_settings_test.js zatca_settings_route_integration_test.js zatca_submit_fail_closed_guard_test.js nphies_cbahi_ui_config_test.js > $tmpPatch"

$wt = '../namaweb_patch_check_raw'
if (Test-Path $wt) { git worktree remove $wt --force }
git worktree add $wt HEAD | Out-Null

try {
  git -C $wt apply --check ../namaweb/$tmpPatch
  Write-Output 'RAW_PATCH_APPLIES_ON_HEAD'
} finally {
  git worktree remove $wt --force
}
