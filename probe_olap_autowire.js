const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c 'sed -n "24485,24595p" /var/www/namaweb/server.js'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
