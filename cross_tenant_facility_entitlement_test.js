/**
 * cross_tenant_facility_entitlement_test.js
 * ==========================================
 * اختبار إنفاذ استحقاقات نوع المنشأة على الـ backend (P1).
 * (1) فحص ثابت: التأكد أن الحارس مربوط فعلياً في server.js (global middleware).
 * (2) محاكاة قرار الحارس: نفس منطق الـ middleware (pathToModule → isModuleEntitled)
 *     يغطي السماح/الحجب/غير المعروف/الافتراضي + محاولة تجاوز الرابط المباشر.
 * (3) لا تراجع في P0: يُشغّل اختبار الربط ضمن الانحدار (منفصل).
 *
 * الاستخدام: node cross_tenant_facility_entitlement_test.js
 */
const fs = require('fs');
const path = require('path');
const ent = require('./facility_entitlements');

const RED='\x1b[31m',GREEN='\x1b[32m',BLUE='\x1b[34m',RESET='\x1b[0m',BOLD='\x1b[1m';
let passed=0,failed=0; const failures=[];
function assert(c,n,d=''){ if(c){console.log(`  ${GREEN}✅ PASS${RESET} — ${n}`);passed++;} else {console.log(`  ${RED}❌ FAIL${RESET} — ${n}${d?' | '+d:''}`);failed++;failures.push(n);} }

console.log(`\n${BOLD}${BLUE}===== Facility Entitlement Backend Enforcement Test (P1) =====${RESET}\n`);

