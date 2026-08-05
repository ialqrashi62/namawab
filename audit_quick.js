const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== order sets count ==="
curl -s -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" http://127.0.0.1:3000/api/v4/careplans/bundles | node -e "let d=\\"\\"; process.stdin.on(\\"data\\",c=>d+=c); process.stdin.on(\\"end\\",()=>{const j=JSON.parse(d); console.log(\\"keys:\\", Object.keys(j)); console.log(\\"bundles:\\", Object.keys(j.bundles||{}).length); for(const k of Object.keys(j.bundles||{}).slice(0,20))console.log(\\"  -\\", k)})"
echo "=== orderSets file head ==="
head -60 /var/www/namaweb/lib/careplans/orderSets.js 2>&1
echo "=== full file count ==="
wc -l /var/www/namaweb/lib/careplans/orderSets.js
echo "=== engine file ==="
ls /var/www/namaweb/lib/careplans/
echo "=== sample bundle structure ==="
curl -s -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" http://127.0.0.1:3000/api/v4/careplans/bundles/stroke_alert 2>&1 | head -c 500'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
