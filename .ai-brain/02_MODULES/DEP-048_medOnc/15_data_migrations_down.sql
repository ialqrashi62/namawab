-- Migration DOWN for Medical_Oncology (DEP-048)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS medOnc_audit_iso ON medOnc_audit;
ALTER TABLE IF EXISTS medOnc_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS medOnc_audit;

DROP POLICY IF EXISTS medOnc_enc_iso ON medOnc_encounters;
ALTER TABLE IF EXISTS medOnc_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS medOnc_encounters;

COMMIT;