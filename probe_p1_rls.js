const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== p1_01 / p1_02 / p1_03 migrations ==="
ls /var/www/namaweb/migrations/p1_* 2>/dev/null
echo "=== e47 billing ==="
ls /var/www/namaweb/migrations/ | grep -E "^p[1-9]_|^ex_" | head -20
echo "=== audit_trail table check ==="
sudo -u postgres psql -d nama_medical_web -c "\\\\d audit_trail" 2>&1 | head -20
echo "=== RLS status ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = '\\''public'\\'' AND rowsecurity = true ORDER BY tablename LIMIT 20;" 2>&1 | head -30'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
