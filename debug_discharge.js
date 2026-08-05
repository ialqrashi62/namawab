const { spawnSync } = require('child_process');
const SH = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const REMOTE = 'bash -lc \'cd /var/www/namaweb && ' +
  'echo "=== Test 1: tenantId in body + headers ===" && ' +
  'curl -s -o /tmp/t1.txt -w "status: %{http_code}\\n" -X POST ' +
  '-H "Content-Type: application/json" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" ' +
  '-d "{\\"tenantId\\":\\"tnt-demo\\",\\"patientId\\":\\"P-001\\",\\"primaryDx\\":\\"Test\\",\\"notes\\":[\\"sample\\"],\\"events\\":[],\\"meds\\":[],\\"actorId\\":\\"dr-test\\",\\"actorRoles\\":[\\"doctor\\"]}" ' +
  '"http://127.0.0.1:3000/api/v4/discharge/draft" && ' +
  'head -c 800 /tmp/t1.txt && echo "" && ' +
  'echo "=== Test 2: tenantId ONLY in headers ===" && ' +
  'curl -s -o /tmp/t2.txt -w "status: %{http_code}\\n" -X POST ' +
  '-H "Content-Type: application/json" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" ' +
  '-d "{\\"patientId\\":\\"P-001\\",\\"primaryDx\\":\\"Test\\",\\"notes\\":[\\"sample\\"],\\"events\\":[],\\"meds\\":[],\\"actorId\\":\\"dr-test\\",\\"actorRoles\\":[\\"doctor\\"]}" ' +
  '"http://127.0.0.1:3000/api/v4/discharge/draft" && ' +
  'head -c 800 /tmp/t2.txt && echo "" && ' +
  'echo "=== Test 3: GET /api/v4/discharge/ds_123 ===" && ' +
  'curl -s -o /tmp/t3.txt -w "status: %{http_code}\\n" ' +
  '-H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" ' +
  '"http://127.0.0.1:3000/api/v4/discharge/ds_123" && ' +
  'head -c 800 /tmp/t3.txt && echo ""\'';

const r = spawnSync('ssh', [
  '-i', SH,
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74', REMOTE
], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });

process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 6000));
if (r.error) process.stderr.write('SPAWN ERR: ' + r.error.message + '\n');
if (r.status !== 0) process.stderr.write('SSH exit: ' + r.status + '\n');
