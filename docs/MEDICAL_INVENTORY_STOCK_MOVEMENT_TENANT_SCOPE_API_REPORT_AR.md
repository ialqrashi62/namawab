# تقرير تأمين مسارات المخزون وحركات الصرف (Inventory & Stock Movement Tenant Scope API Report)

**التاريخ:** 2026-06-15  
**المرحلة:** Phase 13 — Inventory & Stock Movement Tenant Scope API  
**الحالة:** ✅ مكتمل بنسبة 100%  
**الملفات المُعدَّلة:** `namaweb/server.js`  
**الملفات الجديدة:** `namaweb/cross_tenant_inventory_test.js`  

---

## 1. الملخص التنفيذي

تم بحمد الله تطبيق وتفعيل نظام عزل المستأجرين (`tenant_id` / `facility_id` / `branch_id`) بالكامل على كافة نهايات الـ API المرتبطة بالمخزون الطبي وحركات صرف المستلزمات للأقسام (بإجمالي 11 مساراً)، بما يمنع تسريب البيانات بين المستأجرين (Cross-Tenant Data Leakage) ويحمى من ثغرات الوصول غير المصرح به (IDOR).

تم تشغيل سكربت اختبار محلي متكامل يحتوي على **36 اختباراً** للتحقق البنائي للأكواد ومحاكاة عمليات الإضافة والتعديل والحذف وطلب الصرف، وحققت جميع الاختبارات نجاحاً بنسبة 100% دون أي خطأ.

---

## 2. نطاق المرحلة ولماذا تم فصل المخزون عن المشتريات والموردين

* **نطاق المرحلة:** تأمين وعزل مسارات جلب وإضافة وتعديل وحذف عناصر المخزون العام (`inventory`) وتفاصيل الأصناف المخزنية (`inventory_items`) وطلبات الصرف للأقسام الطبية ومتابعة تفاصيلها واعتمادها مع الخصم التلقائي من المخزن.
* **سبب فصل المخزون عن المشتريات والموردين:**
  1. **التعقيد المالي واللوجستي:** مسارات الموردين والمشتريات والفواتير والاعتمادات المالية ترتبط بنظم محاسبية معقدة وحسابات دائنة تتطلب تدقيقاً منفصلاً، بينما حركات صرف المخزون الطبي داخل المستشفى تعد عمليات تشغيلية سريعة وموضعية.
  2. **تقليل نطاق التغيير وتأثيره:** يضمن فصلهما عدم تعطل مسارات المشتريات وعلاقات الموردين وتوريد الأدوية أثناء تطبيق قيود عزل المستأجرين.

---

## 3. الملفات التي تم فحصها وتعديلها

* **الملفات التي تم فحصها:**
  * [namaweb/server.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/server.js) — فحص وتحديد مسارات المخزون وحركات الصرف.
  * [namaweb/db_postgres.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/db_postgres.js) — التحقق من مخطط جداول المخزون الطبية والتفصيلية.
* **الملفات التي تم تعديلها:**
  * [namaweb/server.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/server.js) — عزل وتأمين 11 مساراً مع إضافة التحقق من الملكية لجميع عمليات التعديل والحذف والإضافة.
* **الملفات الجديدة:**
  * [namaweb/cross_tenant_inventory_test.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/cross_tenant_inventory_test.js) — سكربت اختبار محلي شامل للتأكد من بنية الحماية ومحاكاة العمليات.

---

## 4. مسارات المخزون وحركاته التي تم حمايتها

تم تأمين العمليات الحساسة عبر المسارات التالية:

### أ. مسارات المخزون العام (Dynamic Inventory)
1. `GET /api/inventory/low-stock` — تنبيهات المخزون المنخفض (تصفية بـ `tenant_id` مع تفعيل الـ ALTER التلقائي).
2. `GET /api/inventory` — عرض قائمة المخزون العام (تصفية بـ `tenant_id`).
3. `POST /api/inventory` — إضافة صنف مخزني (ختم `tenant_id` و `facility_id` وتفعيل `logAudit`).
4. `PUT /api/inventory/:id` — تعديل صنف مخزني (التحقق من ملكية الصنف ومنع IDOR مع تفعيل `logAudit`).
5. `DELETE /api/inventory/:id` — حذف صنف مخزني (التحقق من ملكية الصنف ومنع IDOR مع تفعيل `logAudit`).

