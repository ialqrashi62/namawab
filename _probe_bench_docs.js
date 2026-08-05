const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
ls /var/www/namaweb/docs/BENCHMARK* /var/www/namaweb/docs/PHASE_* /var/www/namaweb/docs/GATE* /var/www/namaweb/docs/GLOBAL* 2>/dev/null
echo "---"
ls /var/www/namaweb/docs/ | grep -iE "bench|gate|phase|global|roadmap|wave" 2>/dev/null'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 3000));
