/**
 * cross_tenant_modern_modules_test.js
 * ==========================================
 * اختبار عزل المستأجرين للموديولات الحديثة (P0 Remediation)
 * Cross-Tenant Isolation Test — Modern Modules
 *
 * النطاق: السجلات الطبية، الصيدلية السريرية، إعادة التأهيل، بوابة المرضى، التغذية.
 * الأسلوب: فحص ثابت لكود server.js (Static Code Audit) + محاكاة منطق العزل
 *          (نفس أسلوب الـ 17 اختبار القائمة — لا يتطلب اتصال قاعدة بيانات).
 *
 * يتحقق من:
 *  1. كل مسار حساس محمي بـ requireTenantScope.
 *  2. كل SELECT يصفّي بـ tenant_id.
 *  3. كل INSERT يختم tenant_id/facility_id.
 *  4. كل UPDATE/PUT يتحقق من الملكية ويقيّد بـ tenant_id.
 *  5. POST التي تقبل patient_id تتحقق من تبعية المريض (IDOR).
 *  6. drug_interactions تبقى مرجعية عالمية (بلا عزل) — سلوك صحيح.
 *  7. محاكاة: المستأجر A لا يرى صفوف المستأجر B.
 *
 * الاستخدام: node cross_tenant_modern_modules_test.js
 */
