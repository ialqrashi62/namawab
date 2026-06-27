# تقرير تصميم مسودة سياسات أمان السجلات للتشغيل التجريبي (RLS Staging Policy Draft Report)
## نظام نما الطبي - تأمين وحوكمة فهارس الجداول السريرية والمالية

---

### 1. فلسفة تصميم السياسات الأمنية (Policy Design Philosophy)

تم تصميم سياسات Row-Level Security (RLS) لتعتمد كلياً على سياق الجلسة النشطة لقاعدة البيانات PostgreSQL والمعرف بمفتاح المستأجر `app.tenant_id`. تضمن هذه البنية الأمنية عزل بيانات كل جهة (Tenant) بالكامل على مستوى محرك قاعدة البيانات، مما يمنع ثغرات الوصول غير المصرح به وتداخل البيانات العرضي.

* **تجنب التعديلات الهيكلية**: يتم تطبيق السياسات بالاعتماد على المخطط الحالي دون الحاجة إلى تشغيل هجرات قاعدة بيانات (migrations) أو إحداث تغيير في أنواع البيانات.
* **الأمان الافتراضي (Fail-Safe)**: في حال عدم تعريف متغير الجلسة `app.tenant_id` (كأن تكون القيمة فارغة أو غير معينة)، تقوم السياسة بحجب كافة السجلات افتراضياً وإرجاع `0` صفوف كإجراء وقائي.

---

### 2. الكود البرمجي المقترح للسياسات (SQL Draft)

تم تجهيز الملفات الهيكلية للمرحلة وتخزينها تحت المسارات التالية:

1. **ملف التهيئة وتفعيل السياسات**:
   * المسار: [rls_staging_controlled_dry_run_setup.sql](docs/sql/rls_staging_controlled_dry_run_setup.sql)
   * الفكرة الأساسية:
     ```sql
     CREATE POLICY dry_run_patients_tenant_isolation ON patients
         FOR ALL
         USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
         WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
     ```
2. **ملف الفحص والتحقق الأمني**:
   * المسار: [rls_staging_controlled_dry_run_validation.sql](docs/sql/rls_staging_controlled_dry_run_validation.sql)
   * الحالات المختبرة: الاستعلام بهوية المستأجر المالك، الاستعلام بهوية مستأجر آخر (صفر نتائج)، الاستعلام بدون سياق، محاولة حقن سجل بمستأجر مخالف (فشل العملية).
3. **ملف التراجع والتنظيف**:
   * المسار: [rls_staging_controlled_dry_run_rollback.sql](docs/sql/rls_staging_controlled_dry_run_rollback.sql)
   * الفكرة الأساسية: تعطيل RLS وحذف السياسات الاستباقية لتصفير البنية الأمنية بعد التجربة.

---

### 3. مصفوفة التحقق المتوقعة (Expected Test Matrix)

* **الحالة 1 (المستأجر 1)**: إمكانية استعراض الـ 3 مرضى والـ 3 فواتير.
* **الحالة 2 (المستأجر 2)**: رؤية 0 سجلات (العزل نشط).
* **الحالة 3 (حقن مخالف)**: حدوث استثناء أمني لمنع كتابة سجل لمستأجر آخر `RLS policy violation`.
* **الحالة 4 (التراجع)**: استعادة وضع `RLS: DISABLED` واختفاء كافة السياسات.

---

### 4. محددات إغلاق المرحلة (Metadata Status)

STATUS:
MEDICAL_RLS_STAGING_POLICY_DRAFT_REPORT_COMPLETED
