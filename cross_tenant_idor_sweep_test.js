/**
 * cross_tenant_idor_sweep_test.js
 * ==========================================
 * يثبت إضافة حارس المستأجر (tenant ownership check) للمسارات عالية الخطورة التي كانت
 * تعدّل سجلات بـ id فقط دون فلتر tenant (IDOR، لأن RLS مُتجاوَز تحت دور superuser):
 *  - PUT /api/queue/patients/:id/status   (patients)
 *  - PUT /api/patients/:id/referral       (patients)
 *  - PUT /api/insurance/claims/:id        (insurance_claims)
 * نمط: static audit + simulation — بلا قاعدة بيانات.
 */
const fs = require('fs'); const path = require('path');
const RED='\x1b[31m',GREEN='\x1b[32m',BLUE='\x1b[34m',RESET='\x1b[0m',BOLD='\x1b[1m';
let passed=0,failed=0; const failures=[];
function assert(c,n,d=''){ if(c){console.log(`  ${GREEN}✅ PASS${RESET} — ${n}`);passed++;} else {console.log(`  ${RED}❌ FAIL${RESET} — ${n}${d?' | '+d:''}`);failed++;failures.push(n);} }
const src = fs.readFileSync(path.join(__dirname,'server.js'),'utf8');
function routeBlock(re){ const m=src.match(re); return m?m[0]:''; }

console.log(`\n${BOLD}${BLUE}===== Tenant-Guard IDOR Sweep Test =====${RESET}\n`);

console.log(`${BOLD}[1] PUT /api/queue/patients/:id/status${RESET}`);
const r1 = routeBlock(/app\.put\('\/api\/queue\/patients\/:id\/status'[\s\S]*?\n\}\);/);
assert(/SELECT id FROM patients WHERE id=\$1\$\{tc\}/.test(r1) && /owns/.test(r1), 'ownership check before mutating patient status');
assert(/if \(!owns\) return res\.status\(404\)/.test(r1), 'returns 404 when not owned (no cross-tenant write)');

console.log(`\n${BOLD}[2] PUT /api/patients/:id/referral${RESET}`);
const r2 = routeBlock(/app\.put\('\/api\/patients\/:id\/referral'[\s\S]*?\n\}\);/);
assert(/SELECT id FROM patients WHERE id=\$1\$\{tc\}/.test(r2) && /if \(!owns\)/.test(r2), 'ownership check before mutating patient referral');

console.log(`\n${BOLD}[3] PUT /api/insurance/claims/:id${RESET}`);
const r3 = routeBlock(/app\.put\('\/api\/insurance\/claims\/:id'[\s\S]*?\n\}\);/);
assert(/SELECT id FROM insurance_claims WHERE id=\$1\$\{tc\}/.test(r3) && /if \(!owns\)/.test(r3), 'ownership check before mutating claim status');
assert(/Claim not found/.test(r3), 'claim 404 path present');

console.log(`\n${BOLD}[4] محاكاة منطق الملكية${RESET}`);
const rows=[{id:1,tenant_id:1},{id:2,tenant_id:1}];
const owns=(id,t)=> rows.find(r=>r.id===Number(id) && (t==null?false:r.tenant_id===t))||null;
assert(owns(1,1)!==null,'tenant 1 owns its record');
assert(owns(1,999)===null,'tenant 999 does NOT own tenant 1 record → blocked');
assert(owns(1,null)===null,'no tenant context → not owned (conditional pattern: tenant users blocked cross-tenant)');

console.log(`\n${BOLD}${BLUE}النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed?RED:GREEN}${failed} FAIL${RESET}\n`);
if (failed) { failures.forEach(f=>console.log(`${RED} - ${f}${RESET}`)); process.exit(1); }
process.exit(0);
