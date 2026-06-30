-- Rollback Migration: Drop cardiology tables and RLS policies.
BEGIN;

DROP INDEX IF EXISTS idx_ecg_records_patient;
DROP INDEX IF EXISTS idx_cardiology_procedures_patient;

DROP POLICY IF EXISTS rls_ecg_records_tenant_isolation ON ecg_records;
DROP POLICY IF EXISTS rls_cardiology_procedures_tenant_isolation ON cardiology_procedures;

DROP TABLE IF EXISTS ecg_records;
DROP TABLE IF EXISTS cardiology_procedures;

COMMIT;
