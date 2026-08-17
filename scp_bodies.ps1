$files = Get-ChildItem C:\tmp\pharm_body_*.json | ForEach-Object { $_.FullName }
& scp -i $env:USERPROFILE\.ssh\nama_medical_key @files root@204.168.144.74:/tmp/
$ssh = "ls /tmp/pharm_body_*.json 2>&1 | wc -l ; bash /tmp/sm_pharm_tier14.sh 2>&1"
$out = & ssh -i $env:USERPROFILE\.ssh\nama_medical_key root@204.168.144.74 $ssh
$out | Select-String -Pattern "OK|FAIL|PASS=" | ForEach-Object { $_.Line } | Select-Object -First 35