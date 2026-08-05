const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `pm2 flush && sleep 1 && curl -s -H 'x-tenant-id: tnt-demo' -H 'x-user-id: dr-test' -H 'x-user-role: doctor' http://127.0.0.1:3000/api/v4/pgx/pairs > /dev/null && sleep 1 && pm2 logs nama-medical-erp --lines 80 --nostream --raw 2>&1 | tail -40`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
