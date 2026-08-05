const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc 'echo "=== line 5453-5457 ==="; sed -n "5453,5457p" /var/www/namaweb/public/js/app.js; echo "=== line 6612-6616 ==="; sed -n "6612,6616p" /var/www/namaweb/public/js/app.js'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 2000));