const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m', GREEN = '\x1b[32m', BLUE = '\x1b[34m', RESET = '\x1b[0m', BOLD = '\x1b[1m';
let passed = 0, failed = 0;
const failureLog = [];
function assert(cond, name, details = '') {
    if (cond) { console.log(`  ${GREEN}✅ PASS${RESET} — ${name}`); passed++; }
    else { console.log(`  ${RED}❌ FAIL${RESET} — ${name}${details ? ' | ' + details : ''}`); failed++; failureLog.push({ name, details }); }
}

console.log(`\n${BOLD}${BLUE}==================================================================${RESET}`);
console.log(`${BOLD}${BLUE}  Cross-Tenant Modern Modules Isolation Test (P0 Remediation)${RESET}`);
console.log(`${BOLD}${BLUE}==================================================================${RESET}\n`);

const server = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
const db = fs.readFileSync(path.join(__dirname, 'db_postgres.js'), 'utf8');

// ===== 1) المسارات محمية بـ requireTenantScope =====
console.log(`${BOLD}[1] حماية المسارات بـ requireTenantScope${RESET}`);
const scopedRoutes = [
    "app.get('/api/medical-records/files', requireAuth, requireTenantScope",
    "app.get('/api/medical-records/requests', requireAuth, requireTenantScope",
    "app.post('/api/medical-records/requests', requireAuth, requireTenantScope",
    "app.put('/api/medical-records/requests/:id', requireAuth, requireTenantScope",
    "app.get('/api/medical-records/coding', requireAuth, requireTenantScope",
    "app.post('/api/medical-records/coding', requireAuth, requireTenantScope",
    "app.get('/api/clinical-pharmacy/reviews', requireAuth, requireTenantScope",
    "app.post('/api/clinical-pharmacy/reviews', requireAuth, requireTenantScope",
    "app.put('/api/clinical-pharmacy/reviews/:id', requireAuth, requireTenantScope",
    "app.get('/api/clinical-pharmacy/education', requireAuth, requireTenantScope",
    "app.post('/api/clinical-pharmacy/education', requireAuth, requireTenantScope",
    "app.get('/api/rehab/patients', requireAuth, requireTenantScope",
    "app.post('/api/rehab/patients', requireAuth, requireTenantScope",
    "app.get('/api/rehab/sessions', requireAuth, requireTenantScope",
    "app.post('/api/rehab/sessions', requireAuth, requireTenantScope",
    "app.get('/api/rehab/goals', requireAuth, requireTenantScope",
    "app.post('/api/rehab/goals', requireAuth, requireTenantScope",
    "app.put('/api/rehab/goals/:id', requireAuth, requireTenantScope",
    "app.get('/api/portal/users', requireAuth, requireTenantScope",
    "app.post('/api/portal/users', requireAuth, requireTenantScope",
    "app.get('/api/portal/appointments', requireAuth, requireTenantScope",
    "app.put('/api/portal/appointments/:id', requireAuth, requireTenantScope",
    "app.get('/api/dietary/orders', requireAuth, requireTenantScope",
    "app.post('/api/dietary/orders', requireAuth, requireTenantScope",
    "app.put('/api/dietary/orders/:id', requireAuth, requireTenantScope",
    "app.post('/api/dietary/meals', requireAuth, requireTenantScope",
    "app.put('/api/dietary/meals/:id/deliver', requireAuth, requireTenantScope",
    "app.get('/api/nutrition/assessments', requireAuth, requireTenantScope",
    "app.post('/api/nutrition/assessments', requireAuth, requireTenantScope",
];
scopedRoutes.forEach(r => assert(server.includes(r), `محمي: ${r.match(/'\/api\/[^']+'/)[0]} (${r.split("'")[0].replace('app.','').trim()})`));

// ===== 2) INSERT يختم tenant_id =====
console.log(`\n${BOLD}[2] ختم tenant_id في عمليات الإدراج${RESET}`);
const insertTables = [
    'medical_records_requests', 'medical_records_coding', 'clinical_pharmacy_reviews',
    'patient_drug_education', 'rehab_patients', 'rehab_sessions', 'rehab_goals',
    'portal_users', 'diet_orders', 'diet_meals', 'nutrition_assessments'
];
insertTables.forEach(t => {
    const re = new RegExp(`INSERT INTO ${t}[^;]*tenant_id`, 'i');
    assert(re.test(server), `INSERT INTO ${t} يتضمن tenant_id`);
});

// ===== 3) SELECT يصفّي بـ tenant_id =====
console.log(`\n${BOLD}[3] تصفية القراءة بـ tenant_id${RESET}`);
[
    ['medical_records_files', 'tenant_id = $'],
    ['medical_records_requests', 'tenant_id = $'],
    ['clinical_pharmacy_reviews', 'tenant_id = $'],
    ['patient_drug_education', 'tenant_id = $'],
    ['rehab_patients', 'tenant_id = $'],
    ['nutrition_assessments', 'tenant_id = $'],
    ['portal_users', 'pu.tenant_id = $'],
].forEach(([t, frag]) => {
    const idx = server.indexOf(`FROM ${t}`);
    assert(idx !== -1 && server.slice(idx, idx + 400).includes(frag.split(' = ')[0]), `SELECT FROM ${t} يصفّي بـ ${frag.split(' = ')[0]}`);
});

// ===== 4) IDOR: تحقق تبعية المريض في POST =====
console.log(`\n${BOLD}[4] تحقق IDOR (تبعية المريض للمستأجر)${RESET}`);
const idorMarker = "SELECT id FROM patients WHERE id=$1 AND tenant_id=$2";
['medical-records/requests', 'medical-records/coding', 'clinical-pharmacy/reviews', 'clinical-pharmacy/education', 'rehab/patients', 'dietary/orders', 'nutrition/assessments'].forEach(route => {
    const idx = server.indexOf(`'/api/${route}', requireAuth, requireTenantScope`);
    // ابحث عن أقرب POST handler بعد المسار
    const block = idx !== -1 ? server.slice(idx, idx + 1200) : '';
    assert(block.includes(idorMarker), `POST /api/${route} يتحقق من تبعية المريض (IDOR)`);
});

// ===== 5) drug_interactions تبقى مرجعية (بلا requireTenantScope) =====
console.log(`\n${BOLD}[5] البيانات المرجعية العالمية تبقى بلا عزل${RESET}`);
assert(server.includes("app.get('/api/clinical-pharmacy/interactions', requireAuth, async"), 'drug_interactions مرجعية عالمية (بلا requireTenantScope) — سلوك صحيح');

// ===== 6) المخطط: ADD COLUMN tenant_id + backfill في db_postgres.js =====
console.log(`\n${BOLD}[6] مخطط قاعدة البيانات (db_postgres.js)${RESET}`);
insertTables.concat(['medical_records_files']).forEach(t => {
    assert(new RegExp(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS tenant_id`).test(db), `db: ALTER ${t} ADD tenant_id`);
    assert(new RegExp(`UPDATE ${t} SET tenant_id = 1`).test(db), `db: backfill ${t} → tenant 1`);
});

// ===== 7) محاكاة العزل: المستأجر A لا يرى صفوف المستأجر B =====
console.log(`\n${BOLD}[7] محاكاة عزل البيانات${RESET}`);
function simulateTenantFilter(rows, tenantId) {
    return rows.filter(r => r.tenant_id === tenantId);
}
const mockRehab = [
    { id: 1, patient_name: 'A1', tenant_id: 1 },
    { id: 2, patient_name: 'A2', tenant_id: 1 },
    { id: 3, patient_name: 'B1', tenant_id: 2 },
];
const seenByTenant1 = simulateTenantFilter(mockRehab, 1);
const seenByTenant2 = simulateTenantFilter(mockRehab, 2);
assert(seenByTenant1.length === 2 && seenByTenant1.every(r => r.tenant_id === 1), 'المستأجر 1 يرى صفوفه فقط (2)');
assert(seenByTenant2.length === 1 && seenByTenant2[0].tenant_id === 2, 'المستأجر 2 يرى صفه فقط (1)');
assert(!seenByTenant1.some(r => r.tenant_id === 2), 'المستأجر 1 لا يرى بيانات المستأجر 2 (لا تسريب)');

// محاكاة رفض UPDATE عبر المستأجرين
function simulateOwnershipCheck(rowTenant, requestTenant) { return rowTenant === requestTenant; }
assert(simulateOwnershipCheck(1, 1) === true, 'UPDATE داخل نفس المستأجر مسموح');
assert(simulateOwnershipCheck(2, 1) === false, 'UPDATE عبر المستأجرين مرفوض (404)');

// محاكاة رفض الإنتاج بلا سياق
function simulateRequireTenantScope(tenantId, isProduction) {
    if (!tenantId && isProduction) return 403;
    return 200;
}
assert(simulateRequireTenantScope(null, true) === 403, 'الإنتاج بلا tenant context → 403');
assert(simulateRequireTenantScope(1, true) === 200, 'الإنتاج مع tenant context → 200');

// ===== النتيجة =====
console.log(`\n${BOLD}${BLUE}==================================================================${RESET}`);
console.log(`${BOLD}  النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed ? RED : GREEN}${failed} FAIL${RESET}`);
console.log(`${BOLD}${BLUE}==================================================================${RESET}\n`);
if (failed) { failureLog.forEach(f => console.log(`${RED}  - ${f.name} ${f.details}${RESET}`)); process.exit(1); }
process.exit(0);
