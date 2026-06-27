# مصفوفة قرارات تفعيل RLS لقسم العمليات - موديول العمليات
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا المستند مصفوفة القرارات الفنية الخاصة بتفعيل حماية مستوى الصف (Row-Level Security) وعلاقتها بالبنية الإنشائية لقاعدة البيانات لكل جداول العمليات وغرف العمليات.

---

### 1. مصفوفة القرارات لتفعيل RLS (RLS Decision Matrix)

توضح المصفوفة التالية القرارات المعتمدة لكل جدول في موديول العمليات:

| اسم الجدول | وجود أعمدة العزل | حالة RLS الحالية | القرار التصميمي المعتمد | الفهارس المقترحة (Proposed Indexes) | الحاجة لتعبئة البيانات (Backfill) |
| :--- | :---: | :---: | :---: | :--- | :---: |
| `surgeries` | نعم (`tenant_id`, `facility_id`) | Disabled | **ENABLE_LATER** & **NEEDS_INDEX** | موجود (`idx_surgeries_tenant_facility`) | لا (0 صفوف) |
| `surgery_preop_assessments` | نعم (`tenant_id`, `facility_id`) | Disabled | **ENABLE_LATER** & **NEEDS_INDEX** | `idx_surgery_preop_assessments_tenant_facility` | لا (0 صفوف) |
| `surgery_preop_tests` | نعم (`tenant_id`, `facility_id`) | Disabled | **ENABLE_LATER** & **NEEDS_INDEX** | `idx_surgery_preop_tests_tenant_facility` | لا (0 صفوف) |
| `surgery_anesthesia_records` | نعم (`tenant_id`, `facility_id`) | Disabled | **ENABLE_LATER** & **NEEDS_INDEX** | `idx_surgery_anesthesia_records_tenant_facility` | لا (0 صفوف) |
| `operating_rooms` | نعم (`tenant_id`, `branch_id`) | Disabled | **ENABLE_LATER** & **NEEDS_INDEX** | `idx_operating_rooms_tenant_branch` | لا (الصفوف الأربعة معبأة بالكامل بـ `tenant_id=1` و `branch_id=1`) |
| `consent_forms` | نعم (`tenant_id`, `facility_id`) | Disabled | **ENABLE_LATER** & **NEEDS_INDEX** | `idx_consent_forms_tenant_facility` | لا (0 صفوف) |

---

### 2. مبررات القرارات الهندسية (Design Decisions Rationale)

1. **القرار `ENABLE_LATER`**:
   - تم اتخاذ هذا القرار لكافة الجداول لأن قاعدة البيانات الفعالة على بيئة Staging يجب ألا تتأثر بأي تغييرات إنشائية (DDL) أو تفعيل للسياسات الأمنية في مرحلة التصميم والتحليل الحالية، وسيتم تنفيذ هذا التفعيل رسمياً في مرحلة التطبيق اللاحقة.
2. **القرار `NEEDS_INDEX`**:
   - لضمان الأداء الفائق والسرعة الفنية بعد تفعيل RLS وتصفية البيانات الأمنية على خادم PostgreSQL، يجب إنشاء فهارس مركبة (B-Tree Composite Indexes) تربط `tenant_id` بـ `facility_id` أو `branch_id` لتجنب عمليات المسح الكامل للجداول (Sequential Scan).

---

### 3. الصياغة الفنية لسياسات RLS المقترحة (Proposed RLS Policy Code)

عند الانتقال لمرحلة التطبيق الفعلي، سيتم تفعيل السياسات التالية:

```sql
-- 1. جدول surgeries
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_surgeries_tenant_isolation ON surgeries
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 2. جدول surgery_preop_assessments
ALTER TABLE surgery_preop_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_preop_assessments FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_preop_assessments_tenant_isolation ON surgery_preop_assessments
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. جدول surgery_preop_tests
ALTER TABLE surgery_preop_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_preop_tests FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_preop_tests_tenant_isolation ON surgery_preop_tests
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. جدول surgery_anesthesia_records
ALTER TABLE surgery_anesthesia_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_anesthesia_records FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_anesthesia_records_tenant_isolation ON surgery_anesthesia_records
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 5. جدول operating_rooms
ALTER TABLE operating_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_rooms FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_operating_rooms_tenant_isolation ON operating_rooms
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 6. جدول consent_forms
ALTER TABLE consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_forms FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_consent_forms_tenant_isolation ON consent_forms
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
```

> [!WARNING]
> يُمنع منعاً باتاً تشغيل أو كتابة هذه الأوامر في قاعدة البيانات في الوقت الحالي. هذا التقرير مخصص للتصميم والتوثيق والتحضير فقط.