### ب. مسارات تفاصيل الأصناف المخزنية (Inventory Items)
6. `GET /api/inventory/items` — عرض تفاصيل الأصناف النشطة (تصفية بـ `tenant_id`).
7. `POST /api/inventory/items` — إضافة تفاصيل صنف جديد (ختم `tenant_id` و `branch_id` وتفعيل `logAudit`).

### ج. مسارات طلبات صرف الأقسام (Department Requests)
8. `GET /api/dept-requests` — عرض طلبات الصرف للأقسام (تصفية بـ `tenant_id`).
9. `POST /api/dept-requests` — إنشاء طلب صرف للأقسام (التحقق أمنياً من أن كافة الأصناف `item_id` المطلوبة تنتمي للمستأجر الحالي لمنع IDOR، ثم ختم الهويات وتفعيل `logAudit`).
10. `GET /api/dept-requests/:id/items` — جلب تفاصيل عناصر طلب الصرف (التحقق من ملكية طلب الصرف الأب للمستأجر الحالي لمنع IDOR).
11. `PUT /api/dept-requests/:id` — تعديل حالة طلب الصرف (التحقق من ملكية طلب الصرف ومنع IDOR، وتخصيم الكميات فقط للأصناف التابعة لنفس المستأجر عند الاعتماد `Approved` مع تسجيل `logAudit`).

---

## 5. أمثلة من شروط الحماية (سليمة من الأسرار)

### أ. التحقق من ملكية الأصناف المطلوبة قبل إنشاء طلب الصرف (POST IDOR Check)
```javascript
if (tenantId && items && items.length) {
    for (const item of items) {
        const itemCheck = (await pool.query('SELECT id FROM inventory_items WHERE id=$1 AND tenant_id=$2', [item.item_id || 0, tenantId])).rows[0];
        if (!itemCheck) {
            return res.status(404).json({ error: `Item not found or access denied for item #${item.item_id}` });
        }
    }
}
```

### ب. قصر عملية التخصيم من المخزن عند الاعتماد على نفس المستأجر (Protected Stock Deduction)
```javascript
if (status === 'Approved') {
    const items = (await pool.query('SELECT * FROM inventory_dept_request_items WHERE request_id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows;
    for (const item of items) {
        const approved = item.qty_approved || item.qty_requested;
        await pool.query('UPDATE inventory_items SET stock_qty = GREATEST(stock_qty - $1, 0) WHERE id=$2 AND tenant_id=$3', [approved, item.item_id, tenantId]);
    }
}
```

---

## 6. نتائج اختبارات منع التسريب وفحوصات الصياغة

* **صياغة الأكواد (`node --check`):**
  * `node --check namaweb/server.js` ➔ ✅ ناجح
  * `node --check namaweb/db_postgres.js` ➔ ✅ ناجح

* **نتائج سكربت الاختبار (`node cross_tenant_inventory_test.js`):**
  * إجمالي الاختبارات: **36**
  * ناجحة: **36**
  * فاشلة: **0**
  * النتيجة: ✅ **ناجح بالكامل بنسبة 100%**

---

## 7. المسارات المؤجلة والمخاطر المتبقية

* **المسارات المؤجلة:**
  * مسارات الموردين والمشتريات والفواتير والطلبات المالية الخارجية.
  * لوحات التحكم والتقارير الإحصائية للمخازن.
* **المخاطر المتبقية:**
  1. عدم تفعيل RLS على مستوى قاعدة البيانات لجدول `inventory_items` وبقية جداول المخزون.
  2. عدم وجود قيود `NOT NULL` على أعمدة المستأجرين في جداول المخزون.

---

## 8. التوصية بالمرحلة التالية

**Reports & Dashboards Tenant Scope Audit**  
إجراء مراجعة وتدقيق شامل لجميع الاستعلامات التجميعية (Aggregate SQL Queries) في لوحات التحكم والتقارير المالية والتشغيلية والإدارية تمهيداً لعزلها ومنع أي تسريب للمعلومات الإحصائية بين المستأجرين.
