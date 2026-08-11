-- Migration DOWN for Psychology (DEP-045)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS psychol_audit_iso ON psychol_audit;
ALTER TABLE IF EXISTS psychol_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS psychol_audit;

DROP POLICY IF EXISTS psychol_enc_iso ON psychol_encounters;
ALTER TABLE IF EXISTS psychol_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS psychol_encounters;

COMMIT;