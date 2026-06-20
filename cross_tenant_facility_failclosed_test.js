/**
 * cross_tenant_facility_failclosed_test.js
 * ==========================================
 * اختبار تقوية fail-closed لإنفاذ نوع المنشأة (P1).
 * يحاكي منطق الحارس النهائي بدقة (بما فيه: خطأ القراءة، النوع غير المضبوط،
 * المسار غير المصنّف unclassified) ويثبت أن المسارات الحساسة fail-closed،
 * بينما health/auth/common لا تنكسر. + فحص ثابت لربط المنطق في server.js.
 *
 * الاستخدام: node cross_tenant_facility_failclosed_test.js
 */
const fs = require('fs');
const path = require('path');
const ent = require('./facility_entitlements');

const RED='\x1b[31m',GREEN='\x1b[32m',BLUE='\x1b[34m',RESET='\x1b[0m',BOLD='\x1b[1m';
let passed=0,failed=0; const failures=[];
function assert(c,n,d=''){ if(c){console.log(`  ${GREEN}✅ PASS${RESET} — ${n}`);passed++;} else {console.log(`  ${RED}❌ FAIL${RESET} — ${n}${d?' | '+d:''}`);failed++;failures.push(n);} }

console.log(`\n${BOLD}${BLUE}===== Facility Entitlement FAIL-CLOSED Hardening Test (P1) =====${RESET}\n`);

// محاكاة دقيقة لمنطق الحارس النهائي في server.js
// readError=true يحاكي فشل قراءة company_settings.
function guard(facilityTypeRaw, apiPath, { hasTenant = true, readError = false } = {}) {
    if (!apiPath.startsWith('/api/')) return 200;
    if (apiPath === '/api/health' || apiPath.startsWith('/api/auth/')) return 200; // bootstrap
    const mod = ent.pathToModule(apiPath);
    const isCommon = ent.isCommonModule(mod);
    if (!hasTenant) return 200; // يُترك لطبقة auth/tenantScope
    if (readError) return isCommon ? 200 : 403;            // (1) خطأ قراءة: حساس → fail-closed
    const norm = ent.normalizeFacilityType(facilityTypeRaw);
    if (norm.status === 'unknown') return 422;             // (2) غير معروف → 422
    if (norm.status === 'missing') return isCommon ? 200 : 403; // (3) غير مضبوط: حساس → 403
    return ent.isModuleEntitled(norm.type, mod) ? 200 : 403;    // (4) معروف → استحقاق
}

// ===== (1) فحص ثابت: منطق fail-closed مربوط في server.js =====
console.log(`${BOLD}[1] ربط منطق fail-closed في server.js${RESET}`);
const server = fs.readFileSync(path.join(__dirname,'server.js'),'utf8');
assert(server.includes('isCommonModule'), 'الحارس يستخدم isCommonModule');
assert(server.includes("Facility entitlement unavailable (read error)"), 'خطأ القراءة على مسار حساس → 403');
assert(server.includes("Facility type not configured for this module"), 'نوع غير مضبوط على مسار حساس → 403');
assert(server.includes("ft.error"), 'الحارس يتعامل مع خطأ قراءة company_settings');
assert(/return \{ value: null, error: true \}/.test(server), 'getFacilityType يُبلّغ عن خطأ القراءة (لا fail-open)');
assert(!/catch \(e\) \{ return next\(\); \}/.test(server), 'لم يعد هناك fail-open عام (catch→next) في الحارس');

// ===== (2) المسارات العامة/bootstrap لا تنكسر =====
console.log(`\n${BOLD}[2] common/bootstrap لا تنكسر${RESET}`);
assert(guard('', '/api/health') === 200, 'health بدون نوع منشأة → PASS');
assert(guard('', '/api/auth/login') === 200, 'auth/login بدون نوع منشأة → PASS');
assert(guard('', '/api/dashboard/stats') === 200, 'common (dashboard) بدون نوع منشأة → PASS');
assert(guard('', '/api/settings') === 200, 'common (settings) بدون نوع منشأة → PASS');
assert(guard(null, '/api/patients', { hasTenant: false }) === 200, 'بلا جلسة/سياق → يُترك لطبقة auth (لا يكسر)');

