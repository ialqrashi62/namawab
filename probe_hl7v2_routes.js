const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  "bash -lc 'cd /var/www/namaweb && grep -nE \"router\\\\.use|router\\\\.get|router\\\\.post|router\\\\.put|router\\\\.delete|^function|^  function|return router\" ./routes/hl7v2.js | head -40'",
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
