# تدقيق استحقاقات أنواع المنشآت (Facility-Type Entitlements Audit)

> التاريخ: 2026-06-20 | الأدلة: `public/js/app.js` (FACILITY_ALLOWED)، `db_postgres.js` (tenants)، `server.js`.
> مرجع: `GLOBAL_AUDIT_11_COMMERCIAL_SAAS_READINESS`.

## 1. الحالة الحالية (دليل برمجي)
- **التعريف الوحيد** للاستحقاقات في `public/js/app.js:17-22`:
  ```
  let facilityType = 'hospital';
  FACILITY_ALLOWED = { hospital: null, health_center: [..مؤشرات قائمة..], clinic: [..مؤشرات قائمة..] }
  ```
- المصدر: `facility_type` يُقرأ من الإعدادات (`s.facility_type`) في الواجهة فقط.
- **`server.js`: صفر إشارات** لـ facilityType/facility_type/FACILITY_ALLOWED/entitlement → **لا إنفاذ على الـ backend إطلاقاً**.
- `tenants` يحوي `plan_type` فقط (لا عمود `facility_type`، لا جدول FacilityType/Plan/Entitlement).

## 2. الفجوة المعمارية الجوهرية
**النظام ينفّذ نوع المنشأة كإخفاء قائمة في الواجهة فقط** — وهو بالضبط النمط الخاطئ المحذّر منه. أي مستخدم يستطيع استدعاء أي `/api/*` بغضّ النظر عن نوع المنشأة (الموديول "المخفي" يبقى مفتوحاً عبر الـ API). كما أن النظام يعرّف **3 أنواع فقط** (hospital/health_center/clinic) مقابل **10 أنواع** مطلوبة.

## 3. مصفوفة الموديول × نوع المنشأة (الحالة الفعلية)
> الحالة الحالية = إخفاء قائمة فقط (للأنواع الثلاثة)؛ البقية **Not implemented**. الإنفاذ على الـ API = "Hidden(UI only)" لكل الخلايا فعلياً.

| Module | Medical City | Large Hosp | Medium Hosp | Small Hosp | Polyclinic | Health Center | Specialized | Pharmacy Only | Lab Only | Radiology Only |
| ------ | ------------ | ---------- | ----------- | ---------- | ---------- | ------------- | ----------- | ------------- | -------- | -------------- |
| النوع معرّف في الكود؟ | ❌ | ✅(hospital) | ❌ | ❌ | ✅(clinic) | ✅(health_center) | ❌ | ❌ | ❌ | ❌ |
| المرضى/المواعيد/EMR | Full(UI) | Full | — | — | Limited(UI) | Limited(UI) | — | Hidden | Hidden | Hidden |
| الصيدلية | Full(UI) | Full | — | — | Optional(UI) | Optional(UI) | — | **مطلوب Full** NI | Hidden | Hidden |
| المختبر | Full(UI) | Full | — | — | Optional | Optional | — | Hidden | **مطلوب Full** NI | Hidden |
| الأشعة | Full(UI) | Full | — | — | Optional | Optional | — | Hidden | Hidden | **مطلوب Full** NI |
| التنويم/ICU/OR/الطوارئ | Full(UI) | Full | — | — | Hidden | Hidden | — | Hidden | Hidden | Hidden |
| المحاسبة/المخازن | Full(UI) | Full | — | — | Limited | Limited | — | Limited NI | Limited NI | Limited NI |
| تعدد المنشآت/التوحيد | **مطلوب Full** NI | — | — | — | — | — | — | — | — | — |

(NI = Not implemented؛ "(UI)" = إخفاء واجهة فقط بلا إنفاذ API)

## 4. النتائج

| Finding | Evidence | Risk | Required Fix | Priority |
| ------- | -------- | ---- | ------------ | -------- |
| الاستحقاقات واجهة فقط، بلا إنفاذ API | app.js فقط؛ صفر في server.js | **عالٍ** — تجاوز عبر API لموديولات غير مفعّلة | إضافة إنفاذ entitlement middleware على الـ API | **P1** |
| 3 أنواع فقط مقابل 10 مطلوبة | FACILITY_ALLOWED (3 مفاتيح) | عالٍ — لا يدعم نماذج العمل المستهدفة (مدينة طبية/صيدلية/مختبر/أشعة فقط) | تعريف 10 أنواع + قوالبها | P1 |
| لا نموذج FacilityType/Plan/Entitlement في DB | tenants به plan_type فقط | عالٍ — لا مصدر حقيقة للاستحقاقات | جداول FacilityType + ModuleEntitlements + FeatureEntitlements + UsageLimits | P1 |
| لا قوالب افتراضية (أدوار/أقسام/شجرة حسابات/كتالوج خدمات) | لا onboarding wizard | متوسط | RoleTemplates/DepartmentTemplates/CoA/ServiceCatalog حسب النوع | P2 |
| لا usage limits / metering | غير موجود | متوسط (SaaS) | حدود + قياس استخدام | P2 |
| التوحيد متعدد المنشآت (مدينة طبية) | بنية branches موجودة، لا تجميع | متوسط | مالية/مشتريات/تحليلات موحّدة | P2 |

## 5. الخلاصة
استحقاقات أنواع المنشآت **غير مُنفّذة فعلياً** (إخفاء قائمة فقط لـ3 أنواع، بلا backend، بلا نموذج DB، بلا قوالب). هذه فجوة **P1 معمارية** تمنع التشغيل كـ SaaS متعدد الأنواع وتشكّل **خطراً أمنياً** (تجاوز عبر API). يجب تصميم طبقة استحقاقات مخزّنة في DB ومُنفَّذة على UI+API+Service قبل أي onboarding تجاري.

`FACILITY_TYPE_ENTITLEMENTS_AUDIT_COMPLETE`
