const { spawnSync } = require('child_process');

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && bash -c '
echo "=== route-guards requireTenantScope ==="
grep -nA 12 "function requireTenantScope\\b" ./lib/route-guards.js
echo "=== Patient portal v2 lines around 24617 ==="
sed -n "24615,24625p" ./server.js
echo "=== DICOM routes exported paths ==="
node -e "const m=require(\\"./routes/dicomweb\\"); console.log(\\"handlers:\\", Object.keys(m.handlers)); const r=m.router; if(r && r.stack){r.stack.forEach(l=>{if(l.route)console.log(\\"  \\", Object.keys(l.route.methods).join(\\",\\"), l.route.path)})}" 2>&1
echo "=== HL7 routes ==="
node -e "const m=require(\\"./routes/hl7v2\\"); console.log(\\"type:\\", typeof m); if(m && m.stack){m.stack.forEach(l=>{if(l.route)console.log(\\"  \\", Object.keys(l.route.methods).join(\\",\\"), l.route.path); else console.log(\\"  mw:\\", l.regexp.source)})}else console.log(\\"no stack\\", Object.keys(m||{}).slice(0,5))" 2>&1'`
]);

console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
