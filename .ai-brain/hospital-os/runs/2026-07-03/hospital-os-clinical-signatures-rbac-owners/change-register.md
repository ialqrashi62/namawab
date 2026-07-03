# سجل التغييرات (Change Register)

سجل تفصيلي بكافة التغييرات التي تمت على الملفات والمكونات البرمجية.

## الملفات المعدلة والمضافة

### 1. [server.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/server.js)
* **الموقع**: السطر 23 والسطر 458 والسطر 4125 والسطر 7316 والسطر 12825 والسطر 14229 والسطر 17273.
* **التعديل**:
  - نقل وتأسيس حارس الصلاحيات الديناميكي `requirePermission` إلى أعلى الملف.
  - دمج وتوحيد مسار قفل السجل الطبي `POST /api/clinical/records/:id/lock` وتطبيق حدود الأدوار الطبية وحقوق التوقيع السريري.
  - حذف المسار المكرر الثاني عند السطر 17209 لمنع التعارض.
  - إضافة حارس `requirePermission` على مسارات إلغاء العمليات (`or:cancel`) وإلغاء الفواتير (`invoices:cancel`) وحذف الرسائل (`messages:delete`).

### 2. [db_postgres.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/db_postgres.js)
* **الموقع**: السطر 496.
* **التعديل**: إضافة عمود `owner_role` لجدول `clinical_departments` بالبنية التأسيسية.

### 3. [DEPLOY_RUN.sh](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/DEPLOY_RUN.sh)
* **الموقع**: السطر 201-204.
* **التعديل**: إدراج الهجرة الجديدة `p1_03_department_owners` ضمن سيناريو التشغيل والتحقق التلقائي.

### 4. [p1_03_department_owners_up.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/p1_03_department_owners_up.sql) [NEW]
* **الوصف**: هجرة قاعدة البيانات لإنشاء حقل الملاك وتحديث الأقسام الحالية بالقيم المناسبة.

### 5. [p1_03_department_owners_down.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/p1_03_department_owners_down.sql) [NEW]
* **الوصف**: التراجع عن هجرة مصفوفة ملاك الأقسام.

### 6. [p1_03_department_owners_validate.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/p1_03_department_owners_validate.sql) [NEW]
* **الوصف**: فحص وتأكيد نجاح الترحيل ووجود العمود وخلو الأقسام من الملاك غير المعرفين.

### 7. [cross_tenant_clinical_signatures_test.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/cross_tenant_clinical_signatures_test.js) [NEW]
* **الوصف**: اختبار أمان تلقائي شامل للتحقق من تكامل السجلات، حواجز التوقيع السريري، وحراس الصلاحيات.
