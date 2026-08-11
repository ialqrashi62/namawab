-- Migration DOWN for Hematology_Oncology (DEP-004)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS hemOnc_audit_iso ON hemOnc_audit;
ALTER TABLE IF EXISTS hemOnc_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hemOnc_audit;

DROP POLICY IF EXISTS hemOnc_enc_iso ON hemOnc_encounters;
ALTER TABLE IF EXISTS hemOnc_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hemOnc_encounters;

COMMIT;