# مصفوفة قرارات تفعيل RLS للعناية والتمريض - الدفعة الرابعة (ICU & Nursing RLS Decision Matrix)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا المستند مصفوفة القرارات الخاصة بتفعيل حماية مستوى الصف (Row-Level Security) وعلاقتها بالهيكل الإنشائي لقاعدة البيانات لكل جداول الدفعة الرابعة.

---

### 1. مصفوفة القرارات لتفعيل RLS (RLS Decision Matrix)

| اسم الجدول | الحالة الحالية للـ RLS | القرار الأمني المستهدف | الفهارس المطلوبة (New Indexes) | الحاجة لهجرة البيانات (Backfill) |
| :--- | :---: | :---: | :--- | :---: |
| `nursing_vitals` | Enabled | **ENABLE_FORCE_RLS** | موجود | لا |
| `nursing_care_plans` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_nursing_care_plans_tenant_facility` | لا |
| `nursing_assessments` | Disabled | **NEEDS_DDL_THEN_RLS** | `idx_nursing_assessments_tenant_facility` (بعد إضافة الأعمدة) | لا |
| `icu_monitoring` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_icu_monitoring_tenant_facility` | لا |
| `icu_ventilator` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_icu_ventilator_tenant_facility` | لا |
| `icu_scores` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_icu_scores_tenant_facility` | لا |
| `icu_fluid_balance` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_icu_fluid_balance_tenant_facility` | لا |
| `emar_orders` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_emar_orders_tenant_facility` | لا |
| `emar_administrations` | Disabled | **ENABLE_RLS_AND_FORCE** | `idx_emar_administrations_tenant_facility` | لا |

---

### 2. متطلبات الأعمدة والفهارس الإنشائية (Columns and Indexes Requirements)

1. **إضافة الأعمدة المفقودة (DDL)**:
   - يتطلب جدول `nursing_assessments` إضافة الأعمدة `tenant_id` (نوع INTEGER) و `facility_id` (نوع INTEGER).
2. **إنشاء الفهارس المقترحة (Performance Optimization)**:
   - سيتم إنشاء الفهرس الهجين `(tenant_id, facility_id, patient_id)` أو `(tenant_id, facility_id, admission_id)` على كافة جداول المراقبة المذكورة أعلاه لتسريع عمليات التصفية الأمنية ومنع استهلاك المعالج أثناء الفحص.

---

### 3. الصياغة الفنية لسياسة RLS المقترحة (Proposed RLS Policy Draft)

لجميع جداول العناية والتمريض (بعد استكمال DDL لـ `nursing_assessments`):
```sql
-- تفعيل RLS وفرضه
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_name FORCE ROW LEVEL SECURITY;

-- إنشاء سياسة عزل المستأجر
CREATE POLICY rls_table_name_tenant_isolation ON table_name
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
```

> **تنبيه أمني هام**: **لا يتم تشغيل أو تطبيق أي من هذه الأوامر أو الـ SQL في هذه المرحلة البرمجية الحالية**. هذا المستند مخصص للتوثيق والتخطيط فقط.