// ===== (3) المسارات الحساسة fail-closed بدون نوع منشأة =====
console.log(`\n${BOLD}[3] مسارات حساسة بدون نوع منشأة → fail-closed (403)${RESET}`);
for (const p of ['/api/patients', '/api/medical/records', '/api/admissions', '/api/emergency/visits',
                 '/api/surgeries', '/api/icu/patients', '/api/pharmacy/drugs', '/api/lab/orders',
                 '/api/radiology/orders', '/api/invoices', '/api/insurance/claims', '/api/finance/journal',
                 '/api/inventory/items', '/api/hr/employees', '/api/reports/financial']) {
    assert(guard('', p) === 403, `بدون نوع منشأة: ${p} → 403`);
}

// ===== (4) خطأ قراءة company_settings =====
console.log(`\n${BOLD}[4] خطأ قراءة الإعدادات${RESET}`);
assert(guard('large_hospital', '/api/patients', { readError: true }) === 403, 'خطأ قراءة على مسار حساس → fail-closed 403');
assert(guard('large_hospital', '/api/dashboard/stats', { readError: true }) === 200, 'خطأ قراءة على مسار عام → يمرّ (لا يكسر)');
assert(guard('large_hospital', '/api/health', { readError: true }) === 200, 'خطأ قراءة على health → يمرّ');

// ===== (5) مسار حساس غير مصنّف (unclassified) =====
console.log(`\n${BOLD}[5] مسار غير مصنّف → يُعامَل حساساً (fail-closed)${RESET}`);
assert(ent.pathToModule('/api/some-new-future-module/x') === 'unclassified', 'مسار غير معروف → unclassified');
assert(guard('', '/api/some-new-future-module/x') === 403, 'مسار غير مصنّف بدون نوع → 403');
assert(guard('pharmacy_only', '/api/some-new-future-module/x') === 403, 'مسار غير مصنّف لنوع مقيّد → 403');
assert(guard('large_hospital', '/api/some-new-future-module/x') === 403, 'مسار غير مصنّف حتى للنوع الكامل → 403 (default-deny)');

// ===== (6) unknown + known-not-entitled + bypass + المصفوفة المطلوبة =====
console.log(`\n${BOLD}[6] unknown / not-entitled / bypass / المصفوفة${RESET}`);
assert(guard('totally_unknown_type', '/api/patients') === 422, 'نوع غير معروف → 422');
assert(guard('medical_city', '/api/icu/patients') === 200, 'Medical City → وصول كامل');
assert(guard('health_center', '/api/admissions') === 403, 'Health Center ← التنويم 403');
assert(guard('health_center', '/api/surgeries') === 403, 'Health Center ← العمليات 403');
assert(guard('health_center', '/api/icu/patients') === 403, 'Health Center ← ICU 403');
assert(guard('pharmacy_only', '/api/medical/records') === 403, 'Pharmacy Only ← EMR 403');
assert(guard('pharmacy_only', '/api/admissions') === 403, 'Pharmacy Only ← التنويم 403');
assert(guard('pharmacy_only', '/api/lab/orders') === 403, 'Pharmacy Only ← المختبر 403');
assert(guard('pharmacy_only', '/api/radiology/orders') === 403, 'Pharmacy Only ← الأشعة 403');
assert(guard('laboratory_only', '/api/pharmacy/drugs') === 403, 'Lab Only ← الصيدلية 403');
assert(guard('laboratory_only', '/api/medical/records') === 403, 'Lab Only ← EMR 403');
assert(guard('laboratory_only', '/api/admissions') === 403, 'Lab Only ← التنويم 403');
assert(guard('radiology_only', '/api/pharmacy/drugs') === 403, 'Radiology Only ← الصيدلية 403');
assert(guard('radiology_only', '/api/lab/orders') === 403, 'Radiology Only ← المختبر 403');
assert(guard('radiology_only', '/api/medical/records') === 403, 'Radiology Only ← EMR 403');
// تجاوز مباشر بمسار عميق
assert(guard('health_center', '/api/surgeries/9/anesthesia') === 403, 'تجاوز مباشر (مسار عميق) للعمليات → 403');
assert(guard('pharmacy_only', '/api/icu/monitoring/5') === 403, 'تجاوز مباشر لـ ICU لصيدلية فقط → 403');

console.log(`\n${BOLD}${BLUE}النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed?RED:GREEN}${failed} FAIL${RESET}\n`);
if (failed) { failures.forEach(f=>console.log(`${RED} - ${f}${RESET}`)); process.exit(1); }
process.exit(0);
