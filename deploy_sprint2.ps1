<#
.SYNOPSIS
  NamaMedical — Sprint 2 Upload Bundle (24 files).
.DESCRIPTION
  بعد موافقة المالك على SSH trust، شغّل:
    1) ssh-add C:\Users\ice\.ssh\nama_medical_key
    2) pwsh -File C:\Users\ice\Desktop\NMEDCALVSCODE\deploy_sprint2.ps1

  يَرفع:
    - 4 lib token-saver (route-guards, route-factory, test-fixtures, cross-tenant-runner, render-snippets)
    - 16 lib phase modules (fhir, careplans, llm, billing, dicom, hl7v2, portal, olap, prompt-engineering, vector, security, auth, bpmn, observability)
    - 8 routes جديدة
    - 1 .env.example update
    - 23 SKILL.md
#>

$ErrorActionPreference = 'Stop'
$Project = 'C:\Users\ice\Desktop\NMEDCALVSCODE'
$Server  = 'ubuntu@204.168.144.74'
$Remote  = '/var/www/namaweb'

Write-Host "==== Sprint 2 Upload Bundle ====" -ForegroundColor Cyan

# Test SSH first
Write-Host "[1/4] Test SSH" -ForegroundColor Yellow
ssh -o BatchMode=yes -o ConnectTimeout=10 $Server 'whoami' 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "SSH failed. Ensure key is added to agent: ssh-add C:\Users\ice\.ssh\nama_medical_key" -ForegroundColor Red
  exit 1
}

# 1) Ensure remote directories
Write-Host "[2/4] mkdir remote dirs" -ForegroundColor Yellow
ssh -o BatchMode=yes $Server "mkdir -p $Remote/lib/fhir $Remote/lib/careplans $Remote/lib/llm $Remote/lib/billing $Remote/lib/dicom $Remote/lib/hl7v2 $Remote/lib/portal $Remote/lib/olap $Remote/lib/prompt-engineering $Remote/lib/vector $Remote/lib/security $Remote/lib/auth $Remote/lib/bpmn $Remote/lib/observability $Remote/public/js"
if ($LASTEXITCODE -ne 0) { Write-Host "mkdir failed" -ForegroundColor Red; exit 2 }

# 2) Upload lib modules
$LibFiles = @(
  'lib\route-guards.js',
  'lib\route-factory.js',
  'lib\test-fixtures.js',
  'lib\cross-tenant-runner.js',
  'lib\fhir\router.js',
  'lib\fhir\storage.js',
  'lib\careplans\engine.js',
  'lib\careplans\orderSets.js',
  'lib\careplans\storage.js',
  'lib\llm\dischargeSummarizer.js',
  'lib\llm\templates.js',
  'lib\llm\contextBuilder.js',
  'lib\billing\currency.js',
  'lib\billing\invoice.js',
  'lib\billing\storage.js',
  'lib\dicom\storage.js',
  'lib\dicom\qidoWado.js',
  'lib\dicom\ohifConfig.js',
  'lib\hl7v2\parser.js',
  'lib\hl7v2\mapper.js',
  'lib\hl7v2\storage.js',
  'lib\portal\auth.js',
  'lib\portal\portal.js',
  'lib\portal\notifications.js',
  'lib\olap\materializedViews.js',
  'lib\olap\queryRunner.js',
  'lib\olap\refresh.js',
  'lib\prompt-engineering\PromptRegistry.js',
  'lib\vector\VectorStore.js',
  'lib\security\Pentest.js',
  'lib\auth\RBAC.js',
  'lib\bpmn\Engine.js',
  'lib\observability\LLMTracker.js',
  'public\js\render-snippets.js',
  'public\js\clinical-form-builder.js',
  'public\js\components\hospital.js',
  'public\js\wireframe-snippets.js',
  'public\js\station-clinical-enhancer.js',
  'public\js\station-api.js',
  'public\js\i18n-runtime.js',
  'public\js\modal.js',
  'public\js\station-snippets.js',
  'public\js\station-builder.js',
  'public\js\fhir-bridge.js',
  'public\js\vital-trend.js',
  'public\js\audit-trail.js',
  'public\js\barcode-meds.js',
  'public\js\procedure-consent.js',
  'public\index.html',
  'public\station-index.html',
  'public\all-stations.html',
  'i18n\medical_dictionary.json',
  'i18n\translations.json',
  'routes\fhir_router.js',
  'routes\careplans.js',
  'routes\discharge.js',
  'routes\billing_v2.js',
  'routes\dicomweb.js',
  'routes\hl7v2.js',
  'routes\portal.js',
  'routes\olap.js',
  '.env.example',
  'scripts\smoke.js'
)

Write-Host "[3/4] Uploading $($LibFiles.Count) files..." -ForegroundColor Yellow
foreach ($f in $LibFiles) {
  $local  = Join-Path $Project $f
  if (-not (Test-Path $local)) { Write-Host "  SKIP missing: $f" -ForegroundColor DarkYellow; continue }
  $remote = "$Server`:$Remote/$($f -replace '\\','/')"
  scp -o BatchMode=yes $local $remote 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Host "  FAIL: $f" -ForegroundColor Red; exit 3 }
  Write-Host "  ok: $f"
}

# 3) PM2 reload
Write-Host "[4/4] pm2 reload" -ForegroundColor Yellow
ssh -o BatchMode=yes $Server 'cd /var/www/namaweb && pm2 reload nama-medical-erp --wait-ready' 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "pm2 reload failed" -ForegroundColor Red; exit 4 }

# 4) Verify
Write-Host "[5/5] verify endpoints" -ForegroundColor Yellow
$checks = @(
  '/health',
  '/fhir/metadata',
  '/api/v4/olap/views',
  '/api/v4/careplans/active',
  '/api/v4/portal/profile'
)
foreach ($c in $checks) {
  $code = ssh -o BatchMode=yes $Server "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000$c" 2>&1
  Write-Host "  $c => HTTP $code"
}

Write-Host "==== DEPLOY COMPLETE ====" -ForegroundColor Green
