$env:NAMA_SSH = "C:\Users\ice\.ssh\nama_medical_key"

Write-Host "=== /pcc-catalog/modules on both servers ==="
ssh -i $env:NAMA_SSH root@204.168.144.74 'curl -s -o /dev/null -w "erp3000=%{http_code}\n" http://127.0.0.1:3000/pcc-catalog/modules; curl -s -o /dev/null -w "pcc3101=%{http_code}\n" http://127.0.0.1:3101/pcc-catalog/modules'

Write-Host ""
Write-Host "=== /pcc-catalog/ on both servers (head 80 chars) ==="
ssh -i $env:NAMA_SSH root@204.168.144.74 'curl -s http://127.0.0.1:3000/pcc-catalog/ | head -c 200; echo ""; echo "----"; curl -s http://127.0.0.1:3101/pcc-catalog/ | head -c 200'

Write-Host ""
Write-Host "=== 8 module list routes ==="
$mList = @("cardiology_ext102","endocrinology_ext102","anesthesiology_ext102","adolescent_ext101","emergency_ext102","billing","pharmacy_ext102","icu_ext102")
foreach ($m in $mList) {
    $r = ssh -i $env:NAMA_SSH root@204.168.144.74 "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3101/api/v1/pcc-$m/list"
    Write-Host "$r  pcc_$m"
}

Write-Host ""
Write-Host "=== /sw.js head + /openapi-pcc.yaml head ==="
ssh -i $env:NAMA_SSH root@204.168.144.74 'curl -s http://127.0.0.1:3000/sw.js | head -c 300; echo ""; echo "----"; curl -s http://127.0.0.1:3000/openapi-pcc.yaml | head -c 300'

Write-Host ""
Write-Host "=== /offline.html head (Arabic?) ==="
ssh -i $env:NAMA_SSH root@204.168.144.74 'curl -s http://127.0.0.1:3000/offline.html | head -c 400'

Write-Host ""
Write-Host "=== /manifest.json ==="
ssh -i $env:NAMA_SSH root@204.168.144.74 'curl -s http://127.0.0.1:3000/manifest.json | head -c 500'

Write-Host ""
Write-Host "=== /api-docs/ ==="
ssh -i $env:NAMA_SSH root@204.168.144.74 'curl -s http://127.0.0.1:3000/api-docs/ | head -c 400'
