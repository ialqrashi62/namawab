const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c 'echo "=== .env ===" && cat /var/www/namaweb/.env | grep -iE "user|password|owner|admin|root" && echo "=== invoices owner ===" && PGPASSWORD="NamaMedicalApp@2026!" psql -U nama_medical_app -h localhost -d nama_medical_web -c "SELECT tableowner FROM pg_tables WHERE tablename=\\\"invoices\\\";" 2>&1 && echo "=== check postgres user ===" && which psql && id postgres 2>&1'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
