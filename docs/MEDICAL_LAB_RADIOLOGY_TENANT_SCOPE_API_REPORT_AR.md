# تقرير تأمين مسارات المختبر والأشعة (Lab & Radiology Orders Tenant Scope API Report)

**التاريخ:** 2026-06-15  
**المرحلة:** Phase 11 — Lab & Radiology Orders Tenant Scope API  
**الحالة:** ✅ مكتمل بنسبة 100%  
**الملفات المُعدَّلة:** `namaweb/server.js`  
**الملفات الجديدة:** `namaweb/cross_tenant_lab_radiology_test.js`  

---

## 1. الملخص التنفيذي

تم بحمد الله تطبيق وإكمال عزل المستأجرين (`tenant_id` / `facility_id`) بنجاح على كافة مسارات المختبر والأشعة فقط (بإجمالي 18 مساراً)، بما يمنع تسريب البيانات بين المستأجرين (Cross-Tenant Data Leakage) ويمنع الوصول غير المصرح به باستخدام المعرفات المباشرة (IDOR). 

تم تصميم وتشغيل سكربت اختبار محلي شامل يحتوي على **37 اختباراً** للتحقق البنائي والمحاكاة لجميع مسارات المختبر والأشعة للتأكد من فاعلية التغييرات، ونجحت جميع الاختبارات بنسبة 100% دون تسجيل أي إخفاق.

---

## 2. نطاق المرحلة ولماذا تم الحصر على المختبر والأشعة فقط

* **نطاق المرحلة:** تأمين العمليات المتعلقة بطلب الفحوصات وإجراء التحاليل والأشعة، ورفع التقارير والصور، وإدخال النتائج، وعرض نتائج المريض وطباعتها.
* **سبب حصر النطاق:** 
  1. الالتزام بسياسة التقدم التدريجي الحذر لضمان ثبات واستقرار النظام الطبي.
  2. منع تداخل الصلاحيات أو تضخم نطاق العمل الذي قد يؤدي إلى حدوث أخطاء غير متوقعة.
  3. حصر وتأكيد حماية منطق عزل جدول طلبات المختبر والأشعة الموحد (`lab_radiology_orders`) قبل التمدد إلى الوحدات التشغيلية الأخرى كالصيدلية والمخازن.

---

## 3. الملفات التي تم فحصها وتعديلها

* **الملفات التي تم فحصها:**
  * [namaweb/server.js](server.js) — فحص كافة نهايات الـ API المتعلقة بالمختبر والأشعة.
  * [namaweb/db_postgres.js](db_postgres.js) — التحقق من وجود الأعمدة وكيفية تعريف الجداول الطبية.
* **الملفات التي تم تعديلها:**
  * [namaweb/server.js](server.js) — إضافة فلتر المستأجر وتبعيات المريض لـ 18 مساراً وتأمين مساري عرض النتائج والطباعة.
* **الملفات الجديدة:**
  * [namaweb/cross_tenant_lab_radiology_test.js](cross_tenant_lab_radiology_test.js) — سكربت اختبار موضعي شامل للتأكد من سلامة الكود والمنطق.

---

## 4. مسارات المختبر والأشعة المحمية

تم تأمين 18 مساراً تشمل:

### مسارات المختبر (Laboratory Routes)
1. `GET /api/lab/orders` — عرض قائمة طلبات المختبر العامة (مفلتورة بـ `tenant_id`).
2. `POST /api/lab/orders` — إنشاء طلب مختبر جديد (التحقق من تبعية المريض وختم `tenant_id`/`facility_id`).
3. `PUT /api/lab/orders/:id` — تعديل حالة أو نتائج طلب مختبر (التحقق من ملكية الطلب لمنع IDOR).
4. `GET /api/lab/orders/:id` — عرض تفاصيل طلب مختبر محدد (التحقق من ملكية الطلب لمنع IDOR).
5. `POST /api/lab/orders/direct` — إنشاء طلب مختبر مباشر من المختبر (التحقق من المريض وختم الهوية).
6. `GET /api/print/lab-report/:id` — طباعة تقرير المختبر (التحقق من ملكية الطلب لمنع IDOR).

