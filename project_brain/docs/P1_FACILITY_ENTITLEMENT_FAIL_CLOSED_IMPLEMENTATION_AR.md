# P1 fail-closed — 03 التنفيذ (Implementation)

> التاريخ: 2026-06-20 | code-only، بلا DDL. الملفات: `facility_entitlements.js`, `server.js` (معدّلة) + اختبار جديد.

## 1. `facility_entitlements.js`
- `COMMON_MODULES`: أُزيل منه `reports` (أصبح حساساً).
- `SEGMENT_TO_MODULE`: أُضيف `patient: 'patients'` (مسار نتائج المريض المفرد).
- `pathToModule`: مقطع غير معروف → `'unclassified'` (بدل `'common'`).
- `normalizeFacilityType`: unset/null → `{type:null, status:'missing'}` (إزالة السلوك permissive القديم).
- `isCommonModule(moduleKey)`: جديد (مُصدَّر).
- `isModuleEntitled`: يبدأ بـ `if (moduleKey==='unclassified') return false;` (default-deny حتى '*')؛ ثم common→true، '*'→true، وإلا عضوية المجموعة.
- `reports` أُضيف لمجموعات الأنواع السبعة غير الكاملة.

## 2. `server.js`
- `getFacilityType(tenantId)`: يعيد `{ value, error }`؛ على catch → `{value:null, error:true}` (لا يُخزَّن الخطأ، لا fail-open).
- الحارس العالمي أُعيدت كتابته fail-closed:
  - أُزيل `catch (e) { return next(); }` العام (لا fail-open).
  - bootstrap (health, auth/*) → يمرّ.
  - يحسب moduleKey + isCommon.
  - بلا tenant → يمرّ (طبقة auth).
  - خطأ قراءة: عام→يمرّ، حساس→403.
  - missing: عام→يمرّ، حساس→403.
  - unknown→422.
  - معروف: isModuleEntitled→يمرّ أو 403.
- إبطال كاش نوع المنشأة عند `PUT /api/settings` (موجود من قبل).

## 3. الاختبارات
- جديد: `cross_tenant_facility_failclosed_test.js` (**50/50**) — فحص ثابت للربط + محاكاة دقيقة (خطأ قراءة/missing/unclassified/المصفوفة/التجاوز المباشر).
- محدّث: `cross_tenant_facility_entitlement_test.js` (**41/41**) — `guardDecision` يطابق المنطق الجديد، وتصحيح حالات unset.

## 4. سلامة الصياغة والانحدار
- `node --check server.js` + `facility_entitlements.js` → OK.
- الانحدار: **21/21 حزمة exit 0** — بما فيها `cross_tenant_app_tenant_binding_test.js` (RLS P0، 9/9) → **لا تراجع**.

## 5. لم يُنشر
code-only جاهز ومُختبَر محلياً. **النشر موقوف** (يحتاج ضبط `facility_type` على الإنتاج أولاً + موافقة نشر — انظر الإغلاق).

`IMPLEMENTATION_COMPLETE`
