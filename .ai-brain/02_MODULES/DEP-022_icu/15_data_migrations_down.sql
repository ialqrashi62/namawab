-- Migration DOWN for ICU_Adult (DEP-022)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS icu_audit_iso ON icu_audit;
ALTER TABLE IF EXISTS icu_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS icu_audit;

DROP POLICY IF EXISTS icu_enc_iso ON icu_encounters;
ALTER TABLE IF EXISTS icu_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS icu_encounters;

COMMIT;