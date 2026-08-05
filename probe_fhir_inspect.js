const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && bash -c '
# Check what the FHIR router requires
sed -n "1,60p" ./lib/fhir/router.js
echo "---"
# Check storage methods
node -e "const s=require(\\\"./lib/fhir/storage\\\"); const p=new s.Patient(); console.log(\\\"Patient methods:\\\", Object.getOwnPropertyNames(Object.getPrototypeOf(p))); console.log(\\\"Patient direct:\\\", Object.getOwnPropertyNames(p))" 2>&1 | head -20'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
