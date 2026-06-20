# P1 fail-closed — 01 خط الأساس (Baseline)

> المرحلة: `P1_FACILITY_ENTITLEMENT_FAIL_CLOSED_HARDENING` | التاريخ: 2026-06-20

## 1. حالة Git
- parent HEAD: `64c0737` ؛ namaweb HEAD: `9897a6a`.

## 2. نقاط fail-open في الحارس القائم (قبل التقوية) — دليل من `server.js`/`facility_entitlements.js`
| # | الموضع | السلوك القديم (fail-open) |
| - | ------ | ------------------------- |
| 1 | `normalizeFacilityType` (unset/null) | يرجع `{type:'large_hospital', status:'default'}` → **permissive (الكل)** |
| 2 | `getFacilityType` catch | `value=null` → يُعامَل كافتراضي permissive |
| 3 | الحارس outer `catch (e) { return next(); }` | **fail-open** على أي خطأ |
| 4 | `pathToModule` لمقطع غير معروف | يرجع `'common'` → **permissive** لمسار غير مصنّف |

## 3. التصنيف المطلوب
- **عام (يمرّ بدون نوع منشأة)**: common, dashboard, messaging, settings, forms, audit, catalog, print, consent, notifications + bootstrap (health, auth).
- **حساس (يجب fail-closed)**: patients, emr, nursing, inpatient, emergency, surgery, icu, pharmacy, lab, radiology, pathology, blood_bank, billing, insurance, accounting, inventory, hr, facility_ops, rehab, telemedicine, social_work, cosmetic, obgyn, dietary, portal, quality، **reports** (مالية/سريرية/مخزون)، **sensitive_admin**، وأي مسار **unclassified**.

## 4. تأكيد تغطية المسارات (تفادي كسر مسار حالي عند التشديد)
- المقاطع الحالية المغطّاة: 73؛ غير مغطّى: `patient` (مفرد) فقط → أُضيف للخريطة (→ patients). بعدها **لا مقطع حالي غير مصنّف** → تشديد unclassified يؤثّر فقط على المسارات المستقبلية (آمن).

## 5. قاعدة السلامة المحورية
تحويل unset → fail-closed للمسارات الحساسة **سيحجب الإنتاج الحالي** (نوع المنشأة على الإنتاج = unset). لذلك: ينفَّذ الكود + الاختبارات + commit/push، **ويُوقَف قبل النشر**؛ النشر مشروط بضبط `facility_type` على الإنتاج أولاً (تغيير بيانات بموافقة منفصلة).

`BASELINE_COMPLETE`
