-- Migration DOWN for Maternal_Fetal_Medicine (DEP-037)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS mfm_audit_iso ON mfm_audit;
ALTER TABLE IF EXISTS mfm_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS mfm_audit;

DROP POLICY IF EXISTS mfm_enc_iso ON mfm_encounters;
ALTER TABLE IF EXISTS mfm_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS mfm_encounters;

COMMIT;