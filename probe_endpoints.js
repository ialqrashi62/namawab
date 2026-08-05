const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
for path in "fhir/metadata" "fhir/Patient" "fhir/Patient/123" "fhir/Observation" "fhir/MedicationRequest" "dicomweb/" "dicomweb/stow/studies" "hl7v2/" "portal/v2/me" "api/v4/fhir/metadata" "api/v4/patient-portal/v2/me" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$path" 2>/dev/null)
  body=$(head -c 80 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "$path => $code | $body"
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
