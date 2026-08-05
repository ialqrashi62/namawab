// filepath: probe_olap_handlers.js
const r = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cat > /tmp/probe_olap3.js'
], { encoding: 'utf8', input: [
  "const m = require('/var/www/namaweb/routes/olap');",
  "function showRoute(name, r) {",
  "  if (!r || !r.stack) { console.log(name + ': (no stack)'); return; }",
  "  r.stack.forEach((l, i) => {",
  "    if (l.route) {",
  "      const methods = Object.keys(l.route.methods).join(',').toUpperCase();",
  "      console.log(name + ' [' + i + '] ' + methods + ' ' + l.route.path);",
  "      // dump full route stack to see middleware (auth, RBAC, validation)",
  "      if (l.route.stack) {",
  "        l.route.stack.forEach((s, j) => {",
  "          console.log('    mw[' + j + '] name=' + (s.name || '?') + ' handle.type=' + (s.handle && s.handle.name ? s.handle.name : '?'));",
  "        });",
  "      }",
  "    }",
  "  });",
  "}",
  "console.log('--- viewsRouter routes ---'); showRoute('viewsRouter', m.viewsRouter);",
  "console.log('--- queryRouter routes ---'); showRoute('queryRouter', m.queryRouter);",
  "console.log('--- exportRouter routes ---'); showRoute('exportRouter', m.exportRouter);",
  "console.log('--- paramRouter routes ---'); showRoute('paramRouter', m.paramRouter);",
  "console.log('--- runner ---'); console.log('  type=' + typeof m.runner + ' keys=' + (m.runner ? Object.keys(m.runner).join(',') : 'n/a'));",
  "console.log('--- refreshSvc ---'); console.log('  type=' + typeof m.refreshSvc + ' keys=' + (m.refreshSvc ? Object.keys(m.refreshSvc).join(',') : 'n/a'));",
  "console.log('--- olapRouter fallback info ---');",
  "if (m.olapRouter) {",
  "  console.log('  type=' + typeof m.olapRouter);",
  "  console.log('  is Express app? has ._router? has .use? ' + (typeof m.olapRouter.use === 'function'));",
  "  console.log('  is Router? has .stack? ' + (!!m.olapRouter.stack));",
  "  if (m.olapRouter._router) console.log('  _router.stack.length=' + m.olapRouter._router.stack.length);",
  "  if (m.olapRouter.stack) console.log('  stack.length=' + m.olapRouter.stack.length);",
  "  // list all enumerable own props",
  "  console.log('  own props: ' + Object.getOwnPropertyNames(m.olapRouter).join(','));",
  "}",
  ""
].join('\n') });
process.stdout.write('WRITE_STDOUT:' + (r.stdout || '') + '\n');
process.stdout.write('WRITE_STDERR:' + (r.stderr || '') + '\n');
process.stdout.write('WRITE_CODE:' + r.status + '\n');

const r2 = require('child_process').spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cd /var/www/namaweb && node /tmp/probe_olap3.js 2>&1'
], { encoding: 'utf8' });
process.stdout.write('=== STDOUT ===\n' + (r2.stdout || '') + '\n');
process.stdout.write('=== STDERR ===\n' + (r2.stderr || '') + '\n');
process.stdout.write('=== CODE:' + r2.status + ' ===\n');
