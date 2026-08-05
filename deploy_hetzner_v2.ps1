<#
.SYNOPSIS
  NamaMedical — رفع شامل لكل ما تم إنشاؤه (38 ملف) إلى Hetzner.
.NOTES
  يستخدم PSCP/PLINK. المفتاح: C:\Users\ice\.ssh\nama_medical_key
  AGENTS.md §2.4: يحتاج موافقة المالك (RAIL-1, RAIL-3, RAIL-13).
#>

$ErrorActionPreference = 'Stop'
$Project   = 'C:\Users\ice\Desktop\NMEDCALVSCODE'
$KeyPath   = 'C:\Users\ice\.ssh\nama_medical_key'
$Server    = 'ubuntu@204.168.144.74'
$Remote    = '/var/www/namaweb'
$Pscp      = 'C:\Program Files\PuTTY\pscp.exe'
$Plink     = 'C:\Program Files\PuTTY\plink.exe'

# ============= الملفات (38 ملف) =============
$Files = @(
  # ----- Public frontend (4) -----
  @{ src='namaweb\public\index.html'; dst="$Remote/public/index.html" },
  @{ src='namaweb\public\station-index.html'; dst="$Remote/public/station-index.html" },
  @{ src='namaweb\public\all-stations.html'; dst="$Remote/public/all-stations.html" },

  # ----- Public JS (15) -----
  @{ src='namaweb\public\js\modal.js'; dst="$Remote/public/js/modal.js" },
  @{ src='namaweb\public\js\station-snippets.js'; dst="$Remote/public/js/station-snippets.js" },
  @{ src='namaweb\public\js\station-builder.js'; dst="$Remote/public/js/station-builder.js" },
  @{ src='namaweb\public\js\station-clinical-enhancer.js'; dst="$Remote/public/js/station-clinical-enhancer.js" },
  @{ src='namaweb\public\js\station-api.js'; dst="$Remote/public/js/station-api.js" },
  @{ src='namaweb\public\js\i18n-runtime.js'; dst="$Remote/public/js/i18n-runtime.js" },
  @{ src='namaweb\public\js\wireframe-snippets.js'; dst="$Remote/public/js/wireframe-snippets.js" },
  @{ src='namaweb\public\js\components\hospital.js'; dst="$Remote/public/js/components/hospital.js" },
  @{ src='namaweb\public\js\clinical-form-builder.js'; dst="$Remote/public/js/clinical-form-builder.js" },
  @{ src='namaweb\public\js\fhir-bridge.js'; dst="$Remote/public/js/fhir-bridge.js" },
  @{ src='namaweb\public\js\vital-trend.js'; dst="$Remote/public/js/vital-trend.js" },
  @{ src='namaweb\public\js\audit-trail.js'; dst="$Remote/public/js/audit-trail.js" },
  @{ src='namaweb\public\js\barcode-meds.js'; dst="$Remote/public/js/barcode-meds.js" },
  @{ src='namaweb\public\js\procedure-consent.js'; dst="$Remote/public/js/procedure-consent.js" },
  @{ src='namaweb\public\js\render-snippets.js'; dst="$Remote/public/js/render-snippets.js" },

  # ----- Public i18n (1) -----
  @{ src='namaweb\i18n\medical_dictionary.json'; dst="$Remote/public/i18n/medical_dictionary.json" },

  # ----- Lib — token-saver dedup (5) -----
  @{ src='namaweb\lib\route-guards.js'; dst="$Remote/lib/route-guards.js" },
  @{ src='namaweb\lib\test-fixtures.js'; dst="$Remote/lib/test-fixtures.js" },
  @{ src='namaweb\lib\route-factory.js'; dst="$Remote/lib/route-factory.js" },
  @{ src='namaweb\lib\cross-tenant-runner.js'; dst="$Remote/lib/cross-tenant-runner.js" },

  # ----- Lib — multi-agent sprint 1 (6 modules) -----
  @{ src='namaweb\lib\prompt-engineering\PromptRegistry.js'; dst="$Remote/lib/prompt-engineering/PromptRegistry.js" },
  @{ src='namaweb\lib\vector\VectorStore.js'; dst="$Remote/lib/vector/VectorStore.js" },
  @{ src='namaweb\lib\security\Pentest.js'; dst="$Remote/lib/security/Pentest.js" },
  @{ src='namaweb\lib\auth\RBAC.js'; dst="$Remote/lib/auth/RBAC.js" },
  @{ src='namaweb\lib\bpmn\Engine.js'; dst="$Remote/lib/bpmn/Engine.js" },
  @{ src='namaweb\lib\observability\LLMTracker.js'; dst="$Remote/lib/observability/LLMTracker.js" },

  # ----- Lib — autopilot sprint 1+2 (16 modules) -----
  @{ src='namaweb\lib\fhir\router.js'; dst="$Remote/lib/fhir/router.js" },
  @{ src='namaweb\lib\fhir\storage.js'; dst="$Remote/lib/fhir/storage.js" },
  @{ src='namaweb\lib\careplans\orderSets.js'; dst="$Remote/lib/careplans/orderSets.js" },
  @{ src='namaweb\lib\careplans\engine.js'; dst="$Remote/lib/careplans/engine.js" },
  @{ src='namaweb\lib\careplans\storage.js'; dst="$Remote/lib/careplans/storage.js" },
  @{ src='namaweb\lib\llm\dischargeSummarizer.js'; dst="$Remote/lib/llm/dischargeSummarizer.js" },
  @{ src='namaweb\lib\llm\templates.js'; dst="$Remote/lib/llm/templates.js" },
  @{ src='namaweb\lib\llm\contextBuilder.js'; dst="$Remote/lib/llm/contextBuilder.js" },
  @{ src='namaweb\lib\billing\currency.js'; dst="$Remote/lib/billing/currency.js" },
  @{ src='namaweb\lib\billing\invoice.js'; dst="$Remote/lib/billing/invoice.js" },
  @{ src='namaweb\lib\billing\storage.js'; dst="$Remote/lib/billing/storage.js" },
  @{ src='namaweb\lib\dicom\storage.js'; dst="$Remote/lib/dicom/storage.js" },
  @{ src='namaweb\lib\dicom\qidoWado.js'; dst="$Remote/lib/dicom/qidoWado.js" },
  @{ src='namaweb\lib\dicom\ohifConfig.js'; dst="$Remote/lib/dicom/ohifConfig.js" },
  @{ src='namaweb\lib\hl7v2\parser.js'; dst="$Remote/lib/hl7v2/parser.js" },
  @{ src='namaweb\lib\hl7v2\mapper.js'; dst="$Remote/lib/hl7v2/mapper.js" },
  @{ src='namaweb\lib\hl7v2\storage.js'; dst="$Remote/lib/hl7v2/storage.js" },
  @{ src='namaweb\lib\portal\auth.js'; dst="$Remote/lib/portal/auth.js" },
  @{ src='namaweb\lib\portal\portal.js'; dst="$Remote/lib/portal/portal.js" },
  @{ src='namaweb\lib\portal\notifications.js'; dst="$Remote/lib/portal/notifications.js" },
  @{ src='namaweb\lib\olap\materializedViews.js'; dst="$Remote/lib/olap/materializedViews.js" },
  @{ src='namaweb\lib\olap\queryRunner.js'; dst="$Remote/lib/olap/queryRunner.js" },
  @{ src='namaweb\lib\olap\refresh.js'; dst="$Remote/lib/olap/refresh.js" },

  # ----- Routes (5) -----
  @{ src='namaweb\routes\fhir_router.js'; dst="$Remote/routes/fhir_router.js" },
  @{ src='namaweb\routes\careplans.js'; dst="$Remote/routes/careplans.js" },
  @{ src='namaweb\routes\discharge.js'; dst="$Remote/routes/discharge.js" },
  @{ src='namaweb\routes\billing_v2.js'; dst="$Remote/routes/billing_v2.js" },
  @{ src='namaweb\routes\dicomweb.js'; dst="$Remote/routes/dicomweb.js" },
  @{ src='namaweb\routes\hl7v2.js'; dst="$Remote/routes/hl7v2.js" },
  @{ src='namaweb\routes\portal.js'; dst="$Remote/routes/portal.js" },
  @{ src='namaweb\routes\olap.js'; dst="$Remote/routes/olap.js" }
)

