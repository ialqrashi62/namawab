# تقرير قرار خطة التفعيل التدريجي لـ RLS (Gradual RLS Enablement Decision Report)
## نظام نما الطبي - تأمين وحوكمة قواعد البيانات الطبية وعزل المرضى

---

### 1. القرار الاستراتيجي النهائي (Strategic Decision Status)

بناءً على النجاح التام للتشغيل التجريبي الخاضع للمراقبة (Controlled Dry Run) على خادم الاستضافة الاستباقية (Staging Server) وتمرير كافة الفحوصات الأمنية والسريرية العشرة بنجاح بنسبة 100% دون أي انكسار أو آثار جانبية في المنصة، فإن القرار الرسمي هو:

**READY_FOR_GRADUAL_RLS_ENABLEMENT**
*(جاهز للتفعيل التدريجي لسياسات أمان السجلات مع اتباع المبادئ التوجيهية المحددة أدناه).*

---

### 2. خطة التفعيل والجدولة للجداول (Enablement Batches Roadmap)

لضمان سلامة خادم الإنتاج وتجنب حدوث أي اضطراب في العمليات الطبية اليومية، سيتم تقسيم الجداول لتفعل تدريجياً عبر دفعات متتالية:

#### الدفعة الأولى (Batch 1) - الجداول الطبية الحساسة (المنفذة تجريبياً):
* **الجداول**: `patients` (المرضى)، `appointments` (المواعيد)، `invoices` (الفواتير).
* **الحالة**: مؤهلة فوراً للتفعيل النهائي الدائم، حيث تم تدقيقها بالكامل والتأكد من عدم وجود قيم فارغة (`NULL`) في هوية المستأجر.

#### الدفعة الثانية (Batch 2) - العمليات السريرية وقسم التمريض وطابور الانتظار:
* **الجداول**: `waiting_queue`, `nursing_vitals`, `medical_records`, `prescriptions`, `lab_radiology_orders`.
* **المتطلبات قبل التفعيل**: مراجعة شاملة لربط الجلسات في الاستعلامات المركبة والتأكد من استخدام سياق المعاملات `withTenantTransaction`.

#### الدفعة الثالثة (Batch 3) - الصيدلية والمخازن والخدمات اللوجستية:
* **الجداول**: `medications`, `pharmacy_prescriptions_queue`, `pharmacy_drug_catalog`, `inventory_items`, `inventory_opening_balances`.
* **الحالة**: مؤجلة جزئياً لحين تدقيق مسارات الربط اللوجستي متعدد الفروع وتوحيد فهارس الأدوية العامة التي لا تتأثر بـ RLS (Bypass RLS for General Catalogs).

#### الدفعة الرابعة (Batch 4) - الشؤون المالية والموارد البشرية وحوكمة النظام:
* **الجداول**: `hr_employees`, `hr_salaries`, `finance_chart_of_accounts`, `finance_journal_entries`, `finance_journal_lines`.
* **الحالة**: مؤجلة لحين تفعيل الصلاحيات المعقدة للمشرفين والمراجعين الماليين الذين يحتاجون صلاحيات استعراض متعدد المستأجرين (Bypass Policies or Audit Role).

---

### 3. نقاط ومسارات الواجهات (Endpoints) التي تحتاج لغلاف المعاملة (Transaction Wrapper)

يجب تعديل الواجهات والاتصالات التي تستخدم الاستعلامات المباشرة دون إطار المعاملة لتمرير متغير الجلسة عبر المعاملة:
* **نقاط فحص الدخول**: `/api/auth/login` و `/api/auth/logout`.
* **واجهات لوحة التحكم الرئيسية**: `/api/dashboard/stats` التي تجمع البيانات من عدة جداول.
* **واجهات التقارير الطبية والمالية**: التي تعتمد على استعلامات تجميعية ضخمة (COUNT/SUM) لضمان ربط `SET LOCAL app.tenant_id` بالمعاملة النشطة مباشرة وعدم تسرب قيم الجلسات عبر الاتصالات المشتركة (Connection Pooling).

---

### 4. تحليل المخاطر والاستراتيجيات الوقائية (Risk Assessment & Mitigation)

* **خطر انقطاع الجلسة أو إعادة الاستخدام (Connection Pooling Leak)**:
  * *الأثر*: قد يرى مستخدم مستأجر أخر بيانات غير مصرح بها في حال أعاد الاتصال استخدام جلسة سابقة دون إعادة ضبط سياق المعاملة.
  * *الوقاية*: استخدام `SET LOCAL` حصراً داخل معاملات قصيرة العمر تنتهي تلقائياً بـ `COMMIT` أو `ROLLBACK` وعدم استخدام `SET` العام على الاتصال.
* **خطر وجود صفوف يتيمة بدون معرف مستأجر (Orphaned Rows)**:
  * *الأثر*: حجب السجلات التي تفتقد `tenant_id` بالكامل عن كافة الواجهات الطبية.
  * *الوقاية*: تشغيل فحص جاهزية البيانات الدوري (Readiness Audit) وإلحاق هويات المستأجرين مسبقاً (Backfill Scripts) مع وضع قيود منع القيمة الفارغة `NOT NULL` لاحقاً.

---

### 5. خطة الاستعادة والتراجع للإنتاج والاستضافة (Rollback Strategy)

في حالة حدوث عطل إنتاجي بعد تفعيل RLS بشكل دائم:
1. **التعطيل الفوري**: تشغيل أوامر التعطيل السريع عبر SQL دون الحاجة لإعادة نشر التطبيق:
   ```sql
   ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
   ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
   ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
   ```
2. **استعادة النسخة الاحتياطية**: استخدام نسخة ما قبل الدفعة والتي تم الاحتفاظ بها بشكل آمن وفق خطة الاستعادة المعتمدة [MEDICAL_RLS_STAGING_BACKUP_AND_RESTORE_PLAN_AR.md](docs/MEDICAL_RLS_STAGING_BACKUP_AND_RESTORE_PLAN_AR.md).

---

### 6. مخرجات الرصد والمتابعة (Monitoring & Audit Protocols)

* **تتبع الفشل (Audit on Access Denied)**: تفعيل المراقبة لجميع المحاولات الفاشلة للوصول إلى البيانات أو العمليات المرفوضة بسبب سياسات RLS عبر نظام سجلات النوافذ (PostgreSQL Audit Logs - `pgAudit`).
* **تخطي الحسابات الخدمية (Service Role Bypass)**: السماح للمهام الخلفية لجدولة المهام والنسخ الاحتياطي بالعمل كأدوار متخطية (BYPASSRLS) لضمان عدم تعطل العمليات الخدمية التلقائية.

---

### 7. محددات القرار النهائي (Decision Metadata)

```yaml
STATUS:
  MEDICAL_RLS_GRADUAL_ENABLEMENT_DECISION_COMPLETED

DECISION:
  READY_FOR_GRADUAL_RLS_ENABLEMENT

QUALIFIED_TABLES:
  - patients
  - invoices
  - appointments

DEFERRED_TABLES:
  - hr_employees
  - finance_chart_of_accounts
  - pharmacy_drug_catalog

BACKFILL_REQUIRED:
  NO_STAGING_IS_CLEAN

AUDIT_LOGGING_RECOMMENDED:
  YES
```
