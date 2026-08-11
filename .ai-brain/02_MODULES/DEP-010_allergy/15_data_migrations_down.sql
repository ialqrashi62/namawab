-- Migration DOWN for Allergy_Immunology (DEP-010)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS allergy_audit_iso ON allergy_audit;
ALTER TABLE IF EXISTS allergy_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS allergy_audit;

DROP POLICY IF EXISTS allergy_enc_iso ON allergy_encounters;
ALTER TABLE IF EXISTS allergy_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS allergy_encounters;

COMMIT;