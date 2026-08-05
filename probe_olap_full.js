// filepath: probe_olap_full.js
const r = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cat > /tmp/probe_olap2.js'
], { encoding: 'utf8', input: [
  "const m = require('/var/www/namaweb/routes/olap');",
  "function dumpRouter(name, r) {",
  "  if (!r) { console.log(name + ': undefined'); return; }",
  "  if (typeof r !== 'function') { console.log(name + ': not a function, type=' + typeof r); return; }",
  "  if (!r.stack) { console.log(name + ': function but no .stack (raw express app?)'); return; }",
  "  console.log(name + ': ' + r.stack.length + ' layers');",
  "  r.stack.forEach((l, i) => {",
  "    if (l.route) {",
  "      console.log('  [' + i + '] ROUTE', Object.keys(l.route.methods).join(',').toUpperCase(), l.route.path);",
  "    } else if (l.name === 'router') {",
  "      console.log('  [' + i + '] SUB-ROUTER ' + (l.regexp && l.regexp.source ? l.regexp.source : '?'));",
  "    } else {",
  "      console.log('  [' + i + '] MW name=' + (l.name || '?') + ' path=' + (l.regexp ? l.regexp.source : '?').slice(0, 80));",
  "    }",
  "  });",
  "}",
  "dumpRouter('olapRouter', m.olapRouter);",
  "dumpRouter('viewsRouter', m.viewsRouter);",
  "dumpRouter('queryRouter', m.queryRouter);",
  "dumpRouter('exportRouter', m.exportRouter);",
  "dumpRouter('paramRouter', m.paramRouter);",
  ""
].join('\n') });
process.stdout.write('WRITE_STDOUT:' + (r.stdout || '') + '\n');
process.stdout.write('WRITE_STDERR:' + (r.stderr || '') + '\n');
process.stdout.write('WRITE_CODE:' + r.status + '\n');

const r2 = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cd /var/www/namaweb && node /tmp/probe_olap2.js 2>&1'
], { encoding: 'utf8' });
process.stdout.write('=== STDOUT ===\n' + (r2.stdout || '') + '\n');
process.stdout.write('=== STDERR ===\n' + (r2.stderr || '') + '\n');
process.stdout.write('=== CODE:' + r2.status + ' ===\n');
