# P1 إنفاذ استحقاقات المنشأة — 05 الإغلاق النهائي (Final Closeout)

> المرحلة: `P1_FACILITY_ENTITLEMENT_BACKEND_ENFORCEMENT` | التاريخ: 2026-06-20

## الحالة النهائية: **PASS**

| معيار الإغلاق | الحالة |
| ------------- | ------ |
| Facility entitlement لم يعد UI-only | ✅ حارس backend عالمي على كل `/api/` |
| API يمنع الوصول غير المصرح حسب نوع المنشأة | ✅ 403 عند عدم الاستحقاق (مُختبَر) |
| direct URL/API bypass يفشل | ✅ القرار على `req.path` مستقل عن طريقة الوصول (مُختبَر بمسارات عميقة) |
| الأنواع العشرة ممثّلة في registry | ✅ `facility_entitlements.js` (10 أنواع + 3 aliases قديمة) |
| لا تراجع في RLS P0 | ✅ binding test 9/9 + انحدار 20/20 |
| الاختبارات الأساسية PASS | ✅ 40/40 |
| التقارير مكتملة | ✅ 5 تقارير |
| Git pushed بلا force | ✅ (أدناه) |

## الملفات
- جديد: `namaweb/facility_entitlements.js` (السجل المركزي)، `namaweb/cross_tenant_facility_entitlement_test.js` (40/40).
- معدّل: `namaweb/server.js` (require + getFacilityType+cache + حارس عالمي + إبطال كاش عند تحديث الإعدادات).
- لا DDL، لا تغيير بيانات إنتاج، لا لمس Wave2B، لا Stitch.

## أنواع المنشآت العشرة (registry)
medical_city، large_hospital، medium_hospital، small_hospital، polyclinic، primary_healthcare_center، specialized_center، pharmacy_only، laboratory_only، radiology_only + aliases (hospital/health_center/clinic).

## رسائل الخطأ
- `403 Facility type not entitled for this module` (+ module + facilityType).
- `422 Unknown facility type` (نوع مضبوط غير معروف).
- 401/403 لغياب السياق عبر طبقات `requireAuth`/`requireTenantScope` القائمة.

## المخاطر المتبقية
1. **لم يُنشر بعد على الإنتاج** — code-only جاهز؛ النشر المحكوم خطوة لاحقة بموافقة (نسخة احتياطية + scp + node --check + pm2 restart + smoke + التحقق أن نوع المنشأة الحالي يسمح بالموديولات المتوقعة).
2. **التحقق الحيّ عبر HTTP** (login + ضبط facility_type + طلبات فعلية) يُجرى ضمن النشر المحكوم؛ الاختبار الحالي يثبت منطق الحارس + ربطه ثابتاً.
3. الاستحقاقات في `company_settings` (key/value) لا في نموذج DB مخصّص — تحسين مستقبلي (FacilityType/Entitlement tables) يحتاج خطة DDL منفصلة.
4. `fail-open` عند خطأ قراءة غير متوقع (مقبول لطبقة feature-gating؛ auth+RLS تبقى الأساس).

## القرار
حاجز "Facility Entitlement backend enforcement ABSENT" **أُغلق على مستوى الكود** ومُتحقَّق منه بالاختبارات. لم يعد الاعتماد على الواجهة. لا تراجع في P0.

```
STATUS: P1_FACILITY_ENTITLEMENT_BACKEND_ENFORCEMENT_COMPLETED
FINAL_STATUS: PASS
ENFORCEMENT_LAYER: API (global middleware) — not UI-only
FACILITY_TYPES_IN_REGISTRY: 10 (+3 legacy aliases)
DIRECT_BYPASS_BLOCKED: YES
TESTS: 40/40 + REGRESSION 20/20 PASS
RLS_P0_REGRESSION: NONE (binding 9/9)
DDL_EXECUTED: NO ; PRODUCTION_DATA_CHANGED: NO ; PRODUCTION_DEPLOYED: NO (pending controlled deploy)
WAVE2B_TOUCHED: NO ; STITCH: NO
UTF8_ARABIC_AUDIT: PASS
NEXT: CONTROLLED_DEPLOY (approval) + live HTTP verification ; then P1 maturity (accounting posting / lab-rad approval / FEFO / security P1)
```

`FINAL_CLOSEOUT_COMPLETE`
