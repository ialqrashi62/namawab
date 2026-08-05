const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== HEALTH ==="
curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1:3000/api/health
echo "=== FHIR ==="
for p in "fhir/metadata" "fhir/Patient" "fhir/Patient/123" "fhir/Observation?patient=123" "fhir/MedicationRequest?patient=123" "fhir/Condition?patient=123" "fhir/AllergyIntolerance?patient=123" "fhir/DiagnosticReport?patient=123" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$p" 2>/dev/null)
  body=$(head -c 70 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "  $p => $code | $body"
done
echo "=== HL7 ==="
for p in "api/v4/hl7/" "api/v4/hl7" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$p" 2>/dev/null)
  body=$(head -c 70 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "  $p => $code | $body"
done
echo "=== DICOM ==="
for p in "api/v4/dicomweb/qido/studies" "api/v4/dicomweb/ohif/config" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$p" 2>/dev/null)
  body=$(head -c 70 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "  $p => $code | $body"
done
echo "=== PATIENT PORTAL V2 ==="
for p in "api/v4/portal2/me" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: patient-test" -H "x-user-role: patient" "http://127.0.0.1:3000/$p" 2>/dev/null)
  body=$(head -c 70 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "  $p => $code | $body"
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
