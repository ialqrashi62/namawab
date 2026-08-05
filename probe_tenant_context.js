const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  "bash -c 'cat /var/www/namaweb/tenant_context.js'"
]);
const out = (r.stdout || r.stderr || '').toString();
console.log('--- STDOUT LEN:', r.stdout ? r.stdout.length : 0, 'STDERR LEN:', r.stderr ? r.stderr.length : 0);
console.log(out.slice(0, 8000));
