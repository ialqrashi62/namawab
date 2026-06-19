# تقرير جاهزية تفعيل RLS لجدول عينات المختبر - (Post-Migration RLS Readiness Report)
## نظام نما الطبي (NamaMedical)

مستند يوضح جاهزية جدول `lab_samples` لتفعيل Row Level Security ضمن الدفعة السادسة القادمة.

---

### 1. تقييم الجاهزية الأمنية (Security Readiness Assessment)

* **جاهزية الجدول**: `READY_FOR_RLS_BATCH6`
* **نسبة القيم الفارغة (Null tenant_id)**: `0%` (جميع السجلات الحالية والمستقبلية ستحمل معرف مستأجر صحيح بفضل قيد `NOT NULL`).
* **مؤشرات الأداء**: المؤشر `idx_lab_samples_tenant` جاهز للعمل بشكل مثالي لتأمين سرعة تصفية الاستعلامات.

---

### 2. السياسة المقترحة للدفعة السادسة (Proposed RLS Policy)

نقترح صياغة السياسة التالية لجدول `lab_samples` لضمان عزل البيانات المباشر:

```sql
DROP POLICY IF EXISTS rls_lab_samples_tenant_isolation ON lab_samples;
CREATE POLICY rls_lab_samples_tenant_isolation ON lab_samples
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
```

* **التراجع السريع**: سكربت التراجع [tenant_id_backfill_controlled_migration_down.sql](docs/sql/tenant_id_backfill_controlled_migration_down.sql) جاهز للتراجع وإزالة العمود والقيود بالكامل في حال رصد أي مشكلة.
