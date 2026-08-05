const { spawnSync } = require('child_process');
const fs = require('fs');

const SQL = `
echo "=== policies on RLS-enabled tables ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('patients', 'invoices', 'appointments');" 2>&1
echo ""
echo "=== migration tracker table candidates ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND (tablename LIKE '%migration%' OR tablename LIKE '%schema%');" 2>&1
echo ""
echo "=== RLS status on those 3 tables ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, rowsecurity, forcerowsecurity FROM pg_tables WHERE schemaname='public' AND tablename IN ('patients','invoices','appointments','medical_records');" 2>&1
echo ""
echo "=== full migration list (look for p1_01) ==="
ls /var/www/namaweb/migrations/ | grep "p1_01_legacy_core_rls"
echo "=== p1_01 migration content for medical_records ==="
grep -A 15 "medical_records" /var/www/namaweb/migrations/p1_01_legacy_core_rls_up.sql | head -40
`;

const tmp = 'C:\\Users\\ice\\Desktop\\NMEDCALVSCODE\\probe_rls_p1_02.sql';
fs.writeFileSync(tmp, SQL, 'utf8');
const b64 = fs.readFileSync(tmp).toString('base64');

const remoteCmd = `bash -lc 'echo ${b64} | base64 -d | bash'`;
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  remoteCmd
]);

console.log((r.stdout || r.stderr || '').toString().slice(0, 8000));
