# تقرير التغييرات البنائية والأمنية - الدفعة الثانية (Batch 2 Schema Change Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير حالة مخطط قاعدة البيانات والتعديلات الهيكلية والأمنية التي طرأت في هذه المرحلة.

---

### 1. تصنيف التغييرات البنائية والأمنية (Schema & Security Classification)
- **TABLE_COLUMN_SCHEMA_CHANGED**: `NO` (لم يتم إضافة أو حذف أو تعديل أي جداول أو أعمدة هيكلية؛ حيث كانت الأعمدة `tenant_id` و `branch_id`/`facility_id` متوفرة مسبقاً في قاعدة البيانات).
- **DATABASE_SECURITY_DDL_CHANGED**: `YES` (تم إدخال وتعديل سياسات RLS وفهارس الأداء كـ DDL أمني).
- **RLS_POLICIES_CHANGED**: `YES` (تم إنشاء وتفعيل سياسات Row-Level Security جديدة على جدولي `admissions` و `bed_transfers`).
- **INDEXES_CREATED**: `YES` (تم إنشاء الفهرس المركب `idx_bed_transfers_tenant_branch` لجدول حركة نقل الأسرة).

### 2. الفهارس والتعديلات الأمنية بالتفصيل (DDL Modifications)
1. **إنشاء فهرس أداء عزل نقل الأسرة**:
   - `CREATE INDEX IF NOT EXISTS idx_bed_transfers_tenant_branch ON bed_transfers (tenant_id, branch_id);`
   - **الهدف**: تسريع عمليات الفحص والبحث الفلترية لحركات الأسرة بناءً على سياق المستأجر النشط وفروعه.
2. **تفعيل Row-Level Security**:
   - `ALTER TABLE admissions ENABLE ROW LEVEL SECURITY; ALTER TABLE admissions FORCE ROW LEVEL SECURITY;`
   - `ALTER TABLE bed_transfers ENABLE ROW LEVEL SECURITY; ALTER TABLE bed_transfers FORCE ROW LEVEL SECURITY;`

### 3. قرارات الأوتو بايلوت والجاهزية (Autopilot Decisions)
- **DB_CHANGED**: `YES` (بسبب إدخال سياسات RLS وفهرس الأداء الجديد).
- **MIGRATIONS_RUN**: `YES` (تم تشغيل سكربت الهجرة بنجاح).
- **DB_PUSH_RUN**: `NO` (ممنوع في بيئة Staging لحماية المخطط).
- **PRODUCTION_READY**: `NO` (النظام لا يزال في مرحلة Staging التجريبية والمحمية).
