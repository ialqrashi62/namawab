const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && bash -c '
echo "=== HL7 routes ==="
grep -nE "app.use|app.post|app.get" ./routes/hl7v2.js | head -10
echo "=== DICOM routes ==="
grep -nE "app.use|app.get|app.post|router." ./routes/dicomweb.js | head -20
echo "=== HL7 storage ==="
ls -la ./lib/hl7 2>/dev/null
ls -la ./lib/*hl7* 2>/dev/null
find . -name "hl7v2*" -type f 2>/dev/null | head -5
echo "=== DICOM storage ==="
ls -la ./lib/dicom 2>/dev/null
find . -name "*dicom*" -type f 2>/dev/null | grep -v node_modules | head -10'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
