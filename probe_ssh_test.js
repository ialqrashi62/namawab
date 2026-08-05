// filepath: probe_ssh_test.js
const r = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'pwd; echo MARK; ls /tmp/probe_olap.js 2>&1'
], { encoding: 'utf8' });
process.stdout.write('STDOUT:' + (r.stdout || '') + '\n');
process.stdout.write('STDERR:' + (r.stderr || '') + '\n');
process.stdout.write('CODE:' + r.status + '\n');
