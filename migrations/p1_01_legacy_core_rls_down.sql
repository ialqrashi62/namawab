-- ============================================================
-- p1_01_legacy_core_rls_down.sql  (rollback of p1_01_legacy_core_rls_up.sql)
-- Disables FORCE RLS and drops the isolation policies on the four legacy core tables.
-- Keeps the tenant_id column + data + FK + index (non-destructive rollback of the POLICY only).
-- CANDIDATE ONLY — DO NOT EXECUTE WITHOUT EXPLICIT DDL APPROVAL.
-- ============================================================
BEGIN;

DROP POLICY IF EXISTS rls_patients_tenant_isolation ON patients;
ALTER TABLE patients NO FORCE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_invoices_tenant_isolation ON invoices;
ALTER TABLE invoices NO FORCE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_appointments_tenant_isolation ON appointments;
ALTER TABLE appointments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_medical_records_tenant_isolation ON medical_records;
ALTER TABLE medical_records NO FORCE ROW LEVEL SECURITY;
ALTER TABLE medical_records DISABLE ROW LEVEL SECURITY;

COMMIT;
