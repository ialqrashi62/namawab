-- Migration DOWN for General_Surgery (DEP-011)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS genSurg_audit_iso ON genSurg_audit;
ALTER TABLE IF EXISTS genSurg_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS genSurg_audit;

DROP POLICY IF EXISTS genSurg_enc_iso ON genSurg_encounters;
ALTER TABLE IF EXISTS genSurg_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS genSurg_encounters;

COMMIT;