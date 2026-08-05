const { spawnSync } = require('child_process');
const cmd = process.argv[2];
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc ${JSON.stringify(cmd)}`
]);
const out = (r.stdout || r.stderr || '').toString();
process.stdout.write(out);
