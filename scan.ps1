# scan.ps1 — SCANNER Agent (read-only)
# Usage: powershell -ExecutionPolicy Bypass -File scan.ps1
$ErrorActionPreference = "SilentlyContinue"

$root = (Get-Location).Path
$ts = Get-Date -Format "yyyy-MM-dd-HHmm"
$out = "project_brain\scans\scan-$ts.json"

# استثناء المسارات الضخمة / المؤقتة
$excludePattern = '\\(node_modules|\.git|\.venv|\.claude|\.cache|\.vendor|local_backups|\.playwright-mcp|backups|\.deploy_staging|tmp)(\\|$)'
$files = Get-ChildItem -Recurse -File -Force | Where-Object { $_.FullName -notmatch $excludePattern }
$dirs = Get-ChildItem -Directory -Force | Select-Object -ExpandProperty Name

# تصنيف بالامتداد (Top 20)
$byExt = @()
$groups = $files | Group-Object Extension | Sort-Object Count -Descending
$idx = 0
foreach ($g in $groups) {
    if ($idx -ge 20) { break }
    $n = if ($g.Name) { $g.Name } else { "(noext)" }
    $byExt += [pscustomobject]@{ ext = $n; count = $g.Count }
    $idx++
}

# إحصائيات إضافية
$namaweb = (Get-ChildItem -Recurse -File -Force -Path "namaweb" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch $excludePattern }).Count
$docs = (Get-ChildItem -Recurse -File -Force -Path "docs" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch $excludePattern }).Count
$brain = (Get-ChildItem -Recurse -File -Force -Path "project_brain" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch $excludePattern }).Count
$migrations = (Get-ChildItem -Recurse -File -Force -Path "namaweb\migrations" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch $excludePattern }).Count

# skills المتوفرة
$skillsRoot = "project_brain\skills"
$skillsCount = 0
if (Test-Path $skillsRoot) {
    $skillsCount = (Get-ChildItem -File -Recurse -Path $skillsRoot -Filter "*.md" -ErrorAction SilentlyContinue).Count
}

# عدد الاختبارات (.js files ending with _test.js)
$testsCount = (Get-ChildItem -Recurse -File -Force -Path "namaweb" -Filter "*_test.js" -ErrorAction SilentlyContinue).Count

# بناء التقرير
$report = [pscustomobject]@{
    scan_id         = "SCAN-$ts"
    timestamp       = (Get-Date).ToString("o")
    os              = "Windows"
    shell           = "PowerShell"
    cwd             = $root
    schema_version  = "5.0"
    total_files     = $files.Count
    total_dirs      = $dirs.Count
    top_dirs        = ($dirs | Select-Object -First 30)
    by_extension    = $byExt
    sub_counts = [pscustomobject]@{
        namaweb          = $namaweb
        docs             = $docs
        project_brain    = $brain
        migrations       = $migrations
        skills_md        = $skillsCount
        test_files       = $testsCount
    }
    has_agents_md   = (Test-Path "AGENTS.md")
    has_server_js   = (Test-Path "namaweb\server.js")
    has_ai_rules    = (Test-Path ".ai_rules")
    stack_detected  = @("Node.js", "Express", "Vanilla JS", "PostgreSQL", "Tailwind")
    notes           = @(
        "Project is NamaMedical ERP (jumanaMedical)",
        "Live deployment: Hetzner ubuntu-8gb-hel1-1 (204.168.144.74)",
        "Process: nama-medical-erp (PM2)",
        "44 clinical departments, 16 facility types",
        "Submodule: namaweb (own .git)",
        "Audit fork: namaweb-ovr-audit-independent (read-only)"
    )
}

$report | ConvertTo-Json -Depth 6 | Set-Content -Path $out -Encoding UTF8

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host (" SCANNER v5.0  -  SCAN COMPLETE") -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host (" scan_id       : SCAN-$ts")
Write-Host (" total_files   : " + $files.Count)
Write-Host (" total_dirs    : " + $dirs.Count)
Write-Host (" namaweb       : " + $namaweb)
Write-Host (" docs          : " + $docs)
Write-Host (" project_brain : " + $brain)
Write-Host (" migrations    : " + $migrations)
Write-Host (" skills_md     : " + $skillsCount)
Write-Host (" test_files    : " + $testsCount)
Write-Host (" report_path   : " + $out)
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
