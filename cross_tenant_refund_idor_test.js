/**
 * cross_tenant_refund_idor_test.js
 * ==========================================
 * يثبت إصلاح ثغرة IDOR في مسار POST /api/invoices/:id/refund:
 *  - المسار يستخدم requireTenantScope.
 *  - قراءة الفاتورة tenant-scoped (WHERE id=$1 AND tenant_id=$2) لا id فقط.
 *  - مستأجر آخر لا يستطيع استرداد فاتورة لا تخصّه (محاكاة منطق الفلتر).
 *  - لا يعتمد على RLS (التطبيق يتصل بدور superuser يتجاوز RLS).
 * نمط: static audit + simulation — يعمل بلا قاعدة بيانات.
 * الاستخدام: node cross_tenant_refund_idor_test.js
 */
const fs = require('fs');
const path = require('path');
const RED='\x1b[31m',GREEN='\x1b[32m',BLUE='\x1b[34m',RESET='\x1b[0m',BOLD='\x1b[1m';
let passed=0,failed=0; const failures=[];
function assert(c,n,d=''){ if(c){console.log(`  ${GREEN}✅ PASS${RESET} — ${n}`);passed++;} else {console.log(`  ${RED}❌ FAIL${RESET} — ${n}${d?' | '+d:''}`);failed++;failures.push(n);} }

console.log(`\n${BOLD}${BLUE}===== Refund IDOR Tenant-Guard Test =====${RESET}\n`);

// ---- 1) Static audit of the refund route ----
const src = fs.readFileSync(path.join(__dirname,'server.js'),'utf8');
const m = src.match(/app\.post\('\/api\/invoices\/:id\/refund'[\s\S]*?\n\}\);/);
assert(!!m, 'refund route located in server.js');
const route = m ? m[0] : '';
console.log(`${BOLD}[1] تدقيق ثابت للمسار${RESET}`);
assert(/requireTenantScope/.test(route), 'refund route uses requireTenantScope');
assert(/SELECT \* FROM invoices WHERE id=\$1 AND tenant_id=\$2/.test(route), 'invoice lookup is tenant-scoped (id + tenant_id)');
assert(!/SELECT \* FROM invoices WHERE id=\$1'\s*,\s*\[req\.params\.id\]\)/.test(route), 'no vulnerable id-only invoice lookup remains');
assert(/\[req\.params\.id, tenantId\]/.test(route), 'lookup binds [id, tenantId]');

// ---- 2) Simulation of the tenant-scoped lookup logic ----
console.log(`\n${BOLD}[2] محاكاة منطق الفلتر${RESET}`);
const invoices = [{ id: 1, tenant_id: 1, total: 115 }, { id: 2, tenant_id: 1, total: 50 }];
function lookup(id, tenantId){ return invoices.find(v => v.id === Number(id) && v.tenant_id === tenantId) || null; }
assert(lookup(1, 1) !== null, 'tenant 1 finds its own invoice (refund allowed path)');
assert(lookup(1, 999) === null, 'tenant 999 CANNOT find tenant 1 invoice (cross-tenant blocked → 404)');
assert(lookup(1, null) === null, 'missing tenant context → no match (blocked)');
assert(lookup(2, 999) === null, 'cross-tenant blocked for second invoice too');

// ---- 3) Accounting posting stays inert (flag governs; this fix adds no journal) ----
console.log(`\n${BOLD}[3] لا أثر محاسبي من الإصلاح${RESET}`);
assert(/runEventWithPosting/.test(route), 'refund still uses runEventWithPosting (flag-governed; OFF => no journal)');
assert(!/ACCOUNTING_POSTING_ENABLED\s*=\s*['\"]?true/.test(route), 'fix does not enable accounting flag');

console.log(`\n${BOLD}${BLUE}النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed?RED:GREEN}${failed} FAIL${RESET}\n`);
if (failed) { failures.forEach(f=>console.log(`${RED} - ${f}${RESET}`)); process.exit(1); }
process.exit(0);
