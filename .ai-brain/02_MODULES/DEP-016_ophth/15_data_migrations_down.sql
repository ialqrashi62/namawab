-- Migration DOWN for Ophthalmology (DEP-016)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS ophth_audit_iso ON ophth_audit;
ALTER TABLE IF EXISTS ophth_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ophth_audit;

DROP POLICY IF EXISTS ophth_enc_iso ON ophth_encounters;
ALTER TABLE IF EXISTS ophth_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ophth_encounters;

COMMIT;