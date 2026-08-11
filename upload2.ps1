$key = 'C:\Users\ice\.ssh\nama_medical_key'
$host = 'root@204.168.144.74'
$dst = '/var/www/namaweb'
$files = @('wave30_backup.sh','wave30_backup_test.js','wave31_rls_audit.js','wave31_rls_audit_test.js','wave32_metrics.js','wave32_metrics_test.js','openapi_generator.js','openapi_generator_test.js')
foreach ($f in $files) {
    $src = "C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb\$f"
    Write-Host "scp $f"
    & scp -i $key -o BatchMode=yes -o ConnectTimeout=10 $src "${host}:${dst}/" 2>&1 | Out-String
    Write-Host ("  exit=$LASTEXITCODE")
}
