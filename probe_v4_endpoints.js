const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c 'for path in pgx/pairs bi/workspaces voice/models dr/regions trials/protocols population/registries integrations/sf/patient360/123 home-health/nurse-route/n1/2026-08-03 telehealth/rooms genomic/genes compounding/orders mobile/refresh ; do code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" http://127.0.0.1:3000/api/v4/$path) ; body=$(head -c 60 /tmp/b.txt) ; echo "$path => $code | $body" ; done'`
]);
const out = (r.stdout ? r.stdout.toString() : '') + (r.stderr ? r.stderr.toString() : '');
console.log(out.slice(0, 4000));
