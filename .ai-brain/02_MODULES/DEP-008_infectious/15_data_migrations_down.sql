-- Migration DOWN for Infectious_Diseases (DEP-008)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS infectious_audit_iso ON infectious_audit;
ALTER TABLE IF EXISTS infectious_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS infectious_audit;

DROP POLICY IF EXISTS infectious_enc_iso ON infectious_encounters;
ALTER TABLE IF EXISTS infectious_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS infectious_encounters;

COMMIT;