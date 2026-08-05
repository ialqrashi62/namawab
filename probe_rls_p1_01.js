const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== RLS status on the 4 p1_01 tables ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = '\\''public'\\'' AND tablename IN ('\\''patients'\\'', '\\''invoices'\\'', '\\''appointments'\\'', '\\''medical_records'\\'') ORDER BY tablename;" 2>&1
echo ""
echo "=== Policies on those tables ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, polname FROM pg_policies WHERE schemaname = '\\''public'\\'' AND tablename IN ('\\''patients'\\'', '\\''invoices'\\'', '\\''appointments'\\'', '\\''medical_records'\\'');" 2>&1
echo ""
echo "=== schema_migrations applied? ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT migration_name, applied_at FROM schema_migrations WHERE migration_name LIKE '\\''p1_01%'\\'' ORDER BY migration_name;" 2>&1 | head -10'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
