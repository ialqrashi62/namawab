// filepath: probe_olap_final.js
const r = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cat > /tmp/probe_olap4.js'
], { encoding: 'utf8', input: [
  "const m = require('/var/www/namaweb/routes/olap');",
  "console.log('olapRouter.name=' + m.olapRouter.name + ' arity=' + m.olapRouter.length);",
  "console.log('olapRouter.toString().slice(0,400)=\\n' + m.olapRouter.toString().slice(0,400));",
  "console.log('---');",
  "console.log('runner constructor=' + (m.runner && m.runner.constructor && m.runner.constructor.name));",
  "console.log('runner proto methods=' + Object.getOwnPropertyNames(Object.getPrototypeOf(m.runner)).join(','));",
  "console.log('---');",
  "console.log('refreshSvc proto methods=' + Object.getOwnPropertyNames(Object.getPrototypeOf(m.refreshSvc)).join(','));",
  "console.log('---');",
  "// Also dump the file header to confirm path/exports",
  "const fs = require('fs');",
  "const head = fs.readFileSync('/var/www/namaweb/routes/olap.js', 'utf8').split('\\n').slice(0, 20).join('\\n');",
  "console.log('--- file head ---');",
  "console.log(head);",
  "const tail = fs.readFileSync('/var/www/namaweb/routes/olap.js', 'utf8').split('\\n').slice(-20).join('\\n');",
  "console.log('--- file tail ---');",
  "console.log(tail);",
  ""
].join('\n') });
process.stdout.write('WRITE_STDOUT:' + (r.stdout || '') + '\n');
process.stdout.write('WRITE_STDERR:' + (r.stderr || '') + '\n');
process.stdout.write('WRITE_CODE:' + r.status + '\n');

const r2 = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cd /var/www/namaweb && node /tmp/probe_olap4.js 2>&1'
], { encoding: 'utf8' });
process.stdout.write('=== STDOUT ===\n' + (r2.stdout || '') + '\n');
process.stdout.write('=== STDERR ===\n' + (r2.stderr || '') + '\n');
process.stdout.write('=== CODE:' + r2.status + ' ===\n');
