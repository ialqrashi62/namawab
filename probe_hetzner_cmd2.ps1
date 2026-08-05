$key = 'C:\Users\ice\.ssh\nama_medical_key'
$host_ = 'root@204.168.144.74'
$remoteCmd = "bash -lc 'cd /var/www/namaweb && grep -nE ""fhir_server|fhir_router|dicomweb|hl7v2|patient_portal_v2"" server.js | head -20'"
Write-Host '=== CMD2: fhir/dicom/hl7/portal symbols (retried) ==='
& ssh -i $key -o BatchMode=yes -o StrictHostKeyChecking=no -o ConnectTimeout=15 $host_ $remoteCmd
Write-Host '=== exit:'$LASTEXITCODE' ==='
