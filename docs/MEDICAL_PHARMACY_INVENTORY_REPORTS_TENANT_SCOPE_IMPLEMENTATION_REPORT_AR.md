# تقرير تطبيق عزل تقارير الصيدلية والمخزون الطبي ومنع التسريب (Pharmacy & Inventory Reports Tenant Scope Implementation Report)

**التاريخ:** 2026-06-15  
**المرحلة:** Phase 21 — Pharmacy & Inventory Reports Tenant Scope Implementation  
**الحالة:** ✅ مكتمل بنسبة 100%  
**الملفات المُعدَّلة:** `namaweb/server.js`  
**الملفات الجديدة:** `namaweb/cross_tenant_pharmacy_inventory_reports_test.js`  

---

## 1. الملخص التنفيذي

تم بحمد الله تطبيق وتفعيل نظام عزل المستأجرين (`tenant_id` / `facility_id` / `branch_id`) بالكامل على تقارير الصيدلية والمخزون التفصيلية والتجميعية والأصناف وقوائم الأدوية في خادم التطبيق [server.js](server.js) (بإجمالي 26 مساراً). يمنع هذا العزل تسريب مبيعات الصيدلية وأرصدة المخزون وحركات الاستهلاك والتحويل والوصفات الطبية بين المستأجرين (Cross-Tenant Data Leakage)، كما يعالج كافة مخاطر الوصول المباشر غير المصرح به (IDOR).

تم بناء وتشغيل سكربت اختبار محلي متكامل يحتوي على **49 فحصاً برمجياً** للتحقق البنائي والمحاكاة لعمليات الاستعلام والتقارير والتجميعات، وحققت جميع الفحوصات نجاحاً كاملاً بنسبة 100%.

---

## 2. نطاق المرحلة ولماذا تم حصر النطاق على تقارير الصيدلية والمخزون الحالية

* **نطاق المرحلة:** تأمين كافة مسارات جلب وعرض وتعديل وحذف كتالوج الأدوية، طابور الصيدلية، الوصفات الطبية (الديناميكية والثابتة)، مخزون الأدوية وتنبيهات النقص وانتهاء الصلاحية، سجل حركات مخزن الأدوية (stock-log)، والمخزون العام ومستلزماته التفصيلية وتنبيهاته.
* **لماذا تم حصر النطاق:**
  1. **الالتزام بحدود التقارير الحالية:** تم تجنب إدخال أي هياكل جديدة أو مسارات غير مدعومة حالياً للحفاظ على استقرار العمليات.
  2. **حظر الموردين والمشتريات الخارجية:** تم إخراج الموردين وأوامر الشراء وفواتير الموردين من النطاق مؤقتاً لتجنب تعقيدات الحسابات الدائنة الخارجية في هذه المرحلة المحورية.
  3. **عزل الحركات الموضعية:** تصفية الحركات اللوجستية الموضعية للمخزون والصيدلية يضمن حماية الخصوصية التجارية والتشغيلية للمستأجرين على أكمل وجه.

---

## 3. الملفات التي تم فحصها وتعديلها

* **الملفات التي تم فحصها:**
  * [namaweb/server.js](server.js) — تحديد وتأمين مسارات الصيدلية والمخزون وقوائم التقارير.
  * [namaweb/db_postgres.js](db_postgres.js) — فحص مخطط الجداول والتأكد من وجود أعمدة `tenant_id` و `branch_id` و `facility_id` لجميع الجداول المستهدفة.
* **الملفات التي تم تعديلها:**
  * [namaweb/server.js](server.js) — تأمين 26 مساراً للصيدلية والمخزون والأصناف والوصفات بـ `requireTenantScope` وفلاتر العزل.
* **الملفات الجديدة:**
  * [namaweb/cross_tenant_pharmacy_inventory_reports_test.js](cross_tenant_pharmacy_inventory_reports_test.js) — سكربت اختبار موضعي شامل للتأكد من بنية الحماية ومحاكاة التقرير التجميعي.

---

## 4. المسارات والجداول المستهدفة وتطبيق الفلاتر

تم تأمين نهايات API الـ 26 بالكامل كالتالي:

