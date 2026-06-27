-- ============================================================
-- p1_01_legacy_core_rls_up.sql
-- PHASE-1 REMEDIATION — FORCE RLS on the four legacy core PHI/financial tables that carry
--   tenant_id but had NO isolation policy: patients, invoices, appointments, medical_records.
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL (DB gate).
--
-- الهدف: سدّ أكبر فجوة عزل متبقية — هذه الجداول الأساسية تُفلتر حالياً عبر app-layer WHERE tenant_id=$n
--   فقط (idiom شرطي fail-open). نضيف نفس قالب FORCE RLS القانوني (USING/WITH CHECK على app.tenant_id)
--   كدفاع متعمّق على مستوى قاعدة البيانات. التطبيق يبصم tenant_id ويربط app.tenant_id لكل طلب،
--   لذا لا تتأثر عمليات الإدراج/القراءة المشروعة؛ أي مسار بلا سياق مستأجر يحصل على 0 صفوف (fail-closed).
--
-- idempotent: ADD COLUMN IF NOT EXISTS + backfill(tenant_id=1) + SET NOT NULL + FK + index +
--   DROP/CREATE POLICY. wrapped BEGIN; … COMMIT;
-- ملاحظة: audit_trail عمداً غير مشمول هنا — يتطلب تعديلاً منسّقاً في logAudit (بصم tenant_id +
--   معالجة أحداث بلا مستأجر مثل تسجيل الدخول) قبل تفعيل RLS عليه. يُعالَج في هجرة منفصلة.
-- ============================================================
BEGIN;

-- ===== patients =====
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE patients SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE patients ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE patients DROP CONSTRAINT IF EXISTS fk_patients_tenant;
ALTER TABLE patients ADD CONSTRAINT fk_patients_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id ON patients (tenant_id);
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_patients_tenant_isolation ON patients;
CREATE POLICY rls_patients_tenant_isolation ON patients
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- ===== invoices =====
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE invoices SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE invoices ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS fk_invoices_tenant;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices (tenant_id);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_invoices_tenant_isolation ON invoices;
CREATE POLICY rls_invoices_tenant_isolation ON invoices
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- ===== appointments =====
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE appointments SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE appointments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS fk_appointments_tenant;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments (tenant_id);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_appointments_tenant_isolation ON appointments;
CREATE POLICY rls_appointments_tenant_isolation ON appointments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- ===== medical_records =====
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
UPDATE medical_records SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE medical_records ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE medical_records DROP CONSTRAINT IF EXISTS fk_medical_records_tenant;
ALTER TABLE medical_records ADD CONSTRAINT fk_medical_records_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_medical_records_tenant_id ON medical_records (tenant_id);
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_medical_records_tenant_isolation ON medical_records;
CREATE POLICY rls_medical_records_tenant_isolation ON medical_records
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

COMMIT;
