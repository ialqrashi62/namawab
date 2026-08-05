const { spawnSync } = require('child_process');

const KEY = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const HOST = 'root@204.168.144.74';
const SSH_ARGS = ['-i', KEY, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15'];

// 1) Upload the bash script
process.stdout.write('--- UPLOADING verify_wave21_chain.sh ---\n');
const up = spawnSync('scp',
  [...SSH_ARGS, 'verify_wave21_chain.sh', `${HOST}:/tmp/verify_wave21_chain.sh`],
  { encoding: 'utf8' }
);
process.stdout.write('upload exit: ' + up.status + '\n');
if (up.stdout) process.stdout.write('upload stdout: ' + up.stdout + '\n');
if (up.stderr) process.stdout.write('upload stderr: ' + up.stderr + '\n');

// 2) Run the script on the server
process.stdout.write('\n--- RUNNING verify_wave21_chain.sh on Hetzner ---\n');
const r = spawnSync('ssh',
  [...SSH_ARGS, HOST, 'bash /tmp/verify_wave21_chain.sh'],
  { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
);
const out = r.stdout || '';
const err = r.stderr || '';
process.stdout.write('\n===== STDOUT (' + out.length + ' bytes) =====\n');
process.stdout.write(out);
process.stdout.write('\n===== STDERR (' + err.length + ' bytes) =====\n');
process.stdout.write(err);
process.stdout.write('\n===== STATUS: ' + r.status + ' =====\n');
process.stdout.write('===== ERROR: ' + (r.error ? r.error.message : 'none') + ' =====\n');
