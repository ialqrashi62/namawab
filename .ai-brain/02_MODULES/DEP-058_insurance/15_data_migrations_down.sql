-- Migration DOWN for Insurance_Claims_NPHIES (DEP-058)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS insurance_audit_iso ON insurance_audit;
ALTER TABLE IF EXISTS insurance_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS insurance_audit;

DROP POLICY IF EXISTS insurance_enc_iso ON insurance_encounters;
ALTER TABLE IF EXISTS insurance_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS insurance_encounters;

COMMIT;