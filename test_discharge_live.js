const { spawnSync } = require('child_process');
const ssh = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const remote = 'root@204.168.144.74';

// Build script; use 'bash -s' so we can pipe the script via stdin (avoids all quoting issues)
const body1 = '{"patientId":"P-002","primaryDx":"Stroke","notes":["left hemiparesis"],"events":["CT head"],"meds":["tPA"],"actorId":"dr-test","actorRoles":["doctor"]}';
const body2 = '{"tenantId":"tnt-demo","patientId":"P-003","lang":"en-US","primaryDx":"Sepsis","notes":["fever 39C"],"events":["lactate 4.5"],"meds":["Pip-Tazo"],"actorId":"dr-test","actorRoles":["doctor"]}';

const bashScript = [
  'echo "=== HEADER-ONLY ==="',
  'curl -s -X POST -H "Content-Type: application/json" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" -d \'' + body1 + '\' http://127.0.0.1:3000/api/v4/discharge/draft | head -c 500',
  'echo ""',
  'echo "=== HEADER + BODY ==="',
  'curl -s -X POST -H "Content-Type: application/json" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" -d \'' + body2 + '\' http://127.0.0.1:3000/api/v4/discharge/draft | head -c 500',
  'echo ""',
  'echo "=== GET ds_test ==="',
  'curl -s -o /tmp/b.txt -w "status: %{http_code}\\n" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/api/v4/discharge/ds_test"',
  'head -c 300 /tmp/b.txt',
  'echo ""',
  'echo "=== GET /drafts list ==="',
  'curl -s -o /tmp/c.txt -w "status: %{http_code}\\n" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/api/v4/discharge/drafts"',
  'head -c 500 /tmp/c.txt',
  'echo ""'
].join('\n');

const r = spawnSync('ssh', [
  '-i', ssh,
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  remote,
  'bash -s'
], { input: bashScript, encoding: 'utf8' });

console.log('--- STDOUT ---');
console.log((r.stdout || '').toString());
console.log('--- STDERR ---');
console.log((r.stderr || '').toString());
console.log('--- exit:', r.status, '---');
