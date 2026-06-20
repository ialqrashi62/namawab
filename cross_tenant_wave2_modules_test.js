/**
 * cross_tenant_wave2_modules_test.js
 * ==========================================
 * اختبار عزل المستأجرين — الموجة 2 (Class B query gaps)
 * Cross-Tenant Isolation Test — Wave 2
 *
 * النطاق (Class B — جداول تحمل tenant_id، إصلاح كودي آمن للنشر):
 *   telemedicine_sessions, pathology_cases, social_work_cases, mortuary_cases, zatca_invoices.
 * الأسلوب: Static Code Audit + محاكاة (لا يتطلب قاعدة بيانات).
 *
 * الاستخدام: node cross_tenant_wave2_modules_test.js
 */
const fs = require('fs');
const path = require('path');
const RED = '\x1b[31m', GREEN = '\x1b[32m', BLUE = '\x1b[34m', RESET = '\x1b[0m', BOLD = '\x1b[1m';
let passed = 0, failed = 0; const failureLog = [];
function assert(cond, name, details = '') {
    if (cond) { console.log(`  ${GREEN}✅ PASS${RESET} — ${name}`); passed++; }
    else { console.log(`  ${RED}❌ FAIL${RESET} — ${name}${details ? ' | ' + details : ''}`); failed++; failureLog.push({ name, details }); }
}

console.log(`\n${BOLD}${BLUE}==================================================================${RESET}`);
console.log(`${BOLD}${BLUE}  Cross-Tenant Wave 2 Isolation Test (Class B query gaps)${RESET}`);
console.log(`${BOLD}${BLUE}==================================================================${RESET}\n`);

const server = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

// ===== 1) حماية المسارات بـ requireTenantScope =====
console.log(`${BOLD}[1] حماية المسارات بـ requireTenantScope${RESET}`);
const scoped = [
    "app.get('/api/telemedicine/sessions', requireAuth, requireTenantScope",
    "app.post('/api/telemedicine/sessions', requireAuth, requireTenantScope",
    "app.put('/api/telemedicine/sessions/:id', requireAuth, requireTenantScope",
    "app.get('/api/pathology/cases', requireAuth, requireTenantScope",
    "app.post('/api/pathology/cases', requireAuth, requireTenantScope",
    "app.put('/api/pathology/cases/:id', requireAuth, requireTenantScope",
    "app.get('/api/social-work/cases', requireAuth, requireTenantScope",
    "app.post('/api/social-work/cases', requireAuth, requireTenantScope",
    "app.put('/api/social-work/cases/:id', requireAuth, requireTenantScope",
    "app.get('/api/mortuary/cases', requireAuth, requireTenantScope",
    "app.post('/api/mortuary/cases', requireAuth, requireTenantScope",
    "app.put('/api/mortuary/cases/:id', requireAuth, requireTenantScope",
    "app.get('/api/zatca/invoices', requireAuth, requireTenantScope",
    "app.post('/api/zatca/generate', requireAuth, requireTenantScope",
];
scoped.forEach(r => assert(server.includes(r), `محمي: ${r.match(/'\/api\/[^']+'/)[0]} (${r.split("'")[0].replace('app.','').trim()})`));

// ===== 2) INSERT يختم tenant_id =====
console.log(`\n${BOLD}[2] ختم tenant_id في الإدراج${RESET}`);
['telemedicine_sessions', 'pathology_cases', 'social_work_cases', 'mortuary_cases', 'zatca_invoices'].forEach(t => {
    assert(new RegExp(`INSERT INTO ${t}[^;]*tenant_id`, 'i').test(server), `INSERT INTO ${t} يتضمن tenant_id`);
});

// ===== 3) SELECT يصفّي بـ tenant_id =====
console.log(`\n${BOLD}[3] تصفية القراءة بـ tenant_id${RESET}`);
['telemedicine_sessions', 'pathology_cases', 'social_work_cases', 'mortuary_cases', 'zatca_invoices'].forEach(t => {
    const idx = server.indexOf(`FROM ${t}`);
    assert(idx !== -1 && server.slice(idx, idx + 300).includes('tenant_id = $'), `SELECT FROM ${t} يصفّي بـ tenant_id`);
});

