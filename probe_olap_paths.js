const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
for p in "api/v4/olap/views" "api/v4/olap/query" "api/v4/olap/export" "api/v4/olap/refresh/mv_daily_admissions/history" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: admin" "http://127.0.0.1:3000/$p" 2>/dev/null)
  body=$(head -c 200 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "$p => $code | $body"
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
