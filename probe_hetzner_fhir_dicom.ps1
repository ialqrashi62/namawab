$key = 'C:\Users\ice\.ssh\nama_medical_key'
$host_ = 'root@204.168.144.74'
$opts  = @('-i', $key, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15')

$cmd1 = 'cd /var/www/namaweb && grep -nE "app.use" server.js | head -60'
Write-Host '=== CMD1: app.use mounts ==='
ssh @opts $host_ $cmd1

$cmd2 = 'cd /var/www/namaweb && grep -nE "fhir_server|fhir_router|dicomweb|hl7v2|patient_portal_v2" server.js | head -20'
Write-Host '=== CMD2: fhir/dicom/hl7/portal symbols ==='
ssh @opts $host_ $cmd2