| المسار (API Route) | نوع التقرير / العملية | الجداول المستخدمة | هل أضيف فلتر المستأجر؟ | فلاتر العزل المضافة |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/pharmacy/drugs` (مكرر) | كتالوج الأدوية | `pharmacy_drug_catalog` | ✅ نعم | `tenant_id = $1` |
| `GET /api/pharmacy/low-stock` | تنبيهات المخزون المنخفض | `pharmacy_drug_catalog` | ✅ نعم | `tenant_id = $1` |
| `POST /api/pharmacy/drugs` (مكرر) | إضافة دواء للكتالوج | `pharmacy_drug_catalog` | ✅ نعم | ختم `tenant_id` و `branch_id` |
| `GET /api/pharmacy/queue` (مكرر) | طابور الصرف بالصيدلية | `pharmacy_prescriptions_queue` | ✅ نعم | `tenant_id = $1` |
| `PUT /api/pharmacy/queue/:id` (مكرر) | صرف الوصفات وصرف الدواء | `pharmacy_prescriptions_queue`, `invoices`, `patients` | ✅ نعم | تحقق `tenant_id` من سياق الجلسة قبل التحديث لمنع IDOR |
| `GET /api/inventory/items` | تفاصيل أصناف المخزون | `inventory_items` | ✅ نعم | `tenant_id = $1` |
| `POST /api/inventory/items` | إضافة تفاصيل صنف مخزن | `inventory_items` | ✅ نعم | ختم `tenant_id` و `branch_id` |
| `GET /api/prescriptions` | عرض الوصفات الطبية | `prescriptions`, `patients` | ✅ نعم | تحقق المريض + `tenant_id = $N` |
| `POST /api/prescriptions` (مكرر) | إنشاء وصفة طبية | `prescriptions`, `patients`, `pharmacy_prescriptions_queue`, `invoices` | ✅ نعم | تحقق المريض + ختم `tenant_id` و `facility_id` |
| `GET /api/print/prescription/:id` | طباعة وصفة طبية تفصيلية | `prescriptions`, `patients` | ✅ نعم | تحقق ملكية الوصفة والمريض بـ `tenant_id` |
| `POST /api/pharmacy/deduct-stock` | خصم كميات الأدوية | `pharmacy_drug_catalog`, `patients`, `prescriptions`, `pharmacy_stock_log` | ✅ نعم | تحقق ملكية الدواء والمريض والوصفة لـ `tenant_id` |
| `GET /api/pharmacy/expiring` | تنبيهات الأدوية قاربة الانتهاء | `pharmacy_drug_catalog` | ✅ نعم | `tenant_id = $2` |
| `GET /api/pharmacy/stock-log` | سجل حركات مخزن الصيدلية | `pharmacy_stock_log`, `pharmacy_drug_catalog` | ✅ نعم | ربط `JOIN` مع الكتالوج لفلترة `dc.tenant_id = $1` |
| `GET /api/inventory/low-stock` | تنبيهات نقص مستلزمات المخزن | `inventory` | ✅ نعم | `tenant_id = $1` |
| `GET /api/inventory` | المخزون العام | `inventory` | ✅ نعم | `tenant_id = $1` |
| `POST /api/inventory` | إضافة صنف للمخزون العام | `inventory` | ✅ نعم | ختم `tenant_id` و `facility_id` |
| `PUT /api/inventory/:id` | تعديل صنف بالمخزون | `inventory` | ✅ نعم | تحقق `tenant_id` قبل التحديث لمنع IDOR |
| `DELETE /api/inventory/:id` | حذف صنف من المخزون | `inventory` | ✅ نعم | تحقق `tenant_id` قبل الحذف لمنع IDOR |
| `GET /api/pharmacy/prescriptions` | الوصفات الديناميكية | `pharmacy_prescriptions` | ✅ نعم | `tenant_id = $1` |
| `POST /api/pharmacy/prescriptions` | إضافة وصفة ديناميكية | `pharmacy_prescriptions`, `patients` | ✅ نعم | تحقق المريض + ختم `tenant_id` و `facility_id` |
| `PUT /api/pharmacy/prescriptions/:id` | تحديث وصفة ديناميكية | `pharmacy_prescriptions` | ✅ نعم | تحقق `tenant_id` قبل التحديث لمنع IDOR |

---

## 5. منع التسريب في Aggregates والتعامل مع الجداول غير الجاهزة

1. **منع تسريب البيانات الإحصائية (Aggregates):**
   * تم تعديل تنبيهات المخزون المنخفض (`pharmacy/low-stock` و `inventory/low-stock`) والأدوية منتهية الصلاحية لتقوم بحساب الأرصدة والكميات والتنبيهات المجمعة فقط للأصناف التابعة لنفس المستأجر بناءً على سياق `tenant_id` الموثق في الجلسة.
2. **التعامل مع الجداول غير الجاهزة (مثل `pharmacy_stock_log`):**
   * نظراً لأن جدول سجل الحركات `pharmacy_stock_log` لا يحتوي بشكل مباشر على حقل المستأجر، فقد تم تأمينه بنجاح باستخدام عملية ربط آمنة `JOIN` مع جدول كتالوج الأدوية `pharmacy_drug_catalog` كالتالي:
     ```javascript
     SELECT sl.* FROM pharmacy_stock_log sl 
     JOIN pharmacy_drug_catalog dc ON sl.drug_id = dc.id 
     WHERE dc.tenant_id = $1 
     ORDER BY sl.created_at DESC LIMIT 200
     ```
     يضمن هذا الحل عزل البيانات بنسبة 100% دون كسر التقرير ودون الحاجة لتعديل مخطط الجدول إنشائياً.

---

## 6. نتائج الاختبارات وفحص سلامة الأكواد

* **فحص سلامة الأكواد ونحويتها (`node --check`):**
  * خادم Express: `node --check namaweb/server.js` ➔ ✅ ناجح
  * مخطط الجداول: `node --check namaweb/db_postgres.js` ➔ ✅ ناجح

* **نتائج سكربت الاختبار الأمني (`node namaweb/cross_tenant_pharmacy_inventory_reports_test.js`):**
  * إجمالي الاختبارات التشخيصية والمحاكاة: **49**
  * اختبارات ناجحة: **49**
  * اختبارات فاشلة: **0**
  * النتيجة: ✅ **ناجح بالكامل بنسبة 100%**

---

## 7. المخاطر المتبقية وتوصية المرحلة التالية

* **المخاطر المتبقية:**
  1. **المشتريات والموردين:** لم يعالج نطاق الموردين والمشتريات الخارجية والاعتمادات المالية بعد.
  2. **غياب RLS (Row-Level Security):** لم يتم تشغيل RLS على قاعدة البيانات للحد من تسريب البيانات في حال حدوث تجاوز برمجي مستقبلي.
* **توصية المرحلة التالية:** 
  **RLS Local Design & Dry-Run Plan**  
  تصميم وصياغة مخطط أمان قاعدة البيانات على مستوى الصف (RLS) محلياً وإجراء تشغيل تجريبي جاف (Dry-Run) دون تنشيطه إنتاجياً أو تعديل البنية التحتية الفعلية.
