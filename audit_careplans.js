const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== CarePlans routes ==="
curl -s -o /dev/null -w "active: %{http_code}\\n" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" http://127.0.0.1:3000/api/v4/careplans/active
curl -s -o /dev/null -w "bundles: %{http_code}\\n" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" http://127.0.0.1:3000/api/v4/careplans/bundles
echo "=== Engines dir ==="
ls /var/www/namaweb/engines | head -10
echo "=== careplans.js head ==="
head -50 /var/www/namaweb/routes/careplans.js
echo "=== care_plan_bundles in DB? ==="
PGPASSWORD="NamaMedicalApp@2026!" psql -U nama_medical_app -h localhost -d nama_medical_web -c "SELECT COUNT(*) FROM care_plan_bundles;" 2>&1 | head -5
'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
