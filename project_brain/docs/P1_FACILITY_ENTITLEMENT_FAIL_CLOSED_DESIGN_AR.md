# P1 fail-closed — 02 التصميم (Design)

> التاريخ: 2026-06-20

## 1. سياسة fail-closed
حالة نوع المنشأة لمسار `/api/`:

| الحالة | مسار عام | مسار حساس |
| ------ | -------- | --------- |
| bootstrap (health, auth/*) | يمرّ | يمرّ |
| لا سياق مستأجر (بلا جلسة) | يُترك لطبقة auth/requireTenantScope (401/403) | يُترك لطبقة auth |
| خطأ قراءة company_settings | يمرّ (لا نكسر الواجهة) | **403 fail-closed** |
| نوع غير مضبوط (missing) | يمرّ | **403 fail-closed** |
| نوع غير معروف (unknown) | **422** | **422** |
| نوع معروف + مستحق | يمرّ | يمرّ |
| نوع معروف + غير مستحق | — | **403** |
| مسار unclassified | n/a (ليس عاماً) | **403 default-deny حتى للأنواع الكاملة** |

## 2. التصنيف (في `facility_entitlements.js`)
- `COMMON_MODULES`: common, dashboard, messaging, settings, forms, audit, catalog, print, consent, notifications. (**reports أُخرج** → حساس.)
- حساس = أي موديول آخر + `unclassified`.
- `isCommonModule(moduleKey)` لتحديد العام.
- `pathToModule`: مقطع غير معروف → `'unclassified'` (لا `'common'`).
- `normalizeFacilityType`: unset → `{status:'missing'}` (لا permissive)؛ unknown → `{status:'unknown'}`.
- `isModuleEntitled`: `'unclassified'` → false دائماً (حتى '*')؛ common → true؛ '*' → true؛ غير ذلك → عضوية المجموعة.
- `reports` أُضيف لمجموعات الأنواع غير الكاملة (فالنوع المضبوط يحصل على التقارير؛ غياب النوع → 403). تمييز نوع التقرير (مالي/سريري) دقيقاً = تحسين مستقبلي (يحتاج خرائط مسار أدق).

## 3. أكواد الاستجابة
- `403 Facility type not configured for this module` (missing على حساس).
- `403 Facility entitlement unavailable (read error)` (خطأ قراءة على حساس).
- `422 Unknown facility type` (نوع غير معروف).
- `403 Facility type not entitled for this module` (معروف غير مستحق / unclassified).

## 4. الحفاظ على عدم الكسر
- health/auth/common تمرّ دائماً (الواجهة/الدخول/الـ bootstrap سليمة).
- لا سياق → طبقة auth (401) كما هي.
- RLS P0 (app.tenant_id) غير ممسوس.
- مقطع `patient` المفرد أُضيف لتفادي حجب مسار نتائج المريض الحالي.

## 5. code-only / DDL
- code-only بالكامل، **بلا DDL**، بلا تغيير بيانات.

## 6. أثر النشر (حرج)
الإنتاج الحالي `facility_type` = **unset** → بعد النشر ستُحجب كل المسارات الحساسة (403). لذلك **النشر مشروط** بضبط `facility_type` (مثلاً `large_hospital`) على الإنتاج أولاً (تغيير بيانات بموافقة منفصلة)، ثم النشر المحكوم. **لا يُنشر في هذه المرحلة.**

`DESIGN_COMPLETE`
