-- Migration DOWN for Obstetrics (DEP-034)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS obs_audit_iso ON obs_audit;
ALTER TABLE IF EXISTS obs_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS obs_audit;

DROP POLICY IF EXISTS obs_enc_iso ON obs_encounters;
ALTER TABLE IF EXISTS obs_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS obs_encounters;

COMMIT;