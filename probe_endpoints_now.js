const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && bash -c '
for path in "fhir/metadata" "api/v4/dicomweb/" "api/v4/fhir/Patient" "api/v4/hl7v2/" "api/v4/patient_portal_v2/me" ; do
  echo "--- $path ---"
  curl -s -o /tmp/b.txt -w "status=%{http_code}\n" "http://127.0.0.1:3000/$path"
  head -c 200 /tmp/b.txt
  echo ""
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
