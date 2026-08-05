const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== OLAP modules ==="
ls /var/www/namaweb/lib/olap 2>/dev/null || find /var/www/namaweb/lib -name "*olap*" -o -name "*analytics*" -type f 2>/dev/null | head -10
echo "=== olap.js routes ==="
node -e "const m=require(\\"./routes/olap\\"); const keys=Object.keys(m); console.log(\\"keys:\\", keys); for(const k of keys){const v=m[k]; if(typeof v===\\"function\\" && v.stack){console.log(k+\\" stack=\\"+v.stack.length); v.stack.forEach(l=>{if(l.route)console.log(\\"  \\", Object.keys(l.route.methods).join(\\",\\"), l.route.path)})}}"
echo "=== olap lib ==="
head -50 /var/www/namaweb/lib/olap.js 2>&1
echo "=== live olap test ==="
for p in "api/v4/olap/" "api/v4/olap/summary" "api/v4/olap/kpis" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$p" 2>/dev/null)
  body=$(head -c 120 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "  $p => $code | $body"
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