Write-Host "==== NamaMedical v2 :: Hetzner Full Deploy ====" -ForegroundColor Cyan
Write-Host "Server: $Server"           -ForegroundColor Gray
Write-Host "Files:  $($Files.Count)"   -ForegroundColor Gray
Write-Host ""

# 1) تحقّق وجود الملفات محلياً
$missing = @()
foreach ($f in $Files) {
  $p = Join-Path $Project $f.src
  if (-not (Test-Path $p)) { $missing += $f.src }
}
if ($missing.Count -gt 0) {
  Write-Host "MISSING LOCAL FILES:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
  exit 2
}
Write-Host "[0/4] All $($Files.Count) files exist locally" -ForegroundColor Green

# 2) إنشاء المجلدات على الخادم
Write-Host "[1/4] mkdir remote dirs" -ForegroundColor Yellow
$dirs = @(
  "$Remote/public/js/components",
  "$Remote/public/i18n",
  "$Remote/lib/prompt-engineering",
  "$Remote/lib/vector",
  "$Remote/lib/security",
  "$Remote/lib/auth",
  "$Remote/lib/bpmn",
  "$Remote/lib/observability",
  "$Remote/lib/fhir",
  "$Remote/lib/careplans",
  "$Remote/lib/llm",
  "$Remote/lib/billing",
  "$Remote/lib/dicom",
  "$Remote/lib/hl7v2",
  "$Remote/lib/portal",
  "$Remote/lib/olap",
  "$Remote/routes"
)
foreach ($d in $dirs) {
  & $Plink -i $KeyPath -batch -ssh $Server "mkdir -p $d" 2>&1 | Out-Null
}
Write-Host "  Done." -ForegroundColor Green

