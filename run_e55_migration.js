const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c "sudo -u postgres psql -d nama_medical_web -f /var/www/namaweb/migrations/e55_invoices_multi_currency_up.sql 2>&1" | head -40`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
