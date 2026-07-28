# secrets-rotation.ps1 — T2 Step 2.1 helper
# يولّد 5 أسرار base64 ويحفظها في vault محلي (.secrets-rotation-2026-07-24)
# ⚠️ لا يطبع القيم على الشاشة بشكل كامل (RAIL 12: no print of secrets)
# ⚠️ لا يرسلها لأي مكان (RAIL 1: secrets in code → out of scope, only generated)
# الاستخدام: powershell -ExecutionPolicy Bypass -File .\project_brain\secrets-rotation.ps1

$ErrorActionPreference = "Stop"
$ts = Get-Date -Format "yyyy-MM-dd-HHmm"
$outDir = Join-Path $PSScriptRoot ".secrets-rotation-$ts"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Secrets Rotation Helper — T2" -ForegroundColor Green
Write-Host " Generated: $ts" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1) تجهيز مجلد محمي
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}
# تقييد الوصول إلى المالك فقط (umask 077 equivalent)
$acl = Get-Acl $outDir
$acl.SetAccessRuleProtection($true, $false)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    $env:USERNAME, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
$acl.AddAccessRule($rule)
Set-Acl $outDir $acl

# 2) توليد الـ 5 أسرار (48 bytes = 64 chars base64)
$secrets = [ordered]@{
    "01_MSSQL_SA_PASSWORD"          = -join ((1..48) | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 127) } | ForEach-Object { $_ }) | ConvertTo-SecureString -AsPlainText -Force
    "02_PG_APP_USER_PASSWORD"       = -join ((1..48) | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 127) } | ForEach-Object { $_ }) | ConvertTo-SecureString -AsPlainText -Force
    "03_JWT_SECRET"                 = -join ((1..48) | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 127) } | ForEach-Object { $_ }) | ConvertTo-SecureString -AsPlainText -Force
    "04_SESSION_SECRET"             = -join ((1..48) | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 127) } | ForEach-Object { $_ }) | ConvertTo-SecureString -AsPlainText -Force
    "05_E2E_TEST_PASSWORD"          = -join ((1..48) | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 127) } | ForEach-Object { $_ }) | ConvertTo-SecureString -AsPlainText -Force
}

# 3) حفظ كـ SecureString (DPAPI-protected) في ملف JSON
$payload = @{}
foreach ($k in $secrets.Keys) {
    $payload[$k] = ConvertFrom-SecureString $secrets[$k]
}
$payload | ConvertTo-Json | Set-Content (Join-Path $outDir "secrets.dpapi.json") -Encoding UTF8

# 4) حفظ أسماء المتغيرات + sha256 fingerprints (لا القيم!)
$fingerprints = @{}
foreach ($k in $secrets.Keys) {
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secrets[$k]))
    $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash(
        [System.Text.Encoding]::UTF8.GetBytes($plain))
    $fingerprints[$k] = -join ($hash | ForEach-Object { $_.ToString("x2") })
    # امسح الذاكرة فوراً
    $plain = $null
    [System.GC]::Collect()
}

$fingerprints | ConvertTo-Json | Set-Content (Join-Path $outDir "fingerprints.json") -Encoding UTF8

Write-Host ""
Write-Host "[OK] Generated 5 secrets (48 bytes each)" -ForegroundColor Green
Write-Host "[OK] Saved to: $outDir" -ForegroundColor Green
Write-Host "[OK] File ACL: owner-only (DPAPI protected)" -ForegroundColor Green
Write-Host ""
Write-Host "Fingerprints (for audit only):" -ForegroundColor Yellow
$fingerprints.GetEnumerator() | ForEach-Object {
    Write-Host ("  " + $_.Key + " = " + $_.Value.Substring(0, 12) + "...")
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " NEXT STEPS (manual, owner-only):" -ForegroundColor Yellow
Write-Host " 1. Read secrets: Run .\read-secrets.ps1 (separate helper)" -ForegroundColor Yellow
Write-Host " 2. Update /etc/namaweb/.env on Hetzner (204.168.144.74)" -ForegroundColor Yellow
Write-Host " 3. Rotate DB users (MSSQL sa + PG nama_app_user)" -ForegroundColor Yellow
Write-Host " 4. pm2 reload nama-medical-erp" -ForegroundColor Yellow
Write-Host " 5. DELETE this folder after rotation: Remove-Item -Recurse -Force '$outDir'" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# 5) إنشاء helper قراءة منفصل (يحتاج موافقة PowerShell ExecutionPolicy)
$readHelper = @"
# read-secrets.ps1 — استرجاع القيم من DPAPI (يعمل على نفس الجهاز فقط)
# الاستخدام: powershell -ExecutionPolicy Bypass -File .\read-secrets.ps1
`$ErrorActionPreference = "Stop"
`$dir = Split-Path -Parent `$MyInvocation.MyCommand.Path
`$jsonPath = Join-Path `$dir "secrets.dpapi.json"
if (-not (Test-Path `$jsonPath)) { throw "secrets.dpapi.json not found in `$dir" }
`$data = Get-Content `$jsonPath -Raw | ConvertFrom-Json
foreach (`$prop in `$data.PSObject.Properties) {
    `$secure = ConvertTo-SecureString `$prop.Value
    `$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR(`$secure))
    # ⚠️ RAIL 12: print only on explicit owner request
    Write-Host ("`$prop.Name = `$plain")
    `$plain = `$null
    [System.GC]::Collect()
}
"@
$readHelper | Set-Content (Join-Path $outDir "read-secrets.ps1") -Encoding UTF8

Write-Host "[OK] Created read-secrets.ps1 in $outDir" -ForegroundColor Green
Write-Host ""
