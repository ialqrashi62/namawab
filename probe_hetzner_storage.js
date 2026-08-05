const { spawnSync } = require('child_process');

const remoteCmd = `cd /var/www/namaweb && bash -c '
# Check Patient storage shape
node -e "const s=require(\\"./lib/fhir/storage\\"); console.log(\\Patient type:\\, typeof s.Patient); console.log(\\Patient:\\, Object.keys(s.Patient).slice(0,10))" 2>&1 | head -10
echo "---"
# Check storage class definitions
grep -nE "module.exports|class.*Storage|function.*[Ss]torage" ./lib/fhir/storage.js | head -20
echo "---"
# Try to access search via static API
node -e "const s=require(\\"./lib/fhir/storage\\"); console.log(\\Patient.search:\\, typeof s.Patient.search); console.log(\\Patient.read:\\, typeof s.Patient.read); console.log(\\Patient keys:\\, Object.keys(s.Patient))" 2>&1 | head -10
'`;

// Escape the whole thing for PowerShell: wrap in single quotes and escape any single quotes by doubling them
const psCommand = `node probe_hetzner_storage_inner.js`;

const inner = `
const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\\\Users\\\\ice\\\\.ssh\\\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  ${JSON.stringify(remoteCmd)}
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
`;

require('fs').writeFileSync('probe_hetzner_storage_inner.js', inner);