// ===== (1) فحص ثابت: الحارس مربوط في server.js =====
console.log(`${BOLD}[1] ربط الحارس في server.js (Static wiring)${RESET}`);
const server = fs.readFileSync(path.join(__dirname,'server.js'),'utf8');
assert(server.includes("require('./facility_entitlements')"), 'server.js يستورد facility_entitlements');
assert(/app\.use\(async \(req, res, next\) => \{[\s\S]*pathToModule\(req\.path\)/.test(server), 'global middleware يستخدم pathToModule(req.path)');
assert(server.includes("status(403).json({ error: 'Facility type not entitled"), 'يعيد 403 عند عدم الاستحقاق');
assert(server.includes("status(422).json({ error: 'Unknown facility type'"), 'يعيد 422 عند نوع غير معروف');
assert(server.includes('getFacilityType'), 'يحلّ نوع المنشأة عبر getFacilityType (DB + cache)');
assert(server.includes('invalidateFacilityTypeCache'), 'يبطل الكاش عند تحديث الإعدادات');
assert(server.includes("req.path === '/api/health' || req.path.startsWith('/api/auth/')"), 'يستثني auth/health');

// ===== (2) محاكاة قرار الحارس (نفس منطق الـ middleware) =====
// يحاكي: pathToModule → normalizeFacilityType → isModuleEntitled، ويعيد كود الحالة.
function guardDecision(facilityTypeRaw, apiPath, hasTenant = true) {
    if (!apiPath.startsWith('/api/')) return 200;
    if (apiPath === '/api/health' || apiPath.startsWith('/api/auth/')) return 200;
    const mod = ent.pathToModule(apiPath);
    if (ent.COMMON_MODULES.has(mod)) return 200;
    if (!hasTenant) return 200; // يُترك لطبقة requireAuth/requireTenantScope
    const norm = ent.normalizeFacilityType(facilityTypeRaw);
    if (norm.status === 'unknown') return 422;
    return ent.isModuleEntitled(norm.type, mod) ? 200 : 403;
}

console.log(`\n${BOLD}[2] قرارات الحارس حسب نوع المنشأة${RESET}`);
const T = [
    // [facilityType, path, expectedCode, label]
    ['medical_city', '/api/icu/patients', 200, 'Medical City → ICU مسموح (full)'],
    ['medical_city', '/api/blood-bank/units', 200, 'Medical City → بنك الدم مسموح'],
    ['large_hospital', '/api/admissions', 200, 'Large Hospital → التنويم مسموح'],
    ['health_center', '/api/admissions', 403, 'Health Center → التنويم محجوب (403)'],
    ['health_center', '/api/surgeries', 403, 'Health Center → العمليات محجوبة (403)'],
    ['health_center', '/api/icu/patients', 403, 'Health Center → ICU محجوب (403)'],
    ['health_center', '/api/patients', 200, 'Health Center → المرضى مسموح'],
    ['primary_healthcare_center', '/api/emergency/visits', 403, 'PHC → الطوارئ محجوبة (403)'],
    ['pharmacy_only', '/api/medical/records', 403, 'Pharmacy Only → EMR محجوب (403)'],
    ['pharmacy_only', '/api/admissions', 403, 'Pharmacy Only → التنويم محجوب (403)'],
    ['pharmacy_only', '/api/lab/orders', 403, 'Pharmacy Only → المختبر محجوب (403)'],
    ['pharmacy_only', '/api/radiology/orders', 403, 'Pharmacy Only → الأشعة محجوبة (403)'],
    ['pharmacy_only', '/api/pharmacy/drugs', 200, 'Pharmacy Only → الصيدلية مسموحة'],
    ['laboratory_only', '/api/pharmacy/drugs', 403, 'Lab Only → الصيدلية محجوبة (403)'],
    ['laboratory_only', '/api/medical/records', 403, 'Lab Only → EMR محجوب (403)'],
    ['laboratory_only', '/api/admissions', 403, 'Lab Only → التنويم محجوب (403)'],
    ['laboratory_only', '/api/lab/orders', 200, 'Lab Only → المختبر مسموح'],
    ['radiology_only', '/api/pharmacy/drugs', 403, 'Radiology Only → الصيدلية محجوبة (403)'],
    ['radiology_only', '/api/lab/orders', 403, 'Radiology Only → المختبر محجوب (403)'],
    ['radiology_only', '/api/medical/records', 403, 'Radiology Only → EMR محجوب (403)'],
    ['radiology_only', '/api/radiology/orders', 200, 'Radiology Only → الأشعة مسموحة'],
    // common always allowed
    ['pharmacy_only', '/api/dashboard/stats', 200, 'Pharmacy Only → لوحة التحكم مسموحة (common)'],
    ['laboratory_only', '/api/settings', 200, 'Lab Only → الإعدادات مسموحة (common)'],
    // unknown + default + auth/health
    ['totally_made_up', '/api/patients', 422, 'نوع غير معروف → 422'],
    ['', '/api/icu/patients', 200, 'نوع غير مضبوط (فارغ) → افتراضي مسموح (توافق)'],
    [null, '/api/admissions', 200, 'نوع null → افتراضي مسموح (توافق)'],
    ['pharmacy_only', '/api/auth/login', 200, 'auth مستثنى'],
    ['pharmacy_only', '/api/health', 200, 'health مستثنى'],
];
for (const [ft, p, exp, label] of T) {
    const got = guardDecision(ft, p, true);
    assert(got === exp, label, `got=${got} exp=${exp}`);
}

// ===== (3) محاولة تجاوز الرابط المباشر =====
console.log(`\n${BOLD}[3] تجاوز الرابط المباشر (direct API bypass)${RESET}`);
// مهما كان مصدر الطلب، الحارس العالمي يقرّر بناءً على req.path → الموديول المحجوب يُرفض دائماً.
assert(guardDecision('pharmacy_only', '/api/icu/monitoring/5', true) === 403, 'Pharmacy Only يطلب /api/icu/... مباشرة → 403');
assert(guardDecision('radiology_only', '/api/lab/orders/123', true) === 403, 'Radiology Only يطلب /api/lab/... مباشرة → 403');
assert(guardDecision('health_center', '/api/surgeries/9/anesthesia', true) === 403, 'Health Center يطلب مسار عميق للعمليات → 403');

// ===== (4) بدون سياق مستأجر =====
console.log(`\n${BOLD}[4] بدون سياق مستأجر${RESET}`);
assert(guardDecision('pharmacy_only', '/api/lab/orders', false) === 200, 'بلا tenant → يُترك لطبقة auth/tenantScope (لا يكسر)');

// ===== (5) عدم تراجع P0 (تذكير) =====
console.log(`\n${BOLD}[5] P0 RLS: يُتحقق منه عبر cross_tenant_app_tenant_binding_test.js (انحدار)${RESET}`);
assert(fs.existsSync(path.join(__dirname,'cross_tenant_app_tenant_binding_test.js')), 'اختبار ربط P0 موجود (يُشغّل ضمن الانحدار)');

console.log(`\n${BOLD}${BLUE}النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed?RED:GREEN}${failed} FAIL${RESET}\n`);
if (failed) { failures.forEach(f=>console.log(`${RED} - ${f}${RESET}`)); process.exit(1); }
process.exit(0);
