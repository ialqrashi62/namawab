const { spawnSync } = require('child_process');
const KEY = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const HOST = 'root@204.168.144.74';
const A = ['-i', KEY, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15'];

for (const f of ['diag_wave21b.sh', 'trigger_logins.sh']) {
  const up = spawnSync('scp', [...A, f, `${HOST}:/tmp/${f}`], { encoding: 'utf8' });
  process.stdout.write('upload ' + f + ' exit: ' + up.status + (up.stderr ? ('\n' + up.stderr) : '') + '\n');
}

process.stdout.write('\n--- triggering live login attempts on Hetzner localhost:3000 ---\n');
const r1 = spawnSync('ssh', [...A, HOST, 'bash /tmp/trigger_logins.sh'], { encoding: 'utf8', maxBuffer: 4*1024*1024 });
process.stdout.write('===== STDOUT (' + (r1.stdout||'').length + ' bytes) =====\n');
process.stdout.write(r1.stdout || '');
process.stdout.write('\n===== STDERR (' + (r1.stderr||'').length + ' bytes) =====\n');
process.stdout.write(r1.stderr || '');
process.stdout.write('\n----- STATUS ' + r1.status + ' -----\n\n');

process.stdout.write('--- chain diagnostic ---\n');
const r2 = spawnSync('ssh', [...A, HOST, 'bash /tmp/diag_wave21b.sh'], { encoding: 'utf8', maxBuffer: 8*1024*1024 });
process.stdout.write('===== STDOUT (' + (r2.stdout||'').length + ' bytes) =====\n');
process.stdout.write(r2.stdout || '');
process.stdout.write('\n===== STDERR (' + (r2.stderr||'').length + ' bytes) =====\n');
process.stdout.write(r2.stderr || '');
process.stdout.write('\n----- STATUS ' + r2.status + ' -----\n');
