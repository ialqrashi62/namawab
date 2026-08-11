-- Migration DOWN for General_Pediatrics (DEP-026)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS peds_audit_iso ON peds_audit;
ALTER TABLE IF EXISTS peds_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS peds_audit;

DROP POLICY IF EXISTS peds_enc_iso ON peds_encounters;
ALTER TABLE IF EXISTS peds_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS peds_encounters;

COMMIT;