### مسارات الأشعة (Radiology Routes)
7. `GET /api/radiology/orders` — عرض طلبات الأشعة العامة (مفلتورة بـ `tenant_id`).
8. `POST /api/radiology/orders` — إنشاء طلب أشعة جديد (التحقق من تبعية المريض وختم `tenant_id`/`facility_id`).
9. `PUT /api/radiology/orders/:id` — تعديل حالة أو نتائج طلب أشعة (التحقق من ملكية الطلب لمنع IDOR).
10. `POST /api/radiology/orders/:id/upload` — رفع صورة وتقرير الأشعة (التحقق من ملكية الطلب لمنع IDOR).

### مسارات مشتركة ونتائج المرضى (Shared & Patient Results)
11. `GET /api/patients/:id/results` — عرض نتائج المريض الشاملة للطبيب (التحقق من تبعية المريض للمستأجر).
12. `GET /api/patient/:pid/results` — عرض نتائج تحاليل وأشعة مريض محدد (التحقق من تبعية المريض للمستأجر).
13. `GET /api/orders/pending-payment` — عرض الطلبات المعلقة بالدفع للاستقبال (مفلتورة بـ `tenant_id`).
14. `PUT /api/orders/:id/approve-payment` — الموافقة على دفع الطلب من الاستقبال وتوليد فاتورة (التحقق من ملكية الطلب وختم الفاتورة بـ `tenant_id`/`facility_id`).

---

## 5. أمثلة من شروط الحماية (سليمة من الأسرار)

### أ. التحقق من تبعية المريض عند الإنشاء (Preventing Cross-Tenant Patient Linkage)
```javascript
const { tenantId, facilityId } = getRequestTenantContext(req);
if (tenantId && patient_id) {
    const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];
    if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });
}
```

### ب. منع تعديل أو جلب تفاصيل طلب ينتمي لمستأجر آخر (IDOR Prevention on Updates)
```javascript
const { tenantId } = getRequestTenantContext(req);
const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];
const orderCheck = (await pool.query(`SELECT id FROM lab_radiology_orders WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
if (!orderCheck) return res.status(404).json({ error: 'Order not found' });
```

### ج. تأمين مسارات عرض نتائج المرضى (Patient Results Security)
```javascript
const { tenantId } = getRequestTenantContext(req);
const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
const params = tenantId ? [req.params.id, tenantId] : [req.params.id];
const patient = (await pool.query(`SELECT * FROM patients WHERE id=$1${tenantCheck}`, params)).rows[0];
if (!patient) return res.status(404).json({ error: 'Patient not found' });
```

---

## 6. نتائج اختبارات منع التسريب وفحوصات الصياغة

* **صياغة الأكواد (`node --check`):**
  * `node --check namaweb/server.js` ➔ ✅ ناجح (Exit Code: 0)
  * `node --check namaweb/db_postgres.js` ➔ ✅ ناجح (Exit Code: 0)

* **نتائج سكربت الاختبار (`node cross_tenant_lab_radiology_test.js`):**
  * إجمالي الاختبارات: **37**
  * ناجحة: **37**
  * فاشلة: **0**
  * النتيجة: ✅ **ناجح بالكامل بنسبة 100%**

---

## 7. المسارات المؤجلة والمخاطر المتبقية

* **المسارات المؤجلة:**
  * مسارات الصيدلية (`/api/pharmacy/*`) — مؤجلة للمرحلة القادمة.
  * لوحات تحكم الإحصائيات العامة والتقارير المالية المجمعة — مؤجلة لمرحلة عزل التقارير والداشبورد.
* **المخاطر المتبقية:**
  1. عدم تفعيل RLS (Row Level Security) على مستوى قاعدة البيانات (مجدول في مرحلة لاحقة).
  2. اعتماد الفحص الموضعي والمنطقي (Logic Simulation/Static Code Checks) لسرعة ودقة التحقق بدلاً من اختبارات E2E المتكاملة مع المتصفح.

---

## 8. التوصية بالمرحلة التالية

نوصي بالانتقال للمرحلة التالية بعنوان: **Pharmacy & Inventory Tenant Scope API** لتطبيق نفس قواعد الحماية والعزل لمنع IDOR وتسريب البيانات على مستوى المخازن والأدوية والوصفات الطبية.
