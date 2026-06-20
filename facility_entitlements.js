/**
 * facility_entitlements.js
 * ==========================================
 * سجل مركزي لاستحقاقات أنواع المنشآت (Facility-Type Entitlement Registry)
 * مصدر الحقيقة code-first لإنفاذ نوع المنشأة على مستوى الـ backend (API)،
 * بدلاً من الاعتماد على إخفاء القوائم في الواجهة فقط.
 *
 * المبدأ (fail-closed):
 *  - الموديولات "المشتركة" (auth/health/dashboard/settings/messaging/...) مسموحة للجميع.
 *  - كل نوع منشأة له مجموعة موديولات مسموحة ('*' = الكل).
 *  - نوع المنشأة غير المضبوط (فارغ/null) → 'missing': المسارات الحساسة تُحجب (403)، العامة تمرّ.
 *  - نوع مضبوط لكنه غير معروف → يُرفض (422).
 *  - مسار غير مصنّف (unclassified) → default-deny (حتى للأنواع الكاملة).
 *  - خطأ قراءة الإعدادات → المسارات الحساسة تُحجب، العامة تمرّ (يُعالَج في الحارس).
 */

// ===== 1) الموديولات الأساسية (canonical module keys) =====
// عام (يمرّ حتى بدون نوع منشأة). ملاحظة: 'reports' أُخرج عمداً ليصبح حساساً
// (تقارير مالية/سريرية/مخزون) → fail-closed عند غياب النوع.
const COMMON_MODULES = new Set([
    'common', 'dashboard', 'messaging', 'settings', 'forms',
    'audit', 'catalog', 'print', 'consent', 'notifications'
]);

// ===== 2) خريطة مقطع المسار → مفتاح الموديول =====
const SEGMENT_TO_MODULE = {
    // common / utility
    auth: 'common', health: 'common', dashboard: 'dashboard', reports: 'reports',
    messages: 'messaging', notifications: 'notifications', settings: 'settings',
    forms: 'forms', 'audit-trail': 'audit', catalog: 'catalog', print: 'print',
    consent: 'consent', 'consent-forms': 'consent', 'diagnosis-templates': 'common',
    admin: 'settings',
    // clinical core
    patients: 'patients', patient: 'patients',
    appointments: 'reception_appointments', bookings: 'reception_appointments',
    queue: 'reception_appointments', visits: 'reception_appointments',
    doctor: 'emr', medical: 'emr', 'medical-records': 'emr', 'medical-reports': 'emr',
    referrals: 'emr',
    nursing: 'nursing', emar: 'nursing',
    admissions: 'inpatient', beds: 'inpatient', wards: 'inpatient', 'bed-transfers': 'inpatient',
    emergency: 'emergency',
    surgeries: 'surgery', 'operating-rooms': 'surgery', 'surgery-preop-tests': 'surgery',
    icu: 'icu',
    pharmacy: 'pharmacy', 'clinical-pharmacy': 'pharmacy', prescriptions: 'pharmacy',
    'drug-interactions': 'pharmacy', 'allergy-check': 'pharmacy',
    lab: 'lab', pathology: 'pathology',
    radiology: 'radiology',
    'blood-bank': 'blood_bank',
    // financial / admin
    invoices: 'billing', billing: 'billing', orders: 'billing', 'cash-drawer': 'billing', zatca: 'billing',
    insurance: 'insurance',
    finance: 'accounting',
    inventory: 'inventory', 'dept-requests': 'inventory',
    hr: 'hr', employees: 'hr',
    quality: 'quality', infection: 'quality', 'infection-control': 'quality',
    maintenance: 'facility_ops', transport: 'facility_ops', cssd: 'facility_ops', mortuary: 'facility_ops',
    dietary: 'dietary', nutrition: 'dietary',
    rehab: 'rehab', telemedicine: 'telemedicine', 'social-work': 'social_work',
    cme: 'cme', cosmetic: 'cosmetic', obgyn: 'obgyn', portal: 'portal',
};

// ===== 3) الأنواع العشرة + الأسماء القديمة (aliases) =====
const FACILITY_TYPE_ALIASES = {
    hospital: 'large_hospital',          // legacy
    health_center: 'primary_healthcare_center', // legacy
    clinic: 'polyclinic',                // legacy
};

