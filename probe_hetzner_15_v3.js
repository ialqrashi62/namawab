const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
for path in "fhir/metadata" "fhir/Patient" "fhir/Patient/123" "fhir/Observation?patient=123" "fhir/MedicationRequest?patient=123" "fhir/Condition?patient=123" "fhir/AllergyIntolerance?patient=123" "fhir/DiagnosticReport?patient=123" "api/v4/hl7/inbox" "api/v4/hl7/" "api/v4/dicomweb/" "api/v4/dicomweb/qido/studies" "api/v4/dicomweb/ohif/config" "api/v4/patient_portal_v2/me" "api/v4/patient_portal_v2/appointment" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -X GET -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$path" 2>/dev/null)
  body=$(head -c 120 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "$path => $code | $body"
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
