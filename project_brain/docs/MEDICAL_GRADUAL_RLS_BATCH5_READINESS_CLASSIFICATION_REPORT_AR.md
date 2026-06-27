# تقرير تصنيف الجاهزية الأمنية لجداول قاعدة البيانات - Batch 5 (Readiness Classification Report)
## نظام نما الطبي (NamaMedical)

تصنيف الجداول الطبية والتشغيلية المتبقية حسب مستوى الجاهزية للتفعيل المباشر لـ RLS دون تعديل هيكلي.

---

### 1. جداول الفئة أ: جاهزة للتفعيل الفوري (Ready for Immediate Enablement)

هي الجداول التي تحتوي على عمود معرف المستأجر `tenant_id` ولا تحتوي على أي سجلات معلقة أو مفقودة التبعية:

* **[emergency_beds](docs/sql/rls_staging_batch5_enable_without_schema_change.sql)**: يحتوي على 8 سجلات تابعة للمستأجر `1`.
* **[pharmacy_sales](docs/sql/rls_staging_batch5_enable_without_schema_change.sql)**: فارغ من البيانات (0 سجلات)، العمود متاح.
* **[pharmacy_sale_items](docs/sql/rls_staging_batch5_enable_without_schema_change.sql)**: فارغ من البيانات (0 سجلات)، العمود متاح.

---

### 2. جداول الفئة ب: مؤجلة لتقليص حجم الدفعة (Deferred to Limit Batch Size)

جداول تحتوي على العمود ومطابقة للشروط، ولكن تم تأجيلها للحفاظ على استقرار النظام وتقليص المخاطر:

* **[beds](docs/sql/tenant_id_backfill_design_draft.sql)**: يحتوي على 95 سجلاً كلها للمستأجر `1`. تم تأجيله لدفعة قادمة.
* **[bed_transfers](docs/sql/tenant_id_backfill_design_draft.sql)**: يحتوي على 0 سجلات ولكنه مؤجل مع جدول الأسرة لضمان الترابط الهيكلي.

---

### 3. جداول الفئة ج: مؤجلة لعدم توفر العمود أو البنية المشتركة (Deferred - No tenant_id or Shared)

جداول لا يمكن تفعيل RLS عليها حالياً وتتطلب مراجعة أو خطة إضافة العمود والتعبئة لاحقاً:

* **[medications](docs/sql/tenant_id_backfill_design_draft.sql)**: كتالوج الأدوية الطبي - لا يحتوي على `tenant_id` (جدول عام مشترك).
* **[lab_samples](docs/sql/tenant_id_backfill_design_draft.sql)**: عينات المختبر - لا يحتوي على `tenant_id` حالياً.
* **[lab_tests_catalog](docs/sql/tenant_id_backfill_design_draft.sql)**: كتالوج فحوصات المختبر المشترك - لا يحتوي على `tenant_id`.
* **[radiology_catalog](docs/sql/tenant_id_backfill_design_draft.sql)**: كتالوج فحوصات الأشعة المشترك - لا يحتوي على `tenant_id`.
