-- Migration DOWN for Psychiatry (DEP-044)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS psych_audit_iso ON psych_audit;
ALTER TABLE IF EXISTS psych_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS psych_audit;

DROP POLICY IF EXISTS psych_enc_iso ON psych_encounters;
ALTER TABLE IF EXISTS psych_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS psych_encounters;

COMMIT;