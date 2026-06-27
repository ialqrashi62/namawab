# تقرير التغييرات البرمجية لمسارات الـ API (API Change Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوضح هذا التقرير التعديلات البرمجية التي أجريت على ملف `namaweb/server.js` لتطبيق نموذج تخصيص الأسعار وقوالب الأشعة لكل مستأجر وإصلاح مسارات API التالفة.

### 1. إصلاح المسارات التالفة وتسجيلها
تم استبدال المسارات الأربعة المكررة والمقيدة بمسار واحد تالف (`/api/catalog/`) بمسارات واضحة ومتطابقة مع استدعاءات واجهة المستخدم:
- **تحاليل المختبر**:
  - `GET /api/catalog/lab` -> لجلب كافة تحاليل المختبر.
  - `PUT /api/catalog/lab/:id` -> لتحديث وتخزين السعر المخصص للمستأجر الحالي.
- **إجراءات الأشعة**:
  - `GET /api/catalog/radiology` -> لجلب إجراءات الأشعة مع قوالب التقارير المخصصة.
  - `PUT /api/catalog/radiology/:id` -> لتحديث وتخزين السعر و/أو قالب التقرير المخصص للمستأجر.

### 2. دمج جداول التخصيص (LEFT JOIN Implementation)
تم تحديث الاستعلامات في المسارات التالية لتستخدم الدمج الخارجي الأيسر لترجيح السعر وقالب التقرير المخصص على القيم العالمية الافتراضية:
- `GET /api/catalog/lab` و `GET /api/lab/catalog`
- `GET /api/catalog/radiology` & `GET /api/radiology/catalog`
- `GET /api/medical/services` & `PUT /api/medical/services/:id`

مثال الاستعلام المعتمد في التطبيق:
```sql
SELECT 
    lt.id, 
    lt.test_name, 
    lt.category, 
    lt.normal_range, 
    COALESCE(o.custom_price, lt.price) AS price,
    COALESCE(o.is_active, 1) AS is_active
FROM lab_tests_catalog lt
LEFT JOIN tenant_lab_test_overrides o 
  ON lt.id = o.test_id AND o.tenant_id = $1
ORDER BY lt.category, lt.test_name;
```

### 3. تعديل التسعير التلقائي للطلبات
تم تحديث مسارات إنشاء الطلبات لضمان استرجاع الأسعار المخصصة للمستأجر الحالي عند إنشاء الطلب بأسماء الفحوصات الطبية:
- `POST /api/lab/orders` -> استعلام السعر التلقائي المدمج بـ `tenant_lab_test_overrides`.
- `POST /api/radiology/orders` -> استعلام السعر التلقائي المدمج بـ `tenant_radiology_overrides`.
  
بذلك تم توفير عزل برمي كامل وحماية الأسعار من التغيير المشترك.
