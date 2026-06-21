/**
 * rls_insert_tenant_stamping_test.js — static audit (no DB).
 * يثبت أن INSERTs لجداول FORCE-RLS (التي كانت تفتقد tenant_id) أصبحت تختمه،
 * فلا تفشل WITH CHECK بعد التحويل إلى دور nama_medical_app. وأن مسارات الإنشاء
 * تستخدم requireTenantScope (يرفض السياق المفقود).
 */
const fs = require('fs'), path = require('path');
const RED = '\x1b[31m', GREEN = '\x1b[32m', RESET = '\x1b[0m';
let pass = 0, fail = 0; const fails = [];
const assert = (c, n) => { if (c) { console.log(`  ${GREEN}✅ PASS${RESET} ${n}`); pass++; } else { console.log(`  ${RED}❌ FAIL${RESET} ${n}`); fail++; fails.push(n); } };
const src = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

function insertCols(table) {
  const marker = 'INSERT INTO ' + table + ' (';
  const i = src.indexOf(marker);
  if (i < 0) return null;
  return src.slice(i + marker.length, src.indexOf(')', i));
}
function routeHasTenantScope(method, route) {
  const marker = "app." + method + "('" + route + "'";
  const i = src.indexOf(marker);
  if (i < 0) return false;
  return src.slice(i, i + 160).includes('requireTenantScope');
}

console.log('\n===== RLS INSERT tenant_id Stamping Readiness =====\n');
['insurance_claims', 'blood_bank_crossmatch', 'blood_bank_transfusions', 'quality_incidents', 'quality_patient_satisfaction', 'transport_requests', 'waiting_queue']
  .forEach(t => { const cols = insertCols(t); assert(cols !== null && /\btenant_id\b/.test(cols), t + ' INSERT includes tenant_id'); });

[['post', '/api/insurance/claims'], ['post', '/api/blood-bank/crossmatch'], ['post', '/api/blood-bank/transfusions'], ['post', '/api/quality/incidents'], ['post', '/api/quality/satisfaction'], ['post', '/api/transport/requests']]
  .forEach(p => assert(routeHasTenantScope(p[0], p[1]), p[0].toUpperCase() + ' ' + p[1] + ' requireTenantScope'));

console.log(`\nنتيجة: ${GREEN}${pass} PASS${RESET} | ${fail ? RED : GREEN}${fail} FAIL${RESET}\n`);
if (fail) { fails.forEach(f => console.log(' - ' + f)); process.exit(1); }
process.exit(0);
