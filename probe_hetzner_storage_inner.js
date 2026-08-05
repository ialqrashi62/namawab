const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  "cd /var/www/namaweb && bash -c '\n# Check Patient storage shape\nnode -e \"const s=require(\\\"./lib/fhir/storage\\\"); console.log(\\\"Patient type:\\\", typeof s.Patient); console.log(\\\"Patient:\\\", Object.keys(s.Patient).slice(0,10))\" 2>&1 | head -10\necho \"---\"\n# Check storage class definitions\ngrep -nE \"module.exports|class.*Storage|function.*[Ss]torage\" ./lib/fhir/storage.js | head -20\necho \"---\"\n# Try to access search via static API\nnode -e \"const s=require(\\\"./lib/fhir/storage\\\"); console.log(\\\"Patient.search:\\\", typeof s.Patient.search); console.log(\\\"Patient.read:\\\", typeof s.Patient.read); console.log(\\\"Patient keys:\\\", Object.keys(s.Patient))\" 2>&1 | head -10\n'"
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
