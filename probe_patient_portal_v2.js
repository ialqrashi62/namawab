const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && head -80 ./routes/patient_portal_v2.js && echo "---" && grep -nE "return|router\\.|module\\.exports|express\\(\\)" ./routes/patient_portal_v2.js | head -30`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
