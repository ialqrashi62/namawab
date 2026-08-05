const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  "PGPASSWORD='NamaMedicalApp@2026!' psql -U nama_medical_app -h localhost -d nama_medical_web -v ON_ERROR_STOP=1 -f /var/www/namaweb/migrations/e55_invoices_multi_currency_up.sql"
]);
console.log('STDOUT >>>');
process.stdout.write((r.stdout || '').toString().slice(0, 8000));
console.log('<<< END STDOUT');
console.log('STDERR >>>');
process.stdout.write((r.stderr || '').toString().slice(0, 8000));
console.log('<<< END STDERR');
console.log('STATUS:', r.status);
console.log('ERROR:', r.error ? r.error.message : null);
