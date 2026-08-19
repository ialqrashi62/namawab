# filepath: deploy_tier.ps1
# Usage: .\deploy_tier.ps1 -Tier 117
param(
  [Parameter(Mandatory)][int]$Tier
)
$ErrorActionPreference = 'Stop'
$KEY = "$env:USERPROFILE\.ssh\nama_medical_key"
$SRV = 'ubuntu@204.168.144.74'
$DST = '/var/www/namaweb/'

# 1) Verify key
if (-not (Test-Path $KEY)) { throw "SSH key missing: $KEY" }

# 2) Verify connection
Write-Host "[1/4] Testing SSH..." -ForegroundColor Cyan
$probe = ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o ConnectTimeout=10 $SRV "echo PROBE_OK" 2>&1
if ($probe -notmatch 'PROBE_OK') { throw "SSH failed: $probe" }

# 3) Gather files
Write-Host "[2/4] Gathering tier files..." -ForegroundColor Cyan
$engines = Get-ChildItem "tier${Tier}_*_engine.js" -ErrorAction SilentlyContinue
$routers = Get-ChildItem "tier${Tier}_*_router.js" -ErrorAction SilentlyContinue
$other = Get-ChildItem "sm_multi_tier${Tier}.sh", "gen_tier${Tier}.js", "test_tier${Tier}_engines.js" -ErrorAction SilentlyContinue
$mig = Get-ChildItem "migrations/e999-g*operations*ext.sql" -ErrorAction SilentlyContinue | Select-Object -Last 1
$allFiles = @($engines + $routers + $other + $mig) | Where-Object { $_ }
if ($allFiles.Count -lt 4) { throw "Too few tier files found (got $($allFiles.Count))" }

# 4) Upload
Write-Host "[3/4] Uploading $($allFiles.Count) files..." -ForegroundColor Cyan
foreach ($f in $allFiles) {
  Write-Host "  -> $($f.Name)"
  if ($f -is [System.IO.DirectoryInfo]) {
    scp -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -r $f.FullName "${SRV}:${DST}$($f.Name)/"
  } else {
    $target = if ($f.FullName -match '\\migrations\\') { "${DST}migrations/" } else { $DST }
    scp -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no $f.FullName "${SRV}${target}"
  }
}

# 5) Server-side: insert mounts, run migration, restart, smoke
Write-Host "[4/4] Server wiring..." -ForegroundColor Cyan
$cmd = @"
cd /var/www/namaweb && \
node insert_mounts.js && \
node -c server.js && \
psql -U nama_medical_app -d nama_medical_web -h 127.0.0.1 -f migrations/$($mig.Name) 2>&1 | tail -20 && \
pm2 restart nama-medical-erp && \
sleep 4 && \
bash sm_multi_tier${Tier}.sh
"@
$out = ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no $SRV $cmd 2>&1
$out | Select-String -Pattern 'PASS|FAIL|SMOKE' | ForEach-Object { Write-Host $_ }
Write-Host "DONE" -ForegroundColor Green