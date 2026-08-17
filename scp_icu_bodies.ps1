cd C:\tmp
$files = Get-ChildItem icu_body_*.json
foreach ($f in $files) {
  scp -i $env:USERPROFILE\.ssh\nama_medical_key $f.FullName root@204.168.144.74:/tmp/ 2>&1 | Out-Null
}
$out = ssh -i $env:USERPROFILE\.ssh\nama_medical_key root@204.168.144.74 'bash /tmp/sm_icu_tier15.sh 2>&1'
$out | Select-String -Pattern 'OK|FAIL|PASS=' | ForEach-Object { $_.Line } | Select-Object -First 28