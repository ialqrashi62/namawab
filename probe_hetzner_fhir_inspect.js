const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && bash -c '
# Check the auth that fhir/metadata requires
curl -s "http://127.0.0.1:3000/fhir/metadata" | head -c 200
echo ""
echo "--- check FHIR router code ---"
head -30 ./routes/fhir_router.js
echo "--- check fhir_storage ---"
node -e "const s=require(\\\"./lib/fhir/storage\\\"); console.log(Object.keys(s)); console.log(\\\"Patient methods:\\\", Object.getOwnPropertyNames(Object.getPrototypeOf(s.Patient)))"'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
