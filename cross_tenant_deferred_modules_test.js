/**
 * cross_tenant_deferred_modules_test.js
 * ============================================================================
 * اختبار الأمان التلقائي لعزل الوحدات المؤجلة (التأهيل، الرسائل، التغذية، السجلات الطبية)
 * Cross-Tenant Security and Isolation Test for Deferred Modules
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE  = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';

let passed = 0;
let failed = 0;
const failureLog = [];

function assert(condition, testName, details = '') {
    if (condition) {
        console.log(`  ${GREEN}✅ PASS${RESET} — ${testName}`);
        passed++;
    } else {
        console.log(`  ${RED}❌ FAIL${RESET} — ${testName}${details ? ' | ' + details : ''}`);
        failed++;
        failureLog.push({ testName, details });
    }
}

console.log(`\n${BOLD}${BLUE}================================================================${RESET}`);
console.log(`${BOLD}${BLUE}  بدء اختبارات أمان وعزل الوحدات المؤجلة (التأهيل، الرسائل، التغذية، السجلات)${RESET}`);
console.log(`${BOLD}${BLUE}  NamaMedical — Deferred Modules Isolation QA Test${RESET}`);
console.log(`${BOLD}${BLUE}================================================================${RESET}\n`);

// ===== 1. التدقيق البرمجي الاستاتيكي لكود Express (Static API Audit) =====
console.log(`${BOLD}[ 1 ] فحص حماية وتصفية مسارات الوحدات المؤجلة في server.js${RESET}`);
const serverPath = path.join(__dirname, 'server.js');
const serverContent = fs.readFileSync(serverPath, 'utf8');

const apiRoutes = [
    // Rehabilitation
    { pattern: "app.get('/api/rehab/patients', requireAuth, requireTenantScope", label: "GET /api/rehab/patients محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/rehab/patients', requireAuth, requireTenantScope", label: "POST /api/rehab/patients محمي بـ requireTenantScope" },
    { pattern: "app.get('/api/rehab/sessions', requireAuth, requireTenantScope", label: "GET /api/rehab/sessions محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/rehab/sessions', requireAuth, requireTenantScope", label: "POST /api/rehab/sessions محمي بـ requireTenantScope" },
    { pattern: "app.get('/api/rehab/goals', requireAuth, requireTenantScope", label: "GET /api/rehab/goals محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/rehab/goals', requireAuth, requireTenantScope", label: "POST /api/rehab/goals محمي بـ requireTenantScope" },
    { pattern: "app.put('/api/rehab/goals/:id', requireAuth, requireTenantScope", label: "PUT /api/rehab/goals/:id محمي بـ requireTenantScope" },

    // Messaging
    { pattern: "app.get('/api/messages', requireAuth, requireTenantScope", label: "GET /api/messages محمي بـ requireTenantScope" },
    { pattern: "app.get('/api/messages/sent', requireAuth, requireTenantScope", label: "GET /api/messages/sent محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/messages', requireAuth, requireTenantScope", label: "POST /api/messages محمي بـ requireTenantScope" },
    { pattern: "app.put('/api/messages/:id/read', requireAuth, requireTenantScope", label: "PUT /api/messages/:id/read محمي بـ requireTenantScope" },
    { pattern: "app.delete('/api/messages/:id', requireAuth, requireTenantScope", label: "DELETE /api/messages/:id محمي بـ requireTenantScope" },

    // Dietary
    { pattern: "app.get('/api/dietary/orders', requireAuth, requireTenantScope", label: "GET /api/dietary/orders محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/dietary/orders', requireAuth, requireTenantScope", label: "POST /api/dietary/orders محمي بـ requireTenantScope" },
    { pattern: "app.put('/api/dietary/orders/:id', requireAuth, requireTenantScope", label: "PUT /api/dietary/orders/:id محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/dietary/meals', requireAuth, requireTenantScope", label: "POST /api/dietary/meals محمي بـ requireTenantScope" },
    { pattern: "app.put('/api/dietary/meals/:id/deliver', requireAuth, requireTenantScope", label: "PUT /api/dietary/meals/:id/deliver محمي بـ requireTenantScope" },
    { pattern: "app.get('/api/nutrition/assessments', requireAuth, requireTenantScope", label: "GET /api/nutrition/assessments محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/nutrition/assessments', requireAuth, requireTenantScope", label: "POST /api/nutrition/assessments محمي بـ requireTenantScope" },

    // Medical Records / HIM
    { pattern: "app.get('/api/medical-records/files', requireAuth, requireTenantScope", label: "GET /api/medical-records/files محمي بـ requireTenantScope" },
    { pattern: "app.get('/api/medical-records/requests', requireAuth, requireTenantScope", label: "GET /api/medical-records/requests محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/medical-records/requests', requireAuth, requireTenantScope", label: "POST /api/medical-records/requests محمي بـ requireTenantScope" },
    { pattern: "app.put('/api/medical-records/requests/:id', requireAuth, requireTenantScope", label: "PUT /api/medical-records/requests/:id محمي بـ requireTenantScope" },
    { pattern: "app.get('/api/medical-records/coding', requireAuth, requireTenantScope", label: "GET /api/medical-records/coding محمي بـ requireTenantScope" },
    { pattern: "app.post('/api/medical-records/coding', requireAuth, requireTenantScope", label: "POST /api/medical-records/coding محمي بـ requireTenantScope" }
];

for (const { pattern, label } of apiRoutes) {
    const cleanPattern = pattern.replace(/\s+/g, '');
    const cleanContent = serverContent.replace(/\s+/g, '');
    const found = cleanContent.includes(cleanPattern);
    assert(found, label, `البحث عن: "${pattern}"`);
}

// Check for explicit tenant_id check in query / update
const queryChecks = [
    { source: "rehab_patients WHERE tenant_id=$1", label: "rehab_patients filtered by tenant_id in GET" },
    { source: "rehab_sessions WHERE rehab_patient_id=$1 AND tenant_id=$2", label: "rehab_sessions filtered by tenant_id in GET" },
    { source: "rehab_goals WHERE rehab_patient_id=$1 AND tenant_id=$2", label: "rehab_goals filtered by tenant_id in GET" },
    { source: "UPDATE rehab_goals SET progress=$1, status=$2 WHERE id=$3 AND tenant_id=$4", label: "rehab_goals update checks tenant_id (prevent IDOR)" },
    { source: "internal_messages m LEFT JOIN system_users su ON m.sender_id=su.id WHERE m.receiver_id=$1 AND m.tenant_id=$2", label: "internal_messages filtered by tenant_id in GET" },
    { source: "UPDATE internal_messages SET is_read=1 WHERE id=$1 AND receiver_id=$2 AND tenant_id=$3", label: "internal_messages read checks recipient and tenant_id (prevent IDOR)" },
    { source: "DELETE FROM internal_messages WHERE id=$1 AND (sender_id=$2 OR receiver_id=$2) AND tenant_id=$3", label: "internal_messages delete checks ownership and tenant_id" },
    { source: "diet_orders WHERE status='Active' AND tenant_id=$1", label: "diet_orders filtered by tenant_id in GET" },
    { source: "UPDATE diet_orders SET", label: "diet_orders update exists" },
    { source: "UPDATE diet_meals SET delivered=1, delivered_by=$1 WHERE id=$2 AND tenant_id=$3", label: "diet_meals deliver checks tenant_id" },
    { source: "nutrition_assessments WHERE tenant_id=$1", label: "nutrition_assessments filtered by tenant_id in GET" },
    { source: "medical_records_files WHERE tenant_id=$1", label: "medical_records_files filtered by tenant_id in GET" },
    { source: "medical_records_requests WHERE tenant_id=$1", label: "medical_records_requests filtered by tenant_id in GET" },
    { source: "UPDATE medical_records_requests SET status=$1, delivered_at=$2 WHERE id=$3 AND tenant_id=$4", label: "medical_records_requests update checks tenant_id" },
    { source: "medical_records_coding WHERE tenant_id=$1", label: "medical_records_coding filtered by tenant_id" }
];

for (const { source, label } of queryChecks) {
    const cleanSource = source.replace(/\s+/g, '');
    const cleanContent = serverContent.replace(/\s+/g, '');
    const found = cleanContent.includes(cleanSource);
    assert(found, label, `البحث عن: "${source}"`);
}

// ===== 2. التدقيق البرمجي الاستاتيكي لسياسات قاعدة البيانات (Static RLS Audit) =====
console.log(`\n${BOLD}[ 2 ] فحص بنية سياسات RLS في ملف الهيئة p0_01_deferred_modules_rls_up.sql${RESET}`);
const upSqlPath = path.join(__dirname, 'migrations', 'p0_01_deferred_modules_rls_up.sql');
assert(fs.existsSync(upSqlPath), "ملف التهيئة up.sql موجود");

if (fs.existsSync(upSqlPath)) {
    const upSqlContent = fs.readFileSync(upSqlPath, 'utf8');
    const tables = [
        'medical_records_files', 'medical_records_requests', 'medical_records_coding',
        'clinical_pharmacy_reviews', 'patient_drug_education',
        'rehab_patients', 'rehab_sessions', 'rehab_goals', 'rehab_assessments',
        'portal_users', 'portal_appointments',
        'diet_orders', 'diet_meals', 'nutrition_assessments',
        'approvals', 'package_sessions', 'internal_messages'
    ];
    
    for (const tbl of tables) {
        assert(upSqlContent.includes(`ALTER TABLE ${tbl} ENABLE ROW LEVEL SECURITY;`), `تفعيل RLS لجدول ${tbl} في up.sql`);
        assert(upSqlContent.includes(`ALTER TABLE ${tbl} FORCE ROW LEVEL SECURITY;`), `فرض RLS لجدول ${tbl} في up.sql`);
        assert(upSqlContent.includes(`CREATE POLICY rls_${tbl}_tenant_isolation ON ${tbl}`), `إنشاء سياسة العزل لجدول ${tbl} في up.sql`);
    }
}

// ===== 3. فحص بنية الجداول في ملف db_postgres.js (db_postgres.js Parity Check) =====
console.log(`\n${BOLD}[ 3 ] فحص مطابقة بنية الجداول في ملف db_postgres.js لتضمين tenant_id${RESET}`);
const dbPostgresPath = path.join(__dirname, 'db_postgres.js');
const dbPostgresContent = fs.readFileSync(dbPostgresPath, 'utf8');

const dbTablesToCheck = [
    { table: 'internal_messages', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'package_sessions', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'diet_orders', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'diet_meals', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'nutrition_assessments', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'medical_records_files', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'medical_records_requests', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'medical_records_coding', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'clinical_pharmacy_reviews', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'patient_drug_education', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'rehab_patients', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'rehab_sessions', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'rehab_goals', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'rehab_assessments', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'portal_users', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' },
    { table: 'portal_appointments', pattern: 'tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE' }
];

for (const { table, pattern } of dbTablesToCheck) {
    const cleanPattern = pattern.replace(/\s+/g, '');
    const cleanContent = dbPostgresContent.replace(/\s+/g, '');
    const found = cleanContent.includes(cleanPattern);
    assert(found, `جدول ${table} في db_postgres.js يحتوي على tenant_id الصحيح`, `توقع وجود: "${pattern}"`);
}

// ===== نتائج الفحص النهائي =====
console.log(`\n${BOLD}${BLUE}================================================================${RESET}`);
console.log(`${BOLD}${BLUE}  ملخص نتائج اختبارات الأمان للوحدات المؤجلة${RESET}`);
console.log(`  إجمالي الفحوصات الناجحة (PASSED): ${passed}`);
console.log(`  إجمالي الفحوصات الفاشلة (FAILED): ${failed}`);
console.log(`${BOLD}${BLUE}================================================================${RESET}\n`);

if (failed > 0) {
    console.error(`${RED}🔴 فشل الاختبار! تم رصد ثغرات عزل غير معالجة في الوحدات المؤجلة.${RESET}`);
    process.exit(1);
} else {
    console.log(`${GREEN}🟢 نجاح كافة اختبارات أمان الوحدات المؤجلة بنسبة 100%! تم إغلاق فجوات العزل بالكامل.${RESET}`);
    process.exit(0);
}
