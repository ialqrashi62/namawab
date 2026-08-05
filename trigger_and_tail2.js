const { spawnSync } = require('child_process');
const KEY = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const HOST = 'root@204.168.144.74';
const A = ['-i', KEY, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15'];

const up = spawnSync('scp', [...A, 'trigger_and_tail2.sh', `${HOST}:/tmp/trigger_and_tail2.sh`], { encoding: 'utf8' });
process.stdout.write('upload exit: ' + up.status + '\n');
const r = spawnSync('ssh', [...A, HOST, 'bash /tmp/trigger_and_tail2.sh'], { encoding: 'utf8', maxBuffer: 4*1024*1024 });
process.stdout.write(r.stdout || '');
process.stdout.write('\n--- STDERR ---\n' + (r.stderr || '') + '\nSTATUS: ' + r.status + '\n');
