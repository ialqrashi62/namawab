const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== FHIR router dev-ctx line ==="
grep -nE "dev-ctx" /var/www/namaweb/lib/fhir/router.js | head -3
echo "=== HL7 dev-ctx ==="
grep -nE "dev-ctx" /var/www/namaweb/routes/hl7v2.js | head -3
echo "=== DICOM dev-ctx ==="
grep -nE "dev-ctx" /var/www/namaweb/routes/dicomweb.js | head -3
echo "=== Patient Portal v2 routes ==="
grep -nE "app\\.get|app\\.post|router\\.get|router\\.post" /var/www/namaweb/routes/patient_portal_v2.js
echo "=== Patient Portal v2 mount in server.js ==="
grep -nE "patient_portal_v2|patient-portal" /var/www/namaweb/server.js | head -10'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
