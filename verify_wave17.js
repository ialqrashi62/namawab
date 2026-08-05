const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== app still serving ==="
for p in "api/health" "api/v4/olap/views" "api/v4/olap/query?view=mv_daily_admissions"; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: admin" "http://127.0.0.1:3000/$p")
  body=$(head -c 80 /tmp/b.txt)
  echo "$p => $code | $body"
done
echo ""
echo "=== audit row count (must keep growing) ==="
APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d "\r\n")
PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c "SET app.tenant_id = '\''1'\''; SELECT count(*), max(created_at) FROM audit_trail;" 2>&1 | grep -v "could not change directory"
echo ""
echo "=== pm2 status ==="
pm2 list 2>/dev/null | grep -E "name-medical-erp|mem|status" | head -5'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 3000));
