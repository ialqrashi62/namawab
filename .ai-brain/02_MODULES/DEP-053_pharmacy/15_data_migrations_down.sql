-- Migration DOWN for Pharmacy (DEP-053)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pharmacy_audit_iso ON pharmacy_audit;
ALTER TABLE IF EXISTS pharmacy_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pharmacy_audit;

DROP POLICY IF EXISTS pharmacy_enc_iso ON pharmacy_encounters;
ALTER TABLE IF EXISTS pharmacy_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pharmacy_encounters;

COMMIT;