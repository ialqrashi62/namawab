-- Migration DOWN for PICU (DEP-024)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS picu_audit_iso ON picu_audit;
ALTER TABLE IF EXISTS picu_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS picu_audit;

DROP POLICY IF EXISTS picu_enc_iso ON picu_encounters;
ALTER TABLE IF EXISTS picu_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS picu_encounters;

COMMIT;