# 3) رفع كل ملف
Write-Host "[2/4] Uploading $($Files.Count) files..." -ForegroundColor Yellow
$ok = 0; $fail = 0
foreach ($f in $Files) {
  $local  = Join-Path $Project $f.src
  $remote = "$Server`:$($f.dst)"
  Write-Host "  -> $($f.src)"
  & $Pscp -i $KeyPath -batch -sftp $local $remote 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) { $ok++ } else { $fail++; Write-Host "  FAILED: $($f.src)" -ForegroundColor Red }
}
Write-Host "  Uploaded: $ok / $($Files.Count) (failed: $fail)" -ForegroundColor Green

# 4) PM2 reload + smoke live
if ($fail -eq 0) {
  Write-Host "[3/4] pm2 reload" -ForegroundColor Yellow
  & $Plink -i $KeyPath -batch -ssh $Server "cd $Remote && pm2 reload nama-medical-erp --wait-ready 2>&1 | tail -10" 2>&1
  Start-Sleep -Seconds 2

  Write-Host "[4/4] live curl checks" -ForegroundColor Yellow
  & $Plink -i $KeyPath -batch -ssh $Server @"
for p in / /station-index.html /all-stations.html /js/modal.js /js/render-snippets.js /lib/fhir/router.js /lib/portal/auth.js /lib/olap/materializedViews.js /i18n/medical_dictionary.json; do
  printf '%-50s ' `\$p`
  curl -s -o /dev/null -w 'HTTP %{http_code}  %{size_download}B\n' http://127.0.0.1:3000`\$p
done
"@ 2>&1

  Write-Host ""
  Write-Host "==== DEPLOY COMPLETE ====" -ForegroundColor Green
  Write-Host "Live URLs:" -ForegroundColor Green
  Write-Host "  https://jumanasoft.com/station-index.html"   -ForegroundColor Green
  Write-Host "  https://jumanasoft.com/all-stations.html"   -ForegroundColor Green
  Write-Host "  https://jumanasoft.com/lib/fhir/router.js (server-side loaded)" -ForegroundColor Green
} else {
  Write-Host "[3/4] SKIP pm2 reload — uploads had $fail failures" -ForegroundColor Red
}
