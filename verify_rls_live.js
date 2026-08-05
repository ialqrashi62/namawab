const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc '
echo "=== app still serving traffic ==="
for p in "api/v4/olap/views" "api/v4/patient/list" "api/settings" "api/auth/me"; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: admin" "http://127.0.0.1:3000/$p")
  body=$(head -c 120 /tmp/b.txt)
  echo "$p => $code | $body"
done
echo ""
echo "=== patients table RLS ==="
APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d "\r\n")
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c "SET app.tenant_id = '\''1'\''; SELECT count(*) FROM patients;" 2>&1 | grep -v "could not change directory"
echo ""
echo "=== invoices table RLS ==="
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c "SET app.tenant_id = '\''1'\''; SELECT count(*) FROM invoices;" 2>&1 | grep -v "could not change directory"
echo ""
echo "=== appointments table RLS ==="
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c "SET app.tenant_id = '\''1'\''; SELECT count(*) FROM appointments;" 2>&1 | grep -v "could not change directory"
'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 6000));
process.stderr.write((r.stderr || '').toString());
process.exit(r.status || 0);
