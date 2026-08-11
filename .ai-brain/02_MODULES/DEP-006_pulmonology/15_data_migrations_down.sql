-- Migration DOWN for Pulmonology (DEP-006)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pulmonology_audit_iso ON pulmonology_audit;
ALTER TABLE IF EXISTS pulmonology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pulmonology_audit;

DROP POLICY IF EXISTS pulmonology_enc_iso ON pulmonology_encounters;
ALTER TABLE IF EXISTS pulmonology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pulmonology_encounters;

COMMIT;