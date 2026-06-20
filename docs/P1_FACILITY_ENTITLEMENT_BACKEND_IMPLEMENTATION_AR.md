# P1 إنفاذ استحقاقات المنشأة — 03 التنفيذ (Implementation)

> التاريخ: 2026-06-20 | code-only، **بلا DDL**. الملفات: `facility_entitlements.js` (جديد)، `server.js` (معدّل).

## 1. السجل المركزي `namaweb/facility_entitlements.js` (جديد)
- `COMMON_MODULES`: موديولات مسموحة للجميع (dashboard/reports/settings/messaging/forms/audit/catalog/print/consent/notifications/common).
- `SEGMENT_TO_MODULE`: خريطة مقطع `/api/<seg>` → مفتاح موديول (تغطي كل المقاطع المكتشفة).
- `FACILITY_TYPE_ALIASES`: hospital→large_hospital، health_center→primary_healthcare_center، clinic→polyclinic.
- `ENTITLEMENTS`: مجموعات الموديولات لكل نوع من الأنواع العشرة ('*' للمدينة/الكبير/المتوسط).
- دوال: `pathToModule(path)`، `normalizeFacilityType(raw)` → {type,status: ok/default/unknown}، `isModuleEntitled(type, module)`.

## 2. الحارس العالمي في `server.js`
- `require('./facility_entitlements')` + كاش `_ftCache` (TTL 60s) + `invalidateFacilityTypeCache()`.
- `getFacilityType(tenantId)`: يقرأ `company_settings.setting_value WHERE setting_key='facility_type' AND (tenant_id=$1 OR tenant_id IS NULL)` مع كاش؛ فشل القراءة → null (افتراضي).
- `app.use(async ...)` بعد middleware سياق المستأجر: ينفّذ المنطق (تمرير common/auth/health/بلا-tenant؛ 422 لغير معروف؛ 403 لغير مستحق؛ تمرير للمستحق).
- إبطال الكاش في `PUT /api/settings` عند تحديث `facility_type`.

## 3. ضمانات السلامة
| الضمان | الكيفية |
| ------ | ------ |
| لا كسر للمستأجرين الحاليين | نوع غير مضبوط → large_hospital (الكل) |
| لا تجاوز عبر الرابط المباشر | الحارس عالمي على `req.path` لكل `/api/` (لا opt-in على مستوى المسار) |
| لا تراجع P0 | الحارس بعد middleware سياق المستأجر؛ لا يلمس pool.query/RLS؛ اختبار الربط يمرّ |
| لا DDL/تغيير بيانات | يقرأ `company_settings` القائم فقط |
| أداء | كاش 60s لنوع المنشأة لكل مستأجر + إبطال عند التحديث |
| fail-safe | خطأ غير متوقع → fail-open (auth+RLS تبقى الحماية الأساسية) |

## 4. سلامة الصياغة
- `node --check server.js` → OK ؛ `node --check facility_entitlements.js` → OK.

## 5. لم يُنشر بعد
الكود code-only ومُختبَر محلياً؛ **النشر المحكوم على الإنتاج خطوة لاحقة بموافقة** (لم يُطلب في هذه المرحلة).

`IMPLEMENTATION_COMPLETE`
