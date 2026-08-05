const { spawnSync } = require('child_process');
const KEY = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const HOST = 'root@204.168.144.74';
const A = ['-i', KEY, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15'];

const up = spawnSync('scp', [...A, 'diag_wave21.sh', `${HOST}:/tmp/diag_wave21.sh`], { encoding: 'utf8' });
process.stdout.write('upload exit: ' + up.status + '\n');
if (up.stderr) process.stdout.write('upload stderr: ' + up.stderr + '\n');

const r = spawnSync('ssh', [...A, HOST, 'bash /tmp/diag_wave21.sh'], { encoding: 'utf8', maxBuffer: 4*1024*1024 });
process.stdout.write('\n===== STDOUT (' + (r.stdout||'').length + ' bytes) =====\n');
process.stdout.write(r.stdout || '');
process.stdout.write('\n===== STDERR (' + (r.stderr||'').length + ' bytes) =====\n');
process.stdout.write(r.stderr || '');
process.stdout.write('\n===== STATUS: ' + r.status + ' =====\n');