// مجموعات الموديولات المسموحة لكل نوع ('*' = الكل). الموديولات المشتركة مسموحة دائماً.
const FULL = '*';
const ENTITLEMENTS = {
    medical_city: FULL,
    large_hospital: FULL,
    medium_hospital: FULL,
    small_hospital: new Set([
        'reports', 'patients', 'reception_appointments', 'emr', 'nursing', 'inpatient', 'emergency',
        'surgery', 'pharmacy', 'lab', 'radiology', 'billing', 'insurance', 'accounting',
        'inventory', 'hr', 'quality', 'rehab', 'telemedicine', 'obgyn', 'portal', 'dietary',
        'social_work', 'cme', 'pathology', 'facility_ops'
        // محجوب: icu, blood_bank, cosmetic
    ]),
    polyclinic: new Set([
        'reports', 'patients', 'reception_appointments', 'emr', 'nursing', 'pharmacy', 'lab', 'radiology',
        'billing', 'insurance', 'accounting', 'inventory', 'rehab', 'telemedicine', 'obgyn',
        'cosmetic', 'portal', 'dietary', 'hr', 'quality'
        // محجوب: inpatient, emergency, surgery, icu, blood_bank, facility_ops, pathology, social_work
    ]),
    primary_healthcare_center: new Set([
        'reports', 'patients', 'reception_appointments', 'emr', 'nursing', 'pharmacy', 'lab', 'radiology',
        'billing', 'insurance', 'accounting', 'inventory', 'rehab', 'telemedicine', 'obgyn',
        'portal', 'dietary', 'quality', 'social_work'
        // محجوب: inpatient, emergency, surgery, icu, blood_bank, facility_ops, cosmetic, pathology
    ]),
    specialized_center: new Set([
        'reports', 'patients', 'reception_appointments', 'emr', 'nursing', 'pharmacy', 'lab', 'radiology',
        'pathology', 'surgery', 'billing', 'insurance', 'accounting', 'inventory', 'rehab',
        'telemedicine', 'obgyn', 'cosmetic', 'portal', 'dietary', 'hr', 'quality'
        // محجوب: inpatient, icu, emergency, blood_bank, facility_ops
    ]),
    pharmacy_only: new Set([
        'reports', 'pharmacy', 'inventory', 'billing', 'accounting', 'hr'
        // محجوب: patients, emr, reception_appointments, inpatient, lab, radiology, emergency,
        // surgery, icu, nursing, blood_bank, insurance, ...
    ]),
    laboratory_only: new Set([
        'reports', 'patients', 'reception_appointments', 'lab', 'pathology', 'inventory', 'billing',
        'insurance', 'accounting', 'hr'
        // محجوب: pharmacy, emr, radiology, inpatient, emergency, surgery, icu, nursing, blood_bank
    ]),
    radiology_only: new Set([
        'reports', 'patients', 'reception_appointments', 'radiology', 'inventory', 'billing',
        'insurance', 'accounting', 'hr'
        // محجوب: pharmacy, lab, emr, inpatient, emergency, surgery, icu, nursing, blood_bank, pathology
    ]),
};

const KNOWN_TYPES = new Set(Object.keys(ENTITLEMENTS).concat(Object.keys(FACILITY_TYPE_ALIASES)));

// ===== 4) دوال مساعدة =====
function pathToModule(p) {
    // p مثل /api/lab/orders → القطعة الأولى بعد /api/
    const m = /^\/api\/([a-z0-9-]+)/i.exec(p || '');
    if (!m) return 'unclassified';
    const seg = m[1].toLowerCase();
    // غير معروف → 'unclassified' (يُعامَل كحساس → fail-closed، لا permissive)
    return SEGMENT_TO_MODULE[seg] || 'unclassified';
}

// هل الموديول ضمن القائمة العامة (مسموح للجميع، يمرّ حتى بدون نوع منشأة)؟
function isCommonModule(moduleKey) {
    return COMMON_MODULES.has(moduleKey);
}

// raw → { type, status } ؛ status: 'ok' | 'missing' | 'unknown'
// fail-closed: نوع غير مضبوط = 'missing' (لا يُعامَل permissive)؛ القرار يُترك للحارس حسب حساسية المسار.
function normalizeFacilityType(raw) {
    if (raw === undefined || raw === null || String(raw).trim() === '') {
        return { type: null, status: 'missing' };
    }
    const v = String(raw).trim().toLowerCase();
    if (ENTITLEMENTS[v]) return { type: v, status: 'ok' };
    if (FACILITY_TYPE_ALIASES[v]) return { type: FACILITY_TYPE_ALIASES[v], status: 'ok' };
    return { type: null, status: 'unknown' };
}

function isModuleEntitled(facilityTypeCanonical, moduleKey) {
    if (moduleKey === 'unclassified') return false; // default-deny حتى للأنواع الكاملة (يجب تصنيف أي مسار جديد)
    if (COMMON_MODULES.has(moduleKey)) return true; // مشترك دائماً
    const set = ENTITLEMENTS[facilityTypeCanonical];
    if (set === FULL) return true;
    if (!set) return false;
    return set.has(moduleKey);
}

module.exports = {
    COMMON_MODULES, SEGMENT_TO_MODULE, ENTITLEMENTS, FACILITY_TYPE_ALIASES, KNOWN_TYPES,
    pathToModule, normalizeFacilityType, isModuleEntitled, isCommonModule,
};
