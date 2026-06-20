# P1 fail-closed — 05 الإغلاق النهائي (Final Closeout)

> المرحلة: `P1_FACILITY_ENTITLEMENT_FAIL_CLOSED_HARDENING` | التاريخ: 2026-06-20

## الحالة النهائية: **PASS (الكود) — النشر موقوف بشرط**

| معيار الإغلاق | الحالة |
| ------------- | ------ |
| المسارات الحساسة لم تعد fail-open | ✅ (missing/unknown/read-error/unclassified → محجوبة) |
| missing facility type على sensitive لا يمر permissive | ✅ 403 |
| read error على sensitive لا يمر permissive | ✅ 403 |
| unknown facility type → 422 | ✅ |
| known but not entitled → 403 | ✅ |
| health/auth/common لا تنكسر | ✅ |
| direct API bypass محجوب | ✅ (مسارات عميقة + unclassified) |
| RLS P0 لم يتراجع | ✅ binding 9/9 |
| الاختبارات PASS | ✅ 50/50 + 41/41 + انحدار 21/21 |
| التقارير مكتملة | ✅ 5 |
| UTF-8 audit | ✅ PASS |
| Git pushed بلا force | ✅ (أدناه) |

## الملفات
- معدّل: `namaweb/facility_entitlements.js` (fail-closed: unset→missing، unmapped→unclassified، reports حساس، unclassified default-deny، isCommonModule)، `namaweb/server.js` (الحارس fail-closed + getFacilityType{value,error}؛ إزالة fail-open العام).
- جديد: `namaweb/cross_tenant_facility_failclosed_test.js` (50/50).
- محدّث: `namaweb/cross_tenant_facility_entitlement_test.js` (41/41).
- لا DDL، لا تغيير بيانات، لا Wave2B، لا Stitch.

## ⚠️ شرط النشر (حرج)
الإنتاج الحالي `facility_type` = **unset** → نشر هذا الكود **سيحجب كل المسارات الحساسة (403)** ويكسر التشغيل. لذلك:
1. **أولاً**: ضبط `facility_type` على الإنتاج لنوع صحيح (مثلاً `large_hospital` للمستشفى الحالي) — **تغيير بيانات على الإنتاج يحتاج موافقة صريحة منفصلة**.
2. **ثم**: النشر المحكوم (backup + scp + node --check + pm2 restart + smoke + التحقق أن المسارات الحساسة تعمل للنوع المضبوط، والمسارات المحجوبة ترجع 403).

**أُوقِف التنفيذ بعد commit/push** كما تتطلب القواعد ("إذا كان النشر يحتاج موافقة منفصلة، توقف بعد commit/push واطلب موافقة نشر").

## المخاطر المتبقية
1. **النشر معلّق** على ضبط `facility_type` على الإنتاج (data change + deploy approval). حتى ذلك، الإنتاج يعمل بالكود السابق (permissive).
2. تمييز نوع التقرير الدقيق (مالي/سريري/مخزون) داخل موديول `reports` الموحّد = تحسين مستقبلي (يحتاج خرائط مسار أدق)؛ حالياً reports حساس ككل ومسموح للأنواع المضبوطة.
3. الاستحقاقات في `company_settings` (key/value) لا نموذج DB مخصّص (تحسين DDL اختياري).
4. مقاطع `/api/` مستقبلية يجب تصنيفها في `SEGMENT_TO_MODULE` وإلا تُحجب (default-deny مقصود).

## القرار
تقوية fail-closed **مكتملة ومُختبَرة على مستوى الكود**؛ المسارات الحساسة لم تعد permissive. لا تراجع في P0. النشر مشروط بضبط facility_type أولاً.

```
STATUS: P1_FACILITY_ENTITLEMENT_FAIL_CLOSED_HARDENING_COMPLETED (code) / DEPLOY_PENDING_APPROVAL
FINAL_STATUS: PASS (code)
SENSITIVE_FAIL_CLOSED: YES (missing/unknown/read-error/unclassified)
COMMON_AUTH_HEALTH_INTACT: YES
DIRECT_BYPASS_BLOCKED: YES
RLS_P0_REGRESSION: NONE
TESTS: 50/50 + 41/41 + REGRESSION 21/21 PASS
DDL_EXECUTED: NO ; PRODUCTION_DATA_CHANGED: NO ; PRODUCTION_DEPLOYED: NO
DEPLOY_PRECONDITION: set facility_type on prod first (data change + approval)
UTF8_ARABIC_AUDIT: PASS
GIT: namaweb + parent pushed (no force)
NEXT: approve [set facility_type + controlled deploy] ; then P1 maturity (accounting posting / lab-rad approval / FEFO / security P1) | WAVE2B (DDL approval)
```

`FINAL_CLOSEOUT_COMPLETE`
