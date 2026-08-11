-- Migration DOWN for HR_Staffing (DEP-056)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS hr_audit_iso ON hr_audit;
ALTER TABLE IF EXISTS hr_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hr_audit;

DROP POLICY IF EXISTS hr_enc_iso ON hr_encounters;
ALTER TABLE IF EXISTS hr_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hr_encounters;

COMMIT;