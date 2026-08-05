// filepath: probe_olap_remote.js
const r = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cat > /tmp/probe_olap.js'
], { encoding: 'utf8', input: [
  "const m = require('/var/www/namaweb/routes/olap');",
  "console.log('olapRouter:', typeof m.olapRouter, m.olapRouter && m.olapRouter.stack ? m.olapRouter.stack.length + ' routes' : 'no stack');",
  "if (m.olapRouter && m.olapRouter.stack) m.olapRouter.stack.forEach(l => { if (l.route) console.log('  ', Object.keys(l.route.methods).join(','), l.route.path); });",
  "console.log('viewsRouter:', typeof m.viewsRouter, m.viewsRouter && m.viewsRouter.stack ? m.viewsRouter.stack.length + ' routes' : 'no stack');",
  "if (m.viewsRouter && m.viewsRouter.stack) m.viewsRouter.stack.forEach(l => { if (l.route) console.log('  V:', Object.keys(l.route.methods).join(','), l.route.path); });",
  "console.log('queryRouter:', typeof m.queryRouter, m.queryRouter && m.queryRouter.stack ? m.queryRouter.stack.length + ' routes' : 'no stack');",
  "if (m.queryRouter && m.queryRouter.stack) m.queryRouter.stack.forEach(l => { if (l.route) console.log('  Q:', Object.keys(l.route.methods).join(','), l.route.path); });",
  "console.log('exportRouter:', typeof m.exportRouter);",
  "console.log('paramRouter:', typeof m.paramRouter);",
  "console.log('module.exports type:', typeof m);",
  "console.log('module.exports has router property:', !!m.router);",
  "console.log('module.exports.router stack:', m.router ? m.router.stack.length : 'no');",
  "console.log('module.exports keys:', Object.keys(m));",
  ""
].join('\n') });
process.stdout.write('WRITE_STDOUT:' + (r.stdout || '') + '\n');
process.stdout.write('WRITE_STDERR:' + (r.stderr || '') + '\n');
process.stdout.write('WRITE_CODE:' + r.status + '\n');

const r2 = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cd /var/www/namaweb && node /tmp/probe_olap.js 2>&1'
], { encoding: 'utf8' });
process.stdout.write('=== STDOUT ===\n' + (r2.stdout || '') + '\n');
process.stdout.write('=== STDERR ===\n' + (r2.stderr || '') + '\n');
process.stdout.write('=== CODE:' + r2.status + ' ===\n');
