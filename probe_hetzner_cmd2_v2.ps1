$key = 'C:\Users\ice\.ssh\nama_medical_key'
$host_ = 'root@204.168.144.74'
# Use grep -E with alternation, no shell pipe. -e forms for safety. head via grep -m 20.
$remoteCmd = 'cd /var/www/namaweb && grep -nE -e fhir_server -e fhir_router -e dicomweb -e hl7v2 -e patient_portal_v2 -m 20 server.js'
Write-Host '=== CMD2 v2: fhir/dicom/hl7/portal symbols ==='
& ssh -i $key -o BatchMode=yes -o StrictHostKeyChecking=no -o ConnectTimeout=15 $host_ $remoteCmd
Write-Host '=== exit:'$LASTEXITCODE' ==='