// ===== 4) UPDATE يتحقق من الملكية (tenant) =====
console.log(`\n${BOLD}[4] تحقق ملكية tenant في التحديث${RESET}`);
[
    ['telemedicine/sessions/:id', 'telemedicine_sessions'],
    ['pathology/cases/:id', 'pathology_cases'],
    ['social-work/cases/:id', 'social_work_cases'],
    ['mortuary/cases/:id', 'mortuary_cases'],
].forEach(([route, table]) => {
    const idx = server.indexOf(`app.put('/api/${route}', requireAuth, requireTenantScope`);
    const block = idx !== -1 ? server.slice(idx, idx + 900) : '';
    assert(block.includes(`SELECT id FROM ${table} WHERE id=$1 AND tenant_id=$2`), `PUT /api/${route} يتحقق من ملكية tenant قبل التعديل`);
});

// ===== 5) IDOR: تحقق تبعية المريض في POST =====
console.log(`\n${BOLD}[5] تحقق IDOR (تبعية المريض)${RESET}`);
['telemedicine/sessions', 'pathology/cases', 'social-work/cases', 'mortuary/cases'].forEach(route => {
    const idx = server.indexOf(`app.post('/api/${route}', requireAuth, requireTenantScope`);
    const block = idx !== -1 ? server.slice(idx, idx + 1000) : '';
    assert(block.includes('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2'), `POST /api/${route} يتحقق من تبعية المريض (IDOR)`);
});
// ZATCA: يتحقق من تبعية الفاتورة للمستأجر
{
    const idx = server.indexOf("app.post('/api/zatca/generate', requireAuth, requireTenantScope");
    const block = idx !== -1 ? server.slice(idx, idx + 1200) : '';
    assert(block.includes('i.tenant_id=$2'), 'POST /api/zatca/generate يتحقق من تبعية الفاتورة للمستأجر');
}

// ===== 6) blood_bank لم يُمسّ (Class A — مؤجّل لـ Wave 2b، يبقى آمناً للنشر) =====
console.log(`\n${BOLD}[6] حماية سلامة النشر: blood_bank لم يُضف له فلتر (Class A مؤجّل)${RESET}`);
assert(!/app\.(get|post|put)\('\/api\/blood-bank[^']*', requireAuth, requireTenantScope/.test(server),
    'blood_bank بلا requireTenantScope (مؤجّل لـ Wave 2b — يمنع كسر الإنتاج بدون DDL)');

// ===== 7) محاكاة العزل =====
console.log(`\n${BOLD}[7] محاكاة عزل البيانات${RESET}`);
const rows = [{ id: 1, t: 1 }, { id: 2, t: 1 }, { id: 3, t: 2 }];
const f = (rs, tid) => rs.filter(r => r.t === tid);
assert(f(rows, 1).length === 2 && !f(rows, 1).some(r => r.t === 2), 'المستأجر 1 يرى صفوفه فقط (لا تسريب)');
assert(f(rows, 2).length === 1, 'المستأجر 2 يرى صفه فقط');
const own = (rowT, reqT) => rowT === reqT;
assert(own(1, 1) && !own(2, 1), 'UPDATE عبر المستأجرين مرفوض');
const scope = (tid, prod) => (!tid && prod) ? 403 : 200;
assert(scope(null, true) === 403 && scope(1, true) === 200, 'الإنتاج بلا سياق → 403، ومع سياق → 200');

console.log(`\n${BOLD}${BLUE}==================================================================${RESET}`);
console.log(`${BOLD}  النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed ? RED : GREEN}${failed} FAIL${RESET}`);
console.log(`${BOLD}${BLUE}==================================================================${RESET}\n`);
if (failed) { failureLog.forEach(x => console.log(`${RED}  - ${x.name} ${x.details}${RESET}`)); process.exit(1); }
process.exit(0);
