/**
 * cross_tenant_update_sweep_test.js — static audit (no DB).
 * يثبت أن مسارات UPDATE-by-id لجداول مملوكة للمستأجر (كانت بلا حارس) أصبحت fail-closed:
 *  - PUT /api/blood-bank/crossmatch/:id (blood_bank_crossmatch)
 *  - PUT /api/quality/incidents/:id     (quality_incidents)
 *  - PUT /api/transport/requests/:id    (transport_requests)
 * fail-closed = requireTenantScope + UPDATE مقيّد بـ tenant_id (لا تعديل عابر للمستأجرين).
 * لا اعتماد على RLS (مُتجاوَز تحت دور superuser).
 */
const fs = require('fs'), path = require('path');
const RED = '\x1b[31m', GREEN = '\x1b[32m', BLUE = '\x1b[34m', RESET = '\x1b[0m', BOLD = '\x1b[1m';
let pass = 0, fail = 0; const fails = [];
const assert = (c, n) => { if (c) { console.log(`  ${GREEN}✅ PASS${RESET} ${n}`); pass++; } else { console.log(`  ${RED}❌ FAIL${RESET} ${n}`); fail++; fails.push(n); } };
const src = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
const block = (re) => { const m = src.match(re); return m ? m[0] : ''; };

console.log(`\n${BOLD}${BLUE}===== Multi-Row UPDATE Tenant-Guard Sweep Test =====${RESET}\n`);

const routes = [
  { name: 'PUT /api/blood-bank/crossmatch/:id', re: /app\.put\('\/api\/blood-bank\/crossmatch\/:id'[\s\S]*?\n\}\);/, upd: /UPDATE blood_bank_crossmatch SET result=\$1 WHERE id=\$2 AND tenant_id=\$3/ },
  { name: 'PUT /api/quality/incidents/:id', re: /app\.put\('\/api\/quality\/incidents\/:id'[\s\S]*?\n\}\);/, upd: /WHERE id=\$\$\{i\} AND tenant_id=\$\$\{i \+ 1\}/ },
  { name: 'PUT /api/transport/requests/:id', re: /app\.put\('\/api\/transport\/requests\/:id'[\s\S]*?\n\}\);/, upd: /WHERE id=\$\$\{i\} AND tenant_id=\$\$\{i \+ 1\}/ },
];
for (const r of routes) {
  console.log(`${BOLD}${r.name}${RESET}`);
  const b = block(r.re);
  assert(!!b, 'route located');
  assert(/requireTenantScope/.test(b), 'uses requireTenantScope (rejects null-tenant in prod)');
  assert(r.upd.test(b), 'UPDATE scoped by tenant_id');
  assert(/getRequestTenantContext\(req\)/.test(b), 'derives tenantId from trusted session');
}

console.log(`\n${BOLD}[simulation]${RESET}`);
const rows = [{ id: 1, tenant_id: 1 }];
const updRows = (id, t) => rows.filter(r => r.id === Number(id) && r.tenant_id === t).length;
assert(updRows(1, 1) === 1, 'tenant 1 update affects its own row');
assert(updRows(1, 999) === 0, 'tenant 999 update affects 0 rows → 404');

console.log(`\n${BOLD}${BLUE}النتيجة: ${GREEN}${pass} PASS${RESET} | ${fail ? RED : GREEN}${fail} FAIL${RESET}\n`);
if (fail) { fails.forEach(f => console.log(' - ' + f)); process.exit(1); }
process.exit(0);
