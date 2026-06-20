# P1 إنفاذ استحقاقات المنشأة — 01 خط الأساس (Baseline)

> المرحلة: `P1_FACILITY_ENTITLEMENT_BACKEND_ENFORCEMENT` | التاريخ: 2026-06-20

## 1. حالة Git
- parent HEAD: `af1dcdb` ؛ namaweb HEAD: `c1ef62b`.

## 2. مصادر نوع المنشأة الحالية (دليل)
| المصدر | الحالة |
| ------ | ------ |
| `public/js/app.js:17-22` | `let facilityType='hospital'` + `FACILITY_ALLOWED = { hospital:null, health_center:[..], clinic:[..] }` (مؤشرات قائمة) |
| `public/js/app.js:90` | `if (s.facility_type) facilityType = s.facility_type` (يُقرأ من `/api/settings`) |
| التخزين | `company_settings` (key/value)، `setting_key='facility_type'` |
| `server.js` | **صفر إشارات** لـ facilityType/FACILITY_ALLOWED/entitlement → لا إنفاذ backend |
| نموذج DB للأنواع | لا يوجد؛ `tenants` به `plan_type` فقط (لا عمود facility_type) |

## 3. الأنواع الموجودة فعلياً في الكود
**3 فقط**: `hospital` (=الكل)، `health_center`، `clinic` — كقوائم مؤشرات في الواجهة.

## 4. المشكلة
الاستحقاقات **إخفاء قائمة في الواجهة فقط**. أي مستخدم يستطيع استدعاء أي `/api/*` بغضّ النظر عن نوع المنشأة (تجاوز عبر الرابط المباشر). و3 أنواع مقابل 10 مطلوبة. ولا مصدر حقيقة backend.

## 5. نقاط الإنفاذ المتاحة
- middleware عالمي بعد الجلسة وبعد middleware سياق المستأجر (السطر 107-118) وقبل المسارات — يغطي كل `/api/*` تلقائياً (يهزم التجاوز المباشر).
- `getRequestTenantContext(req)` متاح لتحديد المستأجر؛ `company_settings` متاح لقراءة `facility_type`.

## 6. قرار النطاق
**code-first، بلا DDL**: سجل مركزي `facility_entitlements.js` + حارس عالمي يقرأ `facility_type` من `company_settings` (cache) ويفرض على مستوى الـ API. لا حاجة DDL (نستخدم `company_settings` القائم). التوافق: نوع غير مضبوط → يُعامَل كـ hospital (الكل) لمنع كسر المستأجرين الحاليين.

`BASELINE_COMPLETE`
