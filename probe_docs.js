const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c 'ls /var/www/namaweb/docs/ 2>/dev/null
echo "---"
ls /var/www/namaweb/docs/governance/enterprise-hospital-platform/ 2>/dev/null | head -30
echo "---"
ls /var/www/namaweb/docs/ | grep -i -E "bench|gap|wave|prior" 2>/dev/null'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 4000));
