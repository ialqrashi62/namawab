-- Migration DOWN for Gastroenterology (DEP-003)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS gastroenterology_audit_iso ON gastroenterology_audit;
ALTER TABLE IF EXISTS gastroenterology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS gastroenterology_audit;

DROP POLICY IF EXISTS gastroenterology_enc_iso ON gastroenterology_encounters;
ALTER TABLE IF EXISTS gastroenterology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS gastroenterology_encounters;

COMMIT;