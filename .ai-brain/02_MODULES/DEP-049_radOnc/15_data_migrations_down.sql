-- Migration DOWN for Radiation_Oncology (DEP-049)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS radOnc_audit_iso ON radOnc_audit;
ALTER TABLE IF EXISTS radOnc_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS radOnc_audit;

DROP POLICY IF EXISTS radOnc_enc_iso ON radOnc_encounters;
ALTER TABLE IF EXISTS radOnc_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS radOnc_encounters;

COMMIT;