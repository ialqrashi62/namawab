# upload_waves.ps1 — Upload Wave 29-33 artifacts to Hetzner /var/www/namaweb/
$key = 'C:\Users\ice\.ssh\nama_medical_key'
$host = 'root@204.168.144.74'
$srcRoot = 'C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb'
$dstRoot = '/var/www/namaweb'

$files = @(
    'wave29_sessions.js',
    'wave29_sessions_test.js',
    'wave30_backup.sh',
    'wave30_backup_test.js',
    'wave31_rls_audit.js',
    'wave31_rls_audit_test.js',
    'wave32_metrics.js',
    'wave32_metrics_test.js',
    'openapi_generator.js',
    'openapi_generator_test.js'
)

foreach ($f in $files) {
    $src = Join-Path $srcRoot $f
    if (-not (Test-Path $src)) {
        Write-Host "[SKIP] $src not found"
        continue
    }
    $scpArgs = @(
        '-i', $key,
        '-o', 'BatchMode=yes',
        '-o', 'ConnectTimeout=10',
        $src,
        "${host}:${dstRoot}/$f"
    )
    & scp @scpArgs 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] scp $f -> $LASTEXITCODE"
    } else {
        Write-Host "[FAIL] scp $f exit=$LASTEXITCODE"
    }
}
