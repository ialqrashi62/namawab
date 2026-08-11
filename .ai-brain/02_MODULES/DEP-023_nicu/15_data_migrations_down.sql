-- Migration DOWN for NICU (DEP-023)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS nicu_audit_iso ON nicu_audit;
ALTER TABLE IF EXISTS nicu_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS nicu_audit;

DROP POLICY IF EXISTS nicu_enc_iso ON nicu_encounters;
ALTER TABLE IF EXISTS nicu_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS nicu_encounters;

COMMIT;