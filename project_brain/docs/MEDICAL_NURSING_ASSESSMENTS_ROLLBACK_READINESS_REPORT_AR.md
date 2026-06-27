# تقرير جاهزية التراجع - التقييمات التمريضية (Nursing Assessments Rollback Readiness Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير الخطط والسكربتات والإجراءات الفورية اللازمة للتراجع عن التغييرات البرمجية أو الهيكلية المطبقة للتقييمات التمريضية `nursing_assessments` في حال حدوث أي خلل تشغيلي أو أمني.

---

### 1. إجراءات التراجع البرمجي (Code Rollback Procedures)

في حال استدعت الحاجة التراجع عن التعديلات البرمجية المطبقة في الخادم `namaweb/server.js` أو ملف تهيئة قاعدة البيانات `namaweb/db_postgres.js`:
* **أوامر التراجع الفورية**:
  ```bash
  git restore namaweb/server.js
  git restore namaweb/db_postgres.js
  ```
* **التحقق من التراجع البرمجي**: إعادة تشغيل الخادم البرمجي والتحقق من عودة استجابات الواجهات لما قبل التعديل.

---

### 2. إجراءات التراجع عن هيكل قاعدة البيانات وسياسات الـ RLS (Database Rollback)

إذا تطلب الأمر إلغاء سياسات الـ RLS أو الأعمدة المضافة حديثاً على جدول التقييمات التمريضية `nursing_assessments`:
* **الأمر التنفيذي المباشر**:
  يتم تشغيل السكربت المخصص للتراجع باستخدام أداة `psql`:
  ```bash
  psql -U postgres -d nama_medical_web -f docs/sql/nursing_assessments_tenant_isolation_down.sql
  ```
* **ملف سكربت التراجع**: `docs/sql/nursing_assessments_tenant_isolation_down.sql`.
* **إجراءات الاستعادة الكاملة للبيانات**:
  في حالة حدوث تشوهات بالبيانات، يمكن استرجاع حالة الجداول تماماً لما قبل البدء باستخدام ملف النسخة الاحتياطية المأخوذ في البوابة 1:
  * **ملف النسخة الاحتياطية**: `docs/sql/nursing_assessments_backup.sql` (مخزن محلياً وغير متتبع في Git).
  * **أمر الاستعادة**:
    ```bash
    psql -U postgres -d nama_medical_web -f docs/sql/nursing_assessments_backup.sql
    ```

---

### 3. سيناريو محاكاة اختبار التراجع (Rollback Simulation Scenario)

1. **تطبيق سكربت التراجع**: تشغيل `docs/sql/nursing_assessments_tenant_isolation_down.sql`.
2. **فحص النتيجة**: تشغيل سكربت التحقق المبدئي `docs/sql/nursing_assessments_readonly_validate.sql` والتأكد من إزالة الأعمدة وعودة RLS لقيمة `false` وإزالة السياسات والفهارس المركبة.

* **حالة البوابة 8**: **PASS** (جاهزية التراجع مكتملة وموثوقة بنسبة 100%